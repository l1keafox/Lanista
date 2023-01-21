// This returns an object that is used by the model.
const namesArray = require('./names');

function createNewOwner() {
  
  return { gold: 100, fame:0, structures:[ "School" ] ,inventory : [] };
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
 return getRandomAround(num/100,percent)
}


function getName(){
  let name;
  do{
    name = gladNames[rollDice(1, gladNames.length)];
  }while(!name)
  return name;
}

function createNewGladiator(gladType) {
  
  //console.log("  -EN> Creating Glad:",gladType);
  switch(gladType){
    default:
    return { 
        name: getName(), 
        // Character Points Stats
        // The three main stats for living. 
        hits: 100, // Easily trained stat.
        morale:100, // Morale is high because it's stable stat? Mmm maybe later add ways to train it up.
        stamina:100,
  
        mana:100,
        level:1,
        winRecord:0,
        loseRecord:0,
        age:1,
  
        // Looking for average of 1,000 start stat. as starting average.
        // Physical Stats
        strength:rollDice(35,55),
        dexterity:rollDice(35,55),
        agility:rollDice(35,55),
        constitution:rollDice(35,55),
        vitality:rollDice(35,55),
        
        // Mental Stats
        intelligence:rollDice(35,55),
        wisdom:rollDice(35,55),
        bravery:rollDice(35,55),
        piety:rollDice(35,55),
        sensitivity:rollDice(35,55),
  
        // Social Stats
        charisma:rollDice(35,55),
        luck:rollDice(35,55),
        reputation:rollDice(35,55),
  
        skills:["dodge","taunt"],
        mainHand:"shortSword",
        schedule:[
          {
          1:{1:"chopWood",2:"community",3:"woodCarv",4:"hiking",5:"readBook",6:"pray",7:"lookLost",8:"tough"},
          2:{1:"community",2:"woodCarv",3:"hiking",4:"readBook",5:"pray",6:"lookLost",7:"tough",8:"chopWood"},
          3:{1:"woodCarv",2:"hiking",3:"readBook",4:"pray",5:"lookLost",6:"tough",7:"chopWood",8:"tough"},
          4:{1:"hiking",2:"readBook",3:"pray",4:"lookLost",5:"tough",6:"chopWood",7:"lookLost",8:"community"},
          5:{1:"readBook",2:"pray",3:"lookLost",4:"tough",5:"chopWood",6:"pray",7:"community",8:"woodCarv"},
          6:{1:"pray",2:"lookLost",3:"tough",4:"chopWood",5:"readBook",6:"community",7:"woodCarv",8:"hiking"},
          }
        ]
  
    };

  }

}

module.exports = { modStat4Effect, createNewOwner, createNewGladiator,randomBetween,rollDice ,getRandomAround };
