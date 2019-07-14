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
    let line=[];
    for (let i=0;i<all_words[0].length;i++){
        let line_words=all_words[0][i].split(" ");
        for (let m=0;m<line_words.length;m++){
            if (stop_words[0].indexOf(line_words[m])==-1) line.push(line_words[m]) ;
        }
        words.push(line)
        line=[]
    }
    return words;
}

function frequencies(){
    let word_freq={}
    for (let i=0;i<non_stop_words[0].length;i++){
        let line=non_stop_words[0][i];

        for (let m=0;m<line.length;m++){
            if (word_freq[line[m]]==undefined){
                word_freq[line[m]]=[1,[Math.floor(i/45)+1]]
            }
            else {
                    word_freq[line[m]][0]+=1
                if (word_freq[line[m]][1].indexOf(Math.floor(i/45)+1)==-1){
                    word_freq[line[m]][1].push(Math.floor(i/45)+1)
                }
            }
        
        }
    }
    return word_freq
}

function sort(){
    return Object.entries(counts[0]).sort();
}


function update(){
    for (let i=0;i<all_columns.length;i++){
       if (all_columns[i][1]!=null){
           all_columns[i][0]=all_columns[i][1]();
       } 
    }
}

all_words[0]=fs.readFileSync("in.txt",'utf8').toLowerCase().replace(/[^a-z0-9\n]+/g, " ").split("\n");
stop_words[0]=fs.readFileSync('stop-words.txt','utf8').split(",");
update();

for (let i=0;i<sorted[0].length;i++){
    console.log(sorted[0][i][0]+": "+sorted[0][i][1][1])
}


