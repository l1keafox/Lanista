const { Schema, model } = require("mongoose");
const User = require('./../User');
const Gladiator = require('./../User');

const ownerSchema = new Schema(
	{
		userAcct:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        gold:{
            type: Number,
        },
        structures:[],
		gladiators:[],
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);


const Owner = model("owner", ownerSchema);

module.exports = Owner;
