module.exports = {
    abilityName: "dodge",
    type:"clash",
    doAbility(casterChar, target) {
      console.log("  -Dodge>ERROR.");
      target.addEffect("damageTake", 5);
    },
  
    winCondition(casterChar, target) {
      let points = 0;
      if (target.effectToDo.damageTake && !target.effectToDo.dodge) {
        console.log("  winner Attack!");
        points = 100;
      }
      return points;
    },
  };
  