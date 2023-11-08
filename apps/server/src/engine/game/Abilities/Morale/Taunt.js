  const {calcEffect,calcWin} = require("../AbilityParts");
// Wins against Defensive.
  const Taunt = ()=>{
    const ability = {
       abilityName : "taunt",
       type : "clash",
       category: "morale",
       effect : {
        taunting:{
          target:"caster",
          reducer:['hitDamage'],
          sensitivity: 40,
          reputation: 40,
          agility:20
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
  