const { Schema, model } = require("mongoose");

// This is what is saved in the database, all the parts that are used in battle .

const saveDuelModel = new Schema(
	{
        // Game Stats
		gladiatorOne:{
            type: Schema.Types.ObjectId,
            ref: "gladiator"
        },
        gladiatorTwo:{
            type: Schema.Types.ObjectId,
            ref: "gladiator"
        },
        duel:{ // The string of the duel.
            type:String
        },
        createdAt:{  // based off of getTime() this will determine when this stuff gets deleted.
            type: Number
        }
	},
);


const saveDuel = model("saveDuel", saveDuelModel);

module.exports = saveDuel;