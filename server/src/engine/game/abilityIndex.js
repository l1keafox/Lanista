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

module.exports = { getAbilityEffect };