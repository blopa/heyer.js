(function (global) {
    var Heyer = function (heyerObject) {
        return Heyer.init(heyerObject);
    };

    Heyer.prototype = {};

    Heyer.init = function (heyerObject) {
        console.log('hello world');
    };

    Heyer.init.prototype = Heyer.prototype;

    global.Heyer = Heyer;

}(window));

