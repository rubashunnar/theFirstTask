const fs=require("fs")
const _=require("lodash")

let all_words:any=[]
let stop_words:any=[]
let non_stop_words:any=[]
let counts:any=[]
let sorted:any=[]
let wf={}
let all_columns:any=[stop_words,all_words,non_stop_words,counts,sorted]

function remove_stop_words(w:string){
    for (let i=0;i<stop_words.length;i++)
    {   
        if ((stop_words[i][0]==w)) return["",null,true];
    }
    return [w,frequencies,true]    
}

function frequencies(w){
    let flag=true;
        if (wf[w]==undefined){
            wf[w]=1
        }
        else {
            //console.log("insidde else")
            wf[w]+=1
            flag=false
        }
    
    return [[w,wf[w]],null,flag];
}

function sort(){
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(counts[0]), 1).reverse()))
}


function update(){
    for (let i=0;i<all_columns.length-1;i++){
        for (let j=0;j<all_columns[i].length;j++){
            if (all_columns[i][j][1]!=null){
                let res=all_columns[i][j][1](all_columns[i][j][0]);
                if(res[2])
                    all_columns[i+1].push(res);
                else
                    {
                        for (let k=0;k<all_columns[i+1].length;k++){
                            if (all_columns[i+1][k][0][0]==res[0][0])
                                all_columns[i+1][k][0][1]+=1;
                        }
                    }
            } 
        }
   
    }
    let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(wf), 1).reverse()));
    for (let i=0;i<25;i++){
        console.log(arr[i]);
    }
}


let words=fs.readFileSync("in.txt",'utf8').toLowerCase().replace(/[\W_]+/g, " ").split(" ");
for (let i=0;i<words.length;i++){
    all_words.push([words[i],remove_stop_words,true])
}

let sw=fs.readFileSync('stop-words.txt','utf8').split(",");
for (let i=0;i<sw.length;i++){
    stop_words.push([sw[i],null,true])
}

update();





