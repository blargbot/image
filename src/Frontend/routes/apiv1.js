const router = require('express').Router();
const moment = require('moment');
const superagent = require('snekfetch');
const childProcess = require('child_process');
const path = require('path');
const Security = require('../../Core/Security');

function getImage(name, args) {
    return new Promise((res, rej) => {
        let env = {
            IMAGE_TYPE: name,
            IMAGE_ARGS: JSON.stringify(args),
            DESTINATION: 'api'
        };

        let cp = childProcess.fork(path.join(__dirname, '..', '..', 'Core', 'Image.js'), [], {
            env
        });

        cp.on('message', (msg) => {
            res(msg);
        });
    });

}

class ApiRoute {
    constructor(website) {
        this.website = website;
        this.router = router;

        router.post('/image/:type', async (req, res) => {
            let u = await Security.validateToken(req.headers.authorization);
            if (u === null) {
                res.status(403);
                res.send(JSON.stringify({
                    code: 403,
                    message: 'Invalid authorization.'
                }));
            } else {
                let type = req.params.type;
                let { image, contentType } = await getImage(type, req.body);
                res.set('Content-Type', contentType || 'image/png');
                res.send(new Buffer.from(image, 'base64'));
            }
        });
    }

}

module.exports = ApiRoute;