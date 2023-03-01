const {calcEffect,calcWin} = require("../AbilityParts");
// provoke wins against Offensive.
const Provoke = ()=>{
  const ability = {
     abilityName : "Provoke",
     type : "clash",
     effect : {
      taunting:{
        target:"caster",
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
