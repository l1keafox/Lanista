const db = require("../src/config/connection");
const { GameDate } = require("./../src/models");

db.once("open", async () => {
	try {
		await GameDate.deleteMany({});
        await GameDate.create({day:1,month:1,year:1,time:1  } );
		console.log(" Restting Date");
		console.log("all done!");
		process.exit(0);
	} catch (err) {
		throw err;
	}
});
