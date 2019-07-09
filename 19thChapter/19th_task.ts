import {frequencies_imp} from './plugins/freq' 
import {extract_words} from './plugins/words'

let wf=frequencies_imp(extract_words("in.txt"))
for (let i=0;i<25;i++){
    console.log(wf[i])
}