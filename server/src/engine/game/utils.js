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

function getHairColor(){
  let version = Math.floor(Math.random()*14);
  if(version < 10){
    version = "0"+version;
  } 
  return `${version}`;
}
function getRandomBody(){
  let bodyType = Math.ceil( Math.random()*10 );
  if(bodyType < 10){
    bodyType = "0"+bodyType;
  } 
  return `humn_v${bodyType}`;
//  return `char_a_p1/char_a_p1_0bas_humn_v${rando}.png`;
}
function getRandomStyle(){
  const hairArray = ['bob1','bob2','dap1','flat','fro1','pon1','spk2']
  return hairArray[ Math.floor( Math.random()*hairArray.length ) ];
};

function getRandomSex(){
  const sexArray = ['m','m','m','m','m','f','f','f','f'];
  return sexArray[ Math.floor( Math.random()*sexArray.length ) ];
}


function getRandomFromArray(ranArray){
  return ranArray[randomBetween(0,ranArray.length)]
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
        hairChar: getHairColor(),
        hairStyleChar: getRandomStyle(),
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
        mainHand:getRandomFromArray(['gladius','mace','dagger']),
        offHand:getRandomFromArray(['mediumShield','gloves','largeShield']),
        head:getRandomFromArray(['galea','halfHelm','fullHelm']),
        schedule:[
          {
            1:{1:"liftRocks",2:"yoga",3:"pray",4:"running",5:"hiking",6:"reading",7:"fishing",8:getRandomFromArray(['liftRocks','yoga','pray','running','hiking','reading','fishing'])},
            2:{1:"liftRocks",2:"yoga",3:"pray",4:"running",5:"hiking",6:"reading",7:"fishing",8:getRandomFromArray(['liftRocks','yoga','pray','running','hiking','reading','fishing'])},
            3:{1:"liftRocks",2:"yoga",3:"pray",4:"running",5:"hiking",6:"reading",7:"fishing",8:getRandomFromArray(['liftRocks','yoga','pray','running','hiking','reading','fishing'])},
            4:{1:"liftRocks",2:"yoga",3:"pray",4:"running",5:"hiking",6:"reading",7:"fishing",8:getRandomFromArray(['liftRocks','yoga','pray','running','hiking','reading','fishing'])},
            5:{1:"liftRocks",2:"yoga",3:"pray",4:"running",5:"hiking",6:"reading",7:"fishing",8:getRandomFromArray(['liftRocks','yoga','pray','running','hiking','reading','fishing'])},
            6:{1:"liftRocks",2:"yoga",3:"pray",4:"running",5:"hiking",6:"reading",7:"fishing",8:getRandomFromArray(['liftRocks','yoga','pray','running','hiking','reading','fishing'])},
          }
        ]
  
    };

  }

}

module.exports = { modStat4Effect, createNewOwner, createNewGladiator,randomBetween,rollDice ,getRandomAround };
