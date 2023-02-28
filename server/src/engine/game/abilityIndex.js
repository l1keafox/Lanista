/*


Due to abilities been a bit more complex than items, we will do an abilities folder,


*/
const abilityObj = {
    // Now this one should maybe do 
    // Prepare abilities
    // heal: require(path.join(__dirname, "@/src/engine/game/abilities/Heal") ),


    // Clash Abilities
    
    slash: require("./Abilities/Slash"),
    dodge: require("./Abilities/dodge"),
    taunt: require("./Abilities/Taunt"),
    stab: require("./Abilities/Stab"),
    
    kick: require("./Abilities/Kick"),

    // React abilities.
    heal: require("./Abilities/Heal"),
    backstab: require("./Abilities/BackStab"),
};

function getAbilityEffect(skillName) {
  // Create an new object this might be memory intensive?
  console.log( require("./Abilities/NewDodge2.js") );
  const ability = abilityObj[skillName];
  if(skillName == "dodge"){
    console.log(skillName,abilityObj[skillName]);
  }
  return ability;
}
async function doLearn(gladiator,skillName){
  const learnSkill = abilityObj[skillName];
  if(learnSkill){
    console.log(gladiator.name,"learning",skillName,learnSkill.learnSpeed,gladiator.learnSkill,gladiator.taskSkill,gladiator.progressSkill);
  }
  await gladiator.save();
}

module.exports = { getAbilityEffect ,doLearn };