/*


Due to abilities been a bit more complex than items, we will do an abilities folder,


*/
const path = require("path");
console.log(__dirname);
const abilityObj = {
    // Now this one should maybe do 
    // Prepare abilities
    // heal: require(path.join(__dirname, "@/src/engine/game/abilities/Heal") ),


    // Clash Abilities
    slash: require(__dirname+"/Abilities/Slash"),
    dodge: require("./Abilities/Dodge"),
    taunt: require("./Abilities/Taunt"),
    stab: require("./Abilities/Stab"),
    kick: require("./Abilities/Kick"),


    // React abilities.
    heal: require("./Abilities/Heal"),
    backstab: require("./Abilities/BackStab"),
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