const {calcEffect,calcWin} = require("../AbilityParts");
// wins against defensive.
const Stab = ()=>{
  const state = {
     abilityName : "stab",
     type : "clash",
     category: "offensive",
     effect : {
      hitDamage:{
        target:"target",
        strength: 30,
        agility:30,
        luck:10
      },
      hitChance:{
        target:"target",
        dexterity:100,
        wisdom:20,
        luck:10
      }
    },
     winStats:{
       target:"target",
       effect:"hitDamage"
     }
  };
  return { ...calcEffect(state),...calcWin(state),...state }
}

module.exports = Stab;