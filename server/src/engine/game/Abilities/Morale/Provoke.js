const { calcEffect, calcWin } = require("../AbilityParts");
// provoke wins against Offensive.
// This is the one that wins against attacks, but loses against other taunt and wins less against
// so it'll 'win' against high damage.

const Provoke = () => {
  const ability = {
    abilityName: "Provoke",
    type: "clash",
    category: "morale",
    effect: {
      taunting: {
        reducer: ["reverse"],
        // If one of with reverse, became still wins against defensive.
        sensitivity: 40,
        charisma: 30,
        agility: 20,
      },
    },
    winStats: {
      target: "caster",
      effect: "taunting",
    },
  };
  return { ...calcEffect(ability), ...calcWin(ability), ...ability };
};

module.exports = Provoke;
