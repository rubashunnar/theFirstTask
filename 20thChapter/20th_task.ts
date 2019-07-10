const fs=require("fs");
const _=require("lodash");

function extract_words(file_path){
    let data;
    if (file_path==null||typeof(file_path)!=typeof("")){
        return []
    }
    try{
        data=fs.readFileSync(file_path,'utf8')
    }
    catch(e){
        console.log(e)
        return [];
    }
    return data.toLowerCase().replace(/[\W_]+/g, " ").split(" ");
}

function remove_stop_words(word_list){
    let stop_words=[]
    if (!Array.isArray(word_list)){
        return [];
    }
    try{
        stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    catch(e){
        console.log(e)
        return [];
    }
    let words=[]
    for (let i=0;i<word_list.length;i++){
       if (stop_words.indexOf(word_list[i])==-1) words.push(word_list[i]) 
    }
    return words;
}   

function frequencies(word_list){
    if (!Array.isArray(word_list)|| word_list.length==0) return {};
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
    if (typeof(word_freq)!=typeof({})||Array.isArray(word_freq)||_.isEmpty(word_freq))return [];
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
}

let filename="in.txt"
let wf=sort(frequencies(remove_stop_words(extract_words(filename))))
for (let i=0;i<25;i++){
    console.log(wf[i]);
}