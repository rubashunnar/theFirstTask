const fs=require("fs");//filesystem module
const _=require("lodash")

const wrap=(v)=>{
    return v;
}

const bind=(v, func)=>{
    return func(v);
}

const read_file=(file_path:string):any=>{
    let data=fs.readFileSync(file_path,'utf8')
    return data;
}

const filter_chars=(str_data:string):any=>{
    let data=str_data.replace(/[\W_]+/g, " ")
    return data;
}

const normalize=(str_data:string):any=>{
    return str_data.toLowerCase();
}

const scan=(str_data:string):any=>{
    return str_data.split(" ")
}

const remove_stop_words=(word_list:any[]):any=>{
    let stop_words=fs.readFileSync("stop-words.txt","utf8").split(",")
    let data=[]
    for (let i=0;i<word_list.length;i++){
        if (stop_words.indexOf(word_list[i])==-1)
        data.push(word_list[i]);
    }
    return data;
}

const frequencies=(word_list:any[]):any=>{
    let wf={};
    for (let i=0;i<word_list.length;i++){
        if (wf[word_list[i]]!=undefined){
            wf[word_list[i]]+=1
        }
        else {
            wf[word_list[i]]=1
        }
    }
   return wf;
}

const sort=(wf):any=>{
    let sorted=Object.entries(_.fromPairs(_.sortBy(_.toPairs(wf), 1).reverse()))
    let top25=[]
    for (let i=0;i<25;i++){
        top25.push(sorted[i])
    }
    return top25;
}

const printme=(Value)=>{
    console.log(Value)
}

//main function
printme(wrap(bind(wrap(bind(wrap(bind(wrap(bind(wrap(bind(wrap(bind(wrap(bind(wrap("in.txt"),read_file)),filter_chars)),normalize)),scan)),remove_stop_words)),frequencies)),sort)))