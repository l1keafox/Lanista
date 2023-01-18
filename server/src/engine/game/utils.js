// This returns an object that is used by the model.
function createNewOwner() {
  return { gold: 100, fame:0 };
}

const gladNames = [
  "Tat",
  "Fat",
  "Cat",
  "Bat",
  "Rat",
  "Mat",
  "Dat",
  "Tar",
  "Far",
  "Car",
  "Bar",
  "Rar",
  "Mar",
  "Dar",
];
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

function createNewGladiator() {
  return { 
      name: getName(), 
      // Character Points Stats
      hits: 50, // Easily trained stat.
      morale:100, // Morale is high because it's stable stat? Mmm maybe later add ways to train it up.
      mana:100,
      stress:100,
      exp:0,
      level:0,
      winRecord:0,
      loseRecord:0,
      stamina:0,
      age:0,

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

      skills:["dodge","taunt","quickSlash","heal"],
      
  };
}

module.exports = { modStat4Effect, createNewOwner, createNewGladiator,randomBetween,rollDice ,getRandomAround };
