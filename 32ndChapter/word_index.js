var fs = require("fs");
var _ = require("lodash");
var sw = require('stopword'); //stopword module
var readline = require('readline');
var lineNumber = require('linenumber');
var WordFrequencyModel = /** @class */ (function () {
    function WordFrequencyModel(file_path) {
        this.freq = {};
        this.update(file_path);
    }
    WordFrequencyModel.prototype.update = function (file_path) {
        try {
            var x = fs.readFileSync(file_path, "utf8").toLowerCase();
            var words = sw.removeStopwords(x.replace(/[\W_]+/g, " ").split(" "));
            //this.freq=Object.entries(_.fromPairs(_.sortBy(_.toPairs(_.countBy(data)), 1).reverse()))
            for (var i = 0; i < words.length - 1; i++) {
                if (this.freq[words[i]] != undefined) {
                    this.freq[words[i]][0] += 1;
                }
                else {
                    this.freq[words[i]] = [1];
                    var re = new RegExp(words[i], "g");
                    var no = lineNumber(x, re);
                    var page = [];
                    for (var i_1 = 0; i_1 < no.length; i_1++) {
                        if (page.indexOf(Math.floor(no[i_1]["line"] / 45) + 1) == -1) {
                            page.push(Math.floor(no[i_1]["line"] / 45) + 1);
                        }
                    }
                    this.freq[words[i]].push(page);
                }
            }
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
        var sorted = Object.entries(this.model.freq).sort();
        for (var i = 0; i < sorted.length; i++) {
            console.log(sorted[i]);
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
    rl.question('Next File: ', function (answer) {
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
