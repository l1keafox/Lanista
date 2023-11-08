const {calcEffect,calcWin} = require("../AbilityParts");
// This needs to win against morale attacks - will reduce taunting/reflect
// but lose against other defensive - so has high stamina when time End. 
// anmd win against weak hit - has week miss chance
const Feint= ()=>{
  const state = {
     abilityName : "Feint",
     type : "clash",
     category: "defensive",
     effect : {
        reduce:{
         target:"caster",
         reducer:['taunting'],
         intelligence:60,
         reputation:60
       }
     },
     winStats:{
       target:"target",
       effect:"reduce"
     }
  };
  return { ...calcEffect(state),...calcWin(state),...state }
}

module.exports = Feint;
