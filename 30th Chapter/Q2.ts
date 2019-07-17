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
//
function* split_words(data_str,nwords){
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
    let results=[]
    let m=0
    let words=remove_stop_words(scan(data_str))
    if (words.length<nwords) return words
    for (let i=0;i<words.length;i++){
        results.push([words[i],1])
        if (i==words.length-1||i==m+nwords){
            yield results
            results=[]
            m=i
        }
    }
}
//
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
//
function read_file(file_path){
    return fs.readFileSync(file_path,'utf8')
}
//
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

// values.map(
//     function(x) { return squarefuncwithadjustment(x, 2); }
//   );
//main
let p=partition(read_file("in.txt"),20)
let x;
let partitions=[]
let spliting=[]


while(true){
    x=p.next()
    if (x['done'])break;
    partitions.push(x['value'])
}

let splits=partitions.map(function(x) { 
    let s=split_words(x,10)
    let m;
    let int=[]
    while(true){
        //console.log(x['done'])
        m=s.next();
        if (m['done'])break;
        for (let i=0;i<m['value'].length;i++){
            int.push(m['value'][i])
        }
        
    }
    return int;
})

let word_freq=sort(splits.reduce(count_words,[]))
for (let i=0;i<25;i++){
    console.log(word_freq[i])
}
