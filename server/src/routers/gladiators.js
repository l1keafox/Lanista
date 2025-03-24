const express = require("express");
const {
  Gladiator,
  saveDuel,
  Memory,
  saveTournament,
} = require("../models");
const { getAbilityEffect } = require("./../engine/game/abilityIndex");
const { doDuel, parseAndSaveDuel } = require("../engine/game/duel");
const {
  prepMemoryForFight,
  prepModelForFight,
  getMemoryGroup,
} = require("./../engine/game/gladiatorPrep");

const router = express.Router();

router.get("/gladiator/:gladiatorId", async (req, res) => {
  if (req.params.gladiatorId == "undefined") {
    res.status(400);
    return;
  }

  let gladiator = await Gladiator.findById(req.params.gladiatorId);
  res.send(gladiator);
});
router.get("/gladiator/enable/:gladiatorId/:state", async (req, res) => {
  if (req.params.gladiatorId == "undefined") {
    res.status(400);
    return;
  }
  let gladiator = await Gladiator.findById(req.params.gladiatorId);
  gladiator.isEnabled = req.params.state;
  console.log("   ->GLADIATOR BEING ENABLED!", gladiator.isEnabled);
  await gladiator.save();
  res.send(gladiator);
});

router.post("/gladiator/updateEquipment", async (req, res) => {
  if (req.body.id == "undefined") {
    res.status(400);
    return;
  }

  let gladiator = await Gladiator.findOne({ _id: req.body.id });
  req.body.save.forEach((item) => {
    gladiator[item.slot] = item.newEquip;
  });
  await gladiator.save();
  res.send(gladiator);
});

router.post("/gladiator/updateClash", async (req, res) => {
  if (req.body.id == "undefined") {
    res.status(400);
    return;
  }

  let gladiator = await Gladiator.findOne({ _id: req.body.id });
  // validate
  for (let slot in req.body.save) {
    if (gladiator[slot]) gladiator[slot] = req.body.save[slot];
  }
  await gladiator.save();

  res.send(true);
});

router.post("/gladiator/doSpar", async (req, res) => {
  if (
    req.body.gladatorId == "undefined" ||
    req.body.gladatorId2 == "undefined"
  ) {
    res.status(400);
    return;
  }

  let glad = await Gladiator.findOne({ _id: req.body.gladatorId });
  let glad2 = await Gladiator.findOne({ _id: req.body.gladatorId2 });
  if (glad && glad2) {
    let one = await prepModelForFight(glad);
    let two = await prepModelForFight(glad2);

    let report = await doDuel(one, two);
    await parseAndSaveDuel(report);

    res.send(report);
  } else {
    res.send({ error: "Glad/Glad2 error" });
  }
});

router.post("/gladiator/fightTarget", async (req, res) => {
  if (req.body.gladatorId == "undefined" || req.body.targetId == "undefined") {
    res.status(400);
    return;
  }

  let glad = await Gladiator.findOne({ _id: req.body.gladatorId });
  let target = await Gladiator.findOne({ _id: req.body.targetId });
  if (!target) {
    res.status(400).send("bad id sent Data");
  } else if (!glad) {
    res.status(400).send("bad Glad Data");
  }
  if (glad) {
    //const nearBy = await getMemoryGroup(glad, 2);
    //let randoMemory = nearBy[Math.floor(Math.random() & nearBy.length)];
    let one = await prepModelForFight(glad);
    let two = await prepModelForFight(target);
    let report = await doDuel(one, two);
    res.send(report);
  }
});

router.post("/gladiator/fightMemory", async (req, res) => {
  if (req.body.gladatorId == "undefined") {
    res.status(400);
    return;
  }

  let glad = await Gladiator.findOne({ _id: req.body.gladatorId });

  if (glad) {
    const nearBy = await getMemoryGroup(glad, 2);
    let randoMemory = nearBy[Math.floor(Math.random() & nearBy.length)];
    let one = await prepModelForFight(glad);
    let two;
    if (randoMemory.memory) {
      two = await prepMemoryForFight(randoMemory);
    } else {
      two = await prepModelForFight(randoMemory);
    }
    let report = await doDuel(one, two);
    res.send(report);
  }
});

