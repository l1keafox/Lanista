module.exports = {
    abilityName: "backStab",
    type:"react",
    maxCoolDown:7,
    resultWanted:'win',
    //abilityWanted:'dodge',
    effectWanted:'missChance',
    doClash(caster, target) {
        console.log(' BACK STAB ',caster.effectToDo );
      if (caster.clashResult === this.resultWanted  && caster.effectToDo.missChance ) {
        
        console.log(`   ${caster.name}-> DOING BACK STAB! because : ${caster.clashResult}`, caster.hits);
        //caster.hits++;
        target.hits -= 10;
        this.cooldown = this.maxCooldown;
        return {react:this.abilityName, effect:"hits: -10" }
      }
    }
  };
  