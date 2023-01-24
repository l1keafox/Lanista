/*

Tournaments take two things, gladiators and Memories;

*/
const { doDuel,parseAndSaveDuel } = require("./duel");
const { prepMemoryForFight, prepModelForFight } = require("./gladiatorPrep");
const { saveTournament } = require('./../../models/');

function getRandomMemorys(memoryGroup, size) {
//	let rtnArray = [];
	memoryGroup.sort(() => Math.random() - 0.5);
	// for (let i = 0; i < size; i++) {
	// 	// Has a chance of bring in the same guy, so let's do this 
	// 	rtnArray.push(memoryGroup[Math.floor(Math.random() * memoryGroup.length)]);
	// 	rtnArray.push(memoryGroup[ Math.floor(Math.random() * memoryGroup.length) ]);

	// }
	return memoryGroup.slice(0,size);
}

async function prepGlad(glad) {
	if(!glad){
		console.log("PREP FAILED?",glad);
		return;
	};
	if (glad.memory) {
		return await prepMemoryForFight(glad);
	} else {
		return await prepModelForFight(glad);
	}
}

async function tournamentRound(group) {
	// now we should create an function that takes any number of gladiators and returns half the number after a clash.
	return new Promise(async (resolve, reject) => {
	let winnerArray = [];
	let loserArray = [];
	let duelReport = [];
	for (let i = 0; i < group.length; i += 2) {
		if (!group[i + 1]) {
			winnerArray.push(group[i]);
		} else {
            let one = await prepGlad(group[i]);
            let two = await prepGlad(group[i + 1]);
			let report = await doDuel(one,two);
			// console.log(` ${group[i].name} vs ${group[i + 1].name} : Winner: ${	report.final.winner	} ` );

			let saved = await parseAndSaveDuel(report);
			// console.log(saved.id,"Saved ID?");
			duelReport.push(saved.id);
			if (report.final.winner == group[i].name) {
                group[i].winRecord++;
                group[i+1].lossRecord++;
				winnerArray.push(group[i]);
				loserArray.push(group[i+1]);
                
			} else if (report.final.winner == group[i + 1].name) {
                group[i+1].winRecord++;
                group[i].lossRecord++;
				loserArray.push(group[i]);
				winnerArray.push(group[i + 1]);
			} else {
				// draw so.
			}
		}
	}
    //winnerArray.forEach( glad => glad.save());
	resolve ({winnerArray,loserArray,duelReport});
	});
}


async function bestOutOf3Round(group) {
	// now we should create an function that takes any number of gladiators and returns half the number after a clash.
	return new Promise(async (resolve, reject) => {
	let winnerArray = [];
	let loserArray = [];
	for (let i = 0; i < group.length; i += 2) {
		if (!group[i + 1]) {
			winnerArray.push(group[i]);
		} else {
            let one = await prepGlad(group[i]);
            let two = await prepGlad(group[i + 1]);
			let oneWins = 0;
			let twoWins = 0;

			do{
				let report = await doDuel(one,two);
//				 console.log(` ${group[i].name} vs ${group[i + 1].name} : Winner: ${	report.final.winner	} ` );
				if (report.final.winner == group[i].name) {
					group[i].winRecord++;
					group[i+1].lossRecord++;
					oneWins++;
					
				} else if (report.final.winner == group[i + 1].name) {
					group[i+1].winRecord++;
					group[i].lossRecord++;
					twoWins++;
				} else {
					// draw so.
					twoWins++;
					oneWins++;
				}
			}while(twoWins < 2 && oneWins < 2)

			if(oneWins == 2){
				winnerArray.push(group[i]);
				loserArray.push(group[i+1]);
			} else {
				loserArray.push(group[i]);
				winnerArray.push(group[i + 1]);
			}
		}
	}
    //winnerArray.forEach( glad => glad.save());
	resolve ({winnerArray,loserArray});
	});
}

async function bestOfThree(group,name){
	return new Promise(async (resolve, reject) => {
    	let roundCount = 0;
		let winnerGroup = group;
		let losersGroup = [];
		do {
        	roundCount++;
//        	console.log("  -TOURN>Start best of three Round ",roundCount,name, group.length);
			group = await bestOutOf3Round(group);

			group = group.winnerArray;
		
		} while (group.length > 1);
		resolve ({winner:group[0]});
	});
}

