

// This returns an object that is used by the model.
function createNewOwner(){
    return {gold:100};
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
    "Dar"
];
global.rollDice = (numOfDice,numOfFaces) =>{
    let rtn = 0;
    while(numOfDice--){
      rtn += Math.ceil(Math.random()*numOfFaces);
    };
    return rtn;
  };

function createNewGladiator(){
    return {name: gladNames[  rollDice(1,gladNames.length)  ], hits:100};
}

module.exports = { createNewOwner,createNewGladiator }; 