/*
This is the effects that abilities use.
All located in one place while the abilities them selves add abilities.

so here are the effects so far that we have.

We will have a naming convention,
the first word is the type, while the second word is what it does,

// this does XXXDamage
moraleDamage
hitDamage
staminaDamage

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

            // If target is hitting this glad.
            if(gladiator.effectToDo.hitChance){
                gladiator.effectToDo.hitChance -= gladiator.effectToDo.missChance;
            }

            // If dodge is sucessful 
            if(gladiator.effectToDo.hitChance <= 0 && gladiator.effectToDo.hitDamage){
                // hit damage is 0, and target(person who did the swing), get stamina damage
                target.effectToDo.staminaDamage = gladiator.effectToDo.hitDamage;
                gladiator.effectToDo.hitDamage = 0;
            }

            // If they are both dodging
            if(target.effectToDo.missChance){
                // Then both of them just set missChance to 0;
                target.effectToDo.missChance = 0;
                gladiator.effectToDo.missChance = 0;
            }
        break;
        case "taunting":
            // If taunter this glad, is taking damage, then taunting is set to 0.
            if( gladiator.effectToDo.hitDamage && gladiator.effectToDo.taunting ){
                gladiator.effectToDo.taunting = 0;
             } 
             
            // If this glad is taunting and the other target is dodging 
            if(target.effectToDo.missChance) {
                target.effectToDo.missChance = 0;
                target.effectToDo.moraleDamage = gladiator.effectToDo.taunting;
            }

            // If target is taunting.
            if(target.effectToDo.taunting){
                // So if both are taunting.
                // then we will compare both and 
                // If target taunting is greater than glad taunting.
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

}

function doEffects(gladiator){
    let effectReport = {};
    for (let effect in gladiator.effectToDo) {
        let num = Math.round( gladiator.effectToDo[effect] );
        switch (effect) {
            case "hitDamage":
                gladiator.hits -= num;
                effectReport[effect] = num;
                break;
            case "moraleDamage":
                if(num > 15) num = 15;
                gladiator.morale -= num;
                effectReport[effect] = num
                break;
            case "staminaDamage":
                gladiator.stamina -= num
                effectReport[effect] = num
                break;
        }
      }
      // clearing out effects.
      gladiator.effectToDo = {};

      effectReport.hits = gladiator.hits;
      effectReport.morale = gladiator.morale;
      effectReport.stamina = gladiator.stamina;
      return effectReport;
}

function addEffect(gladiator,effectName, effectStr) {
    if (!gladiator.effectToDo) {
        gladiator.effectToDo = {};
    }
    if (gladiator.effectToDo[effectName]) {
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