const { Schema } = require("mongoose");

// This is what is saved in the database, all the parts that are used in battle .

const rankEntryModel = new Schema({
  // Game Stats
  gladiatorId: {
    type: Schema.Types.ObjectId,
    ref: "gladiator",
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "owner",
  },
  comment: {
    // The string of the duel.
    type: String,
  },
  points: {
    // based off of getTime() this will determine when this stuff gets deleted.
    type: Number,
  },
});

module.exports = rankEntryModel;
