const fs=require("fs")//file-system module
const _=require('lodash')
const lineNumber=require('linenumber')

class DataStorageManager{
    data:string='';
    dispatch(message):any{
        if (message[0]=='init')
            return this.init(message[1])
        else if (message[0]=='words')
            return this.words();
        else throw new Error("No such Method"+message[0]);
    }
    init(file_path:string){
        this.data=fs.readFileSync("in.txt","utf8").toLowerCase().replace(/[\W_]+/g, " ")
    }
    words():any{
        return this.data.split(" ");
    }
}

class StopWordManager{
    stop_words:any[];

    dispatch(message){
        if (message[0]=='init')
            return this.init()
        else if (message[0]=='is_stop_word')
            return this.is_stop_word(message[1]);
        else throw new Error("No such Method"+message[0]);
    }
    init(){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(word:string){
        return (this.stop_words.indexOf(word)!=-1)
    }
}

class WordPageManager{
    word_page:{}={};
    sorted:any[];
    dispatch(message){
        if (message[0]=='find_page')
            return this.find_pages(message[1],message[2])
        else if (message[0]=='sort')
            return this.sort();
        else throw new Error("No such Method"+message[0]);
    }
    increment_count(word){
        if (this.word_page[word]!=undefined){
            this.word_page[word][0]+=1
        }
        else {
            this.word_page[word]=[1]
        }
    }
    find_pages(word,file){
        this.increment_count(word)
        if (this.word_page[word].length==2){
            return;
        }
        let re=new RegExp(word,"g")
        let no=lineNumber(file,re);
        let page=[]
        for (let i=0;i<no.length;i++){
            if (page.indexOf(Math.floor(no[i]["line"]/45)+1)==-1){
                page.push(Math.floor(no[i]["line"]/45)+1)
            }
        }
        this.word_page[word].push(page);
    }
    sort(){
        let arr=Object.entries(this.word_page)
        return arr.sort();
    }
}

class WordFrequencyController{
    storage_m:DataStorageManager;
    stop_word_m:StopWordManager;
    word_page_m:WordPageManager;
    file;
    dispatch(message){
        if (message[0]=='init')
            return this.init(message[1])
        else if (message[0]=='run')
            return this.run();
        else throw new Error("No such Method"+message[0]);
    }
    init(file_path:string){
        this.storage_m=new DataStorageManager()
        this.stop_word_m=new StopWordManager()
        this.word_page_m=new WordPageManager();
        this.file=fs.readFileSync(file_path,'utf8').toLowerCase();
        this.storage_m.dispatch(['init',file_path])
        this.stop_word_m.dispatch(['init'])
    }
    run(){
        let words=this.storage_m.dispatch(['words']);
        for (let i=0;i<words.length;i++){
            let word=words[i]
            if (!this.stop_word_m.dispatch(['is_stop_word',word])){
                this.word_page_m.dispatch(['find_page',word,this.file])
            }            
        }
        let word_page=this.word_page_m.dispatch(['sort']);
        for (let i=0;i<25;i++){
            console.log(word_page[i][0]+": "+word_page[i][1][1])
        }
    }
}

//main 
let wfcontroller=new WordFrequencyController();
wfcontroller.dispatch(['init',"in.txt"])
wfcontroller.dispatch(['run'])

 

