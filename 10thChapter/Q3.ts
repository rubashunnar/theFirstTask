const fs=require("fs")//file-system module
const _=require('lodash')

class FileDataManager{
    data:string;
    stop_words:any[];
    constructor(file_path:string){
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    words(){
        return this.data.split(" ");
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
    file_m:FileDataManager;
    word_freq_m:WordFrequencyManager;
    constructor(file_path){
        this.file_m=new FileDataManager(file_path)
        this.word_freq_m=new WordFrequencyManager();
    }
    run(){
        for (let i=0;i<this.file_m.words().length;i++){
            let word=this.file_m.words()[i]
            if (!this.file_m.is_stop_word(word)){
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


 

