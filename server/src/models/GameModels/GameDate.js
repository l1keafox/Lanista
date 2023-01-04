const { Schema, model } = require("mongoose");

const gameDateSchema = new Schema(
	{
		time:{
			type: Number,
		},
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

gameDateSchema.methods.addTime = async function () {
	// Ideally we have it here, so that the actual server updates.
	// 30 days in a month
	// 12 months in a year
	// each day currently is setup 
	// const numEventsPerDay = 8;
	// const secsPerEvents = 28;
	this.time++;
	if(this.time > 8 ) {
		this.time = 1;
		this.day++;
	}
	if(this.day > 28){
		this.day = 1;
		this.month++;
	}
	if(this.month > 12){
		this.month = 1;
		this.year++;
	}

	this.save();
	return true;
};

const GameDate = model("gamedate", gameDateSchema);

module.exports = GameDate;
