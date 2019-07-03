const fs=require("fs");//filesystem module
const _=require("lodash")

const read_file=(file_path:string,func)=>{
    let data=fs.readFileSync(file_path,'utf8')
    func(data,normalize);
}

const filter_chars=(str_data:string,func)=>{
    let data=str_data.replace(/[\W_]+/g, " ")
    func(data,scan);
}

const normalize=(str_data:string,func)=>{
    func(str_data.toLowerCase(),remove_stop_words)
}

const scan=(str_data:string,func)=>{
    func(str_data.split(" "),frequencies)
}

const remove_stop_words=(word_list:any[],func)=>{
    let stop_words=fs.readFileSync("stop-words.txt","utf8").split(",")
    let data=[]
    for (let i=0;i<word_list.length;i++){
        if (stop_words.indexOf(word_list[i])==-1)
        data.push(word_list[i]);
    }
    func(data,sort)
}

const frequencies=(word_list:any[],func)=>{
    let wf={};
    for (let i=0;i<word_list.length;i++){
        if (wf[word_list[i]]!=undefined){
            wf[word_list[i]]+=1
        }
        else {
            wf[word_list[i]]=1
        }
    }
    func(wf, print_text);
}

const sort=(wf, func)=>{
    let sorted=Object.entries(_.fromPairs(_.sortBy(_.toPairs(wf), 1).reverse()))
    func(sorted,no_op);
}

const print_text=(sorted,func)=>{
    for (let i=0; i<25; i++){
        console.log(sorted[i])
    }
    func(null)
}

const no_op=(func)=>{
    return;
}


read_file('in.txt',filter_chars);


