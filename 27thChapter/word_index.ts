const fs=require("fs");
const _=require("lodash")

function* all_words(file_path:string){
    let data=fs.readFileSync(file_path,'utf8').replace(/[^a-z0-9\n]+/g, " ").toLowerCase().split("\n")
    for (let i=0;i<data.length;i++){
        yield data[i];
    }
}


function* non_stop_words(file_path:string){
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    let w=all_words(file_path)
    let count=0
    while(true){
        let res=w.next();
        if (res['done']){
            break;
        }
        else {
            count++
            let line=res['value'];
            let line_words=line.split(" ");
            for (let m=0;m<line_words.length;m++){
                if (stop_words.indexOf(line_words[m])==-1) yield [line_words[m],count] ;
            }
        }
    }
}

function* count_and_sort(file_path:string){
    let wf={};
    let count=0;
    let w=non_stop_words(file_path)
    while(true){
        let res=w.next()
        if (res['done']){
            break;
        }
        else{
            count=res['value'][1];
            let word=res['value'][0]
            if (wf[word]==undefined){
                wf[word]=[1,[Math.floor(count/45)+1]]
            }
            else {
                    wf[word][0]+=1
                if (wf[word][1].indexOf(Math.floor(count/45)+1)==-1){
                    wf[word][1].push(Math.floor(count/45)+1)
                }
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
            console.log(res['value'][i][0]+": "+res['value'][i][1][1])
        }
    }
}
