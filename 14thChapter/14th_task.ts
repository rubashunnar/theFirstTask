const fs=require("fs");
const _=require("lodash");

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
    stop_word_filter:StopWordManager=null;
    word_event_handler=[]
    constructor(wfapp:WordFrequencyFramework, stop_word_filter:StopWordManager){
        this.stop_word_filter=stop_word_filter;
        wfapp.register_for_load_event(this.load.bind(this))
        wfapp.register_for_dowork_event(this.produce_words.bind(this))
    }
    load(file_path){
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
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
    constructor(wfapp:WordFrequencyFramework, data_storage:DataStorage){
        data_storage.register_for_word_event(this.increment_count.bind(this))
        wfapp.register_for_end_event(this.print_freq.bind(this))
    }
    increment_count(word){
        if (this.word_freq[word])
            this.word_freq[word]+=1
        else 
            this.word_freq[word]=1
    }
    print_freq(){
        let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.word_freq), 1).reverse()))
        for (let i=0; i<25;i++){
            console.log(arr[i])
        }
    }
}

let wfapp=new WordFrequencyFramework()
let stop_word_filter=new StopWordManager(wfapp)
let data_storage=new DataStorage(wfapp,stop_word_filter)
let word_freq_counter=new WordFrequencyCounter(wfapp, data_storage)
wfapp.run("in.txt")