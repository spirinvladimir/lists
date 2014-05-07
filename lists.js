var start = function () {
    'use strict';
    var g_uls,
        li = function (el, parent, content) {
            if (el === undefined) {
                el = document.createElement('li');
            }
            if (content !== undefined) {
                el.innerHTML = content;
            }
            el.setAttribute('draggable', true);
            el.addEventListener('dragstart', function (e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.dropEffect = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
            }, false);
            el.addEventListener('dragend', function (e) {
                parent.removeChild(el);
            }, false);
            return el;
        },
        flash = function (ul, prop, color, time) {
            prop += ' ';
            ul.className += prop;
            setTimeout(function () {
                ul.className = ul.className.replace(prop, '');
            }, time || 500);
        },
        BaseList = function (opts) {
            var self = this;
            Object.keys(opts).forEach(function (opt) {
                this[opt] = opts[opt];
            }, this);
            this.ondrop = function (e) {
                self.el.appendChild(li(undefined, self.el, e.dataTransfer.getData('text/html')));
            };
            [].forEach.call(this.el.children, function (child) {
                li(child, self.el);
            });
        },
        ColoredList = function (opts) {
            BaseList.call(this, opts);
            var inher = this.ondrop;
            this.ondrop = function (e) {
                inher(e);
                flash(this.el, 'border', 'red');
            }.bind(this);
        },
        CopyList = function (opts) {
            ColoredList.call(this, opts);
            var inher = this.ondrop;
            this.ondrop = function (e) {
                inher(e);
                flash(this.el, 'fill', 'red');
                g_uls[0].el.appendChild(li(undefined, g_uls[0].el, e.dataTransfer.getData('text/html')));
            }.bind(this);
        },
        initLists = function () {
            var uls = window.document.getElementsByTagName('ul'),
                keys = Object.keys(uls).filter(function (a) {
                    return typeof uls[a] === 'object';
                });
            g_uls = keys.map(function (key, id) {
                var ul;
                if (id === 0) {
                    ul = new BaseList({el: uls[key]});
                } else if (id === 1) {
                    ul = new ColoredList({el: uls[key]});
                } else if (id === 2) {
                    ul = new CopyList({el: uls[key]});
                }
                ul.el.addEventListener('drop', ul.ondrop, false);
                ul.el.addEventListener('dragover', function (e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                }, false);
                return ul;
            });
        };
    initLists();
};
