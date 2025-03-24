module.exports = {
  abilityName: "Heal",
  type: "react",
  maxCooldown: 4,
  cooldown: 0,
  description: "Losing a clash will gain some hits",
  resultWanted: "lose",
  learnSpeed: 0.25,
  doReact(caster, target) {
    if (caster.clashResult === this.resultWanted) {
      console.log(
        `   ${caster.name}-> DOING HEALING! because : ${caster.clashResult}`,
        caster.hits,
      );
      caster.hits++;
      this.cooldown = this.maxCooldown;
      return { name: this.abilityName, effect: "hits: +1" };
    }
  },
};
