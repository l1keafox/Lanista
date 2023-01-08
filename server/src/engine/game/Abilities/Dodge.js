module.exports = {
    abilityName: "dodge",
    type:"clash",
    doAbility(casterChar, target) {
      console.log(
        this.abilityName,
        "   ->So this ability needs to cancel out damage"
      );
      casterChar.addEffect("missChance", 50);
    },
  
    winCondition(casterChar, target) {
      let points = 0;
      let targetChar = target;
      if (casterChar.effectToDo.damageTake) {
        console.log("  winner Dodge!");
        points = 5;
        casterChar.effectToDo.damageTake = 0;
      }
  
      return points;
    },
  };
  