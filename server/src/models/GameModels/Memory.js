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
        win:{
            type:Number
        },
        loss:{
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