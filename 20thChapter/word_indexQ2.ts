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
    return data.toLowerCase().replace(/[^a-z0-9\n]+/g, " ").split("\n");
}

function remove_stop_words(word_list){
    let stop_words=[]
    if (typeof(word_list)!=typeof([])){
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
    let line=[];
    for (let i=0;i<word_list.length;i++){
        let line_words=word_list[i].split(" ");
        for (let m=0;m<line_words.length;m++){
            if (stop_words.indexOf(line_words[m])==-1) line.push(line_words[m]) ;
        }
        words.push(line)
        line=[]
    }
    return words;
}   

function frequencies(word_list){
    if (typeof(word_list)!=typeof([""])|| word_list==[]) return {};
    let word_freq={}
    for (let i=0;i<word_list.length;i++){
        let line=word_list[i];

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

function sort(word_freq){
    if (typeof(word_freq)!=typeof({})||word_freq=={})return [];
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
}

let filename="in.txt"
//console.log(remove_stop_words(extract_words(filename)))
let wf=sort(frequencies(remove_stop_words(extract_words(filename))))
for (let i=0;i<wf.length;i++){
    if (wf[i][1][0]<100)
        console.log(wf[i][0]+": "+wf[i][1][1]);
}
