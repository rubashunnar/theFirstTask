const fs=require("fs")
const _=require("lodash")
const lineNumber=require("linenumber")

abstract class IDataStorage{
    abstract words();
}

abstract class IStopWordFilter{
    abstract is_stop_word(word);
}

abstract class IWordFrequencyCounter{
    abstract increment_count(word);
    abstract find_pages(word,file);
    abstract sort();
}

class DataStorageManager extends IDataStorage{
    data:string;
    constructor(file_path:string){
        super();
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    words(){
        return this.data.split(" ");
    }
}

class StopWordManager extends IStopWordFilter{
    stop_words:any[];
    constructor(){
        super()
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(word:string){
        return (this.stop_words.indexOf(word)!=-1)
    }
}

class WordFrequencyManager extends IWordFrequencyCounter{
    word_page:{};
    sorted:any[];
    constructor(){
        super()
        this.word_page={}
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
    word_freq_m:WordFrequencyManager;
    file;
    constructor(file_path){
        this.file=fs.readFileSync(file_path, 'utf8').toLowerCase()
        this.storage_m=new DataStorageManager(file_path)
        this.stop_word_m=new StopWordManager()
        this.word_freq_m=new WordFrequencyManager();
    }
    run(){
        for (let i=0;i<this.storage_m.words().length;i++){
            let word=this.storage_m.words()[i]
            if (!this.stop_word_m.is_stop_word(word)){
                this.word_freq_m.find_pages(word,this.file)
            }            
        }
        let word_page=this.word_freq_m.sort();
        for (let i=0;i<word_page.length;i++){
            if (word_page[i][1][0]<100) console.log(word_page[i][0]+": "+word_page[i][1][1])
        }
    }
}

//main 
let x=new WordFrequencyController("in.txt")
x.run();
