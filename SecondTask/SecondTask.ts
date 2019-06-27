import { read } from "fs";

const fs=require ('fs')
let stack =[]
let heap={}

//check if a character is alphanumberic
const isAlphaNumeric = () => {
heap['ch']=stack.pop();//get the character
if (!(heap['ch'].charCodeAt(0)  > 47 && heap['ch'].charCodeAt(0)  < 58 ) && // numeric (0-9)
    !(heap['ch'].charCodeAt(0)  > 64 && heap['ch'].charCodeAt(0)  < 91) && // upper alpha (A-Z)
    !(heap['ch'].charCodeAt(0)  > 96 && heap['ch'].charCodeAt(0)  < 123))  // lower alpha (a-z)
  return false;
return true;
}


//read the file that we want to find its words' frequencies
const readfile=()=>{
    stack.push([fs.readFileSync(stack.pop(),'utf8')])
}


//change every non-alphanumeric character to whitespace
const filter_chars=()=>{
    heap['file']=stack.pop()[0];//text in file as an array of strings
    heap['counter']=0;// i for looping 
    while (heap['counter']!=heap['file'].length) {
        stack.push(heap['file'][heap['counter']]);//push the character to pop it in the function
       if( !isAlphaNumeric()){
        heap['file']=heap['file'].replace(heap['file'][heap['counter']]," ");
       }
       heap['file'][heap['counter']].toLowerCase();
       stack.push(1);
       stack.push(heap['counter'])
       heap['counter']=stack.pop()+stack.pop();
    }//end of while loop
    stack.push(heap['file'].split(' '))
    heap={}
}


//push the words on the stack
const scan=()=>{
        heap['words-list']=stack.pop();//takes the array of txt file's words
        heap['counter']=0;
        //pushes each word to the stack
        while(heap['counter']!=heap['words-list'].length){
            stack.push(heap['words-list'][heap['counter']])
            stack.push(1)
            stack.push(heap['counter'])
            heap['counter']=stack.pop()+stack.pop();

        }
        heap={}
}


const remove_stop_words=()=>{
    stack.push(fs.readFileSync('stop-words.txt','utf8').split(','))
    heap['stop-words']=stack.pop();
    heap['words']=[]
    while(stack.length>0){
        if (heap['stop-words'].indexOf(stack[stack.length-1]) !== -1){
            stack.pop();
        }
        else{
            heap['words'].push(stack.pop());
        }
    }
    heap['counter']=0;
    while(heap['counter']!=heap['words'].length){
        stack.push(heap['words'][heap['counter']])
        stack.push(1)
        stack.push(heap['counter'])
        heap['counter']=stack.pop()+stack.pop();

    }
    heap={}
}


//find the words frequency
const frequencies=()=>{
    heap['word-freq']={}
    while(stack.length>0){
        //if the word exists
        if (heap['word-freq'][stack[stack.length-1]] !== undefined){
            stack.push(heap['word-freq'][stack[stack.length-1]])// push old freq
            stack.push(1);
            stack.push(stack.pop()+stack.pop());// the new frequency
        }
        else { 
            stack.push(1);
        }
        heap['freq']=stack.pop();
        heap['word-freq'][stack.pop()]=heap['freq'];
    }
    stack.push(heap['word-freq'])
    heap={}
    
}


//find the most 25 repeated words
const sort=()=>{
    heap['words-freq']=stack.pop();
    heap['keysSorted'] = Object.keys(heap['words-freq']).sort(function(a,b){return heap['words-freq'][b]-heap['words-freq'][a]})
    heap['count']=0
    while (heap['count']<25){
        stack.push(heap['keysSorted'][heap['count']]+','+heap['words-freq'][heap['keysSorted'][heap['count']]]);
        stack.push(1)
        stack.push(heap['count'])
        heap['count']=stack.pop()+stack.pop()
    }
   
}


//main function
stack.push('input.txt')
readfile();
filter_chars();
scan()
remove_stop_words()
frequencies();
sort();
//print the most 25 frequently used words
heap['count']=0;
while(heap['count']<25){
console.log(stack.pop());
stack.push(1)
stack.push(heap['count'])
heap['count']=stack.pop()+stack.pop()
}
