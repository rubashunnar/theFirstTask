
var readlineSync = require('readline-sync');
const sw = require('stopword')
const fs = require("fs")//file-system module
const _=require("lodash")

class WordFrequenciesModel{
    freqs = {}
    freqsmall={}
    stopwords
    path_to_file
    data
    counter
    end
    constructor(path_to_file) {
        this.end=false
        this.path_to_file = path_to_file
        this.counter=0
        this.update(path_to_file)
    }
    update(path_to_file) {
        this.freqsmall = {}
        this.path_to_file=path_to_file
        this.end=false
        if (this.path_to_file!=path_to_file){
            this.counter=0;
        }
        try
        {
        this.data = sw.removeStopwords(fs.readFileSync(path_to_file, "utf8").toLowerCase().replace(/[^A-Za-z0-9]+/g, " ").split(" "))
            for (let i = this.counter; i < this.data.length; i++){
                if (i == this.data.length - 1) {
                    this.end = true
                    this.counter = 0                    
                }
                if (i == 10 + this.counter) {
                    this.counter += 10     
                  return 
                }
            if (this.freqs[this.data[i]] == undefined) {
                this.freqs[this.data[i]] = 1
                this.freqsmall[this.data[i]] =1
            }
            else {
                this.freqs[this.data[i]] += 1
                this.freqsmall[this.data[i]] =this.freqs[this.data[i]]
            }
            }
            }
        catch (error) {
            console.log("file not found")
            this.freqs={}
        }   
    }
}

class WordFrequenciesView {
    model: any
    constructor(model) {
        this.model=model
    }
    render() {
        let data=this.model.freqs
        let array:any=Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.model.freqs), 1).reverse()))
        for (let i = 0; i < array.length; i++){
            console.log("top10="+array[i])
        }
        this.model.freqs={}
    }
} class WordFrequencyController {
    model: any
    viwe: any
    constructor(model,viwe) {
        this.model = model
        this.viwe = viwe
        this.model.update(this.model.path_to_file)
        if (this.model.end == false) {
            askfunction(this.model,this.viwe)     
        }
    }
    run() {
        while(true){
            recursiveAsyncReadLine(this.model,this.viwe)
        }
        
    }
}
var recursiveAsyncReadLine = function (m:WordFrequenciesModel,v:WordFrequenciesView) {
    while (m.end == false) {
        askfunction(m,v)     
    }
    console.log("total File: ")
    v.render()
    let input = readlineSync.question('Next File');
    m.update(input)

};
var askfunction = function (m: WordFrequenciesModel, v: WordFrequenciesView) {
    for (let i = 0; i < Object.keys(m.freqsmall).length; i++){
        console.log(Object.keys(m.freqsmall)[i]+" - "+m.freqsmall[Object.keys(m.freqsmall)[i]])
    }
    let input = readlineSync.question('More [Y/N]');
    switch(input.toLowerCase()) {
        case 'y':
            m.update(m.path_to_file)
            break;
        case 'n':
            m.end = true;
            break;
        default:
            console.log('Invalid answer!');
    }      
};
let m = new WordFrequenciesModel("inputFile.txt")
let v = new WordFrequenciesView(m)
let c = new WordFrequencyController(m, v)
c.run()