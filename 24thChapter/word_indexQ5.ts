
const fs=require("fs")//file system module 
const _=require("lodash");

class TFQuarantine{
    static functions=[];
    constructor(f){
        TFQuarantine.functions[0]=f;
    }
    bind(f){
        TFQuarantine.functions.push(f);
    }
    execute(){
        function guard_callable(v){
            if (typeof(v)=="function")return v();
            return v;
        }
        let value=()=>{return null};
        for (let i=0;i<TFQuarantine.functions.length;i++){
            let func=TFQuarantine.functions[i]
            value= func(guard_callable(value))
        }
        console.log(guard_callable(value))
    }
}

function get_input(x){
    function f(){
        return "in.txt";
    }
    return f;
}

function extract_words(file_path){
    function f(){
        let data;
        data=fs.readFileSync(file_path,'utf8')  
        return data.toLowerCase().replace(/[^a-z0-9\n]+/g, " ").split("\n");
    }
    return f;
}

function remove_stop_words(word_list){
    function f(){
        let stop_words=[]
        stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        let words=[]
        let line=[];
        for (let i=0;i<word_list.length;i++){
             let line_words=word_list[i].split(" ");
            for (let m=0;m<line_words.length;m++){
                if (stop_words.indexOf(line_words[m])==-1) line.push(line_words[m]) ;
            }
            words.push(line)
            line=[]
        }
        return words;
    }
    return f
}

function frequencies(word_list){
    let word_freq={}
    for (let i=0;i<word_list.length;i++){
        let line=word_list[i];

        for (let m=0;m<line.length;m++){
            if (word_freq[line[m]]==undefined){
                word_freq[line[m]]=[1,[Math.floor(i/45)+1]]
            }
            else {
                    word_freq[line[m]][0]+=1
                if (word_freq[line[m]][1].indexOf(Math.floor(i/45)+1)==-1){
                    word_freq[line[m]][1].push(Math.floor(i/45)+1)
                }
            }
        
        }
    }
    return word_freq
}

function sort(word_freq){
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
}

function top25(word_freq){
    let top25=[]
    for (let i=0;i<25;i++){
        top25.push(word_freq[i][0]+": "+word_freq[i][1][1]) 
    }
    return top25 
}

let x=new TFQuarantine(get_input)
x.bind(extract_words)
x.bind(remove_stop_words)
x.bind(frequencies)
x.bind(sort)
x.bind(top25)
x.execute();