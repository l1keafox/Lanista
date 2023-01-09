const {modStat4Effect} = require('./../utils');
module.exports = {
    abilityName: "dodge",
    type:"clash",
    doAbility(casterChar, target) {
      // console.log(
      //   this.abilityName,
      //   "   ->So this ability needs to cancel out damage"
      // );
      
      casterChar.addEffect("missChance", modStat4Effect(casterChar.agility*1.25,10));
      
    },
  
    winCondition(casterChar, target) {
      let points = 0;
        points = casterChar.effectToDo.missChance;
      return points;
    },
  };