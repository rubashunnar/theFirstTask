const fs=require("fs")//file-system module
const _=require('lodash')

class DataStorageManager{
    data:string;
    constructor(file_path:string){
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    words(){
        return this.data.split(" ");
    }
}

class StopWordManager{
    stop_words:any[];
    constructor(){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(word:string){
        return (this.stop_words.indexOf(word)!=-1)
    }
}

class WordFrequencyManager{
    word_freq:{};
    sorted:any[];
    constructor(){
        this.word_freq={}
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
    static storage_m:DataStorageManager;
    static stop_word_m:StopWordManager;
    static word_freq_m:WordFrequencyManager;
    constructor(file_path){
        WordFrequencyController.storage_m=new DataStorageManager(file_path)
        WordFrequencyController.stop_word_m=new StopWordManager()
        WordFrequencyController.word_freq_m=new WordFrequencyManager();
    }
    run(){
        for (let i=0;i<WordFrequencyController.storage_m.words().length;i++){
            let word=WordFrequencyController.storage_m.words()[i]
            if (!WordFrequencyController.stop_word_m.is_stop_word(word)){
                WordFrequencyController.word_freq_m.increment_count(word)
            }            
        }
        let word_freqs=WordFrequencyController.word_freq_m.sort();
        for (let i=0;i<25;i++){
            console.log(word_freqs[i])
        }
    }
}

let profile=(f)=>{
    let wrapperfunction=(...arg)=>{
        let start_time=new Date().getMilliseconds();
        let ret_value=f(...arg);
        let elapsed=new Date().getMilliseconds()-start_time;
        console.log(f.name)
        console.log(f.name+" took "+elapsed+" milliseconds");
        return ret_value
    }
    return wrapperfunction;
}

//main 
let x=new WordFrequencyController("in.txt")
x.run= profile(x.run);
x.run();


 

