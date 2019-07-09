const fs=require("fs")
export let extract_words=(file_path)=>{
    let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[^a-z0-9\n]+/g, " ").split("\n");
    let words=[]
    for (let i=0;i<data.length;i++){
        let line_words=data[i].split(" ");
        words.push(line_words)
    }
    return words;
}
