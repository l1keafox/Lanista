/*


Due to items mostly jsut referencing a slot and ability, they should be just an index here no require outside.


So far items have:
Slot = with one type in it, but we'll have to decide if there can be weapons that can be held in both hands later - maybe a slot called "duel" that can handle it.
Abilities = this is an array that will give abilities too gladiators not the only way to gain them.

:{
  description:
  slot:
  abilities:[],
  stats:
}

*/

const itemObj = {
    shortSword:{
      slot:"main",
      abilities:["slash"],
    },
    dagger:{
      description:"short range weapon, but gives backstab react ability that will reward big wins",
      slot: "main",
      abilities: ["stab","backstab"],
      stats:{
          "agility":10,
          "strength":-5
      },
    }
};

function getItemEffect(itemName) {
  return itemObj[itemName];
}

function getAllItems() {
  return itemObj;
}

module.exports = { getItemEffect, getAllItems };
