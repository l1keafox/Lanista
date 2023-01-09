const {modStat4Effect} = require('./../utils');
module.exports = {
  abilityName: "swing",
  type:"clash",
  description:"",
  doAbility(casterChar, target) {
  //  console.log("  -Swng>This ability needs to do damage.");
    // Strength and agility should do the damage.
    target.addEffect("hitDamage",modStat4Effect(casterChar.strength,10));
    target.addEffect("hitChance",modStat4Effect(casterChar.dexterity,10));// Dodge is based on this.
  },

  winCondition(casterChar, target) {
    let points = 0;
    // What I do not like about this, is that we have it setup based on
    // That it is looking for the dodge here. It should be just looking for damage.
  //console.log("Win Condidtions, swing",target.effectToDo.hitDamage);
    points = target.effectToDo.hitDamage;
    return points;
  },
};
