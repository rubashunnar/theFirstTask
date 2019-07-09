const _=require('lodash')
export function frequencies_imp(word_list){
    let word_freq={}
    for (let i=0;i<word_list.length;i++){
        if (word_freq[word_list[i]]==undefined){
            word_freq[word_list[i]]=1
        }
        else {
            word_freq[word_list[i]]+=1
        }
    }
    return Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))

}