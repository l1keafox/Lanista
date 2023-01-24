const { Schema, model } = require("mongoose");

// Tournament has members and owners are references to look for in order to show users
// tournament array is made up on saveDuels.
// because gladiators and memories are different, we will need to create two for now.
// later on we'll figure out better ways.

const saveTournamentModel = new Schema(
	{
        gladiators:[
            {
                type: Schema.Types.ObjectId,
                ref: "gladiator"
            }
        ],
        memories:[
            {
                type: Schema.Types.ObjectId,
                ref: "memory"
            }
        ],
        owners:[
            {
                type: Schema.Types.ObjectId,
                ref: "owner"
            }
        ],
        tournament:{
                type: String
            },        
        createdAt:{  // based off of getTime() this will determine when this stuff gets deleted.
            type: Number
        }
	},
);


const saveTournament = model("saveTournament", saveTournamentModel);

module.exports = saveTournament;