/*

This looks at the store.json to figure out when things will be sold.

It will reference the type : item, structure or ...


*/
const storeObj = require("./store.json");

function getStoreItems() {
  return storeObj;
}

module.exports = { getStoreItems };