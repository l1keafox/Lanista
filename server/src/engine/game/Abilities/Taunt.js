const {modStat4Effect} = require('./../utils');
module.exports = {
    abilityName: "taunt",
    type:"clash",
    doAbility(casterChar, target) {
      let amnt = modStat4Effect(casterChar.charisma + casterChar.reputation ,10);
      //console.log(this.abilityName, "   ->This ability does no damage but....",amnt);
      casterChar.addEffect("taunting", amnt);
      return {"taunting":amnt};
    },
  
    winCondition(casterChar, target) {
      let points = 0;
        points = casterChar.effectToDo.taunting;
      return points;
    },
  };
  