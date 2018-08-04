const Generator = require('../Structures/ImageGenerator');
const Jimp = require('jimp');

const fonts = {
    arcena: 'ARCENA.ttf',
    arial: 'arial.ttf',
    animeace: 'animeace.ttf',
    annieuseyourtelescope: 'AnnieUseYourTelescope.ttf',
    comicjens: 'comicjens.ttf',
    impact: 'impact.ttf',
    sftoontime: 'SFToontime.ttf',
    delius: 'delius.ttf',
    indieflower: 'IndieFlower.ttf',
    roboto: 'Roboto-Regular.ttf',
    ubuntu: 'Ubuntu-Regular.ttf',
    comicsans: 'comicsans.ttf'
};

class ClintGenerator extends Generator {
    constructor() {
        super({
            title: 'Caption',
            description: 'Captions the provided image.',
            body: [
                {
                    name: "image",
                    type: "string",
                    optional: false,
                    description: "The image to caption. Either a URL or a base64 string."
                },
                {
                    name: "top",
                    type: "string",
                    optional: true,
                    description: "The top text."
                },
                {
                    name: "bottom",
                    type: 'string',
                    optional: true,
                    description: 'The bottom text.'
                },
                {
                    name: "font",
                    type: 'string',
                    optional: true,
                    description: 'The font to use. One of: ' + Object.keys(fonts).join(', ') + '. Defaults to impact.',
                    default: 'impact'
                }
            ]
        });
    }
    async generate(args) {
        await super.generate(args);
        let r = await this.decodeImage(args.image);
        let img = await Jimp.read(r);
        img.scaleToFit(800, 800);

        let height = img.bitmap.height;
        let width = img.bitmap.width;
        let topbuf;
        let botbuf;
        let font = fonts[args.font];
        if (!font) font = 'impact.ttf';
        if (args.top) {
            topbuf = await this.createCaption({
                text: args.top,
                font,
                size: `${width}x${height / 6}`,
                gravity: 'north',
                fill: 'white',
                stroke: 'black',
                strokewidth: 16
            });
            let topcap = await Jimp.read(topbuf);
            img.composite(topcap, 0, 0);
        }
        if (args.bottom) {
            botbuf = await this.createCaption({
                text: args.bottom,
                font,
                size: `${width}x${height / 6}`,
                gravity: 'south',
                fill: 'white',
                stroke: 'black',
                strokewidth: 16
            });
            let botcap = await Jimp.read(botbuf);
            img.composite(botcap, 0, height / 6 * 5);
        }
        let buf = await this.getBufferFromJimp(img);
        await this.send(buf.toString('base64'));
    }
}

module.exports = ClintGenerator;