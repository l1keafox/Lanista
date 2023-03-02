/*


Due to items mostly just referencing a slot and ability, they should be just an index here no require outside.

So far items have:
Slot = with one type in it, but we'll have to decide if there can be weapons that can be held in both hands later - maybe a slot called "duel" that can handle it.
Abilities = this is an array that will give abilities too gladiators not the only way to gain them.

:{
  description:
  slot:
  abilities:[],
  stats:
}

Should Items have tiers? The item would have the same skills, but as it as higher tier, the costs go up and the bonus effect?
Maybe just three tiers
Bronze/Iron/Steel 
So right now, I don't think I'll do tiers on weapons, but items cannot be unequipped, once on a char it's 'lost'

*/

const itemObj = require("../../../assets/json/items.json");

function getItemEffect(itemName) {
  return itemObj[itemName];
}

function getAllItems() {
  return itemObj;
}

module.exports = { getItemEffect, getAllItems };
