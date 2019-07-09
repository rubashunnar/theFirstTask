const fs=require("fs")
const _=require('lodash');

export let frequencies_imp=(word_list)=>{
    let word_freq={}
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
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
    return Object.entries(word_freq).sort()
}