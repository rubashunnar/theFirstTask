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
        if (!isAlphaNumeric(data[0][i])&& data[0][i]!="\n"){
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
    let line_words=[]//holds the words of each line
    let line_start=0//index for start of each line
    for(let y=0;y<data[0].length;y++){
        if (data[0][y]=="\n"){
            line_words=data[0].substring(line_start,y-1).split(" ");
            words.push(line_words);
            line_start=y+1;
        }
    }
}


const remove_stop_words=()=>{
    //remove the stop words from the words list
    let stop_words=fs.readFileSync('stop-words.txt','utf8').split(',');
    let line_nonstopwords=[];//holds the non stop words in the file
    let alternate_words=[]//temporary place to put the nonestop words in 
    for (let i=0;i<words.length;i++){
        for (let z=0;z<words[i].length;z++){
            if (stop_words.indexOf(words[i][z]) ==-1){
                line_nonstopwords.push(words[i][z])
        }
    }
    alternate_words.push(line_nonstopwords)//push only the non stop words
    line_nonstopwords=[]
    }
    words=[];
    words=alternate_words.splice(0);// copy the alternate_words to words
   
}


const frequencies_and_lines=()=>{
    //hold the pair of word and its frequency in word_frequency
    for (let i=0;i<words.length;i++){
        for (let r=0;r<words[i].length;r++){
           let flag=false
            for (let y=0;y<word_freq.length;y++){
                //console.log(words[i][r])
                if (words[i][r]==word_freq[y][0]){
                    word_freq[y][1]+=1;
                    //check if the page repeated or not
                    if(word_freq[y][2].indexOf(Math.floor(i/45)+1)==-1){
                        word_freq[y][2].push(Math.floor(i/45)+1);
                    }
                    flag=true;
                    break;
                }
            }   
            if (!flag){
            word_freq.push([words[i][r],1,[Math.floor(i/45)+1]]);
            }
        }
    }    
}


const sort=()=>{
    //Sort the words
        for (let i=0;i<word_freq.length;i++){
            for(let n=i+1;n<word_freq.length;n++){
                if (word_freq[i][0]>word_freq[n][0]){
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
frequencies_and_lines();
sort();

for (let i=0; i<word_freq.length; i++){
    //print words that only occur less than 100 times
    if (word_freq[i][1]<100){
        console.log(word_freq[i]);
    }
}