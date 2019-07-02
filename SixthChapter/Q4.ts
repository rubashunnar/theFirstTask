const fs=require('fs')//file-system module
const sw = require('stopword')//stopword module
const _=require('lodash');//lodash module
const lineNumber = require('linenumber');//line-number module

//read file and replace all non alphanumeric with space and remove stop words
let m=fs.readFileSync("in.txt","utf8").toLowerCase();
let data=sw.removeStopwords(m.replace(/[\W_]+/g, " ").split(" "))
// //find count  
let count=Object.entries(_.countBy(data)).sort()
//find page number 
let lines=[]
for (let r=0;r<count.length;r++){
    if (count[r][0]!= '' && count[r][1]<100){
    let re=new RegExp(count[r][0]+' ',"g")
    let no=lineNumber(m.replace(/[^a-z0-9\n]+/g, " "),re);
    let line=[]
    for (let i=0;i<no.length;i++){
        if (line.indexOf(Math.floor(no[i]["line"]/45)+1)==-1){
            line.push(Math.floor(no[i]["line"]/45)+1)
        }
    }
    lines.push([count[r][0],line])
    }
}
 //print the lines
 for (let i=0;i<lines.length;i++){
    console.log(lines[i])
 }
