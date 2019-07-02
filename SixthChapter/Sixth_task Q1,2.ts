const fs=require('fs')//file-system module
const sw = require('stopword')//stopword module
const _=require('lodash');//lodash module

//read file and replace all non alphanumeric with space and remove stop words
let data=sw.removeStopwords(fs.readFileSync("in.txt","utf8").toLowerCase().replace(/[\W_]+/g, " ").split(" "))
//find count and then sort it 
let count=Object.entries(_.fromPairs(_.sortBy(_.toPairs(_.countBy(data)), 1).reverse()))
 //print the first 25 elements 
 for (let i=0;i<25;i++){
    console.log(count[i])
 }
