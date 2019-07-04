const fs=require("fs")//file-system module
const _=require('lodash')


class TFExcercises{
    name
    constructor(){
        this.name = "super";
    }
    info1(){  
        console.log(this.constructor.name)
    }
}

class DataStorageManager extends TFExcercises{
    data:string;
    constructor(file_path:string){
        super();
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    words(){
        return this.data.split(" ");
    }
    info(){
        super.info1.call(new TFExcercises);
        console.log("My Major Data Structure is a "+ this.constructor.name)
    }
}

class StopWordManager extends TFExcercises {
    stop_words:any[];
    constructor(){
        super()
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(word:string){
        return (this.stop_words.indexOf(word)!=-1)
    }
    info(){
        super.info1.call(new TFExcercises);
        console.log( "My Major Data Structure is a "+ this.constructor.name)
    }
}

class WordFrequencyManager extends TFExcercises{
    word_freq:{};
    sorted:any[];
    constructor(){
        super();
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
    info(){
        super.info1.call(new TFExcercises);
       console.log("My Major Data Structure is a "+ this.constructor.name)
    }
}

class WordFrequencyController{
    storage_m:DataStorageManager;
    stop_word_m:StopWordManager;
    word_freq_m:WordFrequencyManager;
    constructor(file_path){
        this.storage_m=new DataStorageManager(file_path)
        this.storage_m.info();
        this.stop_word_m=new StopWordManager()
        this.stop_word_m.info();
        this.word_freq_m=new WordFrequencyManager();
        this.word_freq_m.info();
    }
    run(){
        for (let i=0;i<this.storage_m.words().length;i++){
            let word=this.storage_m.words()[i]
            if (!this.stop_word_m.is_stop_word(word)){
                this.word_freq_m.increment_count(word)
            }            
        }
        let word_freqs=this.word_freq_m.sort();
        for (let i=0;i<25;i++){
            console.log(word_freqs[i])
        }
    }
}

//main 
let x=new WordFrequencyController("in.txt")
x.run();

 

