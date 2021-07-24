const Generator = require('../Structures/ImageGenerator');
const Jimp = require('jimp');

class ClintGenerator extends Generator {
    constructor() {
        super({
            title: 'Caption',
            description: 'Captions the provided image.',
            body: [
                {
                    name: "text",
                    type: "string",
                    optional: false,
                    description: "What sonic is saying."
                },
            ]
        });
    }
    async generate(args) {
        await super.generate(args);

        let base64 = await this.renderPuppet('sonicsays.html', { replace1: args.text, replace2: args.text }, 8);

        await this.send(base64);
    }
}

module.exports = ClintGenerator;