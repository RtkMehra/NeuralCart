import client from 'prom-client';

client.collectDefaultMetrics({
    prefix: 'neuralcart_',
    gcDurationBuckets: [0.001, 0.01, 0.1, 0.5, 1, 2.5, 5, 10]
});

export const requestCounter = new client.Counter({
    name: 'neuralcart_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});

export const requestDurationHistogram = new client.Histogram({
    name: 'neuralcart_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

export const cacheHitsCounter = new client.Counter({
    name: 'neuralcart_cache_hits_total',
    help: 'Total cache hits',
    labelNames: ['namespace']
});

export const cacheMissesCounter = new client.Counter({
    name: 'neuralcart_cache_misses_total',
    help: 'Total cache misses',
    labelNames: ['namespace']
});

export const cacheOperationDurationHistogram = new client.Histogram({
    name: 'neuralcart_cache_operation_duration_seconds',
    help: 'Cache operation duration in seconds',
    labelNames: ['operation', 'namespace'],
    buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

export const searchOperationDurationHistogram = new client.Histogram({
    name: 'neuralcart_search_operation_duration_seconds',
    help: 'Elasticsearch operation duration in seconds',
    labelNames: ['operation'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2]
});

export const searchErrorsCounter = new client.Counter({
    name: 'neuralcart_search_errors_total',
    help: 'Number of search service errors',
    labelNames: ['operation']
});

export const embeddingDurationHistogram = new client.Histogram({
    name: 'neuralcart_embedding_duration_seconds',
    help: 'Embedding generation duration in seconds',
    labelNames: ['mode'],
    buckets: [0.05, 0.1, 0.5, 1, 2, 5, 10]
});

export const embeddingErrorsCounter = new client.Counter({
    name: 'neuralcart_embedding_errors_total',
    help: 'Number of embedding generation errors',
    labelNames: ['mode']
});

export const recommendationQueryDurationHistogram = new client.Histogram({
    name: 'neuralcart_recommendation_query_duration_seconds',
    help: 'Recommendation query duration in seconds',
    buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

export const metricsRegistry = client.register;

export const dbPoolConnectionsGauge = new client.Gauge({
    name: 'neuralcart_db_pool_connections',
    help: 'Database connection pool statistics',
    labelNames: ['state']
});

export const domainTotalGauge = new client.Gauge({
    name: 'neuralcart_domain_entities_total',
    help: 'Domain aggregate counts',
    labelNames: ['entity']
});

