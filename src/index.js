(function (global) {
    // main class
    var Heyer = function (heyerObject) {
        return Heyer.init(heyerObject);
    };

    // functions
    var generateId = function () {
        return 'hr' + Math.random().toString(36).replace('.', '');
    };

    var domParser = function (dom) {
        let isValidTextType = function (type) {
            switch (type) {
                case 'li':
                    return true;
                default:
                    return false;
            }
        };
        let obj = {};
        let id = generateId();

        dom.setAttribute(id, '');
        obj.type = dom.nodeName.toLowerCase();
        obj.id = id;
        obj.attr = {};
        if (dom.className) {
            obj.attr.class = dom.className;
        }
        obj.text = '';
        if (dom.innerText && isValidTextType(obj.type)) {
            obj.text = dom.innerText;
        }
        obj.children = [];
        if (dom.children && dom.children.length) {
            Array.from(dom.children).forEach(function (child) {
                obj.children.push(domParser(child));
            });
        }

        return obj;
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
        let changed = function (node1, node2) {
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
        let virtualDom = domParser(dom);

        Heyer.instance.dom.old = virtualDom;
        Heyer.instance.dom.new = JSON.parse(JSON.stringify(virtualDom));
        Heyer.instance.el = heyerObject.el;
        Heyer.instance.models = heyerObject.models;
        Heyer.instance.data = heyerObject.data;
        Heyer.instance.functions = heyerObject.functions;
        debugger;
    };

    // attributes
    Heyer.init = initialize;
    Heyer.prototype = {};
    Heyer.instance = {};
    Heyer.instance.dom = {};
    Heyer.instance.dom.old = {};
    Heyer.instance.dom.new = {};
    Heyer.init.prototype = Heyer.prototype;

    // attach Heyer to global scope
    global.Heyer = Heyer;

}(window));

