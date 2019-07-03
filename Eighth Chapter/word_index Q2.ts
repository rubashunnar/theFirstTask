const fs=require("fs");//filesystem module
const _=require("lodash")//lodash library
const sw = require('stopword')//stopword module
const lineNumber = require('linenumber');//line-number module

const read_file=(file_path:string,func)=>{
    let data=fs.readFileSync(file_path,'utf8')
    func(data,normalize);
}

const filter_chars=(str_data:string,func)=>{
    let data=str_data.replace(/[^A-Za-z0-9\n]+/g, " ")
    func(data,scan);
}

const normalize=(str_data:string,func)=>{
    func(str_data.toLowerCase(),remove_stop_words)
}

const scan=(str_data:string,func)=>{
    func(str_data.split("\n"),frequencies_lines)
}

const remove_stop_words=(word_list:any[],func)=>{
    let data=[]
    for (let i=0;i<word_list.length;i++){
        let l=sw.removeStopwords(word_list[i].split(" "))
        data.push(l);
    }
    func(data,sort);
}

const frequencies_lines=(data:any[],func)=>{
    let wordpage={}
    let words=data.join().split(",");
    //loop over words
    for (let y=0;y<words.length;y++){
        if (words[y]!=''){
            //check in which lines it exists
            for (let r=0;r<data.length;r++){
                if (data[r].indexOf(words[y])==-1)
                    continue;
                else{
                    //first appearance of word
                    if (wordpage[words[y]]==undefined){
                        wordpage[words[y]]=[1,[Math.floor(r/45)+1]]
                    }
                    //already appeared
                    else {
                        wordpage[words[y]][0]+=1
                        if (wordpage[words[y]][1].indexOf(Math.floor(r/45)+1)==-1){
                            wordpage[words[y]][1].push(Math.floor(r/45)+1)
                        }
                    }
                }
            }
        }
    }
    func(wordpage,print_text)
}

const sort=(wp, func)=>{
    let arr=Object.entries(wp)
    let sorted=arr.sort()
    func(sorted,no_op);
}

const print_text=(sorted,func)=>{
    for (let i=0; i<sorted.length; i++){
        console.log(sorted[i][0]+": "+ sorted[i][1][1])
    }
    func(null)
}

const no_op=(func)=>{
    return;
}


read_file('in.txt',filter_chars);


