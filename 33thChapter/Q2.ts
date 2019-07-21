const fs=require("fs");
const _=require("lodash");
var readlineSync = require('readline-sync');

let stop_words=fs.readFileSync('stop-words.txt','utf8').split(",");
let data={}
let handlers={}
let input="";
handlers["post_execution"]=quit_handler
handlers["get_default"]=default_get_handler
handlers["get_file_form"]=upload_get_handler
handlers["post_file"]=upload_post_handler
handlers["get_word"]=word_get_handler



function error_state(){
    return ["something Wrong",["get","default",null]]
}

function default_get_handler(args){
    let rep="What would you like to do?"
    rep+="\n1-Quit"+"\n2-Upload File"
    let links={}
    links["1"]=["post","execution",null]
    links["2"]=["get","file_form",null]
    return [rep,links]
}

function quit_handler(args){
    process.exit(-1);
}

function upload_get_handler(args){
    return ["Name of file to upload?",["post","file"]]
}

function upload_post_handler(args){
    function create_data(filename){
        if (data[filename]!=undefined)return;
        let word_freq={}
        //read and scan
        let word_list=fs.readFileSync(filename,'utf8').toLowerCase().replace(/[\W_]+/g, " ").split(" ");
        
        //remove stop words
        let words=[]
        for (let i=0;i<word_list.length;i++){
           if (stop_words.indexOf(word_list[i])==-1) words.push(word_list[i]) 
        }
        //frequency
        for (let i=0;i<words.length;i++){
            if (word_freq[words[i]]==undefined){
                word_freq[words[i]]=1
            }
            else {
                word_freq[words[i]]+=1
            }
        }
        let sorted=Object.entries(_.fromPairs(_.sortBy(_.toPairs(word_freq), 1).reverse()))
        data[filename]=sorted
    }
    if (args==null)return error_state();
    let filename=args;
    try{
        create_data(filename)
    }
    catch(e){
        return error_state()
    }
    return word_get_handler([filename,0])
}

function word_get_handler(args){
    function get_word(filename,word_index){
        if (word_index<0)return "No prev word";
        if (word_index<data[filename].length)
            return data[filename][word_index]
        else return ["no more words",0]
    }
    let filename=args[0];
    let word_index=args[1]
    let rep
    let word_info=get_word(filename,word_index)
    if (word_info=="No prev word"){rep="\n No prev word"}
    else {rep="\n"+(word_index+1)+":"+word_info[0]+"-"+word_info[1]}
    rep+="\nWhat would you like to do?"
    rep+="\n1-Quit"+"\n2-Upload File"
    rep+="\n3-See next most-frequently occuring word"
    rep+="\n4- See Prev occuring word"
    let links={}
    links["1"]=["post","execution",null]
    links["2"]=["get","file_form",null]
    links["3"]=["get","word",[filename,word_index+1]]
    links["4"]=["get","word",[filename,word_index-1]]
    return [rep,links]
}

function handle_request(verb,uri,args){
    function handler_key(verb,uri){
        return verb+"_"+uri
    }
    if (handlers[handler_key(verb,uri)]!= undefined){
        return handlers[handler_key(verb,uri)](args)
    }
    else {
        return handlers[handler_key("get","default")](args)
    }
}   

function render_and_get_input(state,links):string[]{
    console.log(state)
    //one posible option
    if (Array.isArray(links)){
        if (links[0]=="post"){
        input = readlineSync.question('');
        links.push(input)
        return links
        }
        else return links
    }
    else if (typeof(links)=="object"){
        input = readlineSync.question('');
        if (links[input]!=undefined){
            return links[input]
        }
        else return ["get","default",null]
    }
    else 
        return ["get","default",null]
}



//main 
let request=["get","default",null]
let response,state,links;
while(true){
    response=handle_request(request[0],request[1],request[2])
    state=response[0]
    links=response[1]
    request=render_and_get_input(state,links)
}


