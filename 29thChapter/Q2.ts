const fs=require("fs")
const _=require("lodash")
const {Queue} = require('queue-typescript')

let word_space=new Queue()
let freq_space=new Queue();

let data=fs.readFileSync("in.txt","utf8").toLowerCase().replace(/[\W_]+/g, " ").split(" ")
let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
let workers=[]//holds threads
let numbe=4; 

function process_word(k, resolve){
    let word_freq={}
    let word;
   var id= setInterval(()=>{
    if (word_space.length==0){
        freq_space.enqueue(word_freq);
		resolve();
        clearInterval(id);
    }; 
    word=word_space.dequeue()//we used setTimout here and it didn't work 	
    if (stop_words.indexOf(word)==-1){
        if (word_freq[word]==undefined)
            word_freq[word]=1
        else word_freq[word]+=1
    }
   },numbe-k)
    
}
let wf={}

function frequencies(k,resolve){
    let freqs;
    let keys=[];
    let count=0;
    var id= setInterval(()=>{
        
        try{
            if (freq_space.length ==0){
                throw new Error()
            }
        freqs=freq_space.dequeue();
        keys =Object.keys(freqs)
        for (let i=0;i<keys.length;i++){
            if (wf[keys[i]]==undefined)
                count=freqs[keys[i]] 
        else count=wf[keys[i]]+freqs[keys[i]]
        wf[keys[i]]=count
        }
    }catch(e){
        resolve()
        clearInterval(id)
    }
       },numbe-k)

}
async function main (){
	//main
	//push all words
	for (let i=0;i<data.length;i++){
		word_space.enqueue(data[i])
	}

	for (let i=0;i<4;i++){
		workers.push(new Promise(function(resolve,reject){
			process_word(i, resolve)//we also used setTimeout here 
		}))
	}
    //wait all threads to end
    await Promise.all(workers);
    workers=[]
    for (let i=0;i<4;i++){
		workers.push(new Promise(function(resolve,reject){
			frequencies(i, resolve)//we also used setTimeout here 
		}))
		
	}
	//wait all threads to end
	await Promise.all(workers);
	let arr= Object.entries(_.fromPairs(_.sortBy(_.toPairs(wf), 1).reverse()))
	for (let i=0;i<25;i++){
		console.log(arr[i])
	}
}

main();