async function roundRobinThenBestOfThree(incomingGroup,tournyName){
	return new Promise(async (resolve, reject) =>
	 {
		const startOfTick = new Date();
		let winObj = {};
		// We need to split the big 128 peoples into smaller groups of 8
		let groups = [];
		// Group of 8 of sixteen.
		// create the groups.
		for(let i = 0; i < 8 ; i ++){
			groups.push([]);
		}
		console.log('  -EN/TOURNY/NAT>',incomingGroup.length, "Num of peeps");
		do{
			groups.sort(() => Math.random() - 0.5);
			for(let i = 0; i < 8 ; i ++){
				groups[i].push(incomingGroup.pop());
				if(incomingGroup.length == 0  )break;
			}
		}while(incomingGroup.length !== 0)
		
		let bestOfThreeArry = [];
		for(let index in groups){
			let grp = groups[index];
			console.log('  -EN/TOURNY/NAT>',grp.length, "# of members /",groups.length , "# of groups");
			// so do round robin with this groups
			let result = await doRoundRobin(grp,tournyName,false);
			for(let i in result.winner){
				console.log('  -EN/TOURNY/ Round Robin Winner>',result.winner[i].name);
			}
			bestOfThreeArry = bestOfThreeArry.concat(result.winner);
		}
		let string = '';
		bestOfThreeArry.forEach(glad => string+=glad.name+' ');
		console.log('  -EN/TOURNY/ Tournament:',string);
		let result = await bestOfThree(bestOfThreeArry,tournyName+"Final");
		
		resolve(result);
		

	});
}


async function singleElimination(group,name) {
	return new Promise(async (resolve, reject) => {
    	let roundCount = 0;
		let tournamentReport = [];
		do {
        	roundCount++;
//        	console.log("  -TOURN>Start Round ",roundCount,name, group.length);
			const result = await tournamentRound(group);
			group = result.winnerArray;
//			console.log(result.duelReport,"DUEL REPORT in SINGLE"); // group.report is an array
			tournamentReport.push(result.duelReport);
		} while (group.length > 1);
		resolve ({winner:group[0],report:tournamentReport});
	});
}

async function doRoundRobin(group,tournyName,oneWinner){
	// Round robin means that each member of the group will face off against each member
	// the one with the most 
	// Report needs to be just an the ids
	// cause players will want.

	let winObj = {};
	let duelReport = [];
	for(let i = 0; i < group.length; i++){
		const mainGlad = group[i];

		for(let e = i+1; e< group.length;e++){
			const oppGlad = group[e];
			// do duel
			let report;
			if(group[e]){
        	    let one = await prepGlad(group[i]);
    	        let two = await prepGlad(group[e]);
				report = await doDuel(one,two);
				let saved = await parseAndSaveDuel(report);
				duelReport.push(saved.id);
			} else {

			}

			// winner gets winObj++;
			if (report.final.winner == group[i].name) {
                group[i].winRecord++;
                group[e].lossRecord++;
				if(!winObj[group[i]._id]){
					winObj[group[i]._id] = 0;	
				}
				winObj[group[i]._id]++;
			} else if (report.final.winner == group[e].name) {
                group[e].winRecord++;
                group[i].lossRecord++;
				if(!winObj[group[e]._id]){
					winObj[group[e]._id] = 0;
				}
				winObj[group[e]._id]++;

			} else {
				// draw so.
			}
		}
	}
	let mostId = [];
	let mostWins = 0;
	for(let id in winObj){
		if(winObj[id] > mostWins){
			mostWins = winObj[id];
			mostId = [id];
		} else if( winObj[id] == mostWins ) {
			// then tie condidtion
			mostId.push(id);
		}
	}

//	console.log(mostId, "wins with : ", mostWins);
	let winArray = [];
	for(let i in group){
			if(mostId.includes(group[i].id)){
				winArray.push(group[i]);
			}
	}
	//
	let finalReport = {
		duelReport,
		eliminationReport: null
	};
	if(!oneWinner){
		return {winner:winArray, winCount:mostWins, finalReport };
	}
		if (winArray.length > 1){
		let result = await singleElimination(winArray,tournyName);
		//console.log(result);
		finalReport.eliminationReport = result.report;

			
		return {winner:result.winner,winCount:mostWins , finalReport};
		}

	return {winner:winArray[0], winCount:mostWins , finalReport };



	// The one with the most wins gets returned;

}


function getMemoryGroup(memoryByLvl, mainGlad, groupSize){
	let added = [];
	if(!Array.isArray(mainGlad)){
		mainGlad = [mainGlad];
	}
	const MemoryByAge = memoryByLvl[mainGlad[0].level].filter((memory) => {
		// Issue is that previously added Memories need
		if ( Math.abs(memory.age - mainGlad[0].age) <= 6 && memory.name !== mainGlad[0].name  && !added.includes(memory.name)) {
			added.push(memory.name);
			return memory;
		}
	});
	let rando = getRandomMemorys(MemoryByAge, groupSize-mainGlad.length);

	rando = rando.concat(mainGlad);

	rando.sort(() => Math.random() - 0.5);

	return rando;
}
async function nationalTournament( allGladiators, memoryByLvl){
	const groupSize = 128;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	let usedGlads = [];
	return new Promise(async (resolve, reject) => {
		// we need to organize by level. so a tournament for each level.

		let organizeByLvl = {};
		allGladiators.forEach( glad =>{
			if(!organizeByLvl[glad.level]){
				organizeByLvl[glad.level] = [];
			}
			organizeByLvl[glad.level].push(glad);
		});
		console.log('  -EN/TOURNY/NAT>SEND IN:',allGladiators.length);
		for(let i in organizeByLvl){
			console.log('  -EN/TOURNY/NAT>',i, 'levels  IN:',organizeByLvl[i].length);
			const mainGlad = organizeByLvl[i][0];
				const startOfTick = new Date();
				let added = [];
                let tournyName = 'NAT';
				// This won't use so many memories, it will take all the gladiators and then add memories based on the number.

				let localGroup =  getMemoryGroup(memoryByLvl, organizeByLvl[i], groupSize);
				console.log("  -TOURN>>< Starting National Tournament> FOR LEVEL:",mainGlad.level,"<",tournyName, localGroup.length,'/',memoryByLvl[mainGlad.level].length);
				
				// So first it will do an roundrobin touranament 
				// The winner of each roundrobin will then go on to the bestOfThree tournament.


				let result = await roundRobinThenBestOfThree(localGroup,tournyName);
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms National Doing Local tournament size: ${localGroup.length} WINNER: ${result.winner.name}`);
					result.winner.quarterWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms National Doing Local tournament size: ${localGroup.length} WINNER: NONE?!`);
				}
				
                usedGlads = usedGlads.concat(localGroup);
			}

			
		resolve(usedGlads);
	});
}


