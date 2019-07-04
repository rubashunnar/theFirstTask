const fs=require("fs")//file-system module
const _=require('lodash')

class information{
    info(){
        console.log("inside "+this.constructor.name)
    }
}

class DataStorageManager{
    data:string='';
    x:information=new information();
    dispatch(message):any{
        if (message[0]=='init')
            return this.init(message[1])
        else if (message[0]=='words')
            return this.words();
        else if (message[0]=='info')
            return this.x.info.call(new DataStorageManager);
        else throw new Error("No such Method"+message[0]);
    }
    init(file_path:string){
        this.data=fs.readFileSync("in.txt","utf8").toLowerCase().replace(/[\W_]+/g, " ")
    }
    words():any{
        return this.data.split(" ");
    }
}

class StopWordManager{
    stop_words:any[];
    x:information=new information();
    dispatch(message){
        if (message[0]=='init')
            return this.init()
        else if (message[0]=='is_stop_word')
            return this.is_stop_word(message[1]);
        else if (message[0]=='info')
            return this.x.info.call(new StopWordManager);
        else throw new Error("No such Method"+message[0]);
    }
    init(){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(word:string){
        return (this.stop_words.indexOf(word)!=-1)
    }
}

class WordFrequencyManager{
    word_freq:{}={};
    sorted:any[];
    x:information=new information();
    dispatch(message){
        if (message[0]=='increment_count')
            return this.increment_count(message[1])
        else if (message[0]=='sort')
            return this.sort();
        else if (message[0]=='info')
            return this.x.info.call(new WordFrequencyManager);
        else throw new Error("No such Method"+message[0]);
    }
    increment_count(word){
        if (this.word_freq[word]!=undefined){
            this.word_freq[word]+=1
        }
        else {
            this.word_freq[word]=1
        }
    }
    sort(){
        let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.word_freq), 1).reverse()))
        return arr;
    }
}

class WordFrequencyController{
    storage_m:DataStorageManager;
    stop_word_m:StopWordManager;
    word_freq_m:WordFrequencyManager;
    dispatch(message){
        if (message[0]=='init')
            return this.init(message[1])
        else if (message[0]=='run')
            return this.run();
        else throw new Error("No such Method"+message[0]);
    }
    init(file_path:string){
        this.storage_m=new DataStorageManager()
        this.storage_m.dispatch(['info'])
        this.stop_word_m=new StopWordManager()
        this.stop_word_m.dispatch(['info'])
        this.word_freq_m=new WordFrequencyManager();
        this.word_freq_m.dispatch(['info'])
        this.storage_m.dispatch(['init',file_path])
        this.stop_word_m.dispatch(['init'])
    }
    run(){
        let words=this.storage_m.dispatch(['words']);
        for (let i=0;i<words.length;i++){
            let word=words[i]
            if (!this.stop_word_m.dispatch(['is_stop_word',word])){
                this.word_freq_m.dispatch(['increment_count',word])
            }            
        }
        let word_freqs=this.word_freq_m.dispatch(['sort']);
        for (let i=0;i<25;i++){
            console.log(word_freqs[i])
        }
    }
}

//main 
let wfcontroller=new WordFrequencyController();
wfcontroller.dispatch(['init',"in.txt"])
wfcontroller.dispatch(['run'])

 

