import {frequencies_imp} from './plugins/freq' 
import {extract_words} from './plugins/words'
import {print} from './plugins/print'
print(frequencies_imp(extract_words("in.txt")))
