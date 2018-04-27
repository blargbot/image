const path = require('path');
const express = require('express');


class Website {
    constructor(port = 8079) {
        this.port = port;
        this.app = express();

        this.app.use('/', express.static(path.join(__dirname, 'public')));
        this.app.use('/api', new (require('./routes/api'))(this).router);
    }

    start() {
        this.app.listen(this.port, () => {
            console.init('Website listening on port', this.port);
        });
    }
}

module.exports = Website;

const website = new Website();
website.start();