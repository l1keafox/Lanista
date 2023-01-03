const db = require("../src/config/connection");
const { User, GameDate,Owner } = require("./../src/models");

db.once("open", async () => {
	try {
		console.log("Starting Restart:");
		console.log("  > GameDate");
		await GameDate.deleteMany({});
        await GameDate.create({day:1,month:1,year:1,time:1  } );

		console.log("  > User");
		await User.deleteMany({});
		let users = await User.create(  require('./userSeeds.json') );

		console.log("  > Owner Deleteing all");
		await Owner.deleteMany({});

		console.log("all done!");
		process.exit(0);
	} catch (err) {
		throw err;
	}
});