async function quarterTournament(allGladiators, memoryByLvl) {
	const groupSize = 32;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	let usedGlads = [];
	return new Promise(async (resolve, reject) => {
		for(let i in allGladiators){
			const mainGlad = allGladiators[i];
			if (mainGlad.level >= 3) {
				const startOfTick = new Date();
				let added = [];
                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				
				let localGroup =  getMemoryGroup(memoryByLvl, mainGlad, groupSize);
//				console.log("  -TOURN>>< Starting Best of Three Tournament><",tournyName,, localGroup.length,'/',memoryByLvl[mainGlad.level].length);

				let result = await bestOfThree(localGroup,tournyName);
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Level:${mainGlad.level} Age:{ mainGlad.age } Doing Local tournament size: ${localGroup.length} WINNER: ${result.winner.name}`);
					result.winner.quarterWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: NONE?!`);
				}
				
                usedGlads = usedGlads.concat(localGroup);
				

			}
		}
		resolve(usedGlads);
	});
}

async function regionalTournament(allGladiators, memoryByLvl) {
	const groupSize = 16;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	let usedGlads = [];
	return new Promise(async (resolve, reject) => {
		for(let i in allGladiators){
			const mainGlad = allGladiators[i];
			if (mainGlad.level >= 3) {
				const startOfTick = new Date();
				let added = [];
                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				
				let localGroup =  getMemoryGroup(memoryByLvl, mainGlad, groupSize);
//				console.log("  -TOURN>>< Starting Single Elimination><",tournyName,mainGlad.level, mainGlad.age, localGroup.length,'/',memoryByLvl[mainGlad.level].length);

				let result = await singleElimination(localGroup,tournyName);
				console.log(result.report);
				let completeReport = result.report;
				// completeReport
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${result.winner.name}`);
					result.winner.monthWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: NONE?!`);
				}
				
                usedGlads = usedGlads.concat(localGroup);
				

			}
		}
		resolve(usedGlads);
	});
}

function grabOwnerGladIds(localGroup){
	let gladiator = [];
	let owner = [];
	let memory = [];

	localGroup.forEach(glad =>{
		if(glad.memory){
			owner.push(glad.ownerID );
			memory.push(glad.gladiatorID);
		} else {
			owner.push(glad.owner );
			gladiator.push(glad._id);
		}


	});
	return {gladiator,owner,memory}
}

async function localTournament(allGladiators, memoryByLvl) {
	const groupSize = 8;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	let usedGlads = [];
	return new Promise(async (resolve, reject) => {
		for(let i in allGladiators){
			const mainGlad = allGladiators[i];
			if (mainGlad.level >= 3) {
				const startOfTick = new Date();
                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				let localGroup =  getMemoryGroup(memoryByLvl, mainGlad, groupSize);
				// So here we will randomize the group before we start the roundRobin
				//console.log("  -TOURN>>< Starting RoundRobin><",tournyName,mainGlad.level, mainGlad.age, localGroup.length,'/',memoryByLvl[mainGlad.level].length);

				let result = await doRoundRobin(localGroup,tournyName,true);
				// we will need all owners, and make sure it's unique
				// we will need all glaidators and memories seperated.

				let {gladiator,owner,memory} = grabOwnerGladIds(localGroup);
//				console.log(JSON.stringify(result.finalReport),"FINAL");
				let savedTourny = await new saveTournament({tournament: JSON.stringify( result.finalReport.duelReport ),gladiators:gladiator, memories:memory, owners:owner});
				await savedTourny.save();
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${result.winner.name}`);
					result.winner.weekWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: NONE?!`);
				}
				// and it will repeat over and over again.
                usedGlads = usedGlads.concat(localGroup);

			}
		}
		resolve(usedGlads);
	});
}

module.exports = { localTournament ,regionalTournament , quarterTournament, nationalTournament};
