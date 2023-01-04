/*


Due to abilities been a bit more complex than items, we will do an abilities folder, 


*/

const abilityObj = {
    // Now this one should maybe do 
    stab:require("./abilities/stab"),
};

function getAbilityEffect(itemName) {
  return itemObj[itemName];
}

module.exports = { getAbilityEffect };
