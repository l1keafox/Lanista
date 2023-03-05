// Slash currently has 150 Modifity to damage and
// 100 modifier to dodge.

const {calcEffect,calcWin} = require("../AbilityParts");
// Wins against offensive
const Slash = ()=>{
  const state = {
     abilityName : "slash",
     type : "clash",
     category: "offensive",
     effect : {
      hitDamage:{
        target:"target",
        strength: 90,
        dexterity:30,
        intelligence:20,
        luck:10
      },
      hitChance:{
        target:"target",
        dexterity:25,
        sensitivity:20,
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

module.exports = Slash;