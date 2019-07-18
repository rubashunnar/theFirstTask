const fs=require("fs");
const _=require("lodash");
const lineNumber=require('linenumber');

function* partition(data_str:string,nlines:number){

    let lines=data_str.split("\n")
    let i=0;
    let str:String =""
    if (lines.length<nlines) return data_str;
    for (let i=0;i< lines.length;i=i+nlines){
        if (nlines+i>lines.length) return lines.slice(i,lines.length-1).join("\n")
        yield lines.slice(i,i+nlines).join("\n");
    }
    
}

function split_words(data_str){
    function scan(data){
        return data.toLowerCase().replace(/[\W_]+/g, " ").split(" ");
    }
    function remove_stop_words(word_list){
        let stop_words=[]
        stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        let words=[]
        for (let i=0;i<word_list.length;i++){
            if (stop_words.indexOf(word_list[i])==-1) words.push(word_list[i]) 
        }
        return words;
    }
    let result=[];
    let words=remove_stop_words(scan(data_str))
    for (let i=0;i<words.length;i++){
        result.push([words[i],1])
    }
    return result;
}

function regroup(pairs_list){
    let mappings={}
    for (let i=0; i<pairs_list.length;i++){
        let pairs=pairs_list[i];
        for (let j=0;j<pairs.length;j++){
            let p=pairs[j];
            if (mappings[p[0]]!=undefined) mappings[p[0]].push(p)
            else mappings[p[0]]=[p]
        }
    }
    return Object.entries(mappings)
}

function count_words(map_arr){

    let re=new RegExp(map_arr[0],"g")
    let no=lineNumber(read_file("in.txt").toLowerCase(),re);
    let page=[]
    for (let i=0;i<no.length;i++){
        if (page.indexOf(Math.floor(no[i]["line"]/45)+1)==-1){
            page.push(Math.floor(no[i]["line"]/45)+1)
        }
    }
    return [map_arr[0],map_arr[1].length,page];
}   

function read_file(file_path){
    return fs.readFileSync(file_path,'utf8')
}

function sort(word_freq){
    return word_freq.sort()
}

//main
let p=partition(read_file("in.txt"),20)
let x;
let partitions=[]
while(true){
    x=p.next()
    if (x['done'])break;
    partitions.push(x['value'])
}

let splits=partitions.map(split_words)
let group=regroup(splits)
let word_freq=sort(group.map(count_words));
for (let i=0;i<word_freq.length;i++){
    console.log(word_freq[i][0]+": "+word_freq[i][2])
}
