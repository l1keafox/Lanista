/*


Due to abilities been a bit more complex than items, we will do an abilities folder,


*/
const path = require("path");
console.log(__dirname);
const abilityObj = {
    // Now this one should maybe do 
    // Prepare abilities
    heal: require(path.join(__dirname, "/src/engine/game/abilities/Heal") ),


    // Clash Abilities
    // slash: require("./Slash.js"),
    // dodge: require("./abilities/Dodge"),
    // taunt: require("./abilities/Taunt"),
    // stab: require("./abilities/Stab"),
    // kick: require("./abilities/Kick"),


    // // React abilities.
    // heal: require("./abilities/Heal"),
    // backstab: require("./abilities/backstab"),
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