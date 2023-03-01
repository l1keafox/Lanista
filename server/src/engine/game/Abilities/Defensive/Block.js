const {calcEffect,calcWin} = require("../AbilityParts");
// wins against defensive.
// loses to morale
// redude damage instead of hits.
const Block = ()=>{
  const state = {
     abilityName : "Block",
     type : "clash",
     effect : {
        reduce:{
          target:"caster",
          reducer:['Damage'],
          strength:30,
          bravery: 30,
          luck:10
        },
     },
     winStats:{
       target:"casterChar",
       effect:"reduce"
     }
  };
  return { ...calcEffect(state),...calcWin(state),...state }
}

module.exports =  Block;
