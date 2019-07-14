const fs=require("fs")
const _=require("lodash")

let all_words:any=[[],null]
let stop_words:any=[[],null]
let non_stop_words:any=[null,remove_stop_words]
let counts:any=[null,frequencies]
let sorted:any=[null, sort]
let all_columns:any=[all_words,stop_words,non_stop_words,counts,sorted]

function remove_stop_words(){
    let words=[]
    for (let i=0;i<all_words[0].length;i++){
        if (stop_words[0].indexOf(all_words[0][i])==-1) words.push(all_words[0][i]);
    }
    return words;
}

function frequencies(){
    let word_freq={};
    for (let i=0;i<non_stop_words[0].length;i++){
        if (word_freq[non_stop_words[0][i]]==undefined){
            word_freq[non_stop_words[0][i]]=1
        }
        else {
            word_freq[non_stop_words[0][i]]+=1
        }
    }
    return word_freq
}

function sort(){
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(counts[0]), 1).reverse()))
}


function update(){
    for (let i=0;i<all_columns.length;i++){
       if (all_columns[i][1]!=null){
           all_columns[i][0]=all_columns[i][1]();
       } 
    }
}

all_words[0]=fs.readFileSync("in.txt",'utf8').toLowerCase().replace(/[\W_]+/g, " ").split(" ");
stop_words[0]=fs.readFileSync('stop-words.txt','utf8').split(",");
update();

for (let i=0;i<25;i++){
    console.log(sorted[0][i])
}


