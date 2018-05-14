let type = process.env.IMAGE_TYPE;
const Generator = require('../Generators/' + type);
const generator = new Generator();
let args = JSON.parse(process.env.IMAGE_ARGS);

generator.generate(args).catch(err => {
    process.send({ error: true, code: 500, message: err.message, stack: err.stack })
});