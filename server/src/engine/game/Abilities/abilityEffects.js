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



function compareEffects(gladiator){
    switch(gladiator.effectToDo){
        case 'missChance':
            if(gladiator.effectToDo.hitChance){
                gladiator.effectToDo.hitChance -= missChance;
            }
            if(!gladiator.effectToDo.hitChance){
                gladiator.effectToDo.hitDamage = 0;
            }
        break;
    }
}

function doEffects(gladiator){
    for (let effect in gladiator.effectToDo) {
        let num = gladiator.effectToDo[effect];
        switch (effect) {
          case "hitDamage":
            gladiator.hits -= gladiator.effectToDo[effect];
            break;
          case "moraleDamage":
            gladiator.morale -= gladiator.effectToDo[effect];
            break;
        }
      }
      // clearing out effects.
      gladiator.effectToDo = {};
}

rtnGlad.addEffect = function (gladiator,effectName, effectStr) {
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