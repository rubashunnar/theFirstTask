import { resolve } from "url";
import { exists } from "fs";

const fs=require("fs")//file-system module
const _=require('lodash')
const {Queue} = require('queue-typescript')
let time=4000


class ActiveWFObject  {
    name 
    queue
    stopMe
    promise;
    constructor() {
        this.name = String(typeof (this))
        this.queue = new Queue()
        this.stopMe = false 
        this.run(this)       

    }
    run(x) {
           
            x.promise=new Promise(function(resolve,reject){
               var id=setInterval(()=>{
                let massage = x.queue.dequeue()
                if (massage !=undefined){
                    x.dispatch(massage);
                    if (massage[0] == 'die') {
                    resolve(123);
                    clearInterval(id);
                }
                } 
               }) 
            })
        
    }
}

function send(reciever, message){
    reciever.queue.enqueue(message)
}


class DataStorageManager extends ActiveWFObject{
    data:string='';
    stop_word_manager:StopWordManager;
    recipient;
    dispatch(message):any{
        //console.log(message);
        if (message[0]=='init')
            this.init(message[1],message[2])
        else if (message[0]=='send_word_freq')
            this.process_words(message[1]);
        else send (this.stop_word_manager,message)
    }
    init(file_path:string,swm:StopWordManager){
        this.data=fs.readFileSync("in.txt","utf8").toLowerCase().replace(/[\W_]+/g, " ")
        this.stop_word_manager=swm;
    }
    process_words(message):any{
        this.recipient=message;
        let words=this.data.split(" ");
        for (let i=0;i<words.length;i++){
            send (this.stop_word_manager,['filter',words[i]])
        }
        send(this.stop_word_manager,['top25',this.recipient])
    }
}

class StopWordManager extends ActiveWFObject{
    stop_words:any[];
    word_freq_manager:WordFrequencyManager;
    dispatch(message){
        //console.log(message);
        if (message[0]=='init')
            this.init(message[1])
        else if (message[0]=='filter')
            return this.filter(message[1]);
        else send(this.word_freq_manager,message);
    }
    init(m:WordFrequencyManager){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        this.word_freq_manager=m;
    }
    filter(word:string){
        if (this.stop_words.indexOf(word)==-1){
            send(this.word_freq_manager,['word',word])
        }
    }
}

class WordFrequencyManager extends ActiveWFObject{
    word_freq:{}={};
    sorted:any[];
    dispatch(message){
        if (message[0]=='word')
            this.increment_count(message[1])
        else if (message[0]=='top25')
            this.top25(message[1]);
    }
    increment_count(word){
        if (this.word_freq[word]!=undefined){
            this.word_freq[word]+=1
        }
        else {
            this.word_freq[word]=1
        }
    }
    top25(re){
        let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.word_freq), 1).reverse()))
        send(re,['top25',arr])
    }
}

class WordFrequencyController extends ActiveWFObject{
    storage_m:DataStorageManager;
    dispatch(message){
        //console.log(message);
        if (message[0]=='top25')
            this.display(message[1])
        else if (message[0]=='run')
            this._run(message[1]);
    }
    display(wf){
        for (let i=0;i<25;i++){
            console.log(wf[i])
        }
        send(this.storage_m,['die'])
        send(this,['die'])
    }
    _run(m){
        this.storage_m=m;
        send(this.storage_m,['send_word_freq',this])
    }
}

//main 
let word_freq_manager=new WordFrequencyManager();
let stop_word_manager=new StopWordManager();
send(stop_word_manager,['init',word_freq_manager])

let storage_manager=new DataStorageManager()
send(storage_manager,['init',"in.txt",stop_word_manager])

let wfController=new WordFrequencyController()
send(wfController,['run',storage_manager])

let arr=[word_freq_manager.promise,stop_word_manager.promise,storage_manager.promise,wfController.promise]
Promise.all(arr)

 

