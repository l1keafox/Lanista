const {calcAbility,calcWin} = require("./AbilityParts");

const Dodge = ()=>{
  const state = {
     abilityName : "dodge",
     type : "clash",
     ability : {
       dodgeChance:{
         targetEffect:"missChance",
         target:"caster",
         agility:100,
         sensitivity:15,
         luck:15
       }
     },
     winCondition:{
       target:"casterChar",
       effect:"missChance"
     }
  };
  console.log(calcAbility, require("./AbilityParts"));
  return { ...calcAbility(state),...calcWin(state) }
}
console.log('hehrere?',Dodge)

module.export = Dodge();
