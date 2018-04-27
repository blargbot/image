const router = require('express').Router();
const moment = require('moment');
const superagent = require('snekfetch');
const childProcess = require('child_process');
const path = require('path');

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

        router.get('/poem', async (req, res) => {
            let names = ['monika', 'sayori', 'yuri', 'natsuki'];
            let name = '';
            if (req.query.name && typeof req.query.name === 'string' && names.includes(req.query.name.toLowerCase()))
                name = req.query.name.toLowerCase();
            else name = 'monika';
            let content = req.query.text;
            if (req.query.base64 !== undefined) {
                content = Buffer.from(content, 'base64').toString();
            }
            let poem = await getImage('poem', { text: content || 'Just Monika.', name, yuri: req.query.yuri });
            res.set('Content-Type', 'image/png');
            res.send(new Buffer.from(poem, 'base64'));
        });
    }

}

module.exports = ApiRoute;