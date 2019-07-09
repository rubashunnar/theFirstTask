import {frequencies_imp} from './plugins/freqq6' 
import {extract_words} from './plugins/wordsq6'

let wf=frequencies_imp(extract_words("in.txt"))
for (let i=0;i<wf.length;i++){
    console.log(wf[i][0]+": "+wf[i][1][1])
}