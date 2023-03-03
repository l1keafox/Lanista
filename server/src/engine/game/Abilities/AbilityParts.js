function abilityMix (glad,statObj){
  // input is
  // num is an whole num * .01;
  // { "stat":num, }
  let total = 0;
  for(let stat in statObj){
    if(glad[stat]){
      if(statObj[stat] > 1){
        statObj[stat] = statObj[stat] * 0.01;
      }
      total += glad[stat] * [statObj[stat]];
    }
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
      const thisAbility = ability.effect[abilityName];
      const chanceEffect = modStat4Effect(abilityMix(caster,thisAbility),10);

      if(thisAbility.target == "caster"){
        if(ability.effect[abilityName].reducer){
          caster.addEffect( 'reducer' ,ability.effect[abilityName].reducer)
        }
        caster.addEffect( abilityName ,chanceEffect)
        reportObj[ abilityName] = chanceEffect
      } else {
        if(ability.effect[abilityName].reducer){
          target.addEffect( 'reducer' ,ability.effect[abilityName].reducer)
        }
        target.addEffect( abilityName ,chanceEffect)
        reportObj[ abilityName] = chanceEffect
      }
    }
    return reportObj;
  }
});

const calcReact = (ability)=>({
  doReact: (caster, target) =>{

    if(caster.clashResult === ability.resultWanted  && caster.clashAbility === ability.abilityWanted ) {
      for(abilityName in ability.effect){
        thisAbility = ability.effect[abilityName];
  
      const dodgeChance = modStat4Effect(caster.abilityMix({"dexterity":30,"agility":30,"sensitivity":30,"luck":15}),10);
      target.hits -= dodgeChance;
      ability.cooldown = ability.maxCooldown;
      return {name:this.abilityName, effect:`hits: -${dodgeChance}` }

      }
    }
  }
})

const calcPrepare = (ability)=>({
  doPrepare: (caster, target) =>{

  }
})



const calcWin = (ability)=>({
  winCondition:(caster,target) => {
    if(ability.winStats.target === 'caster'){
      // console.log( caster.effectToDo[ability.winStats.effect] );
      return caster.effectToDo[ability.winStats.effect]
    } else {
      // console.log( caster.effectToDo[ability.winStats.effect] );
      return target.effectToDo[ability.winStats.effect]
    }
  }
})

module.exports = {calcEffect,calcWin,calcReact}