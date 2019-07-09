const fs=require("fs")
const _=require("lodash")

let profile=(f)=>{
    let wrapperfunction=(...arg)=>{
        let start_time=new Date().getMilliseconds();
        let ret_value=f(...arg);
        let elapsed=new Date().getMilliseconds()-start_time;
        console.log(f.name)
        console.log(f.name+" took "+elapsed+" milliseconds");
        return ret_value
    }
    return wrapperfunction;
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

let sort=(word_freq)=> {
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
    
}


//main
const tracked_functions=[extract_words,frequencies_imp,sort]
extract_words=profile(tracked_functions[0])
frequencies_imp=profile(tracked_functions[1])
sort=profile(tracked_functions[2])

let arr=sort(frequencies_imp(extract_words("in.txt")))
for (let i=0;i<25;i++){
    console.log(arr[i]);
}