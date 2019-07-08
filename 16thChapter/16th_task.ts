const fs=require("fs");
const _=require("lodash");
const gloabal=this;

const read_stop_word=():string[]=>{
    let x: string = read_stop_word.caller.name
    if (x!="extract_words"){
        return;
    }
    else {
        let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        return stop_words
    }
}
const extract_words=(file_path:string):string[]=>{
    let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    data=data.split(" ");
    let words=[]
    let stop_words:string[]=read_stop_word();
    for (let i=0;i<data.length;i++){
        if (stop_words.indexOf(data[i])==-1){
            words.push(data[i])
        }
    }
    return words;
}

const frequencies=(word_list)=>{
    let word_freq={};
    for(let i=0;i<word_list.length;i++){
        let word=word_list[i];
        if (word_freq[word]==undefined){
            word_freq[word]=1
        }
        else{
            word_freq[word]+=1
        }
    }
    return word_freq    
}

const sort=(word_freq)=>{
    return  Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
}

const main=()=>{
    let word_f=sort(frequencies(extract_words("in.txt")))
    for (let i=0;i<25;i++){
        console.log(word_f[i]);
    }
}

if (require.main === module) {
    main();
}