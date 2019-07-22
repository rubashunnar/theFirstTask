var fs = require("fs");
var _ = require("lodash");
var sw = require('stopword'); //stopword module
var readline = require('readline');
var event_handler = /** @class */ (function () {
    function event_handler() {
        this.controllerhandler = [];
        this.viwehandler = [];
    }
    event_handler.prototype.register_for_viwe = function (handler) {
        this.viwehandler.push(handler);
    };
    event_handler.prototype.register_for_controller = function (handler) {
        this.controllerhandler.push(handler);
    };
    event_handler.prototype.run = function () {
        for (var i = 0; i < this.viwehandler.length; i++) {
            this.viwehandler[i]();
        }
        for (var i = 0; i < this.controllerhandler.length; i++) {
            this.controllerhandler[i]();
        }
    };
    return event_handler;
}());
var WordFrequencyModel = /** @class */ (function () {
    function WordFrequencyModel(file_path) {
        this.freq = [];
        this.update(file_path);
    }
    WordFrequencyModel.prototype.update = function (file_path) {
        try {
            var data = sw.removeStopwords(fs.readFileSync(file_path, "utf8").toLowerCase().replace(/[\W_]+/g, " ").split(" "));
            this.freq = Object.entries(_.fromPairs(_.sortBy(_.toPairs(_.countBy(data)), 1).reverse()));
        }
        catch (e) {
            console.log("file not found");
            this.freq = [];
        }
    };
    return WordFrequencyModel;
}());
var WordFrequencyView = /** @class */ (function () {
    function WordFrequencyView(m) {
        this.model = m;
    }
    WordFrequencyView.prototype.render = function () {
        for (var i = 0; i < this.model.freq.length; i++) {
            console.log(this.model.freq[i]);
        }
    };
    return WordFrequencyView;
}());
var WordFrequencyConstroller = /** @class */ (function () {
    function WordFrequencyConstroller(m, v, event) {
        this.model = m;
        this.view = v;
        this.event_handler = event;
        this.event_handler.register_for_viwe(this.view.render);
        this.event_handler.register_for_controller(this.run);
    }
    WordFrequencyConstroller.prototype.run = function () {
        recursiveAsyncReadLine(this.model, this.view);
    };
    return WordFrequencyConstroller;
}());
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var recursiveAsyncReadLine = function (m, v) {
    rl.question('Next File: ', function (answer) {
        if (answer == 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        m.update(answer);
        v.render();
        recursiveAsyncReadLine(m, v); //Calling this function again to ask new question
    });
};
var e = new event_handler();
var m = new WordFrequencyModel("in.txt");
var v = new WordFrequencyView(m);
var c = new WordFrequencyConstroller(m, v, e);
c.run();
