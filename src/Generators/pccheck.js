const Generator = require('../Structures/ImageGenerator');

class PoemGenerator extends Generator {
    constructor() {
        super({
            title: 'PC Check',
            description: 'Tells everyone a reason why they should get their PC checked. Template credits go to Ghosty#8204.',
            body: [
                {
                    name: "text",
                    type: "string",
                    optional: false,
                    description: "Why your PC should get checked."
                }
            ]
        });
    }

    async generate(args) {
        await super.generate(args);
        let container = [];
        let italic = false;
        let temp = '';
        let m = args.text;
        for (let i = 0; i < m.length; i++) {
            if (m[i] === '*') {
                container.push({ italic, text: temp });
                temp = '';
                italic = !italic;
            } else if (m[i] === ' ' || m[i] === '\n') { 
                container.push({ italic, text: temp + ' ' });
                temp = '';
            } else
                temp += m[i];
        }
        container.push({ italic, text: temp });
        if (container.length > 1 && container.filter(w => w.italic).length === 0) {
            let filtered = container.filter(w => w.text.length > 3);
            if (filtered.length > 0) {
                let rand = filtered[Math.floor(Math.random() * filtered.length)];
                rand.italic = true;
            }    
        }
        let base64 = await this.renderPhantom('pccheck.html', {}, 2, 'PNG',
            [function (m) {
                var thing = document.getElementById('replace1');
                for (var i = 0; i < m.length; i++) {
                    var el = document.createElement(m[i].italic ? 'em' : 'span');
                    el.innerText = m[i].text;
                    thing.appendChild(el);
                }
            }, this.resize], container);

        await this.send(base64);
    }
    get resize() {
        return function () {
            var el, elements, _i, _len, _results;
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
                    if (el.style['font-size'] === '') el.style['font-size'] = '65px';
                    resizeText = function () {
                        var elNewFontSize;
                        elNewFontSize = (parseInt(el.style.fontSize.slice(0, -2)) - 1) + 'px';
                        el.style.fontSize = elNewFontSize;
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
        }
    }
}

module.exports = PoemGenerator;