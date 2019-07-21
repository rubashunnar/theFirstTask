var fs = require("fs");
var _ = require("lodash");
var readlineSync = require('readline-sync');
var lineNumber = require('linenumber');
var stop_words = fs.readFileSync('stop-words.txt', 'utf8').split(",");
var data = {};
var handlers = {};
var input = "";
handlers["post_execution"] = quit_handler;
handlers["get_default"] = default_get_handler;
handlers["get_file_form"] = upload_get_handler;
handlers["post_file"] = upload_post_handler;
handlers["get_word"] = word_get_handler;
function error_state() {
    return ["something Wrong", ["get", "default", null]];
}
function default_get_handler(args) {
    var rep = "What would you like to do?";
    rep += "\n1-Quit" + "\n2-Upload File";
    var links = {};
    links["1"] = ["post", "execution", null];
    links["2"] = ["get", "file_form", null];
    return [rep, links];
}
function quit_handler(args) {
    process.exit(-1);
}
function upload_get_handler(args) {
    return ["Name of file to upload?", ["post", "file"]];
}
function upload_post_handler(args) {
    function create_data(filename) {
        if (data[filename] != undefined)
            return;
        var word_freq = {};
        //read and scan
        var x = fs.readFileSync(filename, 'utf8').toLowerCase();
        var word_list = x.replace(/[\W_]+/g, " ").split(" ");
        //remove stop words
        var words = [];
        for (var i = 0; i < word_list.length; i++) {
            if (stop_words.indexOf(word_list[i]) == -1)
                words.push(word_list[i]);
        }
        //frequency
        for (var i = 0; i < words.length - 1; i++) {
            if (word_freq[words[i]] != undefined) {
                word_freq[words[i]][0] += 1;
            }
            else {
                word_freq[words[i]] = [1];
                var re = new RegExp(words[i], "g");
                var no = lineNumber(x, re);
                var page = [];
                for (var i_1 = 0; i_1 < no.length; i_1++) {
                    if (page.indexOf(Math.floor(no[i_1]["line"] / 45) + 1) == -1) {
                        page.push(Math.floor(no[i_1]["line"] / 45) + 1);
                    }
                }
                word_freq[words[i]].push(page);
            }
        }
        var sorted = Object.entries(word_freq).sort();
        data[filename] = sorted;
    }
    if (args == null)
        return error_state();
    var filename = args;
    try {
        create_data(filename);
    }
    catch (e) {
        return error_state();
    }
    return word_get_handler([filename, 0]);
}
function word_get_handler(args) {
    function get_word(filename, word_index) {
        if (word_index < data[filename].length)
            return data[filename][word_index];
        else
            return ["no more words", 0];
    }
    var filename = args[0];
    var word_index = args[1];
    var word_info = get_word(filename, word_index);
    var rep = "\n" + (word_index + 1) + ":" + word_info[0] + "-" + word_info[1][1];
    rep += "\nWhat would you like to do?";
    rep += "\n1-Quit" + "\n2-Upload File";
    rep += "\n3-See next word pages ";
    var links = {};
    links["1"] = ["post", "execution", null];
    links["2"] = ["get", "file_form", null];
    links["3"] = ["get", "word", [filename, word_index + 1]];
    return [rep, links];
}
function handle_request(verb, uri, args) {
    function handler_key(verb, uri) {
        return verb + "_" + uri;
    }
    if (handlers[handler_key(verb, uri)] != undefined) {
        return handlers[handler_key(verb, uri)](args);
    }
    else {
        return handlers[handler_key("get", "default")](args);
    }
}
function render_and_get_input(state, links) {
    console.log(state);
    //one posible option
    if (Array.isArray(links)) {
        if (links[0] == "post") {
            input = readlineSync.question('');
            links.push(input);
            return links;
        }
        else
            return links;
    }
    else if (typeof (links) == "object") {
        input = readlineSync.question('');
        if (links[input] != undefined) {
            return links[input];
        }
        else
            return ["get", "default", null];
    }
    else
        return ["get", "default", null];
}
//main 
var request = ["get", "default", null];
var response, state, links;
while (true) {
    response = handle_request(request[0], request[1], request[2]);
    state = response[0];
    links = response[1];
    request = render_and_get_input(state, links);
}
