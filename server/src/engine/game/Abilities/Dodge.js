const {modStat4Effect} = require('./../utils');
module.exports = {
    abilityName: "dodge",
    type:"clash",
    doAbility(casterChar, target) {
        // Dodge has a bonus, because there's nothing to win it, doesn't do damage or morale damage, it just dodging.
        // Might get an react from this.
        const dodgeChance = modStat4Effect(casterChar.agility*1.25,10);
      casterChar.addEffect("missChance", dodgeChance);
      return ({"missChance": dodgeChance});
    },
  
    winCondition(casterChar, target) {
      let points = 0;
        points = casterChar.effectToDo.missChance;
      return points;
    },
  };