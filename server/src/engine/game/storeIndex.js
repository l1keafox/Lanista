/*

This looks at the store.json to figure out when things will be sold.

It will reference the type : item, structure or ...


*/
// const itemObj = require("../../../assets/json/items.json");
// const structureObj = require("./../../../assets/json/structure.json");
const storeObj = require("./store.json");

function getStoreItems() {
  return storeObj;
}

module.exports = { getStoreItems };
