// Slash currently has 150 Modifity to damage and
// 100 modifier to dodge.

const {calcEffect,calcWin} = require("../AbilityParts");
// wins against morale
const Slash = ()=>{
  const state = {
     abilityName : "slash",
     type : "clash",
     effect : {
      hitDamage:{
        target:"target",
        strength: 50,
        dexterity:30,
        intelligence:10,
        luck:10
      },
      hitChance:{
        target:"target",
        dexterity:50,
        wisdom:25,
        intelligence:10,
        luck:15
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