var fs = require("fs");
var _ = require("lodash");
var sw = require('stopword'); //stopword module
var readline = require('readline');
var readlineSync = require('readline-sync');
var Queue = require('queue-typescript').Queue;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var recursiveAsyncReadLine = function (m, v) {
    rl.question(' File: ', function (answer) {
        if (answer == 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        m.count(answer);
        v.run(v);
        recursiveAsyncReadLine(m, v); //Calling this function again to ask new question
    });
};
var words_queue = new Queue();
var FreqObserver = /** @class */ (function () {
    function FreqObserver(freqs) {
        this.frequencies = {};
        this.freq1 = [];
        this.frequencies = freqs;
    }
    FreqObserver.prototype.run = function (x) {
        return new Promise(function (resolve, reject) {
            var id = setInterval(function () {
                var massage = words_queue.dequeue();
                if (massage != undefined) {
                    if (massage[0] == "add") {
                        x.update_view();
                        x.frequencies = massage[1];
                    }
                    if (massage[0] == "die") {
                        x.update_view();
                        x.frequencies = massage[1];
                        resolve(123);
                        clearInterval(id);
                    }
                }
            }, 100);
        });
    };
    FreqObserver.prototype.update_view = function () {
        this.freq1 = Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.frequencies), 1).reverse()));
        console.log("\n");
        for (var i = 0; i < this.freq1.length; i++) {
            console.log("10:");
            console.log(this.freq1[i]);
        }
    };
    return FreqObserver;
}());
var wordcounter = /** @class */ (function () {
    function wordcounter() {
        this.freqs = {};
        this.every_10_freq = {};
    }
    wordcounter.prototype.count = function (input) {
        var f = fs.readFileSync(input, 'utf8');
        var data = sw.removeStopwords(f.toLowerCase().replace(/[\W_]+/g, " ").split(" "));
        for (var i = 0; i < data.length; i++) {
            if (i == data.length - 1) {
                words_queue.enqueue(["die", this.freqs]);
            }
            if (i != 0 && i % 10 == 0) {
                words_queue.enqueue(["add", this.every_10_freq]);
                this.every_10_freq = {};
            }
            if (this.freqs[data[i]] == undefined) {
                this.freqs[data[i]] = 1;
                this.every_10_freq[data[i]] = 1;
            }
            else {
                this.freqs[data[i]] += 1;
                this.every_10_freq[data[i]] = this.freqs[data[i]];
            }
        }
    };
    return wordcounter;
}());
var y = new wordcounter();
var x = new FreqObserver(y.freqs);
recursiveAsyncReadLine(y, x);
