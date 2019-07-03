const fs=require('fs');//file-system module
const _=require("lodash")
const RECURSION_LIMIT=10;
let word_freq={}

const count=(word_list:any[],stopwords:any[])=>{
    if (word_list.length==0)return;
    else {
        let word=word_list[0];
        if (stopwords.indexOf(word)==-1){
            if (word_freq[word]!=undefined){
                word_freq[word]+=1
            }
            else word_freq[word]=1
        }
        count(word_list.slice(1,word_list.length-1),stopwords);
    }
}

const wf_print=(wf)=>{
    if (wf.length==0)return;
    else {
        console.log(wf[0])
    }
    wf_print(wf.splice(1,wf.length-1))
}

let stop_words=fs.readFileSync("stop-words.txt","utf8").split(",")
let data=fs.readFileSync("in.txt","utf8").toLowerCase().replace(/[\W_]+/g, " ").split(" ")
for (let i=0;i<data.length;i=i+RECURSION_LIMIT){
    count(data.slice(i,i+RECURSION_LIMIT),stop_words)
}

let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
wf_print(arr.splice(0,25))