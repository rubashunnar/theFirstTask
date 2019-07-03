const fs=require("fs");//filesystem module
const _=require("lodash")
const sw=require("stopword")

class TFTheOne{
    sValue=null;
    constructor(v){
        this.sValue=v;
    }
    bind(func){
        this.sValue=func(this.sValue)
    }
    printme(){
        for (let i=0;i<this.sValue.length;i++){
        console.log(this.sValue[i][0]+": "+this.sValue[i][1][1])
        }
    }
}
const read_file=(file_path:string,func)=>{
    let data=fs.readFileSync(file_path,'utf8')
    return data;
}

const filter_chars=(str_data:string,func)=>{
    let data=str_data.replace(/[^A-Za-z0-9\n]+/g, " ")
    return data;
}

const normalize=(str_data:string,func)=>{
    return str_data.toLowerCase()
}

const scan=(str_data:string,func)=>{
    return str_data.split("\n");
}

const remove_stop_words=(word_list:any[],func)=>{
    let data=[]
    for (let i=0;i<word_list.length;i++){
        let l=sw.removeStopwords(word_list[i].split(" "))
        data.push(l);
    }
    return data;
}

const frequencies_lines=(data:any[])=>{
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
    return wordpage;
}

const sort=(wp)=>{
    let arr=Object.entries(wp)
    let sorted=arr.sort()
    return sorted
}


//main function
let x=new TFTheOne("in.txt");
x.bind(read_file)
x.bind(filter_chars)
x.bind(normalize)
x.bind(scan)
x.bind(remove_stop_words)
x.bind(frequencies_lines)
x.bind(sort)
x.printme()