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

	let winnerArray = [];
	for (let i = 0; i < group.length; i += 2) {
		if (!group[i + 1]) {
			winnerArray.push(group[i]);
		} else {
            let one = await prepGlad(group[i]);
            let two = await prepGlad(group[i + 1]);
			let report = await doDuel(one,two);
			// console.log(
			// 	` ${group[i].name} vs ${group[i + 1].name} : Winner: ${
			// 		report.final.winner
			// 	} `
			// );
			if (report.final.winner == group[i].name) {
				winnerArray.push(group[i]);
			} else if (report.final.winner == group[i + 1].name) {
				winnerArray.push(group[i + 1]);
			} else {
				// draw so.
			}
		}
	}
	return winnerArray;
}

async function doTournament(group,name) {
    let roundCount = 0;
	do {
        roundCount++;
        console.log("Start Round ",roundCount,name);
		group = await tournamentRound(group);
        console.log("End Round",roundCount,name);
		
	} while (group.length > 1);

	return group[0];
}

async function localTournament(allGladiators, memoryByLvl) {
	const groupSize = 8;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	const thisTourn = new Promise(async (resolve, reject) => {
		await allGladiators.forEach(async (mainGlad) => {
			if (mainGlad.level >= 3) {
				const startOfTick = new Date();
				const MemoryByAge = memoryByLvl[mainGlad.level].filter((memory) => {
					if (
						Math.abs(memory.age - mainGlad.age) <= 6 &&
						memory.name !== mainGlad.name
					) {
						return memory;
					}
				});
                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				console.log(" >< Starting Tournament><",tournyName,mainGlad.level, mainGlad.age, MemoryByAge.length,'/',memoryByLvl[mainGlad.level].length);
				let localGroup = getRandomMemorys(MemoryByAge, groupSize);
				// So here we will randomize the group before we start the roundRobin
				localGroup.sort(() => Math.random() - 0.5);
				let winner = await doTournament(localGroup,tournyName);
				console.log(
					`-EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${winner.name}`
				);
				// and it will repeat over and over again.
                //console.log(winner);
                
                                //				winner.weekWin++;
//				await winner.save();
			}
		});
		resolve("thisTourn");
	});

	await thisTourn;
}

module.exports = { localTournament };
