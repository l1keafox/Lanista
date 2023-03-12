// Slash currently has 150 Modifity to damage and
// 100 modifier to dodge.

const {calcEffect,calcWin} = require("../AbilityParts");
// Wins against offensive
const Slash = ()=>{
  const state = {
     abilityName : "smash",
     type : "clash",
     category: "offensive",
     effect : {
      hitDamage:{
        target:"target",
        strength: 60,
        wisdom:60
      },
      hitChance:{
        target:"target",
        dexterity:25,
        sensitivity:55
      }
    },
     winStats:{
       target:"target",
       effect:"hitDamage"
     }
  };
  return { ...calcEffect(state),...calcWin(state),...state }
}

module.exports = Slash;