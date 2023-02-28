// Slash currently has 150 Modifity to damage and
// 100 modifier to dodge.

const {calcEffect,calcWin} = require("./AbilityParts");

const Slash = ()=>{
  const state = {
     abilityName : "slash",
     type : "clash",
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
        dexterity:80,
        wisdom:10,
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