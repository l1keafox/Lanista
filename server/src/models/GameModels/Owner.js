const { Schema, model } = require("mongoose");
const User = require('./../User');
const Gladiator = require('./Gladiator');
const {getStructureEffect} = require("./../../engine/game/structureIndex");

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
		gladiators:[      {
            type: Schema.Types.ObjectId,
            ref: "gladiator"
          }],
        inventory:[],
        history:[],
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

ownerSchema.methods.getTraining = async function() {
    // This will look at structures available and update training array and return that.
    this.training = this.structures.map( struct =>{
        return getStructureEffect(struct).training;
    } );
    this.training = this.training.flat();
    await this.save();
    return this.training;
}

const Owner = model("owner", ownerSchema);

module.exports = Owner;
