const fs=require("fs");
const _=require("lodash");


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
            let ch=p[0]
            if (ch.charCodeAt(0)  > 96 && ch.charCodeAt(0)  < 102 ){
                if (mappings["a-e"]!=undefined) mappings["a-e"].push(p)
                else mappings["a-e"]=[p]
            }
            else if(ch.charCodeAt(0)  > 101 && ch.charCodeAt(0)  < 107 ){
                if (mappings["f-j"]!=undefined) mappings["f-j"].push(p)
                else mappings["f-j"]=[p]
            }
            else if(ch.charCodeAt(0)  > 106 && ch.charCodeAt(0)  < 112 ){
                if (mappings["k-o"]!=undefined) mappings["k-o"].push(p)
                else mappings["k-o"]=[p]
            }
            else if(ch.charCodeAt(0)  > 111 && ch.charCodeAt(0)  < 117 ){
                if (mappings["p-t"]!=undefined) mappings["p-t"].push(p)
                else mappings["p-t"]=[p]
            }
            else if(ch.charCodeAt(0)  > 116 && ch.charCodeAt(0)  < 123 ){
                if (mappings["u-z"]!=undefined) mappings["u-z"].push(p)
                else mappings["u-z"]=[p]
            }
        }
    }
    return Object.entries(mappings)
}

function count_words(map_arr){
    let freq={};
    for (let i=0;i<map_arr[1].length;i++){
        if (freq[map_arr[1][i][0]]==undefined)freq[map_arr[1][i][0]]=1
        else freq[map_arr[1][i][0]]+=1
    }
    return Object.entries(freq)
}   

function read_file(file_path){
    return fs.readFileSync(file_path,'utf8')
}

function sort(word_freq){
    function sortFunction(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
    }
    let s=[]
    for (let i=0;i<word_freq.length;i++){
        for (let j=0;j<word_freq[i].length;j++){
            s.push(word_freq[i][j])
        }
    }
    return s.sort(sortFunction)
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
for (let i=0;i<25;i++){
    console.log(word_freq[i])
}
