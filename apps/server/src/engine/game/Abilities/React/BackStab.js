// const {modStat4Effect} = require('../../utils');
// module.exports = {
//     abilityName: "backStab",
//     type:"react",
//     cooldown:0,
//     maxCooldown:7,
//     resultWanted:'win',
//     abilityWanted:'dodge',
//     //effectWanted:'reduceHit',
//     doReact(caster, target) {
// //        console.log(' BACK STAB wants to win a dodge clash.',caster.effectToDo );
//       if (caster.clashResult === this.resultWanted  && caster.clashAbility === "dodge" ) {
        
//         //caster.hits++;
//         const dodgeChance = modStat4Effect(caster.abilityMix({"dexterity":30,"agility":30,"sensitivity":30,"luck":15}),10);
//         target.hits -= dodgeChance;
//         this.cooldown = this.maxCooldown;
// //        console.log(`   ${caster.name}-> DOING BACK STAB! because : ${caster.clashResult} CD:${this.maxCooldown}`, caster.hits);
//         return {name:this.abilityName, effect:`hits: -${dodgeChance}` }
//       }
//     }
//   };
  
const {calcEffect,calcWin} = require("../AbilityParts");
// wins against morale
// Loses against offensive.
// wins against dodge and block.
const BackStab= ()=>{
  const state = {
     abilityName : "BackStab",
     type : "react",
     cooldown:0,
     maxCooldown:7,
     resultWanted:'win',
     abilityWanted:'dodge',
    //  categoryWanted:'defensive',
     effect : {
      dodgeChance:{
         target:"caster",
         dexterity:30,
         agility:30,
         sensitivity:30,
         luck:15
       }
     },
     winStats:{
       target:"casterChar",
       effect:"taunting"
     }
  };
  return { ...calcReact(state),...calcWin(state),...state }
}

module.exports = BackStab;
