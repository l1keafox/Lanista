const { calcEffect, calcWin } = require("../AbilityParts");
// wins against defensive.
// loses to morale
// redude damage instead of hits.
const Block = () => {
  const state = {
    abilityName: "block",
    type: "clash",
    category: "defensive",
    effect: {
      reduce: {
        target: "caster",
        reducer: ["Damage"],
        wisdom: 40,
        bravery: 40,
      },
    },
    winStats: {
      target: "casterChar",
      effect: "reduce",
    },
  };
  return { ...calcEffect(state), ...calcWin(state), ...state };
};

module.exports = Block;
