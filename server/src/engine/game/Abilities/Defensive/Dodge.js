const {calcEffect,calcWin} = require("../AbilityParts");
// wins against offensive hit.
// loses against block.

const Dodge = ()=>{
  const state = {
     abilityName : "dodge",
     type : "clash",
     effect : {
        reduce:{
         target:"caster",
         reducer:['Chance'],
         agility:70,
         sensitivity:15,
         luck:15
       }
     },
     winStats:{
       target:"casterChar",
       effect:"reduce"
     }
  };
  return { ...calcEffect(state),...calcWin(state),...state }
}

module.exports = Dodge;
