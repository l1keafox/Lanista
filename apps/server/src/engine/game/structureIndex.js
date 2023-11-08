/*

Structures will provide upgrades, starting with the basic school that will provide the starting training options.

*/

// const structureObj = require("./structure.json");
const structureObj = require("./../../../assets/json/structure.json");
function getStructureEffect(itemName) {
  return structureObj[itemName];
}

module.exports = { getStructureEffect };
