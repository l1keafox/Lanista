const {modStat4Effect} = require('./../utils');
module.exports = {
    abilityName: "dodge",
    type:"clash",
    ability:{
      dodgeChance:{
        agility:100,
        sensitivity:15,
        luck:15 
      }
    },
    winCondition:{
      target:"caster",
      effect:"missChance"
    },
    doAbility(caster, target) {
      // Dodge has a bonus, because there's nothing to win it, doesn't do damage or morale damage, it just dodging.
      // Might get an react from this.
      const dodgeChance = modStat4Effect(caster.abilityMix(this.ability.dodgeChance),10);
      caster.addEffect("missChance", dodgeChance);
      return ({"missChance": dodgeChance});
    },
  
    winCondition(caster, target) {
      if(this.winCondition.target === 'caster'){
        return caster.effectToDo[this.winCondition.effect]
      } else {
        return target.effectToDo[this.winCondition.effect]
      }
    },
  };