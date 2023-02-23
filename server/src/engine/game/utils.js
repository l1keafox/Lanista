// This returns an object that is used by the model.
const namesArray = require('./names');

function createNewOwner() {
  
  return { gold: 100, fame:1, structures:[ "School" ] ,inventory : [] };
}

const gladNames = require('./names');
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function rollDice(numOfDice, numOfFaces) {
  let rtn = 0;
  while (numOfDice--) {
    rtn += Math.ceil(Math.random() * numOfFaces);
  }
  return rtn;
}

function getRandomAround(num,percent){
  if(percent > 1 ){
    percent = percent / 100;
  }
  const between = Math.floor( num * percent );
 return randomBetween(num-between,num+between);
}

function modStat4Effect(num,percent){
  let rtn = getRandomAround(num/100,percent);
  return rtn.toFixed()
}

function getRandomHair(){
  let version = Math.floor(Math.random()*14);
  const hairArray = ['bob1','bob2','dap1','flat','fro1','pon1','spk2']
  if(version < 10){
    version = "0"+version;
  } 
  let type =hairArray[ Math.floor( Math.random()*hairArray.length ) ];
  return `char_a_p1/4har/char_a_p1_4har_${type}_v${version}.png`;
}
function getRandomBody(){
  let rando = Math.ceil( Math.random()*10 );
  if(rando < 10){
    rando = "0"+rando;
  } 
  return `char_a_p1/char_a_p1_0bas_humn_v${rando}.png`;
}

function getRandomSex(){
  const sexArray = ['m','m','m','m','m','f','f','f','f'];
  return sexArray[ Math.floor( Math.random()*sexArray.length ) ];
}
//C:\Users\Raymond\Desktop\ActJs\Lanista\server\assets\char_a_p1\char_a_p1_0bas_humn_v00.png
//server\assets\char_a_p1\4har\char_a_p1_4har_bob1_v00.png
function createNewGladiator(gladType) {
  
  //console.log("  -EN> Creating Glad:",gladType);
        // Looking for average of 1,000 start stat. as starting average.
        // 30 d 66 current varience is :
        // low of 700 hight of 1300
        // Physical Stats
        // 20d99
        // Low of 635 high of 1365
        const numDice = 20;
        const sideDice = 99;
  switch(gladType){
    default:
    return { 
        name: gladNames[rollDice(1, gladNames.length)] + ' '+gladNames[rollDice(1, gladNames.length)], 

        level:1,
        winRecord:0,
        lossRecord:0,
        weekWin:0,
        monthWin:0,
        quarterWin:0,
        yearWin:0,
        age:1,
        hairChar: getRandomHair(),
        skinChar: getRandomBody(),
        sexChar: getRandomSex(),
        strength:rollDice(numDice,sideDice),
        dexterity:rollDice(numDice,sideDice),
        agility:rollDice(numDice,sideDice),
        constitution:rollDice(numDice,sideDice),
        vitality:rollDice(numDice,sideDice),
        
        // Mental Stats
        intelligence:rollDice(numDice,sideDice),
        wisdom:rollDice(numDice,sideDice),
        bravery:rollDice(numDice,sideDice),
        piety:rollDice(numDice,sideDice),
        sensitivity:rollDice(numDice,sideDice),
  
        // Social Stats
        charisma:rollDice(numDice,sideDice),
        luck:rollDice(numDice,sideDice),
        reputation:rollDice(numDice,sideDice),
  
        skills:[],
        mainHand:"gladius",
        body:"clothArmor",
        head:"galea",
        schedule:[
          {
          1:{1:"chopWood",2:"community",3:"woodCarv",4:"hiking",5:"readBook",6:"pray",7:"lookLost",8:"chopWood"},
          2:{1:"community",2:"woodCarv",3:"hiking",4:"readBook",5:"pray",6:"lookLost",7:"woodCarv",8:"chopWood"},
          3:{1:"woodCarv",2:"hiking",3:"readBook",4:"pray",5:"lookLost",6:"chopWood",7:"chopWood",8:"woodCarv"},
          4:{1:"hiking",2:"readBook",3:"pray",4:"lookLost",5:"hiking",6:"chopWood",7:"lookLost",8:"community"},
          5:{1:"readBook",2:"pray",3:"lookLost",4:"readBook",5:"chopWood",6:"pray",7:"community",8:"woodCarv"},
          6:{1:"pray",2:"lookLost",3:"hiking",4:"chopWood",5:"readBook",6:"community",7:"woodCarv",8:"hiking"},
          }
        ]
  
    };

  }

}

module.exports = { modStat4Effect, createNewOwner, createNewGladiator,randomBetween,rollDice ,getRandomAround };
