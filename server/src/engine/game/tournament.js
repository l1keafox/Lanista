/*

Tournaments take two things, gladiators and Memories;

*/
const { doDuel } = require("./duel");
const { prepMemoryForFight, prepModelForFight } = require("./gladiatorPrep");

function getRandomMemorys(memoryGroup, size) {
	let rtnArray = [];
	for (let i = 0; i < size; i++) {
		rtnArray.push(memoryGroup[Math.floor(Math.random() * memoryGroup.length)]);
	}
	return rtnArray;
}

async function prepGlad(glad) {
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
	for (let i = 0; i < group.length; i += 2) {
		if (!group[i + 1]) {
			winnerArray.push(group[i]);
		} else {
            let one = await prepGlad(group[i]);
            let two = await prepGlad(group[i + 1]);
			let report = await doDuel(one,two);
			// console.log(` ${group[i].name} vs ${group[i + 1].name} : Winner: ${	report.final.winner	} ` );
			if (report.final.winner == group[i].name) {
                group[i].winRecord++;
                group[i+1].loseRecord++;
				winnerArray.push(group[i]);
				loserArray.push(group[i+1]);
                
			} else if (report.final.winner == group[i + 1].name) {
                group[i+1].winRecord++;
                group[i].loseRecord++;
				loserArray.push(group[i]);
				winnerArray.push(group[i + 1]);
			} else {
				// draw so.
			}
		}
	}
    //winnerArray.forEach( glad => glad.save());
	resolve ({winnerArray,loserArray});
	});
}

async function singleElimination(group,name) {
	return new Promise(async (resolve, reject) => {
    	let roundCount = 0;
		do {
        	roundCount++;
        	console.log("  -TOURN>Start Round ",roundCount,name, group.length);
			group = await tournamentRound(group);
			group = group.winnerArray;
		
		} while (group.length > 1);
		resolve (group[0]);
	});
}

async function doRoundRobin(group,tournyName){
	// Round robin means that each member of the group will face off against each member
	// the one with the most 
	let winObj = {};
	for(let i = 0; i < group.length; i++){
		const mainGlad = group[i];
		for(let e = i+1; e< group.length;e++){
			const oppGlad = group[e];
			// do duel
        	    let one = await prepGlad(group[i]);
    	        let two = await prepGlad(group[e]);
				let report = await doDuel(one,two);

			// winner gets winObj++;
			if (report.final.winner == group[i].name) {
                group[i].winRecord++;
                group[e].loseRecord++;
				if(!winObj[group[i].name]){
					winObj[group[i].name] = 0;	
				}
				winObj[group[i].name]++;
			} else if (report.final.winner == group[e].name) {
                group[e].winRecord++;
                group[i].loseRecord++;
				if(!winObj[group[e].name]){
					winObj[group[e].name] = 0;
				}
				winObj[group[e].name]++;

			} else {
				// draw so.
			}
		}
	}
	console.log(winObj);
	let mostName = [];
	let mostWins = 0;
	for(let name in winObj){
		if(winObj[name] > mostWins){
			mostWins = winObj[name];
			mostName = [name];
		} else if( winObj[name] == mostWins ) {
			// then tie condidtion
			mostName.push(name);
		}
	}

	console.log(mostName, "wins with : ", mostWins);
	let winArray = [];
	for(let i in group){
		if(mostName.includes(group[i].name)){
			winArray.push(group[i]);
		}
	}

	console.log(winArray.length ,"Winners?!");
		if (winArray.length > 1){
		let winner = await singleElimination(winArray,tournyName);
		return {winner,winCount:mostWins};
		}

	return {winner:winArray[0], winCount:mostWins };



	// The one with the most wins gets returned;

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
				const MemoryByAge = memoryByLvl[mainGlad.level].filter((memory) => {
					// Issue is that previously added Memories need
					if ( Math.abs(memory.age - mainGlad.age) <= 6 && memory.name !== mainGlad.name && !added.includes(memory.name)) {
						added.push(memory.name);
						return memory;
					}
				});

                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				console.log("  -TOURN>>< Starting Single Elimination><",tournyName,mainGlad.level, mainGlad.age, MemoryByAge.length,'/',memoryByLvl[mainGlad.level].length);
				let localGroup = getRandomMemorys(MemoryByAge, groupSize-1);
				localGroup.unshift(mainGlad);
				// So here we will randomize the group before we start the roundRobin
				localGroup.sort(() => Math.random() - 0.5);

				//let winner = await doRoundRobin(localGroup,tournyName);
				let winner = await singleElimination(localGroup,tournyName);
				if(winner.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${winner.winner.name}`);
					winner.winner.weekWin++;
				} else 
				if(winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${winner.name}`);
					winner.weekWin++;
				} else {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: NONE?!`);
				}
				// and it will repeat over and over again.
				
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
				let added = [];
				const MemoryByAge = memoryByLvl[mainGlad.level].filter((memory) => {
					// Issue is that previously added Memories need
					if ( Math.abs(memory.age - mainGlad.age) <= 6 && memory.name !== mainGlad.name && !added.includes(memory.name)) {
						added.push(memory.name);
						return memory;
					}
				});

                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				console.log("  -TOURN>>< Starting RoundRobin><",tournyName,mainGlad.level, mainGlad.age, MemoryByAge.length,'/',memoryByLvl[mainGlad.level].length);
				let localGroup = getRandomMemorys(MemoryByAge, groupSize-1);
				localGroup.unshift(mainGlad);
				// So here we will randomize the group before we start the roundRobin
				localGroup.sort(() => Math.random() - 0.5);

				let winner = await doRoundRobin(localGroup,tournyName);
				//let winner = await singleElimination(localGroup,tournyName);
				//console.log(winner);
				if(winner.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${winner.winner.name}`);
					winner.winner.weekWin++;
				} else 
				if(winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${winner.name}`);
					winner.weekWin++;
				} else {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: NONE?!`);
				}
				// and it will repeat over and over again.
                usedGlads = usedGlads.concat(localGroup);
				

			}
		}
		resolve(usedGlads);
	});
}

module.exports = { localTournament };
