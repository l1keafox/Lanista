const {calcEffect,calcWin} = require("../AbilityParts");
// insult wins against other morale
// wins hard against defensive.
const Insult = ()=>{
  const ability = {
     abilityName : "Insult",
     type : "clash",
     effect : {
      taunting:{
        target:"caster",
        reducer:['hitChance','hitDamage'],
        sensitivity: 50,
        reputation: 50,
        bravery: 20,
        luck: 10,
      },
   },
     winStats:{
       target:"caster",
       effect:"taunting"
     }
  };
  return { ...calcEffect(ability),...calcWin(ability),...ability }
}

module.exports = Insult;
