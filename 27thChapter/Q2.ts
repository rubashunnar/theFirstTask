const fs=require("fs");
const _=require("lodash")

function* all_words(file_path:string){
    let data=fs.readFileSync(file_path,'utf8').replace(/[\W_]+/g, " ").toLowerCase().split(" ")
    for (let i=0;i<data.length;i++){
        yield data[i];
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
