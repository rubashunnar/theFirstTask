var fs = require("fs");
var _ = require("lodash");
var sw = require('stopword'); //stopword module
var readline = require('readline');
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
    function WordFrequencyConstroller(m, v) {
        this.model = m;
        this.view = v;
        v.render();
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
    rl.question('Command: ', function (answer) {
        if (answer == 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        m.update(answer);
        v.render();
        recursiveAsyncReadLine(m, v); //Calling this function again to ask new question
    });
};
var m = new WordFrequencyModel("in.txt");
var v = new WordFrequencyView(m);
var c = new WordFrequencyConstroller(m, v);
c.run();
