// Slash currently has 150 Modifity to damage and
// 100 modifier to dodge.

const {calcEffect,calcWin} = require("../AbilityParts");

const Kick = ()=>{
  const state = {
     abilityName : "kick",
     type : "clash",
     effect : {
      hitDamage:{
        target:"target",
        strength: 30,
        dexterity: 30,
        agility:10,
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

module.exports = Kick;