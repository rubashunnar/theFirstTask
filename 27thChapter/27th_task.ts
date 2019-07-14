const fs=require("fs");
const lineReader = require('line-reader');
const _=require("lodash")
const isAlphaNumeric = (c:string) => {
    if (!(c.charCodeAt(0)  > 47 && c.charCodeAt(0)  < 58 ) && // numeric (0-9)
        !(c.charCodeAt(0)  > 64 && c.charCodeAt(0)  < 91) && // upper alpha (A-Z)
        !(c.charCodeAt(0)  > 96 && c.charCodeAt(0)  < 123))  // lower alpha (a-z)
      return false;
    return true;
    }

    
function* character (file_path:string)
{
    let data=fs.readFileSync(file_path,'utf-8').split("\n")
    for (let i=0;i<data.length;i++){
        for (let j=0; j<data[i].length;j++){
            yield data[i][j]
        }
    }
}

function* all_words(file_path:string){
    let start_char:boolean=true;
    let word="";
    let c=character(file_path)
    while(true){
        let res=c.next()
        if (res['done']==true){
            break;
        }
        else {
            let char=res['value']
            if (start_char){
                word="";
                if (isAlphaNumeric(char)){
                        word=char.toLowerCase()
                        start_char=false
                }
            }
            else {
                if (isAlphaNumeric(char)){
                    word+=char.toLowerCase();
                }
                else {
                    start_char=true;
                    yield word;
                }
            }
        }
    }
}


function* non_stop_words(file_path:string){
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    let w=all_words(file_path)
    while(true){
        let res=w.next();
        if (res['done']){
            break;
        }
        else {
            let word=res['value'];
            if (stop_words.indexOf(word)==-1) yield word;
        }
    }
}

function* count_and_sort(file_path:string){
    let wf={};
    let i=1;
    let w=non_stop_words(file_path)
    while(true){
        let res=w.next()
        if (res['done']){
            break;
        }
        else{
            let word:string=res['value']
            if (wf[word]!=undefined){
                wf[word]+=1
            }
            else {
                wf[word]=1
            }
        }
    }
    yield Object.entries(_.fromPairs(_.sortBy(_.toPairs(wf), 1).reverse()))
}

let x=count_and_sort("in.txt")
while(true){
    let res=x.next();
    if (res['done']){
        break;
    }
    else {
        for (let i=0;i<25;i++){
            console.log(res['value'][i])
        }
    }
}
