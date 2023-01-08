module.exports = {
    abilityName: "taunt",
    type:"clash",
    doAbility(casterChar, target) {
      console.log(this.abilityName, "   ->This ability does no damage but....");
      casterChar.addEffect("taunt", 1);
    },
  
    winCondition(casterChar, target) {
      let points = 0;
      if (!casterChar.effectToDo.damageTake) {
        console.log("  winner taunt!");
        target.addEffect("taunted", 5);
        if (casterChar.effectToDo.taunted) {
          target.addEffect("taunted", -2);
          target.addEffect("taunted", -2);
        }
  
        points = 100;
      }
      return points;
    },
  };
  