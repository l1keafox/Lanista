const { Schema, model } = require("mongoose");

// Memories hold saved characters based on there level.
// level 3 or below shouldn't exist, so I'll leave to be.
//336 days in a year
const MemoriesModel = new Schema(
	{
        4:[], // 16
        5:[], // 32
        6:[], // 64
        7:[], // 128
        8:[], // 256
        9:[], // 512
        10:[], // 1024
        11:[], // 2048
        12:[], // 4096
        13:[], // 8192
        14:[], // 16384
        15:[], // 32768
        16:[], // 65536
        17:[], // 131072
        18:[], // 262144
        19:[], // 524288
        20:[], // 1048576
	},
);


const Memories = model("memories", MemoriesModel);

module.exports = Memories;