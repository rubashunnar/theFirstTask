const fs=require('fs');//file-system module
const _=require("lodash")
const lineNumber=require("linenumber")

const RECURSION_LIMIT=100;
let word_freq={}
let pages=[]
let flag=false

const wordpage=(words:any[],file:string,stopword:any[])=>{
    if (words.length==0) return;
    let word1=words[0];
    for (let m=0;m<pages.length;m++){
        if (pages[m][0]==word1)
            {flag=true;
            break;}
        
    }
    if (stopword.indexOf(word1)== -1 && word1!='' && !flag){
        let re=new RegExp(word1,"g")
        console.log(re);
        let no=lineNumber(file,re);
        let line=[]
        for (let i=0;i<no.length;i++){
            if (line.indexOf(Math.floor(no[i]["line"]/45)+1)==-1){
                line.push(Math.floor(no[i]["line"]/45)+1)
            }
        }
        pages.push([word1,line])
    }
    flag=false;
    wordpage(words.slice(1,words.length),file,stopword);
}

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
    wf_print(wf.slice(1,wf.length-1))
}

let stop_words=fs.readFileSync("stop-words.txt","utf8").split(",")
let m=fs.readFileSync("in.txt","utf8").toLowerCase()
let data=m.replace(/[\W_]+/g, " ").split(" ")
for (let i=0;i<data.length;i=i+RECURSION_LIMIT){
    count(data.slice(i,i+RECURSION_LIMIT),stop_words)
}
wordpage(data,m,stop_words)
//let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
console.log(pages)