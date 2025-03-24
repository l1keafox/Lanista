const { calcEffect, calcWin } = require("../AbilityParts");
// insult wins against other morale
// wins hard against defensive.
// Biggest danger of the highest Morale Damage is that it will be the best against both dodge and other taunt.
const Insult = () => {
  const ability = {
    abilityName: "Insult",
    type: "clash",
    category: "morale",
    effect: {
      taunting: {
        target: "caster",
        reducer: ["hitChance"],
        bravery: 60,
        charisma: 50,
        wisdom: 10,
      },
    },
    winStats: {
      target: "caster",
      effect: "taunting",
    },
  };
  return { ...calcEffect(ability), ...calcWin(ability), ...ability };
};

module.exports = Insult;
