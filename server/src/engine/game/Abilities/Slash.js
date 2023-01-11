const {modStat4Effect} = require('./../utils');
module.exports = {
  abilityName: "swing",
  type:"clash",
  description:"",
  doAbility(casterChar, target) {
  //  console.log("  -Swng>This ability needs to do damage.");
    // Strength and agility should do the damage.
    const dmg = modStat4Effect( casterChar.abilityMix({"strength":90,"intelligence":10 }) ,10);
    const hitChance = modStat4Effect( casterChar.abilityMix({"dexterity":80,"wisdom":20 }) ,10);
    target.addEffect("hitDamage",dmg);
    target.addEffect("hitChance",hitChance);// Dodge is based on this.
    return( { "hitDamage":dmg , "hitChance":hitChance }); 
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
