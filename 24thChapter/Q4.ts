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
        function guard_callable(v){
            if (typeof(v)=="function")return v();
            return v;
        }
        let value=()=>{return null};
        for (let i=0;i<TFQuarantine.functions.length;i++){
            let func=TFQuarantine.functions[i]
            value= func(guard_callable(value))
        }
        console.log(guard_callable(value))
    }
}

function get_input(x){
    function f(){
        return "in.txt";
    }
    return f;
}

function read_file(file_path){
    function f(){
        let data;
        return fs.readFileSync(file_path,'utf8')  
    }
    return f;
}

function extract_words(file){
        return file.toLowerCase().replace(/[\W_]+/g, " ").split(" ");
}

function stop_words(file){
    function f(){
        return [fs.readFileSync('stop-words.txt','utf8'),file]
    }
    return f;
}

function remove_stop_words(word_list){
        let stop_w=word_list[0].split(",");
        let words=[]
        for (let i=0;i<word_list[1].length;i++){
            if (stop_w.indexOf(word_list[1][i])==-1) words.push(word_list[1][i]) 
        }
        return words;
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
x.bind(read_file)
x.bind(extract_words)
x.bind(stop_words)
x.bind(remove_stop_words)
x.bind(frequencies)
x.bind(sort)
x.bind(top25)
x.execute();