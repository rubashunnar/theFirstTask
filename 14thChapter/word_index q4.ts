const fs=require("fs");
const _=require("lodash");
const lineNumber=require('linenumber')

class WordFrequencyFramework{
    load_event_handler=[]
    dowork_event_handler=[]
    end_event_handler=[]
    register_for_load_event(handler){
        this.load_event_handler.push(handler);
    }
    register_for_dowork_event(handler){
        this.dowork_event_handler.push(handler);
    }
    register_for_end_event(handler){
        this.end_event_handler.push(handler);
    }
    run(file_path){
        for(let i=0; i<this.load_event_handler.length;i++){
            this.load_event_handler[i](file_path)
        }
        for(let i=0; i<this.dowork_event_handler.length;i++){
            this.dowork_event_handler[i]()
        }
        for(let i=0; i<this.end_event_handler.length;i++){
            this.end_event_handler[i]()
        }
    }

}

class DataStorage{
    data='';
    x='';
    stop_word_filter:StopWordManager=null;
    word_event_handler=[]
    constructor(wfapp:WordFrequencyFramework, stop_word_filter:StopWordManager){
        this.stop_word_filter=stop_word_filter;
        wfapp.register_for_load_event(this.load.bind(this))
        wfapp.register_for_dowork_event(this.produce_words.bind(this))
    }
    load(file_path){
        this.x=fs.readFileSync(file_path,'utf8').toLowerCase()
        this.data=this.x.replace(/[\W_]+/g, " ");
    }
    produce_words(){
        let data_str=this.data.split(" ");
        for (let i=0;i<data_str.length;i++){
            if (!this.stop_word_filter.is_stop_word(data_str[i])){
                for (let h=0;h<this.word_event_handler.length;h++){
                    this.word_event_handler[h](data_str[i])
                }
            }
        }
    }
    register_for_word_event(handler){
        this.word_event_handler.push(handler)
    }   
}

class StopWordManager{
    stop_words=[]
    constructor(wfapp:WordFrequencyFramework){
        wfapp.register_for_load_event(this.load.bind(this))
    }
    load(){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(word){
        return (this.stop_words.indexOf(word)!=-1)
    }
}

class WordFrequencyCounter{
    word_freq={}
    ds=null;
    constructor(wfapp:WordFrequencyFramework, data_storage:DataStorage){
        this.ds=data_storage
        data_storage.register_for_word_event(this.increment_count.bind(this))
        data_storage.register_for_word_event(this.find_page.bind(this))
        wfapp.register_for_end_event(this.print_freq.bind(this))
    }
    increment_count(word){
        if (this.word_freq[word])
            this.word_freq[word][0]+=1
        else 
            this.word_freq[word]=[1]
    }
    find_page=(word)=>{
        if (this.word_freq[word].length==2){
            return;
        }
        let file=this.ds.x;
        let re=new RegExp(word,"g")
        let no=lineNumber(file,re);
        let page=[]
        for (let i=0;i<no.length;i++){
            if (page.indexOf(Math.floor(no[i]["line"]/45)+1)==-1){
                page.push(Math.floor(no[i]["line"]/45)+1)
            }
        }
        this.word_freq[word].push(page);
}
    print_freq(){
        let arr=Object.entries(this.word_freq)
        arr=arr.sort()
        for (let i=0; i<arr.length;i++){
            if (arr[i][1][0]<100)
                console.log(arr[i][0]+": "+arr[i][1][1]);
        }
    }
}

let wfapp=new WordFrequencyFramework()
let stop_word_filter=new StopWordManager(wfapp)
let data_storage=new DataStorage(wfapp,stop_word_filter)
let word_freq_counter=new WordFrequencyCounter(wfapp, data_storage)
wfapp.run("in.txt")