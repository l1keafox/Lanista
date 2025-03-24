const SHOWBATTLE = false;
const {
  doEffects,
  compareEffects,
  addEffect,
} = require("./Abilities/abilityEffects");
const { saveDuel } = require("./../../models");

async function returnPreparedGladiator(gladiator) {
  // gladiator prep stuff.

  gladiator.getClash = function () {
    return gladiator.clash[Math.floor(Math.random() * gladiator.clash.length)];
  };
  gladiator.doAction = function (Ability, targetChar) {
    if (SHOWBATTLE)
      console.log(
        "  =EN/DUEL/ATTK>",
        Ability.abilityName,
        this.name,
        "is the character attacking doing effect",

        "too target",
        targetChar.name,
      );
    return Ability.doAbility(this, targetChar);
  };
  gladiator.abilityMix = function (statObj) {
    // input is
    // num is an whole num * .01;
    // { "stat":num, }
    let total = 0;
    for (let stat in statObj) {
      if (statObj[stat] > 1) {
        statObj[stat] = statObj[stat] * 0.01;
      }
      total += this[stat] * [statObj[stat]];
    }
    return total;
  };

  gladiator.addEffect = function (effectName, effectStr) {
    addEffect(this, effectName, effectStr);
  };
  gladiator.endOfRound = function () {
    for (let aReaction of this.react) {
      if (aReaction.cooldown) {
        aReaction.cooldown--;
      }
    }
    for (let thisGuy of this.prepare) {
      if (thisGuy.cooldown) thisGuy.cooldown--;
    }
  };
  gladiator.clashPrepare = function (target) {
    for (let aPrepare of this.prepare) {
      if (aPrepare.cooldown) continue;
      aPrepare.doPrepare(this, target);
    }
  };

  gladiator.clashReact = function (target) {
    if (SHOWBATTLE)
      console.log(
        "  -En/DUEL>getting clashReSULt for,",
        this.name,
        "is",
        this.clashResult,
        "abilityWanted:",
        this.clashAbility,
        "Is effects",
        this.effectToDo,
      );
    for (let aReaction of this.react) {
      if (aReaction.cooldown) {
        continue;
      }
      return aReaction.doReact(this, target);
    }
  };
  return gladiator;
}

class Clash {
  battle(oneChar, twoChar) {
    // Clash Arrays
    // This will return a clash type instead of array
    const oneClash = oneChar.getClash();
    const twoClash = twoChar.getClash();
    oneChar.clashAbility = oneClash.abilityName;
    twoChar.clashAbility = twoClash.abilityName;
    // Do action and get results
    const oneEffect = oneChar.doAction(oneClash, twoChar);
    const twoEffect = twoChar.doAction(twoClash, oneChar);

    const EventResults = {};
    // Here we need to cancel out effects based on actions
    // dodge cancels out damage
    compareEffects(oneChar, twoChar);
    compareEffects(twoChar, oneChar);

    // Determine win condidtion

    const oneWinPoints = oneClash.winCondition(oneChar, twoChar); // win condidtions also do the effects too.
    const twoWinPoints = twoClash.winCondition(twoChar, oneChar); // win condidtions also do the effects too.

    // Determine winner
    const difference = Math.abs(oneWinPoints - twoWinPoints);

    let tieLine = (oneWinPoints + twoWinPoints) * 0.5 * 0.1;
    //console.log(`  =>${oneChar.name}: ${oneWinPoints}, ${twoChar.name}: ${twoWinPoints} =  ${difference} TIELINE:${tieLine}`);
    if (difference < tieLine) {
      EventResults.clashWinner = null; // tie
    } else if (oneWinPoints > twoWinPoints) {
      EventResults.clashWinner = oneChar;
      EventResults.clashLoser = twoChar;
    } else {
      EventResults.clashWinner = twoChar;
      EventResults.clashLoser = oneChar;
    }
    // if(EventResults.clashWinner){
    // 	console.log(`  -EN/DUEL>Winner is: ${EventResults.clashWinner.name} w/ ${oneClash.abilityName}, Loser is : ${EventResults.clashLoser.name} w ${twoClash.abilityName}`)
    // } else {
    // 	console.log(`  -EN/DUEL>TIE is: ${oneChar.name} w/ ${oneClash.abilityName}, TIE is : ${twoChar.name} w ${twoClash.abilityName}`)
    // }
    EventResults.report = {};
    EventResults.report[oneChar.name] = {
      // "winPoints": oneWinPoints,
      a: oneClash.abilityName,
      e: oneEffect,
    };
    EventResults.report[twoChar.name] = {
      // "winPoints": twoWinPoints,
      a: twoClash.abilityName,
      e: twoEffect,
    };

    return EventResults;
  }
}

function startReport(one, two) {
  let newReport = {};

  // So to start with structure of the report is as followed:

  // Key - glad name and assocated Id
  newReport.k = {
    1: {
      n: one.name,
      m: one.memory ? true : undefined,
      hp: one.maxHits,
      mp: one.maxMorale,
      sp: one.maxStamina,
      id: one._id,
    },
    2: {
      n: two.name,
      m: two.memory ? true : undefined,
      hp: two.maxHits,
      mp: two.maxMorale,
      sp: two.maxStamina,
      id: two._id,
    },
  };

  one.keyId = 1;
  two.keyId = 2;
  return newReport;
}

