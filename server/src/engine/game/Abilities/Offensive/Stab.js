const { calcEffect, calcWin } = require("../AbilityParts");
// wins against defensive.
const Stab = () => {
  const state = {
    abilityName: "stab",
    type: "clash",
    category: "offensive",
    effect: {
      hitDamage: {
        target: "target",
        agility: 60,
        strength: 20,
      },
      hitChance: {
        target: "target",
        dexterity: 90,
        intelligence: 15,
        wisdom: 15,
      },
    },
    winStats: {
      target: "target",
      effect: "hitDamage",
    },
  };
  return { ...calcEffect(state), ...calcWin(state), ...state };
};

module.exports = Stab;
