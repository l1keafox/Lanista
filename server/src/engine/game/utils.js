// This returns an object that is used by the model.
function createNewOwner() {
  return { gold: 100 };
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
global.rollDice = (numOfDice, numOfFaces) => {
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

      // Physical Stats
      strength:rollDice(3,6),
      dexterity:rollDice(3,6),
      agility:rollDice(3,6),
      consitution:rollDice(3,6),
      vitality:rollDice(3,6),
      age:15,
      
      // Mental Stats
      intelligence:rollDice(3,6),
      wisdom:rollDice(3,6),
      bravery:rollDice(3,6),
      piety:rollDice(3,6),
      sensitivity:rollDice(3,6),

      // Social Stats
      charisma:rollDice(3,6),
      luck:rollDice(3,6),
      reputation:rollDice(3,6),
  };
}

module.exports = { createNewOwner, createNewGladiator };
