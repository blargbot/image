const crypto = require('crypto');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Security = require('../../Core/ApiSecurity');

const CAT_ID = '103347843934212096';

class SecurityRoute {
    constructor(website) {
        this.website = website;
        this.router = router;

        router.get('/', async (req, res) => {
            if (await this.authenticate(req, res)) {
                if (req.user.id === CAT_ID) {
                    res.render('security');
                } else {
                    res.send('no u');
                }
            }
        });

        router.post('/verify', async (req, res) => {
            let v = await Security.validateToken(req.body.token);
            res.send(v);
        });

        router.post('/generate', async (req, res) => {
            if (req.isAuthenticated() && req.user.id === CAT_ID) {
                if (req.body.id) {
                    console.log(req.body);
                    let t = await Security.generateToken(req.body.id, req.body.invalidate === 'on');
                    res.send(t);
                } else {
                    res.send('id pls');
                }
            } else res.send('no u');
        });
    }

    async authenticate(req, res) {
        req.session.returnTo = '/security' + req.path;
        if (req.isAuthenticated())
            return true;
        res.redirect('/login');
        return false;
    }
}

module.exports = SecurityRoute;