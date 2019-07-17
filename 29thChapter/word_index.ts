const fs=require("fs")
const _=require("lodash")
const {Queue} = require('queue-typescript')
const lineNumber=require('linenumber')

let line_space=new Queue()
let freq_space=new Queue();

let x=fs.readFileSync("in.txt","utf8").toLowerCase()
let data=x.replace(/[^a-z0-9\n]+/g, " ").split("\n")
let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
let workers=[]//holds threads
let numbe=4; 

function process_word(k, resolve){
    let word_freq={}
    let line;
   var id= setInterval(()=>{ 
    try{
    if (line_space.length==0) throw new Error;
    line=line_space.dequeue() 
    let line_words=line.split(" ")
    let n:number=line_words[line_words.length-1] as number
    for (let i=0;i<line_words.length-1;i++){
        let word=line_words[i]
        if (stop_words.indexOf(word)==-1){
            if (word_freq[word]!=undefined){
                word_freq[word][0]+=1
                if (word_freq[word][1].indexOf(Math.floor(n/45)+1)==-1){
                    word_freq[word][1].push(Math.floor(n/45)+1)
                }
            }
            else {
                word_freq[word]=[1,[Math.floor(n/45)+1]]
            }
        }
    }
}
catch(e){
    freq_space.enqueue(word_freq);
    resolve()
    clearInterval(id)
}
    
   },numbe-k)
    
}

async function main (){
	//main
	//push all words
	for (let i=0;i<data.length;i++){
		line_space.enqueue(data[i]+i)//add line number to end of line
    }
    //process all words
	for (let i=0;i<4;i++){
		workers.push(new Promise(function(resolve,reject){
			process_word(i, resolve)//we also used setTimeout here 
		}))	
	}
	//wait all threads to end
	await Promise.all(workers);
	let word_freq={}
	let freqs;
    let keys=[];
    let pages=[];
	let count=0;

	while(freq_space.length!=0){
		freqs=freq_space.dequeue();
		keys =Object.keys(freqs)
		for (let i=0;i<keys.length;i++){
			if (word_freq[keys[i]]==undefined)
                {   count=freqs[keys[i]][0]
                    pages=freqs[keys[i]][1]
                }
            else {count=word_freq[keys[i]][0]+freqs[keys[i]][0]
                  pages=_.union(freqs[keys[i]][1],word_freq[keys[i]][1]);
            }
			word_freq[keys[i]]=[count,pages]
        }
	}
	let arr= Object.entries(word_freq).sort()
	for (let i=0;i<arr.length;i++){
		console.log(arr[i][0]+": "+arr[i][1][1])
	}
}

main();
