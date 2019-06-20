//import { async } from "rxjs/internal/scheduler/async";
import { execSync } from "child_process";
const fs = require('fs');//used to open files
const lineReader = require('line-reader'); //used to read line by line of input file
const replace = require('replace');//used to replace contant of line in word_freqs file
let data: any = [];//here it is represent primary memory 
const count: any = [];
//this function is used to check type of each char (num,alph,others)
const isAlphaNumeric = (ch: string) => {
  if (ch==' ')return false;
  return ch.match(/^[a-z0-9]+$/i) !== null;
}

//this function is used to initilize data[] and open require file and read stoop_words file
function initilzation() {
  data[1] = [''];// data[1] is line (max 80 characters)
data[2] = ['none'];//data[2] is index of the start_char of word
data[3] = [0];//data[3] is index on characters, i = 0
data[4] = [false];//data[4] is flag indicating if word was found
data[5] = [''];//data[5] is the word
data[6] = [''];//data[6] is word,NNNN
data[7] = [0];// data[7] is frequency

try {  
  data[0] = fs.readFileSync('stop_words.txt', 'utf8').split(',');
 
} catch(e) {
    // console.log('Error:', e.stack);
}

//Open the secondary memory
let input = fs.open('word_freqs.txt', 'w+', (err:Error, fd:any) => {
  if (err){
    console.log("error is" + err);

  }
  else {
   return 
  }
})


}

/*this function is called by stepzero() function to check if any word of inputfile already exist 
in word_freq file or not to handle how this word is stored in word_freqs file*/
 function stepone(data5: string) {
   
  data[6]=count
  if (count.length == 0) {
    count.push(data5 + ",1\n");
  }
  else {
    for (let i = 0; i < data[6].length;i++){
      
      data[7][0] = Number(data[6][i].split(',')[1]);
      data[5][0] = data[6][i].split(',')[0].trim()
      if (data5.trim()== data[5][0].trim()) {
        
        data[7][0] += 1;
        data[4][0] = true;
        count[i] = data5 + "," + String(data[7][0]);
        
        break;
       }

      if (i == data[6].length - 1) {
        
        count.push(data5 + ",0");
   
      }
    }
   }
 
}
  

function stepzero() {
   lineReader.eachLine('inputFile.txt',  function (line: string, last: boolean) {
    
     
    
    if (line) {
      data[1] = [line];
      
      if (data[1][0][data[1][0].length - 1] != '\n') {
        data[1][0] = data[1][0] + '\n';
      }
      data[2] = ['none'];
      data[3] = [0];
      for ( data[3][0] = 0; data[3][0] < data[1][0].length; ) {
        
        if (data[2][0] === 'none') {
          if (isAlphaNumeric(data[1][0][data[3][0]])) data[2][0] = data[3][0];
        }
        else {
          if (!isAlphaNumeric(data[1][0][data[3][0]])) {
            data[4] = [false];

            data[5][0] = data[1][0].substring(Number(data[2][0]), data[3][0] + 1).toLowerCase();
            

            if (data[5][0].length >= 2 && (data[0].indexOf(data[5][0].trim()) == -1)) {
             stepone(data[5][0]);   
              
  
            }
            data[2][0] = 'none';
  
          }
            
        }
        data[3][0] += 1;
        
      }
    }

    if (last) {
      for (data[7][0] = 0; data[7][0] < count.length; data[7][0]++){
       fs.appendFile('word_freqs.txt', count[data[7][0]]+"\n",  function(err:Error) {
         if (err) {
             return console.error(err);
         }
         //console.log("File created!");
       });
        
      }
      parttwo();
 }
});
}
  


function parttwo() {
 for (let i= 0; i < 25; i++){
    
     
      data[i] = [''];
    
  }
  data[25] = ['']//word,freq
  data[26]=[0]//freq
  //data[7]=['']
  lineReader.eachLine('word_freqs.txt', function (line: string, last: boolean) { 
    if (line) {
      data[25][0] = line;
      data[26][0] = Number(data[25][0].split(',')[1]);
      data[25][0] = data[25][0].split(',')[0];
      for (data[26][1] = 0; data[26][1]  < 25; data[26][1] ++){
        if (data[data[26][1] ][0] == ''||Number(data[data[26][1] ][0][1].split(',')[1])<data[26][0]) {
          data[data[26][1] ][0] = data[25][0] + "," + data[26][0];
          break;
        }
      }
    }
    if (last) {
      for (data[3][0]= 0; data[3][0] < 25; data[3][0]++){
        console.log("data="+data[data[3][0]][0])
      }
   }
  })
  
}
initilzation() 
stepzero();
//




  
  



