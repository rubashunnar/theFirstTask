const fs=require("fs");
const _=require("lodash");
const sw=require("stopword")

let stops= fs.readFileSync('stop-words.txt','utf8').split(",");

const frequencies_imp=(word_list)=>{
    let word_freq={}
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

let extract="(file_path)=>{return sw.removeStopwords(fs.readFileSync(file_path,\"utf8\").toLowerCase().replace(/[\\W_]+/g, \" \").split(\" \"))}"
let freq="(wl)=>{return frequencies_imp(wl)}"
let sorted="(word_freq)=>{return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))}"
let extract_words=(file_path)=>{}
let frequencies=(wl)=>{}
let sort=(word_freq)=>{}
eval("frequencies="+freq);
eval("extract_words="+extract)
eval("sort="+sorted)
let wf= sort(frequencies(extract_words("in.txt")));
for (let i=0;i<25;i++){
    console.log(wf[i])
}
