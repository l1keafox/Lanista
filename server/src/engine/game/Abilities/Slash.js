module.exports = {
  abilityName: "swing",
  type:"clash",
  description:"",
  doAbility(casterChar, target) {
    console.log("  -Swng>This ability needs to do damage.");
    // Strength and agility should do the damage.
    target.addEffect("hitDamage", 50);
    target.addEffect("hitChance",50);// Dodge is based on this.
  },

  winCondition(casterChar, target) {
    let points = 0;
    // What I do not like about this, is that we have it setup based on
    // That it is looking for the dodge here. It should be just looking for damage.

    if (target.effectToDo.damageTake && !target.effectToDo.dodge) {
      console.log("  winner Attack!");
      points = 100;
    }
    return points;
  },
};
