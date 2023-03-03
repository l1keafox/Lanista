
function addToEffect(targetObj, amount){
    if(!targetObj && targetObj != 0){
        targetObj = 0;
    }
    targetObj -=amount;
    return targetObj;
}

function compareEffects(caster,target){
    // console.log(caster.effectToDo.reduce,target.effectToDo.reduce)
    // console.log(caster.name, caster.effectToDo, target.effectToDo)
    for(let effect in caster.effectToDo){
        switch(effect){
            case 'reduce':
                for(let i in caster.effectToDo.reducer){
                    let tgtReduce;
                     if(caster.effectToDo.reducer[i] == "taunting") {
                        // This is taunting - which it reduces taunt
                        tgtReduce = caster.effectToDo.reducer[i] // this should be "taunting"

                        if(target.effectToDo.taunting) { // if target is taunting.
                                addEffect(target,"staminaDamage", caster.effectToDo.reduce)

                                if(target.effectToDo.taunting){
                                    target.effectToDo.taunting -= caster.effectToDo.reduce
                                    if(target.effectToDo.taunting<0 ) target.effectToDo.taunting = 0;
                                } 
                                if(caster.effectToDo.moraleDamage){
                                    caster.effectToDo.moraleDamage -= caster.effectToDo.reduce;
                                    if (!caster.effectToDo.moraleDamage) caster.effectToDo.moraleDamage = 0;
                                }
                                console.log("MOR",caster.effectToDo.moraleDamage,target.effectToDo.moraleDamage)
                                console.log("MOR",caster.effectToDo.taunting,target.effectToDo.taunting)

                        }
    
                    } else {
                        if(caster.effectToDo.reducer[i] != "taunting"){
                        
                            tgtReduce = "hit"+caster.effectToDo.reducer[i]
                                // caster.effectToDo[tgtReduce]  -= caster.effectToDo.reduce;
                            addEffect(caster,tgtReduce, target.effectToDo.reduce,true)
        
                        }                         
                    }                    

                    //console.log(tgtReduce,caster.effectToDo[tgtReduce] , caster.effectToDo.reduce);
                    // if(caster.effectToDo[tgtReduce] -= caster.effectToDo.reduce)
                }
                if( target.effectToDo.reduce ){
                    // Then both of them just set reduceHit to 0;
                    // they both get drained of stamina by dodging when nothing is there.
                    // console.log("WHY NOT?",target.effectToDo.reduce,caster.effectToDo.reduce)
                    target.effectToDo.staminaDamage = target.effectToDo.reduce;
                    caster.effectToDo.staminaDamage = caster.effectToDo.reduce;
    
                    target.effectToDo.reduce = 0;
                    caster.effectToDo.reduce = 0;
                }

            break;

            case "taunting":
                // If taunter this glad, is taking damage, then taunting is set to 0.


                // Reducer for taunting is something that reduces the taunting level. If it's damage or hit chance.
                for(let reduce in caster.effectToDo.reducer){
                    
                     if( caster.effectToDo[caster.effectToDo.reducer[reduce]] && caster.effectToDo.taunting ){
                         caster.effectToDo.taunting -= caster.effectToDo[caster.effectToDo.reducer[reduce]];
                     }
                 } 

                 // If playing against an reduce, 
                 // This is where morale damage is triggered.
                if(target.effectToDo.reduce) {
                    // target.effectToDo.reduce = 0; 
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
            if(num){
                switch (effect) {
                    case "hitDamage":
                        if(caster.effectToDo.hitChance && num){
                            caster.hits -= num;
                            if(!effectReport.dmg) effectReport.dmg = {};
                            effectReport.dmg.h = num;
                        }
                        break;
                    case "moraleDamage":
                        console.log(caster.morale)
                        if(num){
                            caster.morale -= num;
                            if(!effectReport.dmg) effectReport.dmg = {};
                            effectReport.dmg.m = num
                        }
                        console.log(num,caster.morale);
                        break;
                    case "staminaDamage":
                        if(num){
                            caster.stamina -= num
                            if(!effectReport.dmg) effectReport.dmg = {};
                            effectReport.dmg.s = num
                        }
                        break;
                }
            }
          }
          // clearing out effects.
          caster.effectToDo = {};
          effectReport.pt = {
            h: caster.hits,
            m: caster.morale,
            s: caster.stamina
          }
          return effectReport;
    }
    
    function addEffect(caster,effectName, effectStr,negitive) {
        if (!caster.effectToDo) {
            caster.effectToDo = {};
        }
        if(effectName == "reducer"){
            caster.effectToDo[effectName] = effectStr;
            return;
        }
        effectStr = parseInt(effectStr)
        if(effectStr < 0 ) effectStr = 0
        if (caster.effectToDo[effectName]) {
            if(effectStr){
                if(negitive){
                    caster.effectToDo[effectName] -= effectStr;
                } else {
                    caster.effectToDo[effectName] += effectStr;
                }
            } else if( effectStr === null ){
                caster.effectToDo[effectName] = 0;
            }
        } else {
            if(!negitive){
                caster.effectToDo[effectName] = effectStr;
            } else {
               // caster.effectToDo[effectName] = effectStr;
            }
        }
      }

    module.exports = {addEffect, doEffects , compareEffects };