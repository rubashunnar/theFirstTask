const fs=require('fs');//file-system module
const lineReader=require('line-reader');
// to hold the words and its frequencies 
let word_freq=[];
//Holds stop_words
let stop_words=fs.readFileSync('stop_words.txt','utf8').split(',');
let found:boolean=false;// boolean for checking if we found a word
let word='';
let pair_index=0;//index for the pair in the word_freq array

let inputfile=fs.readFileSync('input.txt', 'utf8').split('\n')
for (let e=0;e<inputfile.length;e++){
        let start_char=null;// start_char index
        let i:number=0;// last char index
        for (let c=0;c< inputfile[e].length;c++){
            if (start_char==null){
                //start of the word
                if ((inputfile[e][c].charCodeAt(0)  > 47 && inputfile[e][c].charCodeAt(0)  < 58 ) || 
                (inputfile[e][c].charCodeAt(0)  > 64 && inputfile[e][c].charCodeAt(0)  < 91) || 
                (inputfile[e][c].charCodeAt(0)  > 96 && inputfile[e][c].charCodeAt(0)  < 123)){
                    start_char=c;
                }
            }
            else{
                //End of the word
                if (!(inputfile[e][c].charCodeAt(0)  > 47 && inputfile[e][c].charCodeAt(0)  < 58 ) && 
                !(inputfile[e][c].charCodeAt(0)  > 64 && inputfile[e][c].charCodeAt(0)  < 91) && 
                !(inputfile[e][c].charCodeAt(0)  > 96 && inputfile[e][c].charCodeAt(0)  < 123)){
                    found=false;
                    word=inputfile[e].substring(start_char,c).toLowerCase();
                    //ignore stop words
                    if (stop_words.indexOf(word.trim()) == -1){
                        pair_index=0
                        for (let y=0;y<word_freq.length;y++){
                            if (word.trim()==word_freq[y][0])
                            {
                                word_freq[y][1]+=1;
                                found =true;
                                break;
                            }
                            pair_index+=1
                        }
                        //
                        if(!found){
                            word_freq.push([word,1]);
                        }
                        //reordering
                        else if (word_freq.length>1){
                            for (let n=pair_index-1;n>=0;n--){
                                if (word_freq[pair_index][1]>word_freq[n][1]){
                                    //swap
                                    let temp=word_freq[n]
                                    word_freq[n]=word_freq[pair_index];
                                    word_freq[pair_index]=temp;
                                    pair_index=n;
                                }
                            }
                        }
                    }
                    start_char=null;// start a new word
                }
            }
            i+=1;
        }
}
    
        for (let i=0;i<25;i++){
            console.log(word_freq[i])
        }
    




