const _=require('lodash')
const fs=require("fs")


function frequencies_imp(word_list){
    let word_freq={}
    for (let i=0;i<word_list.length;i++){
        if (word_freq[word_list[i]]==undefined){
            word_freq[word_list[i]]=1
        }
        else {
            word_freq[word_list[i]]+=1
        }
    }
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))

}
function extract_words(file_path){
   let stop_words= fs.readFileSync('stop-words.txt','utf8').split(",");
   let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ").split(" ");
   let words=[]
   for (let i=0;i<data.length;i++){
       if (stop_words.indexOf(data[i])==-1){
           words.push(data[i])
       }
   }
   return words;
}

let wf=frequencies_imp(extract_words("in.txt"))
for (let i=0;i<25;i++){
    console.log(wf[i])
}