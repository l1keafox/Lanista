/*
This is an game object for training
Each structure will have an abbprivated name, and that structure can have random effects:
*/
// There are two different types, min/max and dice numbers/side being that the math is different chances.

const structObj = {
  "chopWood": {
    // increase strength, with a chance of lowering
    description: "Chopping Wood",
    "strength": {
      min: 2,
      max: 12,
      growth: true,
    },
    "constitution": {
      diceSide: 6,
      diceNumber: 2,
      growth: true,
    },
    "gold":{
      diceSide: 1,
      diceNumber: 4,
      growth: true,
    }
  },
  "tough":{
    description: "Toughing up one's body",
    "hits":{
      min: 1,
      max: 4,
      growth: true,
    },
    "fame":{
      diceSide: 1,
      diceNumber: 4,
      growth: true,
    },
  },
  "community":{
    description:"Doing Community Service",
    "charisma":{
      min: 5,
      max: 10,
      growth: true,

    },
    "reputation":{
      min: 2,
      max: 10,
      growth: true,

    },
    "gold":{
      min: 1,
      max: 4,
      growth: true,

    }
  },
  "woodCarv":{
    description:"Carving wood",
    "dexterity":{
      min: 2,
      max: 12,
      growth: true,
    },
    "agility":{
      min: 2,
      max: 12,
      growth: true,
    },
    "gold":{
      min: 1,
      max: 4,
      growth: true,

    }
  },
  "hiking":{
    description:"Hiking and looking for plants",
    "vitality":{
      min: 2,
      max: 12,
      growth: true,
    },
    "gold":{
      min: 0,
      max: 4,
      growth: true,
    }
  },
  "readBook":{
    description:"Reading books",
    "intelligence":{
      min: 2,
      max: 12,
      growth: true,
    },
    "sensitivity":{
      min: 2,
      max: 12,
      growth: true,
    },
    "gold":{
      min: 0,
      max: 2,
      growth: true,
    }
  },
  "pray":{
    description:"Praying",
    "piety":{
      min: 2,
      max: 12,
      growth: true,
    },
    "wisdom":{
      min: 2,
      max: 12,
      growth: true,
    },
    "gold":{
      min: 0,
      max: 4,
      growth: true,
    }
  },
  "lookLost":{
    description:"Looking for lost items",
    "luck":{
      min: 0,
      max: 12,
      growth: true,
    },
    "bravery":{
      min: 5,
      max: 10,
      growth: true,
    },
    "gold":{
      min: 0,
      max: 4,
      growth: true,
    }
  },

};

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


/* So how this will work this rough shit is that it will export an module for growth, it will take a character and an type of struct
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

function doGrowth(gladiator, struct) {
  let rtnGrowth = [];
  Object.keys(structObj[struct]).forEach((stat) => {
    let growthAmnt;
    if (structObj[struct][stat].min) {
      growthAmnt = randomBetween(
        structObj[struct][stat].min,
        structObj[struct][stat].max
      );
    } else {
      growthAmnt = rollDice(
        structObj[struct][stat].diceNumber,
        structObj[struct][stat].diceSide
      );
    }
    // console.log(stat,"Growth @", growthAmnt ,"Growth",structObj[struct][stat].growth )
    if (!structObj[struct][stat].growth) {
      growthAmnt = growthAmnt * -1;
    }
    if(stat === "description"){

    } else 
    if(stat !== 'gold' || stat !=="fame"){
      gladiator[stat] += growthAmnt;
      if (gladiator[stat] < 0) {
          rtnGrowth.push( growthPenality(gladiator,gladiator[stat], stat) );
          gladiator[stat] = 1;
      } else {
          rtnGrowth.push({ stat, amount: growthAmnt });
        }
    } else {

    }

    
  });
  return rtnGrowth;
}

function getStruct(struct) {
  return structObj[struct];
}

function getAllStructs(){
  return structObj;
}

module.exports = { doGrowth, getStruct, getAllStructs};
