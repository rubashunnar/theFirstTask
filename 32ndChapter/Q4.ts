const fs=require("fs")
const _=require("lodash")
const sw = require('stopword')//stopword module
const readline = require('readline');
var readlineSync = require('readline-sync');
const {Queue} = require('queue-typescript')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var recursiveAsyncReadLine = function (m,v) {
    rl.question(' File: ', function (answer) {
      if (answer == 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
      m.count(answer);
      v.run(v)
      recursiveAsyncReadLine(m,v); //Calling this function again to ask new question
    });
  };
let words_queue=new Queue()
class FreqObserver{
    frequencies={}
    freq1=[]
    constructor(freqs){
        this.frequencies=freqs;
    }
    run(x){
        return new Promise(function(resolve,reject){
            var id=setInterval(()=>{
            let massage = words_queue.dequeue()
            if (massage !=undefined){
                if (massage[0]=="add"){
                    x.update_view()
                    x.frequencies=massage[1];
                }
                if (massage[0] == "die") {
                    x.update_view()
                    x.frequencies=massage[1];
                    resolve(123);
                    clearInterval(id);
                }
            }
            },100)
        })
    }
    update_view(){
        this.freq1=Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.frequencies), 1).reverse()))
        console.log("\n")
        for (let i=0;i<this.freq1.length;i++){
            console.log(this.freq1[i])
        }
    }
}

class wordcounter{
    freqs={}
    every_10_freq={}
    count(input){
        let f=fs.readFileSync(input,'utf8')
        let data=sw.removeStopwords(f.toLowerCase().replace(/[\W_]+/g, " ").split(" "));
        for (let i=0;i<data.length;i++){
            if (i==data.length-1){
                words_queue.enqueue(["die",this.freqs])
            }
           if (i!=0 && i%10==0){
                words_queue.enqueue(["add",this.every_10_freq])
                this.every_10_freq={}
           }
           if (this.freqs[data[i]]==undefined){
                this.freqs[data[i]]=1
                this.every_10_freq[data[i]]=1
           }
           else {
            this.freqs[data[i]]+=1
            this.every_10_freq[data[i]]=this.freqs[data[i]]
           }

        }
    }
}
let y =new wordcounter()
let x= new FreqObserver(y.freqs)
recursiveAsyncReadLine(y,x)


