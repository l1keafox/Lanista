module.exports = {
    abilityName: "Heal",
    type:"react",
    maxCooldown:4,
    cooldown:0,
    resultWanted:'lose',
    doClash(caster, target) {
      if (caster.clashResult === this.resultWanted) {
        console.log(`   ${caster.name}-> DOING HEALING! because : ${caster.clashResult}`, caster.hits);
        caster.hits++;
        this.cooldown = this.maxCooldown;
        return {name:this.abilityName, effect:"hits: +1" }
      }
    }
  };
  