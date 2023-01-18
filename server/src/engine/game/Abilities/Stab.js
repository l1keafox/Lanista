// Stab is easier to hit, but less damage
// More damage than kick and less hit.


const {modStat4Effect} = require('./../utils');
module.exports = {
  abilityName: "stab",
  type:"clash",
  description:"",
  doAbility(casterChar, target) {
    const dmg = modStat4Effect( casterChar.abilityMix({"strength":30,"agility":30,"luck":10 }) ,10);
    const hitChance = modStat4Effect( casterChar.abilityMix({"dexterity":100,"wisdom":20,"luck":20 }) ,10);
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
