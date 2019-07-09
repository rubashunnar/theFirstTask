 const fs=require("fs")
 export function extract_words(file_path){
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