import { promises } from "fs";
import { resolve } from "url";

const fs=require("fs");
const _=require("lodash");
const {Queue} = require('queue-typescript')

let parts_queue=new Queue();
let map_res=[]//mapping result
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

function split_words(res){
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
    let i=0;
    let data_str=parts_queue.dequeue();
    let words=remove_stop_words(scan(data_str))
    var id=setInterval(function(){
        i++
        result.push([words[i],1])
        if (i==words.length){
            map_res.push(result)
            res();
            clearInterval(id)
        }
        
    },10)
}

function count_words(list1,list2){
    let mappings={}
    for (let i=0;i<list1.length;i++){
        mappings[list1[i][0]]=list1[i][1]
    }
    for (let i=0;i<list2.length;i++){
        if (mappings[list2[i][0]]==undefined)mappings[list2[i][0]]=1
        else mappings[list2[i][0]]+=1
    }
    return Object.entries(mappings)
    
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
    return word_freq.sort(sortFunction)
}

async function concurrent_map(func,arr){
    let workers=[];
   
    for (let i=0;i<arr.length;i++){
        parts_queue.enqueue(arr[i])
    }
    for (let i=0;i<arr.length;i++){
        workers.push(new Promise(function(resolve, reject){
            func(resolve)
        })
    )
    }
    await Promise.all(workers)
}

async function main(){
    let p=partition(read_file("in.txt"),20)
    let x;
    let partitions=[]
    while(true){
        x=p.next()
        if (x['done'])break;
        partitions.push(x['value'])
    }
    await concurrent_map(split_words,partitions)
    let splits=map_res;
    let word_freq=sort(splits.reduce(count_words,[]))
    for (let i=0;i<25;i++){
        if (word_freq[i][0]!='undefined') console.log(word_freq[i])
    }

}

main();

