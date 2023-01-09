/*

This is the effects that abilities use.
All located in one place while the abilities them selves add abilities.

so here are the effects so far that we have.

We will have a naming convention,
the first word is the type, while the second word is what it does,

// this does XXXDamage
moraleDamage
hitDamage

// this does XXXHeal
hitHeal


// This is the chance to hit/miss, this is an all or nothing effect. 
// This is in the compareEffects - cause it cancels out another effect.
missChance
hitChance


// This is an set amount of damage blocked. 
amountBlock

*/



function compareEffects(gladiator,target){
//    console.log(`  ->B4 ${gladiator.name}`,gladiator.effectToDo);
    for(let effect in gladiator.effectToDo){
    switch(effect){
        case 'missChance':
            if(gladiator.effectToDo.hitChance){
                gladiator.effectToDo.hitChance -= gladiator.effectToDo.missChance;
            }
            if(gladiator.effectToDo.hitChance <= 0 && gladiator.effectToDo.hitDamage){
                gladiator.effectToDo.hitDamage = 0;
            }
            if( gladiator.effectToDo.taunting ){
                gladiator.effectToDo.missChance -= gladiator.effectToDo.taunting;
            }
        break;
        case "taunting":
            if( gladiator.effectToDo.hitDamage ){
                gladiator.effectToDo.taunting = 0;
            } else {
                target.effectToDo.moraleDamage = 10;
            }
            if(target.effectToDo.taunting){
                // So if both are taunting.
                // then we will compare both and 
                if(target.effectToDo.taunting > gladiator.effectToDo.taunting){
                    gladiator.effectToDo.moraleDamage = target.effectToDo.taunting - gladiator.effectToDo.taunting
                } else {
                    target.effectToDo.moraleDamage = gladiator.effectToDo.taunting - target.effectToDo.taunting
                }
                target.effectToDo.taunting = 0;
                gladiator.effectToDo.taunting = 0;
            }
            break;
    }
}
//console.log(`  ->A4 ${gladiator.name}`,gladiator.effectToDo);

}

function doEffects(gladiator){
    let effectReport = {};
    for (let effect in gladiator.effectToDo) {
        let num = gladiator.effectToDo[effect];
        switch (effect) {
          case "hitDamage":
            gladiator.hits -= gladiator.effectToDo[effect];
            effectReport[effect] = gladiator.effectToDo[effect]
            effectReport.hits = gladiator.hits;
            break;
          case "moraleDamage":
            gladiator.morale -= gladiator.effectToDo[effect];
            effectReport[effect] = gladiator.effectToDo[effect]
            effectReport.morale = gladiator.morale;
            break;
        }
      }
      // clearing out effects.
      gladiator.effectToDo = {};
      return effectReport;
}

function addEffect(gladiator,effectName, effectStr) {
    if (!gladiator.effectToDo) {
        gladiator.effectToDo = {};
    }
    if (gladiator.effectToDo[effectName]) {
        console.log(effectName,gladiator.effectToDo[effectName],effectStr )
        if(effectStr){
           
            gladiator.effectToDo[effectName] += effectStr;
        } else if( effectStr === null ){
            gladiator.effectToDo[effectName] = 0;
        }
    } else {
        gladiator.effectToDo[effectName] = effectStr;
    }
  }

module.exports = {addEffect, doEffects , compareEffects };