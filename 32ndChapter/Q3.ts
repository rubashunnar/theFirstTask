const fs=require("fs")
const _=require("lodash")
const sw = require('stopword')//stopword module
const readline = require('readline');

class event_handler{
    controllerhandler: any = []
    viwehandler:any=[]
    register_for_viwe(handler) {
         this.viwehandler.push(handler) 
    }
    register_for_controller(handler) {
        this.controllerhandler.push(handler)
      }
    run() {
        for (let i = 0; i < this.viwehandler.length; i++){
            this.viwehandler[i]()  
          }
        for (let i = 0; i < this.controllerhandler.length; i++){
           this.controllerhandler[i]() 
        }
      
    }
}

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
    event_handler:event_handler
    constructor(m,v,event){
        this.model=m
        this.view=v
        this.event_handler = event as event_handler
        this.event_handler.register_for_viwe(this.view.render)
        this.event_handler.register_for_controller(this.run)
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

let e=new event_handler()
let m=new WordFrequencyModel("in.txt");
let v=new WordFrequencyView(m)
let c=new WordFrequencyConstroller(m,v,e);
c.run();