const jwt = require('jsonwebtoken');
const moment = require('moment');
const cookieparser = require('cookieparser');

class SiteSecurity {
    static async generateToken(id) {
        const token = jwt.sign({ id }, _config.security.secret, {
            expiresIn: '1d'
        });
        return 'site.' + token;
    }

    static async validateRequest(req) {
        let p = cookieparser.parse(req.headers.cookie);
        if (p.stoken) {
            return SiteSecurity.validateToken(p.stoken);
        } else return null;
    }

    static async validateToken(token) {
        try {
            const validate = jwt.verify(token.substring(5), _config.security.secret);
            // if (!_bot.guilds.get('194232473931087872').members.get(id)) {
            //     return null;
            // }
            return validate.id;
        } catch (err) {
            return null;
        }
    }
}

module.exports = SiteSecurity;