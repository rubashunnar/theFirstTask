const fs=require("fs")//file-system module
const _=require('lodash')

let word_freq={};
const DataStorageMnager=(file_path:string)=>{
    let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    return data.split(" ");
}

const StopWordManager=(word)=>{
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    return (stop_words.indexOf(word)!=-1)
}

const WordFrequencyManager=(word)=>{
    if (word_freq[word]!=undefined){
        word_freq[word]+=1
    }
    else {
        word_freq[word]=1
    }
    let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
    return arr;
}

const run=()=>{
    let x=DataStorageMnager("in.txt");
    let sorted=[];
    for (let i=0;i<x.length;i++){
        let word=x[i]
        if (!StopWordManager(word)){
            sorted=WordFrequencyManager(word)
        }            
    }
    for (let i=0;i<25;i++){
        console.log(sorted[i])
    }
}

run();

 

