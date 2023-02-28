class Ability{
  constructor(){

  }
  doAbility(caster, target) {
    let reportObj = {};
    for(abilityName in this.ability){
      thisAbility = this.ability[abilityName];
      const chanceEffect = modStat4Effect(caster.abilityMix(thisAbility),10);
      if(thisAbility.target == "caster"){
        caster.addEffect( thisAbility.targetEffect,chanceEffect)
        reportObj[ thisAbility.targetEffect] = chanceEffect
      }
    }
    return reportObj;
  }

  winCondition(caster, target) {
    if(this.winCondition.target === 'caster'){
      return caster.effectToDo[this.winCondition.effect]
    } else {
      return target.effectToDo[this.winCondition.effect]
    }

  }
}

module.export = Ability;