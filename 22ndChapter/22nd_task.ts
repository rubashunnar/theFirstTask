import { AssertionError } from "assert";
const fs=require("fs");
const _=require("lodash")


function extract_words(file_path){
    let data;
    
    if (file_path==null||typeof(file_path)!=typeof("")){
        throw new AssertionError();
    }
    data=fs.readFileSync(file_path,'utf8')  
    return data.toLowerCase().replace(/[\W_]+/g, " ").split(" ");
}

function remove_stop_words(word_list){
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

function frequencies(word_list){
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

function sort(word_freq){
    if (typeof(word_freq)!=typeof({})||Array.isArray(word_freq)||_.isEmpty(word_freq))throw new AssertionError();
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
}

try{
    let filename="in.txt"
    let wf=sort(frequencies(remove_stop_words(extract_words(filename))))
    if (!Array.isArray(wf))throw new AssertionError();
    for (let i=0;i<25;i++){
        console.log(wf[i]);
    }
}
catch(e){
    console.log(e);
}