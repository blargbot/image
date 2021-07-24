const jwt = require('jsonwebtoken');
const moment = require('moment');

class Security {
    static async generateToken(id, invalidate = true) {
        let ts = Date.now();
        if (invalidate) {
            let user = await _dbModels.User.findOrCreate({
                where: { userid: id }, defaults: { tokenDate: ts }
            });
            await user[0].update({ tokenDate: ts });
        }

        const token = jwt.sign(id + '.' + ts, _config.security.secret);
        return token;
    }

    static async validateToken(token) {
        try {
            const validate = jwt.verify(token, _config.security.secret);
            let [id, ts] = validate.split('.');
            if (!_bot.guilds.get('194232473931087872').members.get(id)) {
                return null;
            }
            let user = await _dbModels.User.findByPk(id);
            let ts1 = moment(ts, 'x');
            let ts2 = moment(user.tokenDate);
            let diff = moment.duration(ts1 - ts2);
            if (diff.asMilliseconds() >= 0)
                return id;
            else return null;
        } catch (err) {
            return null;
        }
    }
}

module.exports = Security;