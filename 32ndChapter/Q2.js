var readlineSync = require('readline-sync');
var sw = require('stopword');
var fs = require("fs"); //file-system module
var _ = require("lodash");
var WordFrequenciesModel = /** @class */ (function () {
    function WordFrequenciesModel(path_to_file) {
        this.freqs = {};
        this.freqsmall = {};
        this.end = false;
        this.path_to_file = path_to_file;
        this.counter = 0;
        this.update(path_to_file);
    }
    WordFrequenciesModel.prototype.update = function (path_to_file) {
        this.freqsmall = {};
        this.path_to_file = path_to_file;
        this.end = false;
        if (this.path_to_file != path_to_file) {
            this.counter = 0;
        }
        try {
            this.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "));
            for (var i = this.counter; i < this.data.length; i++) {
                if (i == this.data.length - 1) {
                    this.end = true;
                    this.counter = 0;
                }
                if (i == 10 + this.counter) {
                    this.counter += 10;
                    return;
                }
                if (this.freqs[this.data[i]] == undefined) {
                    this.freqs[this.data[i]] = 1;
                    this.freqsmall[this.data[i]] = 1;
                }
                else {
                    this.freqs[this.data[i]] += 1;
                    this.freqsmall[this.data[i]] = this.freqs[this.data[i]];
                }
            }
        }
        catch (error) {
            console.log("file not found");
            this.freqs = {};
        }
    };
    return WordFrequenciesModel;
}());
var WordFrequenciesView = /** @class */ (function () {
    function WordFrequenciesView(model) {
        this.model = model;
    }
    WordFrequenciesView.prototype.render = function () {
        var data = this.model.freqs;
        var array = Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.model.freqs), 1).reverse()));
        for (var i = 0; i < array.length; i++) {
            console.log("top10=" + array[i]);
        }
        this.model.freqs = {};
    };
    return WordFrequenciesView;
}());
var WordFrequencyController = /** @class */ (function () {
    function WordFrequencyController(model, viwe) {
        this.model = model;
        this.viwe = viwe;
        this.model.update(this.model.path_to_file);
        if (this.model.end == false) {
            askfunction(this.model, this.viwe);
        }
    }
    WordFrequencyController.prototype.run = function () {
        while (true) {
            recursiveAsyncReadLine(this.model, this.viwe);
        }
    };
    return WordFrequencyController;
}());
var recursiveAsyncReadLine = function (m, v) {
    while (m.end == false) {
        askfunction(m, v);
    }
    console.log("total File: ");
    v.render();
    var input = readlineSync.question('Next File');
    m.update(input);
};
var askfunction = function (m, v) {
    for (var i = 0; i < Object.keys(m.freqsmall).length; i++) {
        console.log(Object.keys(m.freqsmall)[i] + " - " + m.freqsmall[Object.keys(m.freqsmall)[i]]);
    }
    var input = readlineSync.question('More [Y/N]');
    switch (input.toLowerCase()) {
        case 'y':
            m.update(m.path_to_file);
            break;
        case 'n':
            m.end = true;
            break;
        default:
            console.log('Invalid answer!');
    }
};
var m = new WordFrequenciesModel("inputFile.txt");
var v = new WordFrequenciesView(m);
var c = new WordFrequencyController(m, v);
c.run();
