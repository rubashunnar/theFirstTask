const fs=require("fs");
const lineReader = require('line-reader');
const _=require("lodash")
const {Queue} = require('queue-typescript')

const isAlphaNumeric = (c:string) => {
    if (!(c.charCodeAt(0)  > 47 && c.charCodeAt(0)  < 58 ) && // numeric (0-9)
        !(c.charCodeAt(0)  > 64 && c.charCodeAt(0)  < 91) && // upper alpha (A-Z)
        !(c.charCodeAt(0)  > 96 && c.charCodeAt(0)  < 123))  // lower alpha (a-z)
      return false;
    return true;
    }
//////////////////////////////////////////////
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

class character_manager extends ActiveWFObject{
    data:string[];
    word_manager:WordManager;
    dispatch(message){
        if (message[0]=='init')
            this.init(message[1],message[2])
        else if (message[0]=='char')
            this.char(message[1]);
        else send(this.word_manager,message)
    }
    init(file_path,wm){
        this.word_manager=wm;
        this.data=fs.readFileSync(file_path,'utf-8').split("\n")
    }
    char(re:WordFrequencyController){
        for (let i=0;i<this.data.length;i++){
            for (let j=0; j<this.data[i].length;j++){
                send (this.word_manager,['process_char',this.data[i][j]])
            }
        }
        send (this.word_manager,['top',re])
    }
}
///////////////////////////////////////////////
class WordManager extends ActiveWFObject{
    start_char:boolean=true
    word="";
    word_freq_manager:StopWordManager;
    dispatch(message){
        if (message[0]=='init')
            this.init(message[1])
        else if (message[0]=='process_char')
            this.process_char(message[1]);
        else if(message[0]=="top")
            this.top(message[1])
        else send(this.word_freq_manager,message)
    }
    init(m){
        this.word_freq_manager=m;
    }
    process_char(c){
        if (this.start_char){
            this.word="";
            if (isAlphaNumeric(c)){
                    this.word=c.toLowerCase()
                    this.start_char=false
            }
        }
        else {
            if (isAlphaNumeric(c)){
                this.word+=c.toLowerCase();
            }
            else {
                this.start_char=true;
                send (this.word_freq_manager,['stop_word',this.word]);
            }
        }
       
    }
    top(re){
        send (this.word_freq_manager,['top25',re])
    }
}

////////////////////////////////////////////////////
class StopWordManager extends ActiveWFObject{
    stop_words;
    word_freq_manager:WordFrequencyManager;
    dispatch(message){
        if (message[0]=='init')
            this.init(message[1])
        else if (message[0]=='stop_word')
            return this.stop_word(message[1]);
        else send(this.word_freq_manager,message)
    }
    init(wfm){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        this.word_freq_manager=wfm
    }
    stop_word(word){
        if (this.stop_words.indexOf(word)==-1) {
            send(this.word_freq_manager,['process_word',word])};
    }

}
//////////////////////////////////////////////////////
class WordFrequencyManager extends ActiveWFObject{
    word_freq:{}={};
    sorted:any[];
    dispatch(message){
        if (message[0]=='process_word')
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
///////////////////////////////////////////////
class WordFrequencyController extends ActiveWFObject{
    storage_m:character_manager;
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
        send(this.storage_m,['char',this])
    }
}

let word_freq_manager=new WordFrequencyManager();
let stop_word_manager=new StopWordManager();
send(stop_word_manager,['init',word_freq_manager])

let word_manager=new WordManager();
send(word_manager,['init',stop_word_manager])

let storage_manager=new character_manager()
send(storage_manager,['init',"in.txt",word_manager])

let wfController=new WordFrequencyController()
send(wfController,['run',storage_manager])

let arr=[word_freq_manager.promise,stop_word_manager.promise,storage_manager.promise,wfController.promise]
Promise.all(arr)

