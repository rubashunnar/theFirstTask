const fs=require("fs");
const _=require("lodash");


let stop_words;

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

const ew=(file_path)=>{
    let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ").split(" ");
    let words=[]
    for (let i=0;i<data.length;i++){
        if (stop_words.indexOf(data[i])==-1){
            words.push(data[i])
        }
    }
    return words;
}

let extract="(file_path)=>{return ew(file_path)}"
let freq="(wl)=>{return frequencies_imp(wl)}"
let sorted="(word_freq)=>{return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))}"
let extract_words=(file_path)=>{}
let frequencies=(wl)=>{}
let sort=(word_freq)=>{}
eval("stop_words="+"fs.readFileSync('stop-words.txt','utf8').split(\",\")")
eval("frequencies="+freq);
eval("extract_words="+extract)
eval("sort="+sorted)
let wf= sort(frequencies(extract_words("in.txt")));
for (let i=0;i<25;i++){
    console.log(wf[i])
}
