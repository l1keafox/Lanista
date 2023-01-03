const { Schema, model } = require("mongoose");
const User = require('./../User');

const gladiatorSchema = new Schema(
	{
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);


const Gladiator = model("gladiator", gladiatorSchema);

module.exports = Gladiator;
