const fs=require("fs")
const _=require("lodash")
var names={};
names['count']=0

let profile=(f)=>{
    let wrapperfunction=(...arg)=>{
        let start_time=new Date().getMilliseconds();
        let ret_value=f(...arg);
        let elapsed=new Date().getMilliseconds()-start_time;
        console.log(names['name']+" took "+elapsed+" milliseconds");
        return ret_value
    }
    return wrapperfunction
}

let tracing=(f)=>{
    let wrapperfunction= (...arg)=>{
        names['name']=f.name;
        console.log("Entering "+names['name'])
        let ret_value=f(...arg);
        console.log("Exiting "+names['name']);
        return ret_value
    }
    return wrapperfunction
}

 let extract_words=(file_path)=>{
    let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ").split(" ");
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    let words=[]
    for (let i=0;i<data.length;i++){
        if (stop_words.indexOf(data[i])==-1){
            words.push(data[i])
        }
    }
    return words;
}

 let frequencies_imp=(word_list)=>{
    let word_freq={}
    for (let i=0;i<word_list.length;i++){
        if (word_freq[word_list[i]]==undefined){
            word_freq[word_list[i]]=1
        }
        else {
            word_freq[word_list[i]]+=1
        }
    }
    return word_freq
}

 let  sort=(word_freq)=> {
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
    
}

//main
extract_words=profile(tracing(extract_words))
frequencies_imp=profile(tracing(frequencies_imp))
sort=profile(tracing(sort))

let arr=sort(frequencies_imp(extract_words("in.txt")))
for (let i=0;i<25;i++){
    console.log(arr[i]);
}