async function doDuel(one, two) {
  // Import things to note - we need it recorded so we can send it back to the users.
  // So, let's take the glads and rebuild the game object for a one time use.
  // Most things should return a report? Or should we pass the report to it so it can use it?
  const startOfTick = new Date();
  let report = startReport(one, two);

  let gladOne = await returnPreparedGladiator(one);
  let gladTwo = await returnPreparedGladiator(two);
  if (gladOne.name == gladTwo.name) {
    gladOne.name = gladOne.name + " 1";
    gladTwo.name = gladTwo.name + " 2";
  }

  //console.log("  -EN/Duel> ", gladOne.name, "Vs", gladTwo.name);

  let roundCnt = 0;
  do {
    if (SHOWBATTLE) console.log("NEW ROUND -------------------------------");
    let roundReport = {};
    roundReport[gladOne.keyId] = {};
    roundReport[gladTwo.keyId] = {};
    
    roundCnt++;
    if (SHOWBATTLE)
      console.log(
        `  -EN/Duel>___________________________PRE:${roundCnt}_________________________________`,
      );
    // Do prepare
    gladOne.clashPrepare(gladTwo);
    gladTwo.clashPrepare(gladOne);

    // We do effects twice, once before the clash clears it out.
    // Do we compare effects again here? in general prepare shouldn't be about
    // doding, and if it is, it's more enhancing existing clash abilities.
    // doEffects(gladOne);
    // doEffects(gladTwo);

    if (SHOWBATTLE)
      console.log(
        `  -EN/Duel>___________________________CLASH:${roundCnt}_______________________________`,
      );
    // doClash clash returns result
    let thisClash = new Clash().battle(gladOne, gladTwo);
    if (SHOWBATTLE)
      console.log(
        `  -EN/Duel>___________________________REACT:${roundCnt}_______________________________`,
      );

    roundReport[gladOne.keyId].c = thisClash.report[gladOne.name];
    roundReport[gladTwo.keyId].c = thisClash.report[gladTwo.name];
    // Do  react
    if (!thisClash.clashWinner) {
      if (SHOWBATTLE) console.log("  -EN/Duel>   TIE");
      roundReport[gladOne.keyId].react = gladOne.clashReact(gladTwo);
      roundReport[gladTwo.keyId].react = gladTwo.clashReact(gladOne);
      roundReport.R = { r: "t" };
    } else {
      roundReport[thisClash.clashWinner.keyId].react =
        thisClash.clashWinner.clashReact(thisClash.clashLoser);
      roundReport[thisClash.clashLoser.keyId].react =
        thisClash.clashLoser.clashReact(thisClash.clashWinner);

      roundReport.R = {
        r: "w",
        w: thisClash.clashWinner.keyId,
      };
    }

    // Do effects after the clash and before end of round.
    const reportEffectOne = doEffects(gladOne);
    const reportEffectTwo = doEffects(gladTwo);
    roundReport[gladOne.keyId].e = reportEffectOne;
    roundReport[gladTwo.keyId].e = reportEffectTwo;
    // Do end of round cooldown reduction, and resets skills if needed.
    gladOne.endOfRound(); //
    gladTwo.endOfRound(); //

    if (SHOWBATTLE)
      console.log(`  -EN/Duel> ${gladOne.name}     vs     ${gladTwo.name}`);
    if (SHOWBATTLE)
      console.log(
        "  -EN/Duel> HP:",
        gladOne.hits,
        "/",
        gladOne.maxHits + "    HP:" + gladTwo.hits,
        "/",
        gladTwo.maxHits,
      );
    if (SHOWBATTLE)
      console.log(
        "  -EN/Duel> Morale:",
        gladOne.morale + "     Morale:" + gladTwo.morale,
      );

    report[roundCnt] = roundReport;
  } while (
    gladOne.hits > 0 &&
    gladTwo.hits > 0 &&
    gladOne.stamina > 0 &&
    gladTwo.stamina > 0 &&
    gladOne.morale > 0 &&
    gladTwo.morale > 0
  );

  report.k.rC = roundCnt;

  const oneDead =
    gladOne.hits <= 0 || gladOne.morale <= 0 || gladOne.stamina <= 0;
  const twoDead =
    gladTwo.hits <= 0 || gladTwo.morale <= 0 || gladTwo.stamina <= 0;

  if (oneDead && twoDead) {
    report.k.w = null;
  } else if (oneDead) {
    report.k.w = gladTwo.keyId;
  } else if (twoDead) {
    report.k.w = gladOne.keyId;
  }

  //console.log(`  -EN> Game DUEL : ${gladOne.name} Vs ${gladTwo.name} TIME: ${new Date() - startOfTick}ms Winner:${report.f.winner} `);
  return report;
}

function parseDuel(report) {
  return {
    gladiatorOne: report.k[1].id,
    gladiatorTwo: report.k[2].id,
    duel: JSON.stringify(report),
    createdAt: new Date(),
  };
}

async function parseAndSaveDuel(report) {
  const savedDuel = await new saveDuel(parseDuel(report));
  await savedDuel.save();
  return savedDuel;
}

module.exports = { doDuel, parseDuel, parseAndSaveDuel };
