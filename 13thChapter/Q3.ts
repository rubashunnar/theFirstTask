const fs=require("fs")
const _=require("lodash")

abstract class IDataStorage{
    abstract words():string[];
}

abstract class IStopWordFilter{
    abstract is_stop_word(word:string);
}

abstract class IWordFrequencyCounter{
    abstract increment_count(word:string);
    abstract sort():any[];
}

class DataStorageManager extends IDataStorage{
    data:string;
    constructor(file_path:string){
        super();
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    words():string[]{
        return this.data.split(" ");
    }
}

class StopWordManager extends IStopWordFilter{
    stop_words:string[];
    constructor(){
        super()
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(word:string):boolean{
        return (this.stop_words.indexOf(word)!=-1)
    }
}

class WordFrequencyManager extends IWordFrequencyCounter{
    word_freq:{};
    sorted:string[][];
    constructor(){
        super()
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
    sort():any[]{
        let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.word_freq), 1).reverse()))
        return arr;
    }
}

class WordFrequencyController{
    storage_m:DataStorageManager;
    stop_word_m:StopWordManager;
    word_freq_m:WordFrequencyManager;
    constructor(file_path){
        this.storage_m=new DataStorageManager(file_path)
        this.stop_word_m=new StopWordManager()
        this.word_freq_m=new WordFrequencyManager();
    }
    run(){
        for (let i=0;i<this.storage_m.words().length;i++){
            let word=this.storage_m.words()[i]
            if (!this.stop_word_m.is_stop_word(word)){
                this.word_freq_m.increment_count(word)
            }            
        }
        let word_freqs:any[]=this.word_freq_m.sort();
        for (let i=0;i<25;i++){
            console.log(word_freqs[i])
        }
    }
}

//main 
let x=new WordFrequencyController("in.txt")
x.run();
