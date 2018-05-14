const router = require('express').Router();
const moment = require('moment');
const superagent = require('snekfetch');
const childProcess = require('child_process');
const path = require('path');
const Security = require('../../Core/Security');
const fs = require('fs');
const Timer = require('../../Structures/Timer');

class ApiRoute {
    constructor(website) {
        this.website = website;
        this.Metrics = website.Metrics;
        this.router = router;

        let dir = fs.readdirSync(path.join(__dirname, '..', '..', 'Generators'));
        this.endpoints = {};
        this.generators = {};
        dir = dir.map(a => a.split('.')[0]);
        for (const e of dir) {
            const _c = require('../../Generators/' + e);
            const c = new _c();
            this.generators[e] = c;
            let _e = c.serialize();
            _e.endpoint = 'image/' + e;
            _e.method = 'POST';
            this.endpoints[e] = _e;
        }

        router.get('/data', async (req, res) => {
            res.send(JSON.stringify(this.endpoints));
        });

        router.post('/image/:type', async (req, res) => {
            let timer = new Timer();
            let fullEndpoint = 'api/v1/image/' + req.params.type;
            timer.start();
            let success = false;
            let u = await Security.validateToken(req.headers.authorization);
            if (u === null) {
                res.status(403);
                res.send(JSON.stringify({
                    code: 403,
                    message: 'Invalid authorization.'
                }));
            } else if (!this.endpoints[req.params.type]) {
                res.status(404);
                res.send(JSON.stringify({
                    code: 404,
                    message: 'Endpoint not found.'
                }));
            } else {
                let type = req.params.type;
                try {
                    this.generators[req.params.type].validateArgs(req.body);
                } catch (err) {
                    res.status(400);
                    return res.send(JSON.stringify({
                        code: 400,
                        message: err.message
                    }));
                }
                this.Metrics.usageCounter.labels(fullEndpoint, u).inc(1);
                try {
                    let { image, contentType } = await this.getImage(type, req.body);
                    res.set('Content-Type', contentType || 'image/png');
                    res.send(new Buffer.from(image, 'base64'));
                    success = true;
                } catch (err) {
                    console.log(err);
                    res.status(err.code || 500);
                    res.end(JSON.stringify(err, null, 4));
                    success = false;
                }
            }
            timer.end();
            this.Metrics.httpRequestDurationMS
                .labels(fullEndpoint, success)
                .observe(timer.elapsed);
        });
    }

    getImage(name, args) {
        return new Promise((res, rej) => {
            let env = {
                IMAGE_TYPE: name,
                IMAGE_ARGS: JSON.stringify(args),
                DESTINATION: 'api'
            };
            let timer = new Timer().start();
            let cp = childProcess.fork(path.join(__dirname, '..', '..', 'Core', 'Image.js'), [], {
                env
            });

            cp.on('message', (msg) => {
                timer.end();
                if (msg.error) {
                    timer.end();
                    console.error(msg);
                    rej(msg);
                } else {
                    res(msg);
                    this.Metrics.imageGenDurationMS
                        .labels(name)
                        .observe(timer.elapsed);
                }
            });
            cp.on('error', (err) => {
                timer.end();
                console.error(err);
                rej(err);
            })
        });

    }

}

module.exports = ApiRoute;