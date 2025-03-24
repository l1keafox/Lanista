const GameDate = require("./GameModels/GameDate");
const User = require("./User");
const Feedback = require("./Feedback");
const Owner = require("./GameModels/Owner");
const Gladiator = require("./GameModels/Gladiator");
const saveDuel = require("./GameModels/saveDuel");
const Memory = require("./GameModels/Memory");
const RankEntry = require("./GameModels/RankEntry");
const RankList = require("./GameModels/RankList");
const saveTournament = require("./GameModels/saveTournament");

module.exports = {
  GameDate,
  User,
  Owner,
  Gladiator,
  saveDuel,
  Memory,
  saveTournament,
  Feedback,
  RankEntry,
  RankList,
};
