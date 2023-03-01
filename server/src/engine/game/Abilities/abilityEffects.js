

function compareEffects(caster,target){
    //    console.log(`  ->B4 ${caster.name}`,caster.effectToDo);
        for(let effect in caster.effectToDo){
        switch(effect){
            case 'reduce':
                
                for(let i in caster.effectToDo.reducer){
                    let tgtReduce;
                    if(caster.effectToDo.reducer[i] != "taunting"){
                        tgtReduce = "hit"+caster.effectToDo.reducer[i]
                    } else {
                        tgtReduce = caster.effectToDo.reducer[i]
                    }
                    if(caster.effectToDo[tgtReduce] ){
                        caster.effectToDo[tgtReduce]  -= caster.effectToDo.reduce;
                    }
                    //console.log(tgtReduce,caster.effectToDo[tgtReduce] , caster.effectToDo.reduce);
                    // if(caster.effectToDo[tgtReduce] -= caster.effectToDo.reduce)
                }
                if( target.effectToDo.reduce ){
                    // Then both of them just set reduceHit to 0;
                    // they both get drained of stamina by dodging when nothing is there.
                    target.effectToDo.staminaDamage = target.effectToDo.reduce;
                    caster.effectToDo.staminaDamage = caster.effectToDo.reduce;
    
                    target.effectToDo.reduce = 0;
                    caster.effectToDo.reduce = 0;
                }

            break;

            case "taunting":
                // If taunter this glad, is taking damage, then taunting is set to 0.
                for(let reduce in caster.effectToDo.reducer){
                    if( caster.effectToDo[caster.effectToDo.reducer[reduce]] && caster.effectToDo.taunting ){
                        caster.effectToDo.taunting -= caster.effectToDo[caster.effectToDo.reducer[reduce]];
                    }
                 } 

                if(target.effectToDo.reduce) {
                    target.effectToDo.reduce = 0;
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