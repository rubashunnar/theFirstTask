const fs=require("fs")
const _=require("lodash")
const sw = require('stopword')//stopword module
const readline = require('readline');

class WordFrequencyModel{
    freq=[];
    constructor(file_path){
        this.update(file_path);
    }
    update(file_path){
        try{
        let data=sw.removeStopwords(fs.readFileSync(file_path,"utf8").toLowerCase().replace(/[\W_]+/g, " ").split(" "))
        this.freq=Object.entries(_.fromPairs(_.sortBy(_.toPairs(_.countBy(data)), 1).reverse()))
        }
        catch(e){
            console.log("file not found")
            this.freq=[];
        }
    }
}

class WordFrequencyView{
    model:WordFrequencyModel
    constructor(m:WordFrequencyModel){
        this.model=m;
    }
    render(){
        for (let i=0;i<this.model.freq.length;i++){
            console.log(this.model.freq[i])
        }
    }
}

class WordFrequencyConstroller{
    model:WordFrequencyModel
    view:WordFrequencyView
    constructor(m,v){
        this.model=m
        this.view=v
        v.render()
    }
    run(){
        recursiveAsyncReadLine(this.model,this.view)
    }

}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var recursiveAsyncReadLine = function (m:WordFrequencyModel,v:WordFrequencyView) {
    rl.question('Next File: ', function (answer) {
      if (answer == 'exit') //we need some base case, for recursion
        return rl.close(); //closing RL and returning from function.
      m.update(answer);
      v.render()
      recursiveAsyncReadLine(m,v); //Calling this function again to ask new question
    });
  };

let m=new WordFrequencyModel("in.txt");
let v=new WordFrequencyView(m)
let c=new WordFrequencyConstroller(m,v);
c.run();