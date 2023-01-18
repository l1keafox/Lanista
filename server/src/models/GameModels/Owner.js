const { Schema, model } = require("mongoose");
const User = require('./../User');
const Gladiator = require('./Gladiator');
const saveDuel = require('./saveDuel');
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
        learning:[],
		gladiators:[      {
            type: Schema.Types.ObjectId,
            ref: "gladiator"
          }],
        inventory:[],
        history:[{
            type: Schema.Types.ObjectId,
            ref: "gladiator"
          }],
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
        if(getStructureEffect(struct).training){
            return getStructureEffect(struct).training;
        } 
    } ).filter((notUndefined) => notUndefined !== undefined);
    this.training = this.training.flat();
    await this.save();
    return this.training;
}
ownerSchema.methods.getLearning = async function() {
    // This will look at structures available and update learning array and return that.
    this.learning = this.structures.map( struct =>{
        if(getStructureEffect(struct).learning){
            return getStructureEffect(struct).learning;
        } 
    } ).filter((notUndefined) => notUndefined !== undefined);
    this.learning = this.learning.flat();
    await this.save();
    return this.learning;
}

const Owner = model("owner", ownerSchema);

module.exports = Owner;
