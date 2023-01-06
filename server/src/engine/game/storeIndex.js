/*

This looks at the store.json to figure out when things will be sold.

It will reference the type : item, structure or ...


*/
const itemObj = require("./items.json");
const structureObj = require("./structure.json");
const storeObj = require("./store.json");

function getStoreCosts(itemName) {
  
}

function getStoreItems(){
    
    return storeObj;
}

module.exports = { getStoreCosts,getStoreItems };
