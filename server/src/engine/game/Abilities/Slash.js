const Clash = require("./Clash");
class Swing extends Clash {
    constructor() {
      super();
      this.abilityName = "Swing";
    }
    doAbility(casterChar, target) {
      console.log(this.abilityName, "   ->This ability needs to do damage.");
      // So we should do damage here.
      target.addEffect("damageTake", 5);
    }
  
    winCondition(casterChar, target) {
      let points = 0;
      if (target.effectToDo.damageTake && !target.effectToDo.dodge) {
        console.log("  winner Attack!");
        points = 100;
      }
      return points;
    }
  }

module.exports = Swing;