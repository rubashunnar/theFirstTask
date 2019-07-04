const fs=require("fs");
const _=require("lodash");

const extract_words=(obj:{},file_path)=>{
    obj['data']=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ").split(" ");
}

const load_stop_words=(obj)=>{
    obj['stop_words']=fs.readFileSync('stop-words.txt','utf8').split(",");
}

const increment_count=(obj,word)=>{
    if (obj['freq'][word]!=undefined){
        obj['freq'][word]+=1
    }
    else{
        obj['freq'][word]=1 
    }
}

let data_obj={
    data:[],
    words:function(){
        return data_obj['data'];
    },
    init:function(file_path) {
        extract_words(data_obj, file_path);
    }
}

let  stop_word_obj={
    stop_words:[],
    init:function() {
        load_stop_words(stop_word_obj);
    },
    is_stop_word:function(word) {
        return (stop_word_obj['stop_words'].indexOf(word)!=-1)
    }
}

let word_freq_obj={
    freq:{},
    increment:function(word) {
        increment_count(word_freq_obj,word)
    },
    sort:function(){
        return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq_obj['freq']), 1).reverse()))
    }
}

data_obj['init']("in.txt");
stop_word_obj['init']()
let word_list=data_obj['words']()
for (let i=0;i<word_list.length;i++){
    let w=word_list[i]
    if (!stop_word_obj['is_stop_word'](w))
        word_freq_obj['increment'](w)
}
let frequency=word_freq_obj['sort']();
for (let i=0;i<25;i++){
    console.log(frequency[i])
}

