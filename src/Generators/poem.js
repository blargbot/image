const Generator = require('../Structures/ImageGenerator');

class PoemGenerator extends Generator {
    constructor() {
        super({
            title: 'Poem',
            description: 'Writes a lovely DDLC poem.',
            body: [
                {
                    name: "text",
                    type: "string",
                    optional: false,
                    description: "The poem's content."
                },
                {
                    name: "name",
                    type: "string",
                    optional: true,
                    default: "monika",
                    description:
                        "The name of the girl who is writing the poem. One of 'monika', 'sayori', 'yuri', and 'natsuki'."
                },
                {
                    name: "yuri",
                    type: "number",
                    optional: true,
                    description: "The Yuri variation to use. Either blank, 1, or 2."
                }
            ]
        });
    }

    async generate(args) {
        await super.generate(args);
        let names = ['monika', 'sayori', 'yuri', 'natsuki'];
        if (args.name && typeof args.name === 'string' && names.includes(args.name.toLowerCase()))
            args.name = args.name.toLowerCase();
        else args.name = 'monika';
        if (!args.text) args.text = 'Just Monika.';
        let base64 = await this.renderPhantom('poem.html', { replace1: args.text }, 2, 'PNG',
            function (args) {
                document.getElementById('replace1').classList.add(args.name);
                if (args.name === 'yuri' && args.yuri) {
                    var variation = '';
                    switch (args.yuri) {
                        case '1':
                            variation = 'y1';
                            break;
                        case '2':
                            variation = 'y2';
                            break;
                    }
                    if (variation) {
                        document.getElementById('workspace').classList.add(variation);
                        document.getElementById('replace1').classList.remove(args.name);
                        document.getElementById('replace1').classList.add(variation === 'y1' ? 'yuri1' : 'yuri2');
                    }
                }

                var el, elements, _i, _len, _results, wrapper;
                elements = document.getElementsByClassName('resize');
                wrapper = document.getElementById('wrapper');
                if (elements.length < 0) {
                    return;
                }
                _results = [];
                for (_i = 0, _len = elements.length; _i < _len; _i++) {
                    el = elements[_i];
                    _results.push((function (el) {
                        var resizeText, _results1;
                        if (el.style['font-size'] === '') el.style['font-size'] = '44px';
                        if (el.style['line-height'] === '') el.style['font-size'] = '44px';
                        resizeText = function () {
                            var elNewFontSize;
                            elNewFontSize = (parseInt(el.style.fontSize.slice(0, -2)) - 1) + 'px';
                            el.style.fontSize = elNewFontSize;
                            el.style.lineHeight = elNewFontSize;

                            return el;
                        };
                        _results1 = null;
                        var ii = 0;
                        while (el.scrollHeight > wrapper.clientHeight) {
                            _results1 = resizeText();
                            if (++ii == 1000) break;

                        }
                        return _results1;
                    })(el));
                }
                return _results;
            }, { name: args.name, yuri: args.yuri });

        await this.send(base64);
    }

}

module.exports = PoemGenerator;