const Prometheus = require('prom-client');

class Metrics {
    constructor() {
        this.Prometheus = Prometheus;

        this.httpRequestDurationMS = new Prometheus.Histogram({
            name: 'http_request_duration_ms',
            help: 'Duration of HTTP requests in MS',
            labelNames: ['route', 'successful'],
            buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000]
        });

        this.collectDefaultMetrics = Prometheus.collectDefaultMetrics;

        this.collectDefaultMetrics({ timeout: 5000 });
    }
}


module.exports = Metrics;