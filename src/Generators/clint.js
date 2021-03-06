const Generator = require('../Structures/ImageGenerator');
const Jimp = require('jimp');

class ClintGenerator extends Generator {
    constructor() {
        super({
            title: 'Clint',
            description: 'Shows a picture of Clint staring at something on a monitor.',
            example: '/img/example/clint.png',
            body: [
                {
                    name: "image",
                    type: "string",
                    optional: false,
                    description: "The image Clint is viewing. Either a URL or a base64 string."
                }
            ]
        });
    }
    async generate(args) {
        await super.generate(args);
        let r = await this.decodeImage(args.image);

        let avatar = await Jimp.read(r);
        avatar.resize(700, 700);
        let bgImg = this.im(await this.getBufferFromJimp(avatar));
        bgImg.command('convert');
        bgImg.out('-matte').out('-virtual-pixel').out('transparent');
        bgImg.out('-distort');
        bgImg.out('Perspective');
        bgImg.out("0,0,0,132  700,0,330,0  0,700,0,530  700,700,330,700");
        let jBgImg = await Jimp.read(await this.getBufferFromIM(bgImg));
        let foreground = await Jimp.read(await this.getLocalResource('clint.png'));
        let img = new Jimp(1200, 675, 0x000000ff);
        img.composite(jBgImg, 782, 0);

        img.composite(foreground, 0, 0);

        let buf = await this.getBufferFromJimp(img);
        await this.send(buf.toString('base64'));
    }
}

module.exports = ClintGenerator;