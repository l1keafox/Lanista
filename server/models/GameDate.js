const { Schema, model } = require("mongoose");

const gameDateSchema = new Schema(
	{
		day: {
			type: Number,
		},
		month: {
			type: Number,
		},
		year: {
			type: Number,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

gameDateSchema.methods.addDay = async function () {
	// Ideally we have it here, so that the actual server updates.
};

const GameDate = model("gamedate", gameDateSchema);

module.exports = GameDate;
