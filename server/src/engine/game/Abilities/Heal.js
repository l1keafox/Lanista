module.exports = {
    abilityName: "Heal",
    type:"react",
    maxCoolDown:4,
    resultWanted:'lose',
    doClash(result, caster, target) {
      if (this.resultWanted === result) {
        console.log(`   ${caster.name}-> DOING HEALING!`, caster.hitPoints);
        caster.hitPoints++;
        this.cooldown = this.maxCooldown;
      }
    }
  };
  