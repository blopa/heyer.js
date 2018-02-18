(function (global) {
    // main class
    var Heyer = function (heyerObject) {
        return Heyer.init(heyerObject);
    };

    // functions
    var domParser = function (dom) {
        var parser = function (root) {
            var isValidTextType = function (type) {
                switch (type) {
                    case 'li':
                        return true;
                    default:
                        return false;
                }
            };
            var obj = {};

            obj.type = root.nodeName.toLowerCase();
            obj.attr = {};
            if (root.className) {
                obj.attr.class = root.className;
            }
            obj.text = '';
            if (root.innerText && isValidTextType(obj.type)) {
                obj.text = root.innerText;
            }
            obj.children = [];
            if (root.children && root.children.length) {
                Array.from(root.children).forEach(function (child) {
                    obj.children.push(parser(child));
                });
            }

            return obj;
        };

        var virtualDom = parser(dom);

        Heyer.dom.old = virtualDom;
        Heyer.dom.new = virtualDom;
    };

    var createElement = function (node) {
        if (typeof node === 'string') {
            return document.createTextNode(node);
        }
        let el = document.createElement(node.type);

        node.children.map(createElement).forEach(el.appendChild.bind(el));
        return el;
    };

    var updateElement = function (dom, newNode, oldNode, index = 0) {
        var changed = function (node1, node2) {
            return (typeof node1 !== typeof node2) ||
                (typeof node1 === 'string' && node1 !== node2) ||
                (node1.type !== node2.type);
        };

        if (!oldNode) {
            dom.appendChild(createElement(newNode));
        } else if (!newNode) {
            dom.removeChild(dom.childNodes[index]);
        } else if (changed(newNode, oldNode)) {
            dom.replaceChild(createElement(newNode), dom.childNodes[index]);
        } else if (newNode.type) {
            const newLength = newNode.children.length;
            const oldLength = oldNode.children.length;

            for (let i = 0; i < newLength || i < oldLength; i++) {
                updateElement(dom.childNodes[index], newNode.children[i], oldNode.children[i], i);
            }
        }
    };

    var initialize = function (heyerObject) {
        // {
        //     el: '#element',
        //     models: {},
        //     data: {},
        //     functions: {},
        //     restoreDefaultData: {},
        //     created: {},
        // }
        let dom = document.querySelector(heyerObject.el);

        domParser(dom);
        debugger;
    };

    // attributes
    Heyer.init = initialize;

    Heyer.prototype = {};

    Heyer.dom = {};
    Heyer.dom.old = {};
    Heyer.dom.new = {};

    Heyer.init.prototype = Heyer.prototype;

    global.Heyer = Heyer;

}(window));

