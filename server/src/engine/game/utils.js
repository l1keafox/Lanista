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
function rollDice(numOfDice, numOfFaces){
  let rtn = 0;
  while (numOfDice--) {
    rtn += Math.ceil(Math.random() * numOfFaces);
  }
  return rtn;
};
function getName(){
  let name;
  do{
    name = gladNames[rollDice(1, gladNames.length)];
  }while(!name)
  return name;
}

function createNewGladiator() {
  return { name: getName(), hits: 100 ,
   
      // Character Points Stats
      mana:100,
      stress:100,
      morale:100,
      exp:0,
      age:0,

      // Physical Stats
      strength:rollDice(30,60),
      dexterity:rollDice(30,60),
      agility:rollDice(30,60),
      constitution:rollDice(30,60),
      vitality:rollDice(30,60),
      
      // Mental Stats
      intelligence:rollDice(30,60),
      wisdom:rollDice(30,60),
      bravery:rollDice(30,60),
      piety:rollDice(30,60),
      sensitivity:rollDice(30,60),

      // Social Stats
      charisma:rollDice(30,60),
      luck:rollDice(30,60),
      reputation:rollDice(30,60),

      skills:["dodge","taunt","quickSlash","heal"],
      
  };
}

module.exports = { createNewOwner, createNewGladiator };
