const fs=require("fs")
const _=require("lodash")
const sw = require('stopword')//stopword module
const readline = require('readline');
const lineNumber=require('linenumber');

class WordFrequencyModel{
    freq={};
    constructor(file_path){
        this.update(file_path);
    }
    update(file_path){
        try{
        let x=fs.readFileSync(file_path,"utf8").toLowerCase();
        let words=sw.removeStopwords(x.replace(/[\W_]+/g, " ").split(" "))
        //this.freq=Object.entries(_.fromPairs(_.sortBy(_.toPairs(_.countBy(data)), 1).reverse()))
        for (let i=0;i<words.length-1;i++){
            if (this.freq[words[i]]!=undefined){
                this.freq[words[i]][0]+=1
            }
            else {
                this.freq[words[i]]=[1]
                let re=new RegExp(words[i],"g")
                let no=lineNumber(x,re);
                let page=[]
                for (let i=0;i<no.length;i++){
                    if (page.indexOf(Math.floor(no[i]["line"]/45)+1)==-1){
                        page.push(Math.floor(no[i]["line"]/45)+1)
                    }
                }
                this.freq[words[i]].push(page);
            }
        }

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
        let sorted= Object.entries(this.model.freq).sort();
        for (let i=0;i<sorted.length;i++){
            console.log(sorted[i][0]+": "+sorted[i][1][1])
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