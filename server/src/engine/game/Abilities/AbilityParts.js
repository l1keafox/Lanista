// function doAbility() {
//   let reportObj = {};
//   for(abilityName in this.ability){
//     thisAbility = this.ability[abilityName];
//     const chanceEffect = modStat4Effect(caster.abilityMix(thisAbility),10);
//     if(thisAbility.target == "caster"){
//       caster.addEffect( thisAbility.targetEffect,chanceEffect)
//       reportObj[ thisAbility.targetEffect] = chanceEffect
//     }
//   }
//   return reportObj;
// }

// function winCondition(caster, target) {
//   if(this.winCondition.target === 'caster'){
//     return caster.effectToDo[this.winCondition.effect]
//   } else {
//     return target.effectToDo[this.winCondition.effect]
//   }
// }

const calcAbility = (state) =>({
  doAbility: (caster, target) => {
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
});

const calcWin = (state)=>({
  winCondition:(caster,target) => {
    if(this.winCondition.target === 'caster'){
      return caster.effectToDo[this.winCondition.effect]
    } else {
      return target.effectToDo[this.winCondition.effect]
    }
  }
})

module.export = {calcAbility(),calcWin()}