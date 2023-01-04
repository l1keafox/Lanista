const { Schema, model } = require("mongoose");
const User = require('./../User');
const Gladiator = require('./Gladiator');

const ownerSchema = new Schema(
	{
		userAcct:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        gold:{
            type: Number,
        },
        fame:{
            type: Number,
        },
        structures:[],
        training:[],
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
