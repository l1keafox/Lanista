const {calcEffect,calcWin} = require("../AbilityParts");
// wins against morale
// Loses against offensive.
// wins against dodge and block.
const Feint= ()=>{
  const state = {
     abilityName : "Feint",
     type : "clash",
     effect : {
        taunting:{
         target:"caster",
         dexterity:40,
         reputation:25,
         intelligence:25
       }
     },
     winStats:{
       target:"casterChar",
       effect:"taunting"
     }
  };
  return { ...calcEffect(state),...calcWin(state),...state }
}

module.exports = Feint;
