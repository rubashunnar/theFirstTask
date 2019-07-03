const fs=require('fs');//file-system module
const _=require("lodash")
const RECURSION_LIMIT=10;


const count=(word_list:any[],stopwords:any[],wordfreq:any):any=>{
    if (word_list.length==0)return wordfreq;
    else {
        let word=word_list[0];
        if (stopwords.indexOf(word)==-1){
            if (wordfreq[word]!=undefined){
                wordfreq[word]+=1
            }
            else wordfreq[word]=1
        }
        return count(word_list.slice(1,word_list.length-1),stopwords,wordfreq);
        
    }
}

const wf_print=(wf)=>{
    if (wf.length==0)return;
    else {
        console.log(wf[0])
    }
    wf_print(wf.splice(1,wf.length-1))
}
let word_freq={};
let stop_words=fs.readFileSync("stop-words.txt","utf8").split(",")
let data=fs.readFileSync("in.txt","utf8").toLowerCase().replace(/[\W_]+/g, " ").split(" ")
for (let i=0;i<data.length;i=i+RECURSION_LIMIT){
    word_freq=count(data.slice(i,i+RECURSION_LIMIT),stop_words,word_freq)
}

let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
wf_print(arr.splice(0,25))