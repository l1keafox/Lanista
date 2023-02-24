const { Schema, model } = require("mongoose");
const RankEntry = require('./RankEntry')
// This is what is saved in the database, all the parts that are used in battle .

const rankListModal = new Schema(
	{
        // Game Stats
      name:{
        type: String
      },
      ranking:[
        RankEntry
      ]
	},
);


const rankList = model("rankList", rankListModal);

module.exports = rankList