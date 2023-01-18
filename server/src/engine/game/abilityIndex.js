/*


Due to abilities been a bit more complex than items, we will do an abilities folder,


*/

const abilityObj = {
    // Now this one should maybe do 
    // Prepare abilities
    heal: require("./abilities/Heal"),


    // Clash Abilities
    slash: require("./abilities/Slash"),
    dodge: require("./abilities/Dodge"),
    taunt: require("./abilities/Taunt"),
    stab: require("./abilities/stab"),


    // React abilities.
    heal: require("./abilities/Heal"),
    backstab: require("./abilities/backstab"),
};

function getAbilityEffect(skillName) {
  return abilityObj[skillName];
}
async function doLearn(gladiator,skillName){
  const learnSkill = abilityObj[skillName];
  if(learnSkill){
    console.log(gladiator.name,"learning",skillName,learnSkill.learnSpeed,gladiator.learnSkill,gladiator.taskSkill,gladiator.progressSkill);
  }
  await gladiator.save();
}

module.exports = { getAbilityEffect ,doLearn };