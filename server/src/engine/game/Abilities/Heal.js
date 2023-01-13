module.exports = {
    abilityName: "Heal",
    type:"react",
    maxCoolDown:4,
    resultWanted:'lose',
    doClash(caster, target) {
      if (caster.clashResult === this.resultWanted) {
        console.log(`   ${caster.name}-> DOING HEALING! because : ${caster.clashResult}`, caster.hits);
        caster.hits++;
        this.cooldown = this.maxCooldown;
      }
    }
  };
  