(function (global) {
    // main class
    var Heyer = function (heyerObject) {
        return Heyer.init(heyerObject);
    };

    // functions
    var generateId = function () {
        return 'data-hr' + Math.random().toString(36).replace('.', '');
    };

    var updateDomElement = function (id, value) {
        let query = document.querySelectorAll('[' + id + ']');

        if (query.length === 1) {
            let node = query[0];

            if (node.localName === 'input') {
                if (node.type === 'checkbox') {
                    node.checked = value;
                }
            }
        }
    };

    var setModelData = function (modelName, modelValue, updateDom = true) {
        if (Heyer.instance.models[modelName]) {
            if (Heyer.instance.models[modelName].value !== modelValue) {
                Heyer.instance.models[modelName].value = modelValue;
                if (updateDom) {
                    updateDomElement(Heyer.instance.models[modelName].id, modelValue);
                }
            }
            return true;
        }

        return false;
    };

    var getModelData = function (modelName) {
        return Heyer.instance.models[modelName];
    };

    var getDomValue = function (dom) {
        if (dom.localName === 'input') {
            if (dom.type === 'checkbox') {
                return dom.checked;
            }
        }

        return null;
    };

    var changeListener = function (event) {
        Array.from(event.target.attributes).forEach(function (attr) {
            if (attr.name.substr(0, 7) === 'data-hr') {
                let models = Heyer.instance.models;

                for (let key in models) {
                     if (models[key].id === attr.name) {
                         let value = getDomValue(event.target);

                         setModelData(key, value, false);
                         return;
                     }
                }
            }
        });
    };

    var addListener = function (dom) {
        switch (dom.localName) {
            case 'input':
                dom.addEventListener('change', changeListener);
                break;
            default:
                break;
        }
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
        obj.type = dom.localName; // .toLowerCase();
        obj.id = id;
        obj.model = null;
        if (dom.attributes['hr-model']) {
            let model = Heyer.instance.models[dom.attributes['hr-model'].value];

            model.id = id;
            obj.model = model;
            dom.removeAttribute('hr-model');
            addListener(dom);
            updateDomElement(id, model.value);
        }
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

    var setData = function (dataName, dataValue, updateDom = true) {
        if (Heyer.instance.data[dataName]) {
            if (Heyer.instance.data[dataName] !== dataValue) {
                Heyer.instance.data[dataName] = dataValue;
            }
            return true;
        }

        return false;
    };

    var getData = function (dataName) {
        return Heyer.instance.data[dataName];
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
        let mapModels = function (models) {
            let obj = {};

            for (let key in models) {
                obj[key] = {
                    value: models[key],
                    id: ''
                };
            }

            return obj;
        };
        let dom = document.querySelector(heyerObject.el);

        Heyer.instance.el = heyerObject.el;
        Heyer.instance.models = mapModels(heyerObject.models);
        Heyer.instance.data = heyerObject.data;
        Heyer.instance.functions = heyerObject.functions;
        // let virtualDom = domParser(dom);

        // Heyer.instance.dom.old = virtualDom;
        // Heyer.instance.dom.new = JSON.parse(JSON.stringify(virtualDom));
        Heyer.instance.dom = domParser(dom);
        // debugger;
    };

    // attributes
    Heyer.init = initialize;
    Heyer.prototype = {};
    Heyer.setData = setData;
    Heyer.getData = getData;
    Heyer.setModelData = setModelData;
    Heyer.getModelData = getModelData;
    Heyer.instance = {};
    Heyer.instance.dom = {};
    // Heyer.instance.dom.old = {};
    // Heyer.instance.dom.new = {};
    Heyer.init.prototype = Heyer.prototype;

    // attach Heyer to global scope
    global.Heyer = Heyer;

}(window));

