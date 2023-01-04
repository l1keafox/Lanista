/*


Due to abilities been a bit more complex than items, we will do an abilities folder,


*/

const abilityObj = {
    // Now this one should maybe do 
    stab: require("./abilities/stab"),
    backstab: require("./abilities/backstab"),
};

function getAbilityEffect(skillName) {
  return abilityObj[skillName];
}

module.exports = { getAbilityEffect };
