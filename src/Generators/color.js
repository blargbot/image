const Generator = require('../Structures/ImageGenerator');
const Jimp = require('jimp');

class ClintGenerator extends Generator {
    constructor() {
        super({
            title: 'Color',
            description: 'Returns an image with the specified colors.',
            example: '/img/example/free.png',
            body: [
                {
                    name: "color",
                    type: "array[int | string] | int | string",
                    optional: false,
                    description: "The colors to render. Must be an array, an integer color, or a hex string. Up to 64 colors can be provided."
                }
            ]
        });
    }
    async generate(args) {
        await super.generate(args);
        let colors = [];
        if (Array.isArray(args.color))
            colors = args.color;
        else colors.push(args.color);

        if (colors.length > 64) throw { code: 400, message: 'A maximum of 64 colors may be provided. You provided ' + colors.length + '.' };
        for (let i = 0; i < colors.length; i++) {
            if (typeof colors[i] === 'string')
                colors[i] = parseInt(colors[i], 16);

            if (!isNaN(colors[i])) {
                colors[i] = colors[i].toString(16);
                colors[i] += 'FF';
                colors[i] = parseInt(colors[i], 16);
            }
        }
        if (colors.length === 1 && isNaN(colors[0]))
            throw { code: 400, message: 'An invalid color was provided: \'' + args.color + '\'' }


        let height, width, gridHeight, gridWidth;
        gridWidth = Math.ceil(Math.sqrt(colors.length));
        gridHeight = Math.ceil(colors.length / gridWidth);
        height = gridHeight * 128;
        width = gridWidth * 128;
        console.log(colors);

        let img = new Jimp(width, height);
        for (let i = 0; i < colors.length; i++) {
            colors[i] = new Jimp(128, 128, colors[i]);
        }
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth && colors.length > 0; x++) {
                img.composite(colors.shift(), x * 128, y * 128);
            }
        }
        let buf = await this.getBufferFromJimp(img);

        await this.send(buf.toString('base64'));
    }
}

module.exports = ClintGenerator;