/*


Due to abilities been a bit more complex than items, we will do an abilities folder,


*/
const abilityObj = {
  // Now this one should maybe do
  // Prepare abilities
  // heal: require(path.join(__dirname, "@/src/engine/game/abilities/Heal") ),

  // Prepare abilities
  heal: require("./Abilities/Prepare/Heal"),

  // Clash Abilities
  slash: require("./Abilities/Offensive/Slash"),
  stab: require("./Abilities/Offensive/Stab"),
  smash: require("./Abilities/Offensive/Smash"),

  dodge: require("./Abilities/Defensive/Dodge"),
  block: require("./Abilities/Defensive/Block"),
  feint: require("./Abilities/Defensive/Feint"),

  taunt: require("./Abilities/Morale/Taunt"),
  provoke: require("./Abilities/Morale/Provoke"),
  insult: require("./Abilities/Morale/Insult"),

  kick: require("./Abilities/WorkInProgress/Kick"),

  // React abilities.
  backstab: require("./Abilities/React/BackStab"),
};

function getAbilityEffect(skillName) {
  // Create an new object this might be memory intensive?
  if (!skillName) {
    //  console.log(" ERR OR undefined skillname:",skillName);
    return;
  }
  skillName = skillName.toLowerCase();

  if (!abilityObj[skillName]) {
    console.log(" BADABADSD", skillName);
    return;
  }
  // console.log(abilityObj[skillName]().doAbility());
  return abilityObj[skillName]();
}
async function doLearn(gladiator, skillName) {
  const learnSkill = abilityObj[skillName];
  if (learnSkill) {
    console.log(
      gladiator.name,
      "learning",
      skillName,
      learnSkill.learnSpeed,
      gladiator.learnSkill,
      gladiator.taskSkill,
      gladiator.progressSkill,
    );
  }
  await gladiator.save();
}

module.exports = { getAbilityEffect, doLearn };
