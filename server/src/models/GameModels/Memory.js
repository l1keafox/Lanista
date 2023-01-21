const { Schema, model } = require("mongoose");


// Memories are saved gladiators to be used later in battle.
// the memory string is what will be created back into an gladiator game object to be played against.


const MemorySchema = new Schema(
	{
        name:{
            type:String
        },
        age:{ 
            type:Number
        },
        level:{ 
            type:Number
        },
        
        winRecord:{
            type:Number
        },
        lossRecord:{
            type:Number
        },
        weekWin:{
            type:Number
        },
        monthWin:{
            type:Number
        },
        quarterWin:{
            type:Number
        },
        yearWin:{
            type:Number
        },

        gladiatorID:{
            type:String
        },
        ownerID:{
            type:String
        },
        memory:{
            type:String
        }
	},
);



const Memory = model("memory", MemorySchema);

module.exports = Memory;