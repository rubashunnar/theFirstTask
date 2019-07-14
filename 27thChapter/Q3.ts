const fs=require("fs");
const _=require("lodash")
let wf={};

function all_words(file_path:string){
    let data=fs.readFileSync(file_path,'utf8').replace(/[\W_]+/g, " ").toLowerCase().split(" ")
    let it=data[Symbol.iterator]()
    while(true){
        let x=it.next();
        if (x['done']) break;
        else  non_stop_words(x['value']);
    }
    return sort();
}



function non_stop_words(word){
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    if (stop_words.indexOf(word)==-1) count(word)
    return;
    
}

function count(word){
    
    if (wf[word]!=undefined){
        wf[word]+=1
    }
    else {
        wf[word]=1
    }
    return;
}

function sort(){
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(wf), 1).reverse()));
}

//main
let arr=all_words("in.txt")

for (let i=0;i<25;i++){
    console.log(arr[i])
}
