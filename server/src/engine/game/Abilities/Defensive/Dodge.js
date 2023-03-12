const {calcEffect,calcWin} = require("../AbilityParts");
// wins against offensive hit.
// loses against block.

const Dodge = ()=>{
  const state = {
     abilityName : "dodge",
     type : "clash",
     category: "defensive",
     effect : {
        reduce:{
         target:"caster",
         reducer:['Chance'],
         agility:60,
         bravery:30,
         reputation:30
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
