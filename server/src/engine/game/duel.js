const { getAbilityEffect } = require("./abilityIndex");
const { getItemEffect } = require("./itemsIndex");

function clashPrepare(user,target) {
    // for (let aPrepare of user.prepArray) {
    //   if (aPrepare.cooldown) continue;
    //   aPrepare.forClash(user, target);
    // }
  }
  function clashReact(clashResult,user,target) {
    // console.log("getting clashReSULt for,", this.name, "is", clashResult);
    // for (let aReaction of this.reactArray) {
    //   if (aReaction.cooldown) continue;
    //   aReaction.doClash(clashResult, this, opponant);
    // }
  }
  function endOfRound() {
    // for (let aReaction of this.reactArray) {
    //   if (aReaction.cooldown) aReaction.cooldown--;
    // }
    // for (let thisGuy of this.prepArray) {
    //   if (thisGuy.cooldown) thisGuy.cooldown--;
    // }
  }

  class Clash {
    battle(oneChar, twoChar) {
      // Clash Arrays
      // This will return a clash type instead of array
      const oneClash = oneChar.getClash();
      const twoClash = twoChar.getClash();
        console.log(oneClash.abilityName,twoClash.abilityName);
      // Do action and get results
       oneChar.doAction(oneClash, twoChar);
       twoChar.doAction(twoClash, oneChar);

      const EventResults = {};
  
      // Determine win condidtion
      const oneWinPoints = oneClash.winCondition(oneChar, twoChar); // win condidtions also do the effects too.
      const twoWinPoints = twoClash.winCondition(twoChar, oneChar); // win condidtions also do the effects too.


      // Determine winner
       const difference = Math.abs(oneWinPoints - twoWinPoints);
  
       console.log("  =>1:", oneWinPoints, "2:", twoWinPoints, difference);
      if (difference < 20) {
        EventResults.clashWinner = null; // tie
      } else if (oneWinPoints > twoWinPoints) {
        EventResults.clashWinner = oneChar;
        EventResults.clashLoser = twoChar;
      } else {
        EventResults.clashWinner = twoChar;
        EventResults.clashLoser = oneChar;
      }
      
      // Do effects
       twoChar.doEffects();
       oneChar.doEffects();
      return EventResults;
    }
  }

  function returnPreparedGladiator(gladiator){
    let rtnGlad ={};
    rtnGlad.maxHits = gladiator.hits;
    rtnGlad.maxMana = gladiator.mana;
    rtnGlad.maxMorale = gladiator.morale;
    rtnGlad.hits = gladiator.hits
    rtnGlad.mana = gladiator.mana
    rtnGlad.morale = gladiator.morale
    rtnGlad.strength  = gladiator.strength
    rtnGlad.dexterity  = gladiator.dexterity
    rtnGlad.agility  = gladiator.agility
    rtnGlad.constitution  = gladiator.constitution
    rtnGlad.vitality  = gladiator.vitality
    rtnGlad.intelligence  = gladiator.intelligence
    rtnGlad.wisdom  = gladiator.wisdom
    rtnGlad.bravery  = gladiator.bravery
    rtnGlad.piety  = gladiator.piety
    rtnGlad.sensitivity  = gladiator.sensitivity
    rtnGlad.charisma  = gladiator.charisma
    rtnGlad.luck  = gladiator.luck
    rtnGlad.name  = gladiator.name
    rtnGlad._id  = gladiator._id
    // need to create clash array;
    // need to create max hits/mana/morale
    rtnGlad.prepare = gladiator.prepare.map(skill => getAbilityEffect(skill) )
    rtnGlad.react = gladiator.react.map(skill => getAbilityEffect(skill) )

    gladiator.setSkills();

    rtnGlad.clash = gladiator.abilities.concat( gladiator.skills ).map(skill => {
        const effect = getAbilityEffect(skill);
        if(effect.type === 'clash'){
            return effect;
        }
    }).filter(notUndefined => notUndefined !== undefined) ;

    rtnGlad.getClash = function (){
        return rtnGlad.clash [ Math.floor(Math.random()* rtnGlad.clash.length ) ];
    };
    rtnGlad.doAction = function(Ability, targetChar) {
        console.log("  =EN/DUEL/ATTK>",
          this.name,
          "is the character attacking doing effect",
          Ability.abilityName,
          "too target",
          targetChar.name
        );
        Ability.doAbility(this, targetChar);
      }
    
      rtnGlad.addEffect = function (effectName, effectStr) {
        if (!this.effectToDo) {
          this.effectToDo = {};
        }
        if (this.effectToDo[effectName]) {
          this.effectToDo[effectName] += effectStr;
        } else {
          this.effectToDo[effectName] = effectStr;
        }
      }
      rtnGlad.doEffects  = function() {
        // This is called after the clash to see what changes in this charater.
        for (let effect in this.effectToDo) {
          let num = this.effectToDo[effect];
          switch (effect) {
            case "takeDamage":
            case "damageTake":
              this.hitPoints -= this.effectToDo[effect];
              break;
            case "taunted":
              this.morale -= this.effectToDo[effect];
              break;
          }
        }
        this.effectToDo = {};
      }
      rtnGlad.endOfRound =function() {
        for (let aReaction of this.react) {
          if (aReaction.cooldown) aReaction.cooldown--;
        }
        for (let thisGuy of this.prepare) {
          if (thisGuy.cooldown) thisGuy.cooldown--;
        }
      }
      rtnGlad.clashPrepare = function (opponant) {
        for (let aPrepare of this.prepare) {
          if (aPrepare.cooldown) continue;
          aPrepare.forClash(this, opponant);
        }
      }
    
      rtnGlad.clashReact = function (clashResult, opponant) {
        console.log("getting clashReSULt for,", this.name, "is", clashResult);
        for (let aReaction of this.react) {
          if (aReaction.cooldown) continue;
          aReaction.doClash(clashResult, this, opponant);
        }
      }
    return rtnGlad;
  }

async function doDuel(one,two){

    // Import things to note - we need it recorded so we can send it back to the users.
    // So, let's take the glads and rebuild the game object for a one time use. 
    let gladOne = returnPreparedGladiator(one);
    let gladTwo = returnPreparedGladiator(two);
    console.log("  -EN/Duel> ",gladOne.name,gladTwo.name);

let roundCnt = 0;
do{
    roundCnt++;
    console.log(`  -EN/Duel>___________________________PRE:${roundCnt}_________________________________`);
    // Do prepare
    gladOne.clashPrepare(gladTwo);
    gladTwo.clashPrepare(gladOne);
    console.log(`  -EN/Duel>___________________________CLASH:${roundCnt}_______________________________`);
    // doClash clash returns result 
    let thisClash = new Clash().battle(gladOne, gladTwo);
    console.log(`  -EN/Duel>___________________________REACT:${roundCnt}_______________________________`);


    // Do  react
if (!thisClash.clashWinner) {
    console.log("TIE");
    gladOne.clashReact('tie', gladTwo);
    gladTwo.clashReact('tie', gladOne);
  } else {
    thisClash.clashWinner.clashReact('win', thisClash.clashLoser);
    thisClash.clashLoser.clashReact('lose', thisClash.clashWinner);
  }

    // see if it's tie, 
    // if it's not then do winner loser reacts


    // Do end of round cooldown reduction
    gladOne.endOfRound(); //
    gladTwo.endOfRound(); //


    
}while(1==2)
console.log('finished');
// while(gladOne.hitPoints > 0 &&
//     gladTwo.hitPoints > 0 &&
//     gladOne.morale > 0 &&
//     gladTwo.morale > 0)
}

module.exports = {doDuel}