const Swing = {
  abilityName: "swing",
  doAbility(casterChar, target) {
    console.log(this.abilityName, "   ->This ability needs to do damage.");
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

module.exports = Swing;
