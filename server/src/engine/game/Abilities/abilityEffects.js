function compareEffects(caster,target){
    //    console.log(`  ->B4 ${caster.name}`,caster.effectToDo);
        for(let effect in caster.effectToDo){
        switch(effect){
            case 'reduceDamage':
                if(caster.effectToDo.hitDamage){
                    caster.effectToDo.hitDamage -= caster.effectToDo.reduceDamage;
                }



                break;
            case 'missChance':
    
                // If target is hitting this glad.
                if(caster.effectToDo.hitChance){
                    caster.effectToDo.hitChance -= caster.effectToDo.missChance;
                }
    
                // If dodge is sucessful 
                if(caster.effectToDo.hitChance <= 0 && caster.effectToDo.hitDamage){
                    // hit damage is 0, and target(person who did the swing), get stamina damage
                    // console.log(caster.effectToDo.hitDamage,caster.agility * 0.01)
                    // Damage is 150 multiplier
                    // agility should be 100 
                    target.effectToDo.staminaDamage = caster.effectToDo.hitDamage - (caster.agility*0.01);
                    caster.effectToDo.hitDamage = 0;
                }
                if( caster.effectToDo.reduceDamage && target.effectToDo.missChance){
                    target.effectToDo.staminaDamage = target.effectToDo.missChance;
                    caster.effectToDo.missChance = 0;
                }
                // If they are both dodging
                if( target.effectToDo.missChance  ){
                    // Then both of them just set missChance to 0;
                    // they both get drained of stamina by dodging when nothing is there.
                    target.effectToDo.staminaDamage = target.effectToDo.missChance;
                    caster.effectToDo.staminaDamage = caster.effectToDo.missChance;
    
                    target.effectToDo.missChance = 0;
                    caster.effectToDo.missChance = 0;
                }
            break;
            case "taunting":
                // If taunter this glad, is taking damage, then taunting is set to 0.
                if( caster.effectToDo.hitDamage && caster.effectToDo.taunting ){
                    caster.effectToDo.taunting -= caster.effectToDo.hitDamage;
                 } 
                 if(caster.effectToDo.reduceDamage){
                    target.effectToDo.reduceDamage = 0;
                    target.effectToDo.moraleDamage = caster.effectToDo.taunting;
                 }
                // If this glad is taunting and the other target is dodging 
                if(target.effectToDo.missChance) {
                    target.effectToDo.missChance = 0;
                    target.effectToDo.moraleDamage = caster.effectToDo.taunting;
                }
    
                // If target is taunting.
                if(target.effectToDo.taunting){
                    // So if both are taunting.
                    // then we will compare both and 
                    // If target taunting is greater than glad taunting.
                    if(target.effectToDo.taunting > caster.effectToDo.taunting){
                        caster.effectToDo.moraleDamage = target.effectToDo.taunting - caster.effectToDo.taunting
                    } else {
                        target.effectToDo.moraleDamage = caster.effectToDo.taunting - target.effectToDo.taunting
                    } 
                    target.effectToDo.taunting = 0;
                    caster.effectToDo.taunting = 0;
                }
                break;
        }
    }
    
    }
    
    function doEffects(caster){
        let effectReport = {
        };
        for (let effect in caster.effectToDo) {
            let num = Math.round( caster.effectToDo[effect] );
            switch (effect) {
                case "hitDamage":
                    caster.hits -= num;
                    if(!effectReport.dmg) effectReport.dmg = {};
                    effectReport.dmg.h = num;
                    break;
                case "moraleDamage":
                    caster.morale -= num;
                    if(!effectReport.dmg) effectReport.dmg = {};
                    effectReport.dmg.m = num
                    break;
                case "staminaDamage":
                    caster.stamina -= num
                    if(!effectReport.dmg) effectReport.dmg = {};
                    effectReport.dmg.s = num
                    break;
            }
          }
          // clearing out effects.
          caster.effectToDo = {};
          effectReport.pt = {
            h: caster.hits,
            m: caster.morale,
            s: caster.stamina
          }
        //   effectReport.hp = ;
        //   effectReport.mp = ;
        //   effectReport.sp = ;
          return effectReport;
    }
    
    function addEffect(caster,effectName, effectStr) {
        if (!caster.effectToDo) {
            caster.effectToDo = {};
        }
        if (caster.effectToDo[effectName]) {
            if(effectStr){
                caster.effectToDo[effectName] += effectStr;
            } else if( effectStr === null ){
                caster.effectToDo[effectName] = 0;
            }
        } else {
            caster.effectToDo[effectName] = effectStr;
        }
      }
    
    module.exports = {addEffect, doEffects , compareEffects };