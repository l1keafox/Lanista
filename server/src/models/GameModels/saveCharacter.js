const { Schema, model } = require("mongoose");

// This is what is saved in the database, all the parts that are used in battle .

const savedCharacterSchema = new Schema(
	{
        // Game Stats
        name:{
            type:String
        },
        abilities:[]
	},
);


const savedCharacter = model("savedCharacter", savedCharacterSchema);

module.exports = savedCharacter;