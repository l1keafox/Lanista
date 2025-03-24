const db = require("../src/config/connection");
const {
  User,
  GameDate,
  Owner,
  Gladiator,
  saveDuel,
  Memory,
  saveTournament,
} = require("./../src/models");
const seedAcct = require("./../src/engine/game/SeedAccount");

db.once("open", async () => {
  try {
    console.log("Starting Database ReFRESH:");
    console.log("  > GameDate");
    await GameDate.deleteMany({});
    await GameDate.create({ day: 1, month: 1, year: 100, time: 1, weekDay: 1 });

    console.log("  > Deleting saved Tournament");
    await saveTournament.deleteMany({});
    console.log("  > Deleting saved Duels");
    await saveDuel.deleteMany({});
    console.log("  > Deleting saved Memories");
    await Memory.deleteMany({});
    console.log("  > Deleting Existing Users");
    await User.deleteMany({});
    let users = await User.create(require("./userSeeds.json"));

    console.log("  > Deleteing All Owner");
    await Owner.deleteMany({});
    console.log("  > Deleteing All Gladiator");
    await Gladiator.deleteMany({});

    console.log("  > Creating Seed Acct");
    await seedAcct();
    console.log("all done!");
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
