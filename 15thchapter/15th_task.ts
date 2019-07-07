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
            for (let i=0;i<this.subscription[event_type].length;i++){
                this.subscription[event_type][i](event)
            }
        }   
    }
}

class DataStorage{
    em;
    data;
    constructor(event_manager:EventMenager){
        this.em=event_manager
        this.em.subscribe('load',this.load.bind(this))
        this.em.subscribe('start',this.produce_words.bind(this))
    }
    load(event){
        let file_path=event[1];
        this.data=fs.readFileSync(file_path,'utf8').toLowerCase().replace(/[\W_]+/g, " ");
    }
    produce_words(event){
        let data_str=this.data.split(' ');
        for (let i=0;i<data_str.length;i++){
            this.em.publish(['word',data_str[i]])
        }
        this.em.publish(['eof',null])
    }

}

class StopWordFilter{
    em;
    stop_words;
    constructor(event_manager){
        this.stop_words=[]
        this.em=event_manager
        this.em.subscribe('load',this.load.bind(this))
        this.em.subscribe('word',this.is_stop_word.bind(this))
    }
    load(event){
        this.stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
    }
    is_stop_word(event){
        let word=event[1];
        if (this.stop_words.indexOf(word)==-1)
            this.em.publish(['valid_word',word])
    }
}

class WorfFrequencyCounter{
    em
    word_freq:{}
    constructor(event_manager){
        this.word_freq={};
        this.em=event_manager
        this.em.subscribe('valid_word',this.increment_count.bind(this))
        this.em.subscribe('print',this.print_freq.bind(this))
    }
    increment_count(event){
        let word=event[1];
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
    }
}

class WordFrequencyApp{
    em;
    constructor(event_manager)
    {
        this.em=event_manager
        this.em.subscribe('run',this.run.bind(this))
        this.em.subscribe('eof',this.stop.bind(this))
    }
    run(event){
        let file_path=event[1]
        this.em.publish(['load',file_path])
        this.em.publish(['start',null])
    }
    stop(event){
        this.em.publish(['print',null])
    }
}

let em=new EventMenager();
let x=new DataStorage(em)
let y=new StopWordFilter(em)
let z=new WorfFrequencyCounter(em)
let c=new WordFrequencyApp(em)
em.publish(["run","in.txt"]);