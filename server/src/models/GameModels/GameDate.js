const { Schema, model } = require("mongoose");

const gameDateSchema = new Schema(
	{
		time:{
			type: Number,
		},
		day: {
			type: Number,
		},
		weekDay:{
			type: String,
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

gameDateSchema.methods.addTick = async function () {
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
		this.weekDay++;
		if(this.weekDay > 7){
			this.weekDay = 1;
		}
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
gameDateSchema.methods.addDay = async function () {
	// This happens on the seventh of every day.,
	//this.time++;
//	if(this.time > 8 ) {
		this.time = 1;
		this.day++;
		this.weekDay++;
		if(this.weekDay > 7){
			this.weekDay = 1;
		}
//	}
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
