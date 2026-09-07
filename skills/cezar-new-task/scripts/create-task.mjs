#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const FIRST_CEZAR_PORT = 4321;
const CEZAR_PORT_COUNT = 50;
const DISCOVERY_TIMEOUT_MS = 300;
const CREATE_TIMEOUT_MS = 30_000;

function fail(message) {
  throw new Error(message);
}

function parseOptions() {
  try {
    const { values, positionals } = parseArgs({
      args: process.argv.slice(2),
      options: {
        'allow-remote': { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
        project: { type: 'string' },
        root: { type: 'string' },
        url: { type: 'string' },
      },
      allowPositionals: false,
      strict: true,
    });
    if (positionals.length > 0) fail('unexpected positional argument');
    if (values.help) {
      console.log([
        'Read a create-run JSON body from stdin and submit it to a running Cezar server.',
        '',
        'Options:',
        '  --url <url>          Cezar base URL. Defaults to CEZAR_URL or local discovery.',
        '  --project <id>       Registered project id. Defaults to CEZAR_PROJECT_ID.',
        '  --root <path>        Project root used for registry matching.',
        '  --allow-remote       Allow a non-loopback URL supplied explicitly.',
        '  -h, --help           Show this help.',
      ].join('\n'));
      process.exit(0);
    }
    return values;
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}

async function readStdin() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  if (!input.trim()) fail('read a JSON create-run body from stdin');
  let body;
  try {
    body = JSON.parse(input);
  } catch {
    fail('stdin is not valid JSON');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    fail('the JSON body must be an object');
  }
  if (typeof body.task !== 'string' || body.task.trim().length === 0) {
    fail('the JSON body needs a non-empty string task');
  }
  if (Boolean(body.workflow) === Boolean(body.steps)) {
    fail('the JSON body needs exactly one of workflow or steps');
  }
  return body;
}

function isLoopback(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host === '::1') return true;
  const octets = host.split('.');
  return octets.length === 4 && octets[0] === '127'
    && octets.slice(1).every((octet) => /^\d+$/.test(octet) && Number(octet) <= 255);
}

function normalizeBaseUrl(raw, allowRemote) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    fail(`invalid Cezar URL: ${raw}`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    fail('Cezar URL must use http or https');
  }
  if (!allowRemote && !isLoopback(url.hostname)) {
    fail('refusing a non-loopback Cezar URL; pass --allow-remote deliberately');
  }
  if (url.search || url.hash) fail('Cezar URL must not contain a query or fragment');
  url.pathname = url.pathname.replace(/\/+$/, '');
  return url.toString().replace(/\/$/, '');
}

function apiUrl(baseUrl, path) {
  return `${baseUrl}/api/v1${path}`;
}

function headers() {
  const token = process.env.CEZAR_TOKEN;
  return {
    accept: 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
}

async function requestJson(url, init = {}, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      headers: { ...headers(), ...(init.headers ?? {}) },
      signal: controller.signal,
    });
    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = { error: text.slice(0, 500) };
      }
    }
    return { body, response };
  } finally {
    clearTimeout(timer);
  }
}

function repositoryRoot() {
  try {
    const commonDir = execFileSync('git', ['rev-parse', '--git-common-dir'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const resolved = realpathSync(resolve(process.cwd(), commonDir));
    return basename(resolved) === '.git' ? dirname(resolved) : process.cwd();
  } catch {
    return process.cwd();
  }
}

function samePath(left, right) {
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return resolve(left) === resolve(right);
  }
}

function validProjectsResponse(body) {
  return body && typeof body === 'object' && !Array.isArray(body)
    && Array.isArray(body.projects) && typeof body.bootProject === 'string';
}

function selectProject(body, requestedId, requestedRoot) {
  const projects = body.projects.filter((project) => (
    project && typeof project.id === 'string' && typeof project.root === 'string'
  ));
  if (requestedId) {
    if (requestedId === 'default') {
      return projects.find((project) => project.id === body.bootProject)
        ?? { id: body.bootProject || 'default' };
    }
    return projects.find((project) => project.id === requestedId) ?? null;
  }
  const byRoot = projects.find((project) => samePath(project.root, requestedRoot));
  if (byRoot) return byRoot;
  if (projects.length === 1) return projects[0];
  if (projects.length === 0 && body.bootProject) return { id: body.bootProject };
  return null;
}

function discoveryUrls(explicitUrl) {
  if (explicitUrl) return [explicitUrl];
  return Array.from(
    { length: CEZAR_PORT_COUNT },
    (_, index) => `http://127.0.0.1:${FIRST_CEZAR_PORT + index}`,
  );
}

async function findServer(options, requestedId, requestedRoot) {
  const explicit = options.url || process.env.CEZAR_URL;
  const urls = discoveryUrls(explicit);
  const allowRemote = Boolean(options['allow-remote']);
  let sawServer = false;
  let lastError = '';
  for (const rawUrl of urls) {
    const baseUrl = normalizeBaseUrl(rawUrl, allowRemote);
    try {
      const { body, response } = await requestJson(
        apiUrl(baseUrl, '/projects'),
        {},
        explicit ? CREATE_TIMEOUT_MS : DISCOVERY_TIMEOUT_MS,
      );
      if (!response.ok) {
        if (explicit) {
          const detail = body?.error ? `: ${body.error}` : '';
          fail(`Cezar project lookup failed with HTTP ${response.status}${detail}`);
        }
        continue;
      }
      if (!validProjectsResponse(body)) {
        if (explicit) fail('Cezar returned an invalid /projects response');
        continue;
      }
      sawServer = true;
      const project = selectProject(body, requestedId, requestedRoot);
      if (project) return { baseUrl, project };
      lastError = requestedId
        ? `project not found: ${requestedId}`
        : `could not match the current repository; registered projects: ${body.projects.map((entry) => entry.id).join(', ')}`;
      if (explicit) break;
    } catch (error) {
      if (explicit) throw error;
    }
  }
  if (sawServer && lastError) fail(`${lastError}; pass --project <id>`);
  fail('no reachable Cezar server found on the local discovery ports');
}

function taskUrls(baseUrl, projectId, records) {
  const project = encodeURIComponent(projectId);
  return records.map((record) => `${baseUrl}/p/${project}/tasks/${encodeURIComponent(record.id)}`);
}

async function main() {
  const options = parseOptions();
  const body = await readStdin();
  const requestedId = options.project || process.env.CEZAR_PROJECT_ID;
  const requestedRoot = options.root || process.env.CEZAR_PROJECT_ROOT || repositoryRoot();
  const { baseUrl, project } = await findServer(options, requestedId, requestedRoot);
  const projectId = project.id;
  const path = `/p/${encodeURIComponent(projectId)}/runs`;
  const { body: responseBody, response } = await requestJson(
    apiUrl(baseUrl, path),
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    },
    CREATE_TIMEOUT_MS,
  );
  if (!response.ok) {
    const detail = responseBody?.error ? `: ${responseBody.error}` : '';
    fail(`Cezar rejected the task with HTTP ${response.status}${detail}`);
  }
  const records = Array.isArray(responseBody?.runs)
    ? responseBody.runs
    : [responseBody];
  if (records.length === 0 || records.some((record) => !record || typeof record.id !== 'string')) {
    fail('Cezar returned an unexpected create-run response');
  }
  const urls = taskUrls(baseUrl, projectId, records);
  console.log(JSON.stringify({
    created: true,
    projectId,
    runId: records[0].id,
    runIds: records.map((record) => record.id),
    url: urls[0],
    urls,
  }, null, 2));
}

main().catch((error) => {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
