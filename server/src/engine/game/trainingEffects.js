/*
This is an game object for training
Each training will have an abbprivated name, and that training can have random effects:
*/
// There are two different types, min/max and dice numbers/side being that the math is different chances.


const trainingObj = require("./training.json");

// Level 1
//   "strength", - Chopping Firewood - increase gold
//   "constitution", - Chopping Firewood 
//   "dexterity", - Woodcarving - increase gold
//   "agility", - Hiking - increase gold
//   "vitality", Hiking - increase gold
//   "intelligence", - Reading Books 
//   "sensitivity", - Reading Books - increase gold
//   "wisdom", - Praying - increase gold
//   "piety", - Praying  - increase gold
//   "bravery", Looking for lost items - increase gold
//   "luck", Looking for lost items - increase gold
//   "charisma",  Community Service  - increases fame
//   "reputation", Community Service - increases fame


/* So how this will work this rough shit is that it will export an module for growth, it will take a character and an type of training
 */
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


function growthPenality(gladiator,amnt, stat) {
  // This happens when you get a stat below 0,
  const stats = [
    "strength",
    "dexterity",
    "agility",
    "constitution",
    "vitality",
    "intelligence",
    "wisdom",
    "bravery",
    "piety",
    "sensitivity",
    "charisma",
    "luck",
    "reputation",
  ];
  const index = stats.indexOf(stat);
  stats.splice(index, 1);
  let removeStat;
  
  let amp = rollDice(3,6);
  amp = Math.ceil( amp / rollDice(2,4) );
  do{
    removeStat = stats[Math.floor( Math.random() * stats.length ) ];
  }while(gladiator[removeStat] < amnt*amp )
  
  gladiator[removeStat] += amnt*amp;
  console.log("  -EN/TICK> growthBad", removeStat, amnt*amp,amp );
  return({stat:removeStat, amount: amnt*amp} );
}



async function  doGrowth(gladiator, training) {
  let rtnGrowth = [];

  Object.keys(trainingObj[training]).forEach((stat) => {
    let growthAmnt;
    if (trainingObj[training][stat].min) {
      growthAmnt = randomBetween(
        trainingObj[training][stat].min,
        trainingObj[training][stat].max
      );
    } else {
      growthAmnt = rollDice(
        trainingObj[training][stat].diceNumber,
        trainingObj[training][stat].diceSide
      );
    }
    // console.log(stat,"Growth @", growthAmnt ,"Growth",trainingObj[training][stat].growth )
    if (!trainingObj[training][stat].growth) {
      growthAmnt = growthAmnt * -1;
    }
    if(stat === "description"){

    } else 
    if(stat !== 'gold' && stat !=="fame"){
      gladiator[stat] += growthAmnt;
      if (gladiator[stat] < 0) {
          rtnGrowth.push( growthPenality(gladiator,gladiator[stat], stat) );
          gladiator[stat] = 1;
      } else {
          rtnGrowth.push({ stat, amount: growthAmnt });
        }
    } else if((stat == 'gold' || stat =="fame") && growthAmnt) {
      rtnGrowth.push({ stat, amount: growthAmnt });
    }
  });
  return rtnGrowth;
}

function getTraining(training) {
  return trainingObj[training];
}

function getAllTrainings(){
  return trainingObj;
}

module.exports = { doGrowth, getTraining, getAllTrainings};
