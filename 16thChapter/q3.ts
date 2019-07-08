import { closeSync } from "fs";

const fs=require("fs")//file-system module
const _=require('lodash')
let class_lists=[];

class DataStorageManager{
    data:string;
    constructor(file_path:string){
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
        class_lists.push(DataStorageManager)
    }
    words(){
        return this.data.split(" ");
    }
}

class StopWordManager{
    stop_words:any[];
    constructor(){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        class_lists.push(StopWordManager)
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
        class_lists.push(WordFrequencyManager)
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
    constructor(file_path){
        this.storage_m=new DataStorageManager(file_path)
        this.stop_word_m=new StopWordManager()
        this.word_freq_m=new WordFrequencyManager();
        class_lists.push(WordFrequencyController)
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
const find_name_method=(cl)=>{
    let name=cl.name;
    let key = Object.keys(cl.prototype)
    console.log(name+": "+key)
}

for (let i=0;i<class_lists.length;i++){
    find_name_method(class_lists[i]);
}

 

