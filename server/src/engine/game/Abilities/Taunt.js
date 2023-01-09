const {getRandomAround} = require('./../utils');
module.exports = {
    abilityName: "taunt",
    type:"clash",
    doAbility(casterChar, target) {
      let amnt = getRandomAround((casterChar.charisma + casterChar.reputation)/200 ,10);
      //console.log(this.abilityName, "   ->This ability does no damage but....",amnt);
      casterChar.addEffect("taunt", amnt);

    },
  
    winCondition(casterChar, target) {
      let points = 0;
      if (!casterChar.effectToDo.hitDamage) {
        //console.log("  winner taunt!");
        casterChar.addEffect("moraleDamage", 10);
        points = casterChar.effectToDo.taunt;
      } else {
        casterChar.addEffect("moraleDamage", null);
      }
      return points;
    },
  };
  