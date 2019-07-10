import { AssertionError } from "assert";
import { exists } from "fs";

const fs=require("fs");//filesystem module
const _=require("lodash")

class TFTheOne{
    sValue=null;
    constructor(v){
        this.sValue=v;
    }
    bind(func){
        try{
        this.sValue=func(this.sValue)
        }
        catch(e){
            console.log(e);
            process.exit(-1);
        }
    }
    printme(){
        console.log(this.sValue)
    }
}

const extract_words=(file_path:string):any=>{
    let data;
    if (file_path==null||typeof(file_path)!=typeof("")){
        throw new AssertionError();
    }
    data=fs.readFileSync(file_path,'utf8')  
    return data.toLowerCase().replace(/[\W_]+/g, " ").split(" ");
}

const remove_stop_words=(word_list:any[]):any=>{
    let stop_words=[]
    if (!Array.isArray(word_list)){
        throw new AssertionError();
    }
    stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    let words=[]
    for (let i=0;i<word_list.length;i++){
       if (stop_words.indexOf(word_list[i])==-1) words.push(word_list[i]) 
    }
    return words;
}

const frequencies=(word_list:any[]):any=>{
    if (!Array.isArray(word_list)|| word_list.length==0) throw new AssertionError();
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

const sort=(word_freq):any=>{
    if (typeof(word_freq)!=typeof({})||Array.isArray(word_freq)||_.isEmpty(word_freq))throw new AssertionError();
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
}


//main function
let x=new TFTheOne("in.txt");
x.bind(extract_words)
x.bind(remove_stop_words)
x.bind(frequencies)
x.bind(sort)
x.printme()