import { type } from "os";

const fs=require("fs")//file system module 
const _=require("lodash");

class TFQuarantine{
    static functions=[];
    constructor(f){
        TFQuarantine.functions[0]=f;
    }
    bind(f){
        TFQuarantine.functions.push(f);
    }
    execute(){
        let value=()=>{return null};
        for (let i=0;i<TFQuarantine.functions.length;i++){
            console.log(TFQuarantine.functions[i].name)
        }

    }
}

function get_input(x){
    function f(){
        return "in.txt";
    }
    return f;
}

function extract_words(file_path){
    function f(){
        let data;
        data=fs.readFileSync(file_path,'utf8')  
        return data.toLowerCase().replace(/[\W_]+/g, " ").split(" ");
    }
    return f;
}

function remove_stop_words(word_list){
    function f(){
        let stop_words=[]
        stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        let words=[]
        for (let i=0;i<word_list.length;i++){
            if (stop_words.indexOf(word_list[i])==-1) words.push(word_list[i]) 
        }
        return words;
    }
    return f
}

function frequencies(word_list){
    let word_freq={};
    for (let i=0;i<word_list.length;i++){
        if (word_freq[word_list[i]]==undefined){
            word_freq[word_list[i]]=1
        }
        else {
            word_freq[word_list[i]]+=1
        }
    }
    return word_freq
}

function sort(word_freq){
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
}

function top25(word_freq){
    let top25=[]
    for (let i=0;i<25;i++){
        top25.push(word_freq[i]) 
    }
    return top25 
}

let x=new TFQuarantine(get_input)
x.bind(extract_words)
x.bind(remove_stop_words)
x.bind(frequencies)
x.bind(sort)
x.bind(top25)
x.execute();