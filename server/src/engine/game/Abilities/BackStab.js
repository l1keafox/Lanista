module.exports = {
    abilityName: "backStab",
    type:"react",
    cooldown:0,
    maxCooldown:7,
    resultWanted:'win',
    abilityWanted:'dodge',
    //effectWanted:'missChance',
    doClash(caster, target) {
//        console.log(' BACK STAB wants to win a dodge clash.',caster.effectToDo );
      if (caster.clashResult === this.resultWanted  && caster.clashAbility === "dodge" ) {
        
        //caster.hits++;
        target.hits -= 10;
        this.cooldown = this.maxCooldown;
        console.log(`   ${caster.name}-> DOING BACK STAB! because : ${caster.clashResult} CD:${this.maxCooldown}`, caster.hits);
        return {name:this.abilityName, effect:"hits: -10" }
      }
    }
  };
  