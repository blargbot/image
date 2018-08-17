const Generator = require('../Structures/ImageGenerator');
const Jimp = require('jimp');

class LinusGenerator extends Generator {
    constructor() {
        super({
            title: 'Linus',
            description: 'Shows a picture of Linus pointing to something on a monitor.',
            body: [
                {
                    name: "image",
                    type: "string",
                    optional: false,
                    description: "The image Linus is pointing to. Either a URL or a base64 string."
                }
            ]
        });
    }
    async generate(args) {
        await super.generate(args);
        let r = await this.decodeImage(args.image);

        let avatar = await Jimp.read(r);
        let { height, width } = avatar.bitmap;
        let ratioHeight = (width / 16) * 9,
            ratioWidth = (height / 9) * 16;
        if (height > ratioHeight) {
            avatar.crop(0, (height - ratioHeight) / 2, width, ratioHeight);
        } else {
            avatar.crop((width - ratioWidth) / 2, 0, ratioWidth, height);
        }
        59, 144

        avatar.resize(741, 417)

        let bgImg = this.im(await this.getBufferFromJimp(avatar));
        bgImg.command('convert');
        bgImg.out('-matte').out('-virtual-pixel').out('transparent');
        bgImg.out('-distort');
        bgImg.out('Perspective');
        bgImg.out("0,0,0,42  741,0,307,0  0,417,49,417  741,417,334,259");
        let jBgImg = await Jimp.read(await this.getBufferFromIM(bgImg));
        let foreground = await Jimp.read(await this.getLocalResource('linus.png'));
        let img = new Jimp(961, 639, 0x000000ff);
        img.composite(jBgImg, 59, 144);

        img.composite(foreground, 0, 0);

        let buf = await this.getBufferFromJimp(img);
        await this.send(buf.toString('base64'));
    }
}

module.exports = LinusGenerator;