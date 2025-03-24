const { calcWin } = require("../AbilityParts");
// wins against morale
// Loses against offensive.
// wins against dodge and block.
const BackStab = () => {
  const state = {
    abilityName: "BackStab",
    type: "react",
    cooldown: 0,
    maxCooldown: 7,
    resultWanted: "win",
    abilityWanted: "dodge",
    //  categoryWanted:'defensive',
    effect: {
      dodgeChance: {
        target: "caster",
        dexterity: 30,
        agility: 30,
        sensitivity: 30,
        luck: 15,
      },
    },
    winStats: {
      target: "casterChar",
      effect: "taunting",
    },
  };
  return { ...calcReact(state), ...calcWin(state), ...state };
};

module.exports = BackStab;