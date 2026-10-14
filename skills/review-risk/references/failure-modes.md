# Failure Mode Catalog

Common failure patterns with symptoms, detection steps, and root causes.

## Deployment-Related

**Symptoms:** Errors/latency spike immediately after deploy time
**Detection:** Compare the code and config before and after the deploy.

**Common causes:** Bad config, missing env vars, incompatible schema, null pointer

## Resource Exhaustion

**Symptoms:** Timeouts increase gradually, then cliff
**Check:** Connection pools, thread pools, file descriptors, memory

**Common causes:** Connection leak, missing close() calls, undersized pools

## Fixed-Capacity Service Saturation

**Symptoms:** Latency spikes on specific nodes while others are fine. Timeouts to specific IPs. CPU flatlined on subset of hosts. Throughput drops while request volume constant

**Investigation:**
1. Identify which node(s) are saturated (latency by host)
2. Find what's running on that node (trace by host)
3. Look for expensive operations (duration, field counts, row counts)
4. Check if routing (consistent hashing) is causing load imbalance

**Common causes:**
- Consistent hashing clustering hot keys on one node
- Expensive operations (wide queries, large payloads) blocking capacity
- Long-running operations that don't respect cancellation
- Fixed replica count with no auto-scaling

**Key insight:** Services with fixed capacity (StatefulSets, dedicated pools) can't shed load. One expensive request can saturate a node for minutes.

## Context Cancellation Not Propagating

**Symptoms:** Operations running far longer than configured timeout. "context canceled" in logs but work continues. Resources consumed after client gives up

**Root cause:** Code path missing `ctx.Done()` checks. Work continues even after caller cancels.

**Fix pattern (Go):**
```go
select {
case <-ctx.Done():
    return ctx.Err()
case result := <-resChan:
    // process result
}
```

Add `ctx.Done()` checks at channel receives and between major processing phases.

**Why it matters:** Without cancellation propagation, a 30s client timeout becomes a 30-minute server resource hold.

## Cascading Failure

**Symptoms:** Multiple services failing, but one started first
**Detection:** Find which service's errors appeared first

**Root cause:** Usually a shared dependency (DB, cache, auth, queue)

## Thundering Herd

**Symptoms:** Spike in traffic immediately after an outage ends
**Detection:** Request rate spike after recovery

**Common causes:** Retry storms, cache stampede, client reconnection flood

## DNS/Certificate Issues

**Symptoms:** All traffic fails, or specific domain/endpoint fails
**Check:** TLS handshake errors, DNS resolution failures

**Common causes:** Expired cert, DNS propagation, misconfigured SNI, CA issues

## Queue Backlog / Consumer Lag

**Symptoms:** Increasing latency, messages piling up, consumer lag growing
**Check:** Queue depth metrics, dead letter queues

**Common causes:** Slow consumer, poison message, upstream spike, consumer crash

## Configuration/Feature Flag Issues

**Symptoms:** Only specific cohorts affected (region, tenant, feature tier)
**Detection:** Find the factor that the affected cases share

**Common causes:** Flag targeting wrong cohort, config not propagated, rollout percentage issue

## Database Issues

**Symptoms:** Slow queries, connection timeouts, deadlocks
**Check:** Query duration, connection pool usage, lock waits

**Common causes:** Missing index, N+1 queries, lock contention, connection exhaustion

## Memory/GC Issues

**Symptoms:** Latency spikes, periodic slowdowns, OOM kills
**Check:** GC pause times, memory usage, heap size

**Common causes:** Memory leak, undersized heap, allocation pressure, GC tuning

## External Dependency Failure

**Symptoms:** Errors correlate with calls to external service
**Check:** Third-party status pages, timeout patterns

**Common causes:** Third-party outage, rate limiting, API deprecation, network issues
