const { Schema, model } = require("mongoose");
const Owner = require('./Owner');

const gladiatorSchema = new Schema(
	{
        name:{
            type:String
        },
        hits:{
            type:Number
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"Owner"
        },
        schedule:[],

	},
);


const Gladiator = model("gladiator", gladiatorSchema);

module.exports = Gladiator;