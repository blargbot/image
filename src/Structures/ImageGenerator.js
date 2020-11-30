const Eris = require('eris');
const snekfetch = require('snekfetch');
const phantom = require('phantom');
const puppeteer = require('puppeteer');

const gm = require('gm');
const im = require('gm').subClass({
    imageMagick: true
});

const parse = require('parse-color');
// additional colors
const extraParse = {
    'blurple': '#7289DA',
    'greyple': '#99AAB5',
    'darkbutnotblack': '#2C2F33',
    'notquiteblack': '#23272A'
}

const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const GIFEncoder = require('gifencoder');

class ArgError extends Error {
    constructor(arg, m) {
        let message = `Error in argument '${arg.name}': ${m}`;
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ImageGenerator {
    get request() { return snekfetch; }
    get random() { return random; }
    get gm() { return gm; }
    get im() { return im; }
    get Jimp() { return Jimp; }
    get fs() { return fs; }
    get path() { return path; }
    get phantom() { return phantom; }
    get GIFEncoder() { return GIFEncoder; }

    constructor(args = {}) {
        this.title = args.title;
        this.description = args.description;
        this.body = args.body;
        this.type = 'png';

        // gif rendering stuff
        this.encoder = null;
        this.gifStream;
        this.buffers = [];
    }

    parse(color = '') {
        let ep = extraParse[color.toLowerCase()];
        if (ep)
            color = ep;
        return parse(color);
    }

    prepareGIFEncoder(width, height, repeat = 0, delay = 50) {
        this.encoder = new GIFEncoder(width, height);
        this.gifStream = this.encoder.createReadStream();
        this.gifStream.on('data', (buffer) => {
            this.buffers.push(buffer);
        })
        this.encoder.start();
        this.encoder.setRepeat(repeat);
        this.encoder.setDelay(delay);
        return this.encoder;
    }

    renderGIF() {
        return new Promise((res, rej) => {
            this.gifStream.on('end', async () => {
                res(Buffer.concat(this.buffers));
            });

            this.encoder.finish();
        })
    }

    serialize() {
        return {
            title: this.title,
            description: this.description,
            body: this.body,
            type: this.type
        };
    }

    validateArgs(args) {
        for (const arg of this.body) {
            if (arg.optional !== true && !args[arg.name])
                throw new ArgError(arg, 'required parameter not provided');
            else if (arg.optional === true && !args[arg.name]) {
                args[arg.name] = arg.default;
            }
            if (arg.type !== 'string' && args[arg.name]) {
                if (typeof args[arg.name] === 'string')
                    try {
                        args[arg.name] = JSON.parse(args[arg.name]);
                    } catch (err) { }
                if (arg.type.includes('|')) return;
                if (/array\[.+\]/.test(arg.type)) {
                    if (!Array.isArray(arg[arg.name]))
                        throw new ArgError(arg, `expected type 'array' but received '${typeof args[arg.name]}'`);
                }
                else {
                    let types = arg.type.split(' | ');
                    if (typeof args[arg.name] !== arg.type)
                        throw new ArgError(arg, `expected type '${arg.type}' but received '${typeof args[arg.name]}'`);
                }
            } else if (arg.type === 'string' && args[arg.name])
                args[arg.name] = args[arg.name].toString();
        }
    }

    async generate(args) {
        // no-op
    }

    async send(data, contentType = 'image/png') {
        if (typeof data === 'string')
            process.send({ image: data, contentType });
        else
            process.send({ image: Buffer.from(data, 'base64'), contentType });
    }

    async renderPuppet(file, replaces, scale = 1, format = 'PNG', extraFunctions, ...extraFunctionArgs) {
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();

        let dPath = this.getLocalResourcePath(file);
        await page.goto(dPath);

        let rect = await page.evaluate(function (message) {
            var keys = Object.keys(message);
            for (var i = 0; i < keys.length; i++) {
                var thing = document.getElementById(keys[i]);
                thing.innerText = message[keys[i]];
            }

            try {
                var workspace = document.getElementById("workspace");
                return JSON.parse(JSON.stringify(workspace.getBoundingClientRect()));
            } catch (err) {
                console.error(err);
                return { top: 0, left: 0, width: 300, height: 300 };
            }
        }, replaces);

        if (typeof extraFunctions === 'function') {
            extraFunctions = [extraFunctions];
        }
        if (Array.isArray(extraFunctions)) {
            for (const extraFunction of extraFunctions) {
                if (typeof extraFunction === 'function')
                    await page.evaluate(extraFunction, ...extraFunctionArgs);
            }
        }

        const b64 = await page.screenshot({
            type: format.toLowerCase(),
            clip: {
                x: rect.top,
                y: rect.left,
                width: rect.width * scale,
                height: rect.height * scale
            },
            omitBackground: true,
            encoding: 'base64'
        });

        await browser.close();

        return b64;
    }

    sleep(time = 1000) {
        return new Promise(res => {
            setTimeout(res, time);
        });
    }

    get resourceDir() {
        return this.path.join(__dirname, '..', '..', 'res');
    }

    getLocalResource(name, encoding = null) {
        return new Promise((resolve, reject) => {
            let filePath = this.path.join(this.resourceDir, name);
            fs.readFile(filePath, { encoding }, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    getLocalResourcePath(name) {
        return 'file://' + this.path.join(this.resourceDir, name).replace(/\\/g, '/');
    }

    async decodeImage(text) {
        let resource;
        if (/^<.+>$/.test(text))
            text = text.substring(1, text.length - 1);
        if (text.startsWith('http'))
            resource = await this.getResource(text);
        else if (Buffer.isBuffer(text))
            resource = text;
        else
            resource = Buffer.from(text, 'base64');
        return resource;
    }

    getResource(url) {
        return new Promise(async (resolve, reject) => {
            url = url.trim();
            if (url.startsWith('<') && url.endsWith('>')) {
                url = url.substring(1, url.length - 1);
            }
            let res = await this.request.get(url);
            if (res.headers['content-type'] == 'image/gif') {
                this.gm(res.body, 'temp.gif').selectFrame(0).setFormat('png').toBuffer(function (err, buffer) {
                    if (err) {
                        console.error('Error converting gif');
                        reject(err);
                        return;
                    }
                    resolve(buffer);
                });
            } else if (['image/png', 'image/jpeg', 'image/bmp'].includes(res.headers['content-type'])) {
                resolve(res.body);
            } else {
                reject('Wrong file type!');
            }
        });
    }

    createCaption(options) {
        return new Promise((resolve, reject) => {
            if (!options.text) {
                reject(new Error('No text provided'));
                return;
            }
            if (!options.font) {
                reject(new Error('No font provided'));
                return;
            }
            if (!options.size) {
                reject(new Error('No size provided'));
                return;
            }
            if (!options.fill) options.fill = 'black';
            if (!options.gravity) options.gravity = 'Center';


            let image = im().command('convert');

            image.font(path.join(this.resourceDir, 'fonts', options.font));
            image.out('-size').out(options.size);

            image.out('-background').out('transparent');
            image.out('-fill').out(options.fill);
            image.out('-gravity').out(options.gravity);
            if (options.stroke) {
                image.out('-stroke').out(options.stroke);
                if (options.strokewidth) image.out('-strokewidth').out(options.strokewidth);
            }
            image.out(`caption:${options.text}`);
            if (options.stroke) {
                image.out('-compose').out('Over');
                image.out('-size').out(options.size);
                image.out('-background').out('transparent');
                image.out('-fill').out(options.fill);
                image.out('-gravity').out(options.gravity);
                image.out('-stroke').out('none');
                image.out(`caption:${options.text}`);
                image.out('-composite');
            }
            image.setFormat('png');
            image.toBuffer(function (err, buf) {
                if (err) {
                    console.error(`[IM] Failed to generate a caption: '${options.text}'`);
                    reject(err);
                    return;
                }
                resolve(buf);
            });
        });
    }

    getBufferFromIM(img) {
        return new Promise((resolve, reject) => {
            img.setFormat('png').toBuffer(function (err, buffer) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(buffer);
            });
        });
    }

    getBufferFromJimp(img) {
        return new Promise((resolve, reject) => {
            img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(buffer);
            });
        });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}

module.exports = ImageGenerator;