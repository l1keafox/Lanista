// Slash currently has 150 Modifity to damage and
// 100 modifier to dodge.

const { calcEffect, calcWin } = require("../AbilityParts");
// wins against morale
const Slash = () => {
  const state = {
    abilityName: "slash",
    type: "clash",
    category: "offensive",
    effect: {
      hitDamage: {
        target: "target",
        strength: 50,
        intelligence: 50,
      },
      hitChance: {
        target: "target",
        dexterity: 50,
        charisma: 50,
      },
    },
    winStats: {
      target: "target",
      effect: "hitDamage",
    },
  };
  return { ...calcEffect(state), ...calcWin(state), ...state };
};

module.exports = Slash;
