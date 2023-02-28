const Ability = require('./Ability.js')
console.log(Ability)
class Dodge extends Ability{
  // constructor(){
  //   this.abilityName = "dodge";
  //   this.type = "clash";
  //   this.ability = {
  //     dodgeChance:{
  //       targetEffect:"missChance",
  //       target:"caster",
  //       agility:100,
  //       sensitivity:15,
  //       luck:15 
  //     }
  //   };
  //   this.winCondition={
  //     target:"casterChar",
  //     effect:"missChance"
  //   };

  //   super()
  // }
  // doAbility(caster, target) {
  //   super.doAbility(caster,target);
  // }


  // winCondition(caster, target) {
  //   super.winCondition(caster,target)
  // }  
}

module.export = Dodge;