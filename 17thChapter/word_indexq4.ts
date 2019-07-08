const fs=require("fs");
const _=require("lodash");


let stop_words;
const frequencies_imp=(word_list)=>{
    let word_freq={}
    for (let i=0;i<word_list.length;i++){
        let line=word_list[i];

        for (let m=0;m<line.length;m++){
            if(stop_words.indexOf(line[m])==-1){
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
    }
    return word_freq
}

const ew=(file_path)=>{
    let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[^a-z0-9\n]+/g, " ").split("\n");
    let words=[]
    for (let i=0;i<data.length;i++){
        let line_words=data[i].split(" ");
        words.push(line_words)
    }
    return words;
}
let extract="(file_path)=>{return ew(file_path)}"
let freq="(wl)=>{return frequencies_imp(wl)}"
let sorted="(word_freq)=>{return Object.entries(word_freq).sort()}"
let extract_words=(file_path)=>{}
let frequencies=(wl)=>{}
let sort=(word_freq):any[]=>{return []}
eval("stop_words="+"fs.readFileSync('stop-words.txt','utf8').split(\",\")")
eval("frequencies="+freq);
eval("extract_words="+extract)
eval("sort="+sorted)
let wf= sort(frequencies(extract_words("in.txt")));
for (let i=0;i<wf.length;i++){
    console.log(wf[i][0]+": "+wf[i][1][1])
}