const router = require('express').Router();

class MetricsRoute {
    constructor(website) {
        this.website = website;
        this.Metrics = website.Metrics;
        this.router = router;

        router.get('/', async (req, res) => {
            res.set('Content-Type', this.Metrics.Prometheus.register.contentType);
            res.end(this.Metrics.Prometheus.register.metrics());
        });

    }
}

module.exports = MetricsRoute;