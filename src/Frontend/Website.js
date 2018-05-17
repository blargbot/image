const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-discord').Strategy;
const session = require('express-session');
const cons = require('consolidate');
const Metrics = require('../Core/Metrics');
const Bot = require('../Core/Bot');
const SiteSecurity = require('../Core/SiteSecurity');
const { Nuxt, Builder } = require('nuxt');


class Website {
    constructor(port = 8079) {
        this.port = port;
        this.bot = new Bot(this);
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.Metrics = new Metrics();

        const nuxtConfig = require('./nuxt.config.js');
        console.log(__dirname);
        this.nuxt = new Nuxt(nuxtConfig);
        if (this.nuxt.options.dev) {
            new Builder(this.nuxt).build();
        }

        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser((obj, done) => {
            done(null, obj);
        });
        passport.use(new Strategy({
            clientID: _config.website.id,
            clientSecret: _config.website.secret,
            callbackURL: _config.website.callback,
            scope: this.scopes
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(function () {
                return done(null, profile);
            });
        }));

        this.app.use(session({
            secret: _config.website.sessionSecret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false,
                maxAge: 86400000,
                httpOnly: false
            }
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.get('/login', (req, res, next) => {
            //req.session.returnTo = req.query.path || '/';
            next();
        }, passport.authorize('discord', {
            scope: this.scopes
        }));
        this.app.get('/callback', passport.authenticate('discord', {
            failureRedirect: '/'
        }), async (req, res) => {
            let token = await SiteSecurity.generateToken(req.user.id);
            res.cookie('stoken', token, { maxAge: 900000 });
            req.session.user = req.user;
            res.redirect(req.session.returnTo || '/');
        });
        this.app.get('/logout', (req, res) => {
            req.logout();
            delete req.session.user;
            res.clearCookie('stoken');
            res.redirect(req.session.returnTo || '/');
        });
        this.app.get('/', (req, res) => {
            res.redirect('/app');
        });
        this.app.engine('html', cons.swig);
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'html');
        this.app.use('/', express.static(path.join(__dirname, 'public')));
        this.app.use('/security', new (require('./routes/security'))(this).router);
        this.app.use('/metrics', new (require('./routes/metrics'))(this).router);
        this.app.use(this.nuxt.render);
        this.app.use('/api/v1', new (require('./routes/apiv1'))(this).router);
    }

    start() {
        this.app.listen(this.port, () => {
            console.init('Website listening on port', this.port);
        });
    }

    get scopes() {
        return ['identify'];
    }
}

module.exports = Website;

const website = new Website();
website.start();