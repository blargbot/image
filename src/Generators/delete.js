const Generator = require('../Structures/ImageGenerator');

class DeleteGenerator extends Generator {
    constructor() {
        super({
            title: 'Delete',
            description: 'Creates a Delete button.',
            body: [
                {
                    name: "text",
                    type: "string",
                    optional: false,
                    description: "The button's text."
                }
            ]
        });
    }
    async generate(args) {
        await super.generate(args);

        let base64 = await this.renderPhantom('delete.html', { replace1: args.text }, 8);

        await this.send(base64);
    }
}

module.exports = DeleteGenerator;