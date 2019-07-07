const fs=require('fs');
const _=require('lodash')

class EventMenager{
    subscription:{};
    constructor(){
        this.subscription={}
    }
    subscribe(event_type,handler){
        if (this.subscription[event_type]==undefined)
            this.subscription[event_type]=[handler]
        else
            this.subscription[event_type].push(handler)
    }
    publish(event:string[]){
        let event_type=event[0];
        if (this.subscription[event_type]!=undefined){
            if (this.subscription[event_type]!= "valid_word"&&this.subscription[event_type]!= "word"){
                for (let i=0;i<this.subscription[event_type].length;i++){
                    this.subscription[event_type][i](event)
                } 
            }
            else{
                for (let i=0;i<this.subscription[event_type].length;i++){
                     this.subscription[event_type][0](event)
                }
            }
        }   
    }
    unsubscribe(event_type,handler){
        if (this.subscription[event_type].indexOf(handler)!=-1)//if it's subscribed to a specific handler
            for (let i=0;i<this.subscription[event_type].length;i++){
                if (this.subscription[event_type][i]==handler)
                    this.subscription[event_type].splice(i,1) 
                    break;                  
            }
    }
}

class DataStorage{
    em;
    data;
    constructor(event_manager:EventMenager){
        this.em=event_manager
        this.em.subscribe('load',this.load.bind(this))
        console.log("DataStorage subscribed to load")
        this.em.subscribe('start',this.produce_words.bind(this))
        console.log("DataStorage subscribed to start")
    }
    load(event){
        let file_path=event[1];
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
        this.em.unsubscribe('load',this.load.bind(this))
        console.log("DataStorag unsubscribed from load")
    }
    produce_words(event){
        let data_str=this.data.split(' ');
        let i;
        for (i=0;i<data_str.length-1;i++){
            this.em.publish(['word',data_str[i],null])
        }
        this.em.publish(['word',data_str[i],"unsubscribe"])
        this.em.publish(['eof',null])
        this.em.unsubscribe('start',this.produce_words.bind(this))
        console.log("DataStorag unsubscribed from start")
    }

}

class StopWordFilter{
    em;
    stop_words;
    count=0;
    constructor(event_manager){
        this.stop_words=[]
        this.em=event_manager
        this.em.subscribe('load',this.load.bind(this))
        console.log("StopWordFilter subscribed to load")
        this.em.subscribe('word',this.is_stop_word.bind(this))
        console.log("StopWordFilter subscribed to word")
    }
    load(event){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
        this.em.unsubscribe('load',this.load.bind(this))
        console.log("StopWordFilter unsubscribed from load")
    }
    is_stop_word(event){
        let word=event[1];
        if (this.stop_words.indexOf(word)==-1)
            this.em.publish(['valid_word',word])
        if (event[2]=="unsubscribe"){
            this.em.publish(['valid_word',"unsubscribe"])
            this.em.unsubscribe('word',this.is_stop_word.bind(this))
            console.log("StopWordFilter unsubscribed from word")
        }
    }
}

class WorfFrequencyCounter{
    em
    word_freq:{}
    constructor(event_manager){
        this.word_freq={};
        this.em=event_manager
        this.em.subscribe('valid_word',this.increment_count.bind(this))
        console.log("WordFreqCounter subscribed to valid_word")
        this.em.subscribe('print',this.print_freq.bind(this))
        console.log("WordFreqCounter subscribed tp print")
    }
    increment_count(event){
        let word=event[1];
        if (word=="unsubscribe"){
            this.em.unsubscribe('valid_word',this.increment_count.bind(this))
            console.log("WordFreqCounter unsubscribed from valid_word")
        }
        if (this.word_freq[word]!=undefined)
            this.word_freq[word]+=1
        else 
            this.word_freq[word]=1
    }
    print_freq(event){
        let arr=Object.entries(_.fromPairs(_.sortBy(_.toPairs(this.word_freq), 1).reverse()))
        for (let i=0; i<25;i++){
            console.log(arr[i])
        }
        this.em.unsubscribe('print',this.print_freq.bind(this))
        console.log("WordFreqCounter unsubscribed from print")
    }
}

class WordFrequencyApp{
    em;
    constructor(event_manager)
    {
        this.em=event_manager
        this.em.subscribe('run',this.run.bind(this))
        console.log("wfApp subscribed to run")
        this.em.subscribe('eof',this.stop.bind(this))
        console.log("wfApp subscribed to stop")
    }
    run(event){
        let file_path=event[1]
        this.em.publish(['load',file_path])
        this.em.publish(['start',null])
        this.em.unsubscribe('run',this.run.bind(this));
        console.log("wfApp unsubscribed from run")
    }
    stop(event){

        this.em.publish(['print',null])
        this.em.unsubscribe('eof',this.stop.bind(this));
        console.log("wfApp unsubscribed from eof")
    }
}

let em=new EventMenager();
let x=new DataStorage(em)
let y=new StopWordFilter(em)
let z=new WorfFrequencyCounter(em)
let c=new WordFrequencyApp(em)
em.publish(["run","in.txt"]);