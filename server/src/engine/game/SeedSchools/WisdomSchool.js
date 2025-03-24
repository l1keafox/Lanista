/*

This is an file just created to create the base seed account. This is an special account that 
will be created first! and will acutally probably be ahead of everyone else by 1 week age wise. (6x8) ticks ahead

The base seed account will create 124 gladiators to grow and seed Memories as they grow. These Memories will be the basis of all tournaments
from here on.

*/
const { User, Owner } = require("./../../../models");
const { createNewOwner } = require("./../utils");
const { doGladTraining, createNumGlads } = require("./seedMethods");
const schoolName = "Wisdom";

function getRandomFromArray(ranArray) {
  return ranArray[randomBetween(0, ranArray.length)];
}
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeSchedule() {
  // this guy does week, random
  let base = {
    1: "run",
    2: "run",
    3: "run",
    4: "run",
    5: "lift",
    6: "hike",
    7: getRandomFromArray(["lift", "yoga", "swim", "run", "hike", "jump"]),
    8: getRandomFromArray(["lift", "yoga", "swim", "run", "hike", "jump"]),
  };

  return [
    {
      1: base,
      2: base,
      3: base,
      4: base,
      5: base,
      6: base,
    },
  ];
}
async function Seed() {
  console.log(`  -SEED> Creating seed account:${schoolName}`);
  // first we create the user account
  const newUser = await new User({
    username: `${schoolName}`,
    email: `${schoolName.toLocaleLowerCase()}@school.com`,
    password: `${schoolName}`,
  });
  console.log(`  -SEED> Creating ${schoolName} USER.`);
  const newOwner = await new Owner(createNewOwner());

  console.log("  -EN> Starting to create ", 10, " gladiators");
  let allGladiators = await createNumGlads(10, newOwner);
  console.log("  -EN> Finished creating ", allGladiators.length, " gladiators");

  // Here we should adjust their schedule.
  console.log("  -EN> Setting Schedule");
  allGladiators.forEach((glad) => {
    glad.schedule = makeSchedule();
    glad.mainHand = "mace";
    glad.offHand = getRandomFromArray([
      "mediumShield",
      "gloves",
      "largeShield",
    ]);
    glad.head = getRandomFromArray(["galea", "halfHelm", "fullHelm"]);
  });

  await doGladTraining(allGladiators, 2000);

  // Do save
  console.log(`  -SEED> Saving ${schoolName} Gladiators.`);
  await allGladiators.forEach(async (gladiator) => {
    await gladiator.save();
  });

  newOwner.userAcct = newUser._id;
  newOwner.userName = schoolName;
  newUser.ownerId = newOwner._id;

  console.log(`  -SEED> Saving ${schoolName} OWNER.`);
  await newOwner.save();
  console.log(`  -SEED> Saving ${schoolName} USER.`);
  await newUser.save();
}
module.exports = Seed;
