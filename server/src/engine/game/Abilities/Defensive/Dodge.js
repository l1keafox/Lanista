const {calcEffect,calcWin} = require("../AbilityParts");
// wins against offensive hit.
// loses against block.

const Dodge = ()=>{
  const state = {
     abilityName : "Dodge",
     type : "clash",
     effect : {
        missChance:{
         target:"caster",
         agility:100,
         sensitivity:15,
         luck:15
       }
     },
     winStats:{
       target:"casterChar",
       effect:"missChance"
     }
  };
  return { ...calcEffect(state),...calcWin(state),...state }
}

module.exports = Dodge;
