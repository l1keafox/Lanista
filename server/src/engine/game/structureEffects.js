/*
This is an game object for training
Each structure will have an abbprivated name, and that structure can have random effects:
*/
// There are two different types, min/max and dice numbers/side being that the math is different chances.

const structObj = {
  "str": {
    // increase strength, with a chance of lowering
    "strength": {
      min: 20,
      max: 30,
      growth: true,
    },
    "agility": {
      diceSide: 4,
      diceNumber: 3,
      growth: false,
    },
  },
};

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
    "consitution",
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
    gladiator[stat] += growthAmnt;
    if (gladiator[stat] < 0) {
        rtnGrowth.push( growthPenality(gladiator,gladiator[stat], stat) );
        gladiator[stat] = 1;
    } else {
        rtnGrowth.push({ stat, amount: growthAmnt });
    }

    
  });
  return rtnGrowth;
}

function getStruct(struct) {
  return structObj[struct];
}

module.exports = { doGrowth, getStruct };
