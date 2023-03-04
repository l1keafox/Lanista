const {calcEffect,calcWin} = require("../AbilityParts");
// provoke wins against Offensive.
// Currently it loses against hitChance
// so it'll 'win' against high damage.
const Provoke = ()=>{
  const ability = {
     abilityName : "Provoke",
     type : "clash",
     category: "morale",
     effect : {
      taunting:{
        reducer:['reverse'], // removes from morale damage this amount. 
        // If one of with reverse, became still wins against defensive.
        charisma: 40,
        reputation:40        
      },
   },
     winStats:{
       target:"caster",
       effect:"taunting"
     }
  };
  return { ...calcEffect(ability),...calcWin(ability),...ability }
}

module.exports = Provoke;
