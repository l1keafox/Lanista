/*


Due to abilities been a bit more complex than items, we will do an abilities folder,


*/

const abilityObj = {
    // Now this one should maybe do 
    slash: require("./abilities/Slash"),
    dodge: require("./abilities/Dodge"),
    taunt: require("./abilities/Taunt"),
    quickSlash: require("./abilities/quickSlash"),
    heal: require("./abilities/Heal"),

    // stab: require("./abilities/stab"),
    // backstab: require("./abilities/backstab"),
};

function getAbilityEffect(skillName) {
  return abilityObj[skillName];
}

module.exports = { getAbilityEffect };