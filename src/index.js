(function (global) {
    // main class
    var Heyer = function (heyerObject) {
        return Heyer.init(heyerObject);
    };

    // functions
    var generateId = function () {
        return 'data-hr' + Math.random().toString(36).replace('.', '');
    };

    var getHeyerIdFromDomElement = function (dom) {
        let result = null;

        for (let k in dom.attributes) {
            if (typeof dom.attributes[k] === 'function') {
                continue;
            }
            if (dom.attributes[k].name.substr(0, 7) === 'data-hr') {
                result = dom.attributes[k].name;
                break;
            }
        }

        return result;
    };

    var createDomElement = function (dom, virtualDom) {
        let el = document.createElement(virtualDom.type);

        for (let k in virtualDom.attr) {
            // todo
        }

        el.setAttribute(virtualDom.id, '');
        el.innerText = virtualDom.text;
        dom.appendChild(el);
    };

    var updateDomElement = function (id, value) {

        if (value instanceof Array) {
            let k = 0;
            let parent = document.querySelectorAll('[' + id + ']');

            parent = parent[0];
            let virtualEl = {};
            let baseId = getHeyerIdFromDomElement(parent.children[0]);

            baseId = baseId.substr(7, baseId.length);
            baseId = baseId.split('-')[0];
            let childId = 'data-hr' + baseId;

            while (true) {
                let query = document.querySelectorAll('[' + childId + '-' + k + ']');

                if (Object.keys(virtualEl).length === 0) {
                    virtualEl.type = query[0].localName;

                    // virtualEl.id = baseId;
                    virtualEl.model = null;
                    virtualEl.children = [];
                    virtualEl.attr = {};
                    // virtualEl.text = value;

                    if (query[0].className) {
                        virtualEl.attr.class = query[0].className;
                    }
                }

                if ((value[k] === undefined) && (query.length === 0)) {
                    break;
                }

                if (query.length === 0) {
                    let parentId = getHeyerIdFromDomElement(parent);
                    let parentQuery = document.querySelectorAll('[' + parentId + ']');

                    virtualEl.id = childId + '-' + k;
                    virtualEl.text = value[k];
                    createDomElement(parentQuery[0], virtualEl);
                } else {
                    if (parent === undefined) {
                        parent = query[0].parentNode;
                    }

                    if (query[0].innerText !== value[k]) {
                        query[0].innerText = value[k];
                    }

                    if (value[k] === undefined) {
                        query[0].remove();
                    }
                }
                k++;
            }
        } else {
            let query = document.querySelectorAll('[' + id + ']');

            if (query.length === 1) {
                let node = query[0];

                if (node.localName === 'input') {
                    if (node.type === 'checkbox') {
                        node.checked = value;
                    }
                }
            }
        }
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

    var createDomLoop = function (dom, arr) {
        while (dom.firstChild) {
            dom.removeChild(dom.firstChild);
        }
        for (let k in arr) {
            createDomElement(dom, arr[k]);
        }
    };

    var getVirtualElementById = function (id) {
        // todo
    };

    var buildLoop = function (virtualDom, model) {
        let query = document.querySelectorAll('[' + virtualDom.id + ']');
        let parent = query[0].parentNode;
        let arr = [];

        for (let key in model.value) {
            if (virtualDom.type === 'li') {
                let obj = {};

                obj.type = virtualDom.type; // .toLowerCase();
                obj.id = virtualDom.id + '-' + key;
                obj.model = null;
                obj.children = [];
                obj.attr = virtualDom.attr;
                obj.text = model.value[key];
                arr.push(obj);
            }
        }

        createDomLoop(parent, arr);
        return arr;
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
        obj.children = [];
        obj.attr = {};
        obj.text = '';
        if (dom.innerText && isValidTextType(obj.type)) {
            obj.text = dom.innerText;
        }
        if (dom.attributes['hr-model']) {
            let model = Heyer.instance.models[dom.attributes['hr-model'].value];

            model.id = id;
            obj.model = model;
            dom.removeAttribute('hr-model');
            addListener(dom);
            updateDomElement(id, model.value);
        }
        if (dom.className) {
            obj.attr.class = dom.className;
        }
        if (dom.attributes['hr-loop']) {
            let loop = dom.attributes['hr-loop'].value;

            loop = loop.replace(/[()]/g, ' ');
            let params = loop.split(' in ');
            let modelName = params[params.length - 1].trim();
            let variables = params[0].split(',');
            let model = Heyer.instance.models[modelName];

            model.id = getHeyerIdFromDomElement(dom.parentNode);
            for (let i = 0; i < variables.length; i++) {
                variables[i] = variables[i].trim();
            }

            let arrObj = buildLoop(obj, model);

            dom.removeAttribute('hr-loop');
            return arrObj;
        }
        if (dom.children && dom.children.length) {
            Array.from(dom.children).forEach(function (child) {
                let result = domParser(child);

                for (let r in result) {
                    obj.children.push(result[r]);
                }
            });
        }

        return [obj];
    };

    var updateVirtualDomElement = function (id) {
        debugger;
        let query = document.querySelectorAll('[' + id + ']');

        let virtualDom = domParser(query[0]);
    };

    var setModelData = function (modelName, modelValue, updateDom = true) {
        if (Heyer.instance.models[modelName]) {
            if (Heyer.instance.models[modelName].value !== modelValue) {
                Heyer.instance.models[modelName].value = modelValue;
                if (updateDom) {
                    updateDomElement(Heyer.instance.models[modelName].id, modelValue);
                    updateVirtualDomElement(Heyer.instance.models[modelName].id);
                }
            }
            return true;
        }

        return false;
    };

    var changeListener = function (event) {
        let id = getHeyerIdFromDomElement(event.target);
        let models = Heyer.instance.models;

        for (let key in models) {
            if (models[key].id === id) {
                let value = getDomValue(event.target);

                setModelData(key, value, false);
                return;
            }
        }
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
        let result = domParser(dom);

        if (result.length === 1) {
            Heyer.instance.dom = result[0];
        } else {
            for (let r in result) {
                Heyer.instance.dom.push(result[r]);
            }
        }

        Heyer.setModelData('list', ['Item A', 'Item B', 'Item C', 'Item D', 'Item E', 'Item F', 'Item G', 'Item H']);
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

