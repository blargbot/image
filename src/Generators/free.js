const Generator = require('../Structures/ImageGenerator');
const Jimp = require('jimp');

class ClintGenerator extends Generator {
    constructor() {
        super({
            title: 'Free!!!',
            description: 'You can get something for FREE! Click to find out how.',
            example: '/img/example/free.png',
            body: [
                {
                    name: "top",
                    type: "string",
                    optional: false,
                    description: "The top text."
                },
                {
                    name: "bottom",
                    type: 'string',
                    optional: true,
                    description: 'The bottom text.',
                    default: 'Click here to find out how'
                }
            ]
        });
        this.type = 'gif';
    }
    async generate(args) {
        await super.generate(args);

        let topCaption = await Jimp.read(await this.createCaption({
            text: args.top,
            font: 'impact.ttf',
            fill: 'white',
            stroke: 'black',
            strokewidth: 5,
            gravity: 'north',
            size: '380x100'
        }));
        let bottomText = args.bottom || 'CLICK HERE TO\nFIND OUT HOW';
        let bottomCaption = await Jimp.read(await this.createCaption({
            text: bottomText,
            font: 'arial.ttf',
            fill: 'white',
            gravity: 'center',
            size: '380x70'
        }));

        let back1 = await Jimp.read(await this.getLocalResource('freefreefree0.png'));
        let back2 = await Jimp.read(await this.getLocalResource('freefreefree1.png'));

        let frameCount = 6;
        let frames = [];
        let base = new Jimp(400, 300);

        for (let i = 0; i < frameCount; i++) {
            let temp = base.clone();
            temp.composite(i < frameCount / 2 ? back1 : back2, 0, 0);
            temp.composite(topCaption, i == 0 ? 10 : this.getRandomInt(-25, 25), i == 0 ? 15 : this.getRandomInt(0, 20));
            temp.composite(bottomCaption, 10, 228);
            frames.push(temp.bitmap.data);
        }

        let encoder = await this.prepareGIFEncoder(400, 300, 0, 50);
        for (let frame of frames) encoder.addFrame(frame);
        let buf = await this.renderGIF();
        await this.send(buf.toString('base64'));
    }
}

module.exports = ClintGenerator;