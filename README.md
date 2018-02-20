# heyer.js - HEY! er... js.  
Made using https://github.com/blopa/base-webpack-library

# About
This project is a personal P.O.C. I made as I self-improvement for my Javascript skills. After using other Javascript libraries for so many years, I wanted to know if I was able to build one myself, even if just for some simple DOM manipulation.

This P.O.C. was made in around 8 hours.

# Usage
Include `heyer.js` to your `HTML` file.

```html
<script src="/heyer.js"></script>
```

Create a new instance of the `Heyer` object.

```javascript
Heyer({
    el: '#app',
    models: {
        showList: false,
        myInput: false,
        list: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
    },
    data: {
        text: 'Hello World',
        listIndex: 0,
    },
    functions: {
        sayHello: function () {
            window.alert('Hello!');
        },
        addItem: function () {
            var arr = Heyer.getModelData('list').value;
            var index = Heyer.getData('listIndex');
            arr.push('Item ' + ++index);
            Heyer.setModelData('list', arr);
            Heyer.setData('listIndex', index);
        }
    },
    created: function () {
        Heyer.instance.sayHello();
        Heyer.setModelData('list', ['Item A', 'Item B', 'Item C', 'Item D', 'Item E', 'Item F', 'Item G']);
    },
});
```

# Development

## Requirements

For development, you will only need Node.js installed on your environment.
And please use the appropriate [Editorconfig](http://editorconfig.org/) plugin for your Editor (not mandatory).

### Node

[Node](http://nodejs.org/) is really easy to install & now include [NPM](https://npmjs.org/).
You should be able to run the following command after the installation procedure
below.

    $ node --version
    v9.5.0

    $ npm --version
    5.6.0

#### Node installation on OS X

You will need to use a Terminal. On OS X, you can find the default terminal in
`/Applications/Utilities/Terminal.app`.

Please install [Homebrew](http://brew.sh/) if it's not already done with the following command.

    $ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"

If everything when fine, you should run

    brew install node

#### Node installation on Linux

    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs

#### Node installation on Windows

Just go on [official Node.js website](http://nodejs.org/) & grab the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it.

---

## Install

All the project dependencies are for development purposes only.

    $ git clone https://github.com/blopa/heyer.js.git
    $ cd PROJECT
    $ npm install

## Start dev server

    $ npm start

## Simple build for production

    $ npm run build

## Update sources

Some packages usages might change so you should run `npm prune` & `npm install` often.
A common way to update is by doing

    $ git pull
    $ npm prune
    $ npm install

To run those 3 commands you can just do

    $ npm run pull

## Languages & tools

### JavaScript

- [eslint](https://github.com/eslint/eslint) is used to prevent JavaScript error and to check coding conventions.
- [webpack](https://github.com/webpack/webpack) takes modules with dependencies and generates static assets representing those modules.
- [babel](https://github.com/babel/babel) is used to 'compile' our Javascript code.

### CSS

- [Bootstrap](https://github.com/twbs/bootstrap) for some templating.

# Release Notes
- **v0.0.1:**
	- First version

# F.A.Q.
**Q: Can you implement <???> function?**

A: I can try. Open a issue and I'll see what I can do.

**Q: Your project is awesome. How can I help?**

A: Thank you! You can help by codding more features, creating pull requests, or donating using Bitcoin: **1BdL9w4SscX21b2qeiP1ApAFNAYhPj5GgG**

# TODO
- Create TODO list

# License
MIT License

Copyright (c) 2018 blopa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Free Software, Hell Yeah!**
