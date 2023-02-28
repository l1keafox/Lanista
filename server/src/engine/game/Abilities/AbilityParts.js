function abilityMix (glad,statObj){
  // input is
  // num is an whole num * .01;
  // { "stat":num, }
  let total = 0;
  for(let stat in statObj){
    if(stat == 'target'){
      continue;
    }
    if(statObj[stat] > 1){
      statObj[stat] = statObj[stat] * 0.01;
    }
    total += glad[stat] * [statObj[stat]];
  }
  return total;
}   
function modStat4Effect(num,percent){
  let rtn = getRandomAround(num/100,percent);
  return rtn.toFixed()
}
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomAround(num,percent){
  if(percent > 1 ){
    percent = percent / 100;
  }
  const between = Math.floor( num * percent );
 return randomBetween(num-between,num+between);
}


const calcEffect = (ability) =>({
  doAbility: (caster, target) =>{
    let reportObj = {};
    for(abilityName in ability.effect){
      thisAbility = ability.effect[abilityName];
      const chanceEffect = modStat4Effect(abilityMix(caster,thisAbility),10);
      if(thisAbility.target == "caster"){
        caster.addEffect(  abilityName ,chanceEffect)
        reportObj[ abilityName] = chanceEffect
      } else {
        target.addEffect( abilityName ,chanceEffect)
        reportObj[ abilityName] = chanceEffect
      }
    }
    return reportObj;
  }
});



const calcWin = (ability)=>({
  winCondition:(caster,target) => {
    if(ability.winStats.target === 'caster'){
      return caster.effectToDo[ability.winStats.effect]
    } else {
      return target.effectToDo[ability.winStats.effect]
    }
  }
})

module.exports = {calcEffect,calcWin}