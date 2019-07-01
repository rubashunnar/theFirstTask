//we will apply currying on remove_stop_words procedure

//File-system module
const fs=require('fs')


//check if a character is alphanumberic
const isAlphaNumeric = (ch) => {
    if (!(ch.charCodeAt(0)  > 47 && ch.charCodeAt(0)  < 58 ) && // numeric (0-9)
        !(ch.charCodeAt(0)  > 64 && ch.charCodeAt(0)  < 91) && // upper alpha (A-Z)
        !(ch.charCodeAt(0)  > 96 && ch.charCodeAt(0)  < 123))  // lower alpha (a-z)
      return false;
    return true;
}

const read_file=(file_path:string):any[]=>{
    //read file content and add it to the data array
    let data=[]
    data.push(fs.readFileSync(file_path,'utf8'))
    return data;
}


const filter_chars_and_normalize =(d:any[]):any[]=>{
    //change any non alphanumeric characters to space
    let str:string;
    for (let i=0;i<d[0].length;i++){
        if (!isAlphaNumeric(d[0][i])){
            d[0]=d[0].replace(d[0][i]," ")
        }
        else {
            d[0]=d[0].replace(d[0][i],d[0][i].toLowerCase());
        }
    }
    return d;
}

const scan=(d:any[]):any[]=>{
    //split the words and add them to the global variable "words"
    let data_str=d[0]+"";
    let words=[];
    words.push(data_str.split(" "));
    return words;
}


const remove_stop_words=(words:any[]):any=>{
    //remove the stop words from the words list
    return function(stop_file:string)
    {
    let stop_words=fs.readFileSync(stop_file,'utf8').split(',');
    let nonstopwords=[];//holds the non stop words in the file
    for (let i=0;i<words[0].length;i++){
        if (stop_words.indexOf(words[0][i]) ==-1){
            nonstopwords.push(words[0][i])
        }
    }
    words.pop()
    words.push(nonstopwords)//push only the non stop words
    return words;
    }
}


const frequencies=(words:any[]):any[]=>{
    //hold the pair of word and its frequency in word_frequency
    let word_freq=[];
    for (let r=0;r<words[0].length;r++){
        let flag=false
        for (let y=0;y<word_freq.length;y++){
            if (words[0][r]==word_freq[y][0]){
                word_freq[y][1]+=1;
                flag=true;
                break;
            }
        }
        if (!flag){
            word_freq.push([words[0][r],1]);
        }
    }
    return word_freq;
}


const sort=(word_freq:any[]):any[]=>{
    //Sort the frequencies
        for (let i=0;i<word_freq.length;i++){
            for(let n=i+1;n<word_freq.length;n++){
                if (word_freq[i][1]<word_freq[n][1]){
                    let temp=word_freq[n]
                    word_freq[n]=word_freq[i]
                    word_freq[i]=temp;
                }
            }
        }
        return word_freq;
}

const PrintAll=(sorted:any[])=>{
    for (let i=0; i<25; i++){
        console.log(sorted[i]);
    }
}
//main
PrintAll(sort(frequencies(remove_stop_words(scan(filter_chars_and_normalize(read_file("in.txt"))))("stop-words.txt"))))
