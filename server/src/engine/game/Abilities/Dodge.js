const {getRandomAround} = require('./../utils');
module.exports = {
    abilityName: "dodge",
    type:"clash",
    doAbility(casterChar, target) {
      // console.log(
      //   this.abilityName,
      //   "   ->So this ability needs to cancel out damage"
      // );
      
      casterChar.addEffect("missChance", getRandomAround(casterChar.agility/100,10));
      
    },
  
    winCondition(casterChar, target) {
      let points = 0;
      if (casterChar.effectToDo.hitDamage <= 0) {
        console.log("  winner Dodge!");
        points = 50;
      }
  
      return points;
    },
  };