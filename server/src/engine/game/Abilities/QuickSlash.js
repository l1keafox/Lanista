module.exports = {
    abilityName: "QuickSlash",
    type:"prepare",
    maxCoolDown:5,
    forClash(caster, target) {
      // This does need aff effects.
      console.log(`  -> Prepaire quickClash`, target.morale);
      if (target.morale < 25) {
        console.log("      ->DID QSlash");
        target.hitPoints -= 3;
        this.cooldown = this.maxCooldown;
      }
    }
  };
  
  