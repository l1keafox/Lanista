const { doGrowth } = require("./../trainingEffects");
const { saveModelMemory } = require("./../gladiatorPrep");
const { User, Owner, Gladiator } = require("./../../../models");
const { createNewOwner, createNewGladiator } = require("./../utils");

function doGladTraining(allGladiators,doTicks){
  let weekDay = 1;
  let dateTime = 1;

  return new Promise(async (resolve, reject) => {
    console.log(`  -SEED> ${doTicks} Growth End`);

    if (allGladiators.length === 0) resolve("this");
    for (let t = 0; t < doTicks; t++) {
      dateTime++;
      if (dateTime > 8) {
        dateTime = 1;
        weekDay++;
        if (weekDay > 7) {
          weekDay = 1;
        }
      }
  
      //                console.log(dateTime,weekDay);
      await allGladiators.forEach(async (gladiator) => {
        if (weekDay === 7) {
          gladiator.age++;
          gladiator.doLevel();
          //                        console.log(gladiator);
          await saveModelMemory(gladiator);
        } else {
          const growth = await doGrowth(
            gladiator, // This is the glad
            gladiator.schedule[0][weekDay][dateTime] // This is the growth.
          );
        }
  
        if (dateTime === 8) {
          gladiator.age++;
          gladiator.doLevel();
        }
      });
      if (weekDay == 7) {
        weekDay = 1;
      }
    }
    resolve("this");
  })
}

async function createNumGlads(gladAmount,newOwner){
  let allGladiators = [];
	for (let i = 0; i < gladAmount; i++) {
		const glad = await new Gladiator(createNewGladiator("default"));
		glad.calcuateGladiator();
		glad.ownerId = newOwner._id;
		glad.seed = true;
		newOwner.gladiators.push(glad.id);
    allGladiators.push(glad)
	}
  return allGladiators;
}

module.exports = {doGladTraining,createNumGlads};