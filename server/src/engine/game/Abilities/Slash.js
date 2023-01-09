const {getRandomAround} = require('./../utils');
module.exports = {
  abilityName: "swing",
  type:"clash",
  description:"",
  doAbility(casterChar, target) {
  //  console.log("  -Swng>This ability needs to do damage.");
    // Strength and agility should do the damage.
    target.addEffect("hitDamage",getRandomAround(casterChar.strength/100,10));
    target.addEffect("hitChance",getRandomAround(casterChar.dexterity/100,10));// Dodge is based on this.
  },

  winCondition(casterChar, target) {
    let points = 0;
    // What I do not like about this, is that we have it setup based on
    // That it is looking for the dodge here. It should be just looking for damage.
  //console.log("Win Condidtions, swing",target.effectToDo.hitDamage);
    if (target.effectToDo.hitDamage) {
      //console.log("  winner Attack!");
      points = target.effectToDo.hitDamage;
    }
    return points;
  },
};