router.get("/gladiator/clashInfo/:gladiatorId", async (req, res) => {
  if (req.params.gladiatorId == "undefined") {
    res.status(400);
    return;
  }

  let glad = await Gladiator.findById(req.params.gladiatorId);
  // So let's take all the skills and abilities put them in one array as unassigned
  // Then we will organize it as needed, returning an object that will hold
  glad.calcuateGladiator();

  const allAbilities = glad.skills.concat(glad.abilities);
  let rtn = {
    prepare: [],
    unPrepare: [],
    clash: [],
    react: [],
    unReact: [],
  };
  allAbilities.forEach((abi) => {
    // here we determine if it goes to the unassigned or not.
    if (!getAbilityEffect(abi)) {
      console.log(`  -> no ${abi} Availbae, needs to be added`);
    } else if (getAbilityEffect(abi).type !== "clash") {
      if (!glad[getAbilityEffect(abi).type].includes(abi)) {
        if (getAbilityEffect(abi).type === "prepare") {
          rtn.unPrepare.push(abi);
        }
        if (getAbilityEffect(abi).type === "react") {
          rtn.unReact.push(abi);
        }
      } else {
        rtn[getAbilityEffect(abi).type].push(abi);
      }
    } else {
      rtn[getAbilityEffect(abi).type].push(abi);
    }
  });
  res.send(rtn);
});

router.post("/gladiator/saveWeek", async (req, res) => {
  if (req.body.id == "undefined") {
    res.status(400);
    return;
  }
  let glad = await Gladiator.findOne({ _id: req.body.id });
  if (req.body.scheduleType == "Day") {
    req.body.week[2] = req.body.week[1];
    req.body.week[3] = req.body.week[1];
    req.body.week[4] = req.body.week[1];
    req.body.week[5] = req.body.week[1];
    req.body.week[6] = req.body.week[1];
  }
  glad.schedule = [req.body.week];
  glad.scheduleType = req.body.scheduleType;
  // So given that this is now an week array we need req.body.weekDay
  glad.save();
  console.log("  -EN> savingWeek", glad.name);
  res.send(glad);
});

router.get(
  "/gladiator/someTournaments/:gladId/:offset/:limit",
  async (req, res) => {
    if (
      req.params.gladId == "undefined" ||
      req.params.offset == "undefined" ||
      req.params.limit == "undefined"
    ) {
      res.status(400);
      return;
    }

    let mongoose = require("mongoose");
    let id = mongoose.Types.ObjectId(req.params.gladId);
    let tournaments = await saveTournament
      .find({ gladiators: { $elemMatch: { $eq: id } } })
      .populate("gladiators", ["name"])
      .populate("memories", ["name"])
      .populate("owners", ["userName"])
      .skip(req.params.offset)
      .limit(req.params.limit);
    res.send(tournaments);
  },
);

router.get(
  "/gladiator/someMemories/:gladId/:offset/:limit",
  async (req, res) => {
    if (
      req.params.gladId == "undefined" ||
      req.params.offset == "undefined" ||
      req.params.limit == "undefined"
    ) {
      res.status(400);
      return;
    }
    let memories = await Memory.find({ gladiatorId: req.params.gladId })
      .skip(req.params.offset)
      .limit(req.params.limit);
    res.send(memories);
  },
);

router.get("/gladiator/someDuels/:gladId/:offset/:limit", async (req, res) => {
  if (
    req.params.gladId == "undefined" ||
    req.params.offset == "undefined" ||
    req.params.limit == "undefined"
  ) {
    res.status(400);
    return;
  }
  let duels = await saveDuel
    .find({
      $or: [
        { gladiatorOne: req.params.gladId },
        { gladiatorTwo: req.params.gladId },
      ],
    })
    .populate("gladiatorTwo", ["name"])
    .populate("gladiatorOne", ["name"])
    .skip(req.params.offset)
    .limit(req.params.limit);

  res.send(duels);
});

router.get("/gladiator/getDuel/:duelId", async (req, res) => {
  if (req.params.duelId == "undefined") {
    res.status(400);
    return;
  }

  let duel = await saveDuel.find({ _id: req.params.duelId });
  res.send(duel);
});

router.post("/gladiator/saveLearning", async (req, res) => {
  if (req.body.id == "undefined") {
    res.status(400);
    return;
  }

  let glad = await Gladiator.findOne({ _id: req.body.id });

  glad.learnSkill = [req.body.skill];
  glad.taskSkill = [req.body.task];

  if (!glad.progressSkill) {
    let newProgressSkillObj = {};
    newProgressSkillObj[req.body.skill] = 0;
    glad.progressSkill = JSON.stringify(newProgressSkillObj);
  } else {
    let progress = JSON.parse(glad.progressSkill);
    if (progress[req.body.skill] === undefined) {
      progress[req.body.skill] = 0;
    }
    glad.progressSkill = JSON.stringify(progress);
  }

  glad.save();
  console.log("  -EN> SaveLearning", glad.name);
  res.send(glad);
});

module.exports = router;
