//File-system module
const fs=require('fs')

//The shared global variables
let data=[]
let words=[]
let word_freq=[]

//check if a character is alphanumberic
const isAlphaNumeric = (ch) => {
    if (!(ch.charCodeAt(0)  > 47 && ch.charCodeAt(0)  < 58 ) && // numeric (0-9)
        !(ch.charCodeAt(0)  > 64 && ch.charCodeAt(0)  < 91) && // upper alpha (A-Z)
        !(ch.charCodeAt(0)  > 96 && ch.charCodeAt(0)  < 123))  // lower alpha (a-z)
      return false;
    return true;
}

const read_file=(file_path:string)=>{
    //read file content and add it to the data array
    data.push(fs.readFileSync(file_path,'utf8'))
}


const filter_chars_and_normalize=()=>{
    //change any non alphanumeric characters to space
    let str:string;
    for (let i=0;i<data[0].length;i++){
        if (!isAlphaNumeric(data[0][i])){
            data[0]=data[0].replace(data[0][i]," ")
        }
        else {
            data[0]=data[0].replace(data[0][i],data[0][i].toLowerCase());
        }
    }
}


const scan=()=>{
    //split the words and add them to the global variable "words"
    let data_str=data[0]+"";
    words.push(data_str.split(" "));
}


const remove_stop_words=()=>{
    //remove the stop words from the words list
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(',');
    let nonstopwords=[];//holds the non stop words in the file
    for (let i=0;i<words[0].length;i++){
        if (stop_words.indexOf(words[0][i]) ==-1){
            nonstopwords.push(words[0][i])
        }
    }
    words.pop()
    words.push(nonstopwords)//push only the non stop words
}


const frequencies=()=>{
    //hold the pair of word and its frequency in word_frequency
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
}


const sort=()=>{
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
}

//main 
read_file("in.txt");
filter_chars_and_normalize();
scan();
remove_stop_words();
frequencies();
sort();

for (let i=0; i<25; i++){
    console.log(word_freq[i]);
}