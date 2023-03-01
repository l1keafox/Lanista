  const {calcEffect,calcWin} = require("../AbilityParts");
// Wins against Defensive.
  const Taunt = ()=>{
    const ability = {
       abilityName : "taunt",
       type : "clash",
       effect : {
        taunting:{
          target:"caster",
          charisma: 50,
          reducer:['hitDamage'],
          reputation:50
        },
     },
       winStats:{
         target:"caster",
         effect:"taunting"
       }
    };
    return { ...calcEffect(ability),...calcWin(ability),...ability }
  }
  
  module.exports = Taunt;
  