module.exports = {
    abilityName: "Heal",
    type:"react",
    maxCoolDown:4,
    resultWanted:'lose',
    doClash(caster, target) {
      if (caster.clashResult === resultWanted) {
        console.log(`   ${caster.name}-> DOING HEALING!`, caster.hitPoints);
        caster.hitPoints++;
        this.cooldown = this.maxCooldown;
      }
    }
  };
  