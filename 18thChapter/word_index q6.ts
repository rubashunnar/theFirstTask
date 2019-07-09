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
    let data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[^a-z0-9\n]+/g, " ").split("\n");
    let words=[]
    for (let i=0;i<data.length;i++){
        let line_words=data[i].split(" ");
        words.push(line_words)
    }
    return words;
}

let frequencies_imp=(word_list)=>{
    let word_freq={}
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    for (let i=0;i<word_list.length;i++){
        let line=word_list[i];

        for (let m=0;m<line.length;m++){
            if(stop_words.indexOf(line[m])==-1){
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
    }
    return word_freq
}

let sort=(word_freq)=> {
    return Object.entries(word_freq).sort()
    
}


//main
const tracked_functions=[extract_words,frequencies_imp,sort]
extract_words=profile(tracked_functions[0])
frequencies_imp=profile(tracked_functions[1])
sort=profile(tracked_functions[2])

let arr=sort(frequencies_imp(extract_words("in.txt")))
for (let i=0;i<arr.length;i++){
    console.log(arr[i][0]+": "+arr[i][1][1]);
}