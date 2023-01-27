/*

Tournaments take two things, gladiators and Memories;

*/
const { doDuel,parseAndSaveDuel } = require("./duel");
const { prepMemoryForFight, prepModelForFight } = require("./gladiatorPrep");
const { saveTournament } = require('./../../models/');

function getRandomMemorys(memoryGroup, size) {
	let rtnArray = [];
	//memoryGroup.sort(() => Math.random() - 0.5);
	for (let i = 0; i < size; i++) {
		// Has a chance of bring in the same guy, so let's do this 
		rtnArray.push(memoryGroup[Math.floor(Math.random() * memoryGroup.length)]);
	// 	rtnArray.push(memoryGroup[ Math.floor(Math.random() * memoryGroup.length) ]);
	}
	return rtnArray;
	// return memoryGroup.slice(0,size);
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
	let report = [];
	for (let i = 0; i < group.length; i += 2) {
		if (!group[i + 1]) {
			winnerArray.push(group[i]);
		} else {
            let one = await prepGlad(group[i]);
            let two = await prepGlad(group[i + 1]);
			let duelResult = await doDuel(one,two);
			let saved = await parseAndSaveDuel(duelResult);
			report.push({saveId: saved.id, 1: one.name, 2:two.name});
			// console.log(` ${group[i].name} vs ${group[i + 1].name} : Winner: ${	duelResultfinal.winner	} ` );

			// console.log(saved.id,"Saved ID?");
			if (duelResult.final.winner == group[i].name) {
                group[i].winRecord++;
                group[i+1].lossRecord++;
				winnerArray.push(group[i]);
				loserArray.push(group[i+1]);
                
			} else if (duelResult.final.winner == group[i + 1].name) {
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
	resolve ({winnerArray,loserArray,report});
	});
}


async function bestOutOf3Round(group) {
	// now we should create an function that takes any number of gladiators and returns half the number after a clash.
	return new Promise(async (resolve, reject) => {
	let winnerArray = [];
	let loserArray = [];
	let roundReport = [];
	for (let i = 0; i < group.length; i += 2) {
		let threeReport = [];
		if (!group[i + 1]) {
			winnerArray.push(group[i]);
		} else {
            let one = await prepGlad(group[i]);
            let two = await prepGlad(group[i + 1]);
			let oneWins = 0;
			let twoWins = 0;
			do{
				let duelResult = await doDuel(one,two);
				let saved = await parseAndSaveDuel(duelResult);
				
				threeReport.push( {saveId: saved.id, 1: one.name, 2:two.name} );
//				 console.log(` ${group[i].name} vs ${group[i + 1].name} : Winner: ${	duelResultfinal.winner	} ` );
				if (duelResult.final.winner == group[i].name) {
					group[i].winRecord++;
					group[i+1].lossRecord++;
					oneWins++;
					
				} else if (duelResult.final.winner == group[i + 1].name) {
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
		roundReport.push( threeReport );

	}
    //winnerArray.forEach( glad => glad.save());
	resolve ({winnerArray,loserArray,report:roundReport});
	});
}

async function bestOfThreeTournament(group,name){
	return new Promise(async (resolve, reject) => {
    	let roundCount = 0;
		let winnerGroup = group;
		let losersGroup = [];
		let roundReport = [];
		do {
        	roundCount++;
//        	console.log("  -TOURN>Start best of three Round ",roundCount,name, group.length);
			result = await bestOutOf3Round(group);
			roundReport.push(group.report);
			group = result.winnerArray;
		
		} while (group.length > 1);
		resolve ({winner:group[0], report:roundReport});
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
		let roundRobinReport = [];
		for(let index in groups){
			let grp = groups[index];
			console.log('  -EN/TOURNY/NAT>',grp.length, "# of members /",groups.length , "# of groups");
			// so do round robin with this groups
			let result = await doRoundRobin(grp,tournyName,false);
			roundRobinReport.push(result.report);
			// for(let i in result.winner){
			// 	console.log('  -EN/TOURNY/ Round Robin Winner>',result.winner[i]);
			// }
			bestOfThreeArry = bestOfThreeArry.concat(result.winner);
		}
		let string = '';
		bestOfThreeArry.forEach(glad => string+=glad.name+' ');
		console.log('  -EN/TOURNY/ Tournament:',string);
		let result = await bestOfThreeTournament(bestOfThreeArry,tournyName+"Final");

		resolve({winner:result.winner, report:{roundRobin:roundRobinReport, bestOfThree:result.report }});
	});
}


async function singleElimination(group,name) {
	return new Promise(async (resolve, reject) => {
    	let roundCount = 0;
		let tournamentResults = [];
		do {
        	roundCount++;
//        	console.log("  -TOURN>Start Round ",roundCount,name, group.length);
			const result = await tournamentRound(group);
			group = result.winnerArray;
//			console.log(result.report,"DUEL REPORT in SINGLE"); // group.report is an array
			tournamentResults.push(result.report);
		} while (group.length > 1);
		resolve ({winner:group[0],report:tournamentResults});
	});
}

async function doRoundRobin(group,tournyName,oneWinner){
/*
Round robin is a O(n^2) or Big O squared 
Because it has two loops one starting one and finishing.
This should be small group sthen.
*/
	let winObj = {};
	let duelResults = [];
	for(let i = 0; i < group.length; i++){
		const mainGlad = group[i];

		for(let e = i+1; e< group.length;e++){
			const oppGlad = group[e];
			// do duel
			let dResult;
			if(group[e]){
        	    let one = await prepGlad(group[i]);
    	        let two = await prepGlad(group[e]);
				dResult = await doDuel(one,two);
				let saved = await parseAndSaveDuel(dResult);
				duelResults.push({saveId: saved.id, 1: one.name, 2:two.name});
			} else {

			}

			// winner gets winObj++;
			if (dResult.final.winner == group[i].name) {
                group[i].winRecord++;
                group[e].lossRecord++;
				if(!winObj[group[i]._id]){
					winObj[group[i]._id] = 0;	
				}
				winObj[group[i]._id]++;
			} else if (dResult.final.winner == group[e].name) {
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
	let report = {
		tournamentStructure: duelResults,
		eliminationReport: null,
		type:"roundRobin"
	};
	
	if(!oneWinner){
		return {winner:winArray[0], winCount:mostWins, report };
	}
	if (winArray.length > 1){
		let result = await singleElimination(winArray,tournyName);
		
		report.eliminationReport = result.report;
		return {winner:result.winner, winCount:mostWins , report};
	}

	return {winner:winArray[0], winCount:mostWins , report };

}


function getMemoryGroup(memoryByLvl, mainGlad, groupSize){
	if(!Array.isArray(mainGlad)){
		mainGlad = [mainGlad];
	}
	let added = [ mainGlad[0].name ];
	//console.log(mainGlad[0].age,memoryByLvl[mainGlad[0].level].length,"size:",groupSize);
	
	const MemoryByAge = memoryByLvl[mainGlad[0].level].filter((memory) => {
		// Issue is that previously added Memories need
		if ( Math.abs(memory.age - mainGlad[0].age) <= 12 && !added.includes(memory.name) ) {
			added.push(memory.name);
			return memory;
		}
	});
	// const MbyNotName  = memoryByLvl[mainGlad[0].level].filter((memory) => {
	// 	// Issue is that previously added Memories need
	// 	if (!added.includes(memory.name) ) {
	// 		added.push(memory.name);
	// 		return memory;
	// 	}
	// });
	// const byAge = memoryByLvl[mainGlad[0].level].filter((memory) => {
	// 	// Issue is that previously added Memories need
	// 	if (Math.abs(memory.age - mainGlad[0].age) <= 12 ) {
	// 		added.push(memory.name);
	// 		return memory;
	// 	}
	// });

	// const MbyAge = memoryByLvl[mainGlad[0].level].filter((memory) => {
	// 	// Issue is that previously added Memories need
	// 	if ( memory.name !== mainGlad[0].name  ) {
	// 		added.push(memory.name);
	// 		return memory;
	// 	}
	// });
	// for(let i in MbyNotName){
	// 	console.log(MbyNotName[i].name,MbyNotName[i].age);
	// }
//	console.log( MbyNotName.length, byAge.length ,  "   : ",MemoryByAge.length  );

		let rando = getRandomMemorys(MemoryByAge, groupSize-mainGlad.length);

	rando = rando.concat(mainGlad);

	rando.sort(() => Math.random() - 0.5);

	return rando;
}



function grabOwnerGladIds(localGroup){
	let gladiator = [];
	let owner = [];
	let memory = [];

	localGroup.forEach(glad =>{
		if(glad.memory){
			owner.push(glad.ownerID );
			memory.push(glad._id);
		} else {
			owner.push(glad.ownerId );
			gladiator.push(glad._id);
		}
	});
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
	owner = owner.filter(onlyUnique);
	return {gladiator,owner,memory}
}

async function doSaveTournament(members,report,saveAs,winner){
	let {gladiator,owner,memory} = grabOwnerGladIds(members);
	if(!winner || !winner.name){
		winner = {
			name: "none"
		}
	}
	if(Array.isArray(report)){
		report = {
			winner:winner.name,
			ownerId:winner.ownerId,
			type: saveAs,
			tournamentStructure: report,
		}
	}  else {
		report.type =   saveAs;
		report.winner=  winner.name;
		report.ownerId= winner.ownerId;
}
	let savedTourny = await new saveTournament({tournament: JSON.stringify( report ),gladiators:gladiator, memories:memory, owners:owner});
	await savedTourny.save();
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
				doSaveTournament(localGroup,result.report,"yearly",result.winner);
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms National Doing National tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: ${result.winner.name}`);
					result.winner.yearWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms National Doing National tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: NONE?!`);
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

				let result = await bestOfThreeTournament(localGroup,tournyName);
				doSaveTournament(localGroup,result.report,"quarter",result.winner);
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Level:${mainGlad.level} Age:${ mainGlad.age } Doing Quarter tournament size: ${localGroup.length} WINNER: ${result.winner.name}`);
					result.winner.quarterWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} age:${mainGlad.age} level: ${mainGlad.level} Doing Quarter tournament size: ${localGroup.length} WINNER: NONE?!`);
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
//				console.log("  -TOURN>>< Starting Single Elimination><",tournyName,mainGlad.level, mainGlad.age, localGroup.length,'/',groupSize,memoryByLvl[mainGlad.level].length);
				let result = await singleElimination(localGroup,tournyName);
				doSaveTournament(localGroup,result.report,"monthly",result.winner)
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Reginoal tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: ${result.winner.name}`);
					result.winner.monthWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Reginoal tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: NONE?!`);
				}
				
                usedGlads = usedGlads.concat(localGroup);
				

			}
		}
		resolve(usedGlads);
	});
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

				await doSaveTournament(localGroup,result.report,"weekly",result.winner)
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: ${result.winner.name}`);
					result.winner.weekWin++;
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: NONE?!`);
				}
				// and it will repeat over and over again.
                usedGlads = usedGlads.concat(localGroup);

			}
		}
		resolve(usedGlads);
	});
}

module.exports = { localTournament ,regionalTournament , quarterTournament, nationalTournament};
