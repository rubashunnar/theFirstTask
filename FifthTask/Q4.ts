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


const filter_chars_and_normalize=(data:any[]):any[]=>{
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
    return data
}


const scan=(data:any[]):any[]=>{
    //split the words and add them to the global variable "words"
    let data_str=data[0]+"";
    let words=[]
    let line_words=[]//holds the words of each line
    let line_start=0//index for start of each line
    for(let y=0;y<data[0].length;y++){
        if (data[0][y]=="\n"){
            line_words=data[0].substring(line_start,y-1).split(" ");
            words.push(line_words);
            line_start=y+1;
        }
    }
    return words
}


const remove_stop_words=(words:any[]):any[]=>{
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
    return words;
}


const frequencies_and_lines=(words:any[]):any[]=>{
    //hold the pair of word and its frequency in word_frequency
    let word_freq=[];
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
    return word_freq;  
}


const sort=(word_freq:any[]):any[]=>{
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
        return word_freq;
}


const Printall=(word_freq:any[])=>{
    for (let i=0; i<word_freq.length; i++){
        //print words that only occur less than 100 times
        if (word_freq[i][1]<100){
            console.log(word_freq[i][0]+": "+word_freq[i][2]);
        }
    }
}

//main 
Printall(sort(frequencies_and_lines(remove_stop_words(scan(filter_chars_and_normalize(read_file("in.txt")))))))

