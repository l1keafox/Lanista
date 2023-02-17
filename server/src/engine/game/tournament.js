/*

Tournaments take two things, gladiators and Memories;

*/
const { doDuel,parseAndSaveDuel } = require("./duel");
const { prepMemoryForFight, prepModelForFight,getMemoryGroup } = require("./gladiatorPrep");
const { saveTournament,Gladiator,Memory } = require('./../../models/');


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

async function tournamentRound(group,toRecord) {
	
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
//			 console.log(`  -EN> DUEL ${group[i].name} vs ${group[i + 1].name} : Winner: ${	duelResult.final.winner	} ` );

			// console.log(saved.id,"Saved ID?");
			if (duelResult.final.winner == group[i].name) {
				 addToRecord2(toRecord,group[i],"winRecord");
				winnerArray.push(group[i]);

				 addToRecord2(toRecord,group[i+1],"lossRecord");
				loserArray.push(group[i+1]);
                
			} else if (duelResult.final.winner == group[i + 1].name) {
				 addToRecord2(toRecord,group[i+1],"winRecord");
				winnerArray.push(group[i + 1]);

				 addToRecord2(toRecord,group[i],"lossRecord");
				loserArray.push(group[i]);
			} else {
				// draw so.
				 addToRecord2(toRecord,group[i+1],"draw");
				 addToRecord2(toRecord,group[i],"draw");
				loserArray.push(group[i]);
				loserArray.push(group[i+1]);
				//console.log('DRAW For tournament');
			}
		}
	}
    //winnerArray.forEach( glad => glad.save());
	resolve ({winnerArray,loserArray,report});
	});
}


async function bestOutOf3Round(group,toRecord) {
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
			//let string = ""
			do{
				let duelResult = await doDuel(one,two);
				let saved = await parseAndSaveDuel(duelResult);
				
				threeReport.push( {saveId: saved.id, 1: one.name, 2:two.name} );
//				 string += `ROUND: ${oneWins+twoWins}  ${group[i].name} vs ${group[i + 1].name} : Winner: **${	duelResult.final.winner	}** `;
				if (duelResult.final.winner == group[i].name) {
					addToRecord2(toRecord,group[i],"winRecord");
					addToRecord2(toRecord,group[i+1],"lossRecord");
					// here we should see if anyof these are memories
					oneWins++;
					
				} else if (duelResult.final.winner == group[i + 1].name) {
					addToRecord2(toRecord,group[i],"lossRecord");
					addToRecord2(toRecord,group[i+1],"winRecord");
					twoWins++;
				} else {
					// draw so.
					addToRecord2(toRecord,group[i],"draw");
					addToRecord2(toRecord,group[i+1],"draw");
					twoWins++;
					oneWins++;
				}
			}while(twoWins < 2 && oneWins < 2)
			//console.log(string);

			if(oneWins == 2){
				winnerArray.push(group[i]);
				loserArray.push(group[i+1]);
			} else {
				loserArray.push(group[i]);
				winnerArray.push(group[i + 1]);
			}
			if(threeReport.length < 3){
				threeReport.push( {saveId: null, 1: group[i].name, 2: group[i+1].name} );
			}
	
		}
		//threeReport[2][1]
		roundReport.push( threeReport );

	}
    //winnerArray.forEach( glad => glad.save());
	resolve ({winnerArray,loserArray,report:roundReport});
	});
}

async function bestOfThreeTournament(group,name,toRecord){
	return new Promise(async (resolve, reject) => {
    	let roundCount = 0;
		let winnerGroup = group;
		let losersGroup = [];
		let roundReport = [];
		do {
        	roundCount++;
        	console.log("  -TOURN>Start best of three Round ",roundCount,name, group.length);
			result = await bestOutOf3Round(group,toRecord);
			
			roundReport.push(result.report);
			group = result.winnerArray;
		
		} while (group.length > 1);
		resolve ({winner:group[0], report:roundReport});
	});
}

async function roundRobinThenBestOfThree(incomingGroup,tournyName,toRecord){
	return new Promise(async (resolve, reject) =>
	 {
		const startOfTick = new Date();
		let winObj = {};
		// We need to split the big 128 peoples into smaller groups of 8
		let groups = [];
		const numOfGroups = 8;
		// Group of 8 of sixteen.
		// create the groups.
		for(let i = 0; i < numOfGroups ; i ++){
			groups.push([]);
		}
		console.log('      -EN/TOURNY/NAT> Starting with:',incomingGroup.length, "Num of glads");
		incomingGroup = [...incomingGroup]
		incomingGroup.sort(() => Math.random() - 0.5);
		let i = 0;
		while(incomingGroup.length){
			groups[i].push(incomingGroup.pop());
			i++;
			if(i >= numOfGroups) i = 0
		}
		
		let bestOfThreeArry = [];
		let roundRobinReport = [];
		for(let index in groups){
			let grp = groups[index];
			console.log('        -EN/TOURNY/NAT>',grp.length, "# of members /",index, "# of groups");
			// so do round robin with this groups
			let result = await doRoundRobin(grp,tournyName ,toRecord );
			// {winner:resultArray, report, duelResults:winObj };
			roundRobinReport.push(result.report);
			// for(let i in result.winner){
			// 	console.log('  -EN/TOURNY/ Round Robin Winner>',result.winner[i]);
			// }
			bestOfThreeArry = bestOfThreeArry.concat(result.winner);
		}
		let string = '';
		bestOfThreeArry.forEach(glad => string+=glad.name+' ');
		console.log('    -EN/TOURNY/ Starting best of three Tournament: Members count:',bestOfThreeArry.length);
		let result = await bestOfThreeTournament(bestOfThreeArry,tournyName+"Final",toRecord);

		resolve({winner:result.winner, report:{roundRobin:roundRobinReport, bestOfThree:result.report }});
	});
}


async function singleElimination(group,name,toRecord) {
	return new Promise(async (resolve, reject) => {
    	let roundCount = 0;
		let tournamentResults = [];
		do {
        	roundCount++;
        	
			const result = await tournamentRound(group,toRecord);
			console.log("    -TOURN>Start Round Started with :", group.length, "Ended with :",result.winnerArray.length);
			group = result.winnerArray;
//			console.log(result.report,"DUEL REPORT in SINGLE"); // group.report is an array
			tournamentResults.push(result.report);
		} while (group.length > 1);
		console.log("  -EN> Elemintaion :: rount taken to win:",roundCount, group.length);
		resolve ({winner:group[0],report:tournamentResults});
	});
}

async function addToRecord(maybeGlad,type,win){

	maybeGlad[type]++;
	if(maybeGlad.memory && !maybeGlad.seed ){
		let notMemory = await Gladiator.findById(maybeGlad.gladiatorId);
		notMemory[type]++;
		await notMemory.save();
	}
	
}

async function addToRecord2(recObj, maybeGlad,type){
	// recObj needs to get the maybeGlad
	if( maybeGlad.seed ) return; // Seeds don't care about their record. 

	// console.log( maybeGlad.id,  !maybeGlad.memory , maybeGlad.seed ,  type);
	if(!recObj.memory) recObj.memory = {};
	if(!recObj.gladiator) recObj.gladiator = {};
	if(maybeGlad.memory  ){
		//let notMemory = await Gladiator.findById(maybeGlad.gladiatorId);
		if(!recObj.gladiator[maybeGlad.gladiatorId] )  recObj.gladiator[maybeGlad.gladiatorId] = {};
		if(!recObj.gladiator[maybeGlad.gladiatorId][type]) recObj.gladiator[maybeGlad.gladiatorId][type] = 0;
		    recObj.gladiator[maybeGlad.gladiatorId][type]++;

		// if(!maybeGlad.seed){
			if(!recObj.memory[maybeGlad.id] )  recObj.memory[maybeGlad.id] = { };
			if(!recObj.memory[maybeGlad.id][type]) recObj.memory[maybeGlad.id][type] = 0;
				recObj.memory[maybeGlad.id][type]++;
		//}
			
	} else {
		if(! recObj.gladiator[maybeGlad.id]       )  recObj.gladiator[maybeGlad.id] = { };
		if(! recObj.gladiator[maybeGlad.id][type] ) recObj.gladiator[maybeGlad.id][type] = 0;
			 recObj.gladiator[maybeGlad.id][type]++;
	}
	
}


async function doRoundRobin(group,tournyName,toRecord){
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
				addToRecord2(toRecord,group[i],"winRecord");
				addToRecord2(toRecord,group[e],"lossRecord");
				if(!winObj[group[i]._id]){
					winObj[group[i]._id] = 0;	
				}
				winObj[group[i]._id]++;
			} else if (dResult.final.winner == group[e].name) {
				addToRecord2(toRecord,group[i],"lossRecord");
				addToRecord2(toRecord,group[e],"winRecord");
				if(!winObj[group[e]._id]){
					winObj[group[e]._id] = 0;
				}
				winObj[group[e]._id]++;

			} else {
				// draw so.
				addToRecord2(toRecord,group[i],"draw");
				addToRecord2(toRecord,group[e],"draw");
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

//	console.log('  ->',mostId, "wins with : ", mostWins);
	let resultArray = [];
	for(let i in group){
		if(mostId.includes(group[i].id)){
			resultArray.push(group[i]);
		}
	}
	//
	let report = {
		tournamentStructure: duelResults,
		eliminationReport: null,
		type:"roundRobin"
	};
	
//	if(!oneWinner){
		return {winner:resultArray, report, duelResults:winObj };
//	}
	// if (winArray.length > 1){
	// 	let result;
	// 	do{
	// 	result = await singleElimination(winArray,tournyName);
		
	// 	if(result.winner == "none")		console.log(result.winner);
	// 	}while(result.winner == "none")
	// 	report.eliminationReport = result.report;

	// 	return {winner:result.winner, winCount:mostWins , report};
	// }

	//return {winner:winArray[0], winCount:mostWins , report };

}

function grabOwnerGladIds(localGroup){
	let gladiator = [];
	let owner = [];
	let memory = [];

	localGroup.forEach(glad =>{
		if(glad.memory){
			owner.push(glad.ownerId );
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

		//console.log(members.length,report);
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
	let savedTourny = await new saveTournament({tournament: JSON.stringify( report ),gladiators:gladiator, memories:memory, owners:owner, createdAt:  new Date() });
	await savedTourny.save();
}



async function nationalTournament( allGladiators){
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
		let toRecordObj = {};
		for(let i in organizeByLvl){
			console.log('    -EN/TOURNY/NAT******>',i, 'levels  Non Seeders::',organizeByLvl[i].length,"/",groupSize);
			const mainGlad = organizeByLvl[i][0];
			const startOfTick = new Date();
			let added = [];
            let tournyName = 'NAT';
			// This won't use so many memories, it will take all the gladiators and then add memories based on the number.

			let localGroup =  await getMemoryGroup(organizeByLvl[i], groupSize);
			console.log("  -EN/NATIONAL/TOURN>>< Starting National Tournament> FOR LEVEL:",mainGlad.level,"<",tournyName, localGroup.length,'/');
				
				// So first it will do an roundrobin touranament 
				// The winner of each roundrobin will then go on to the bestOfThree tournament.


			
			let result = await roundRobinThenBestOfThree(localGroup,tournyName,toRecordObj);
			doSaveTournament(localGroup,result.report,"yearly",result.winner);
			if(result.winner){
				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms National Doing National tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: ${result.winner.name}`);
				//await addToRecord(result.winner,"yearWin");
			} else  {
				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms National Doing National tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: NONE?!`);
			}
			usedGlads = usedGlads.concat(localGroup);
				
			}

			
		resolve({usedGlads,toRecordObj});
	});
}


async function quarterTournament(allGladiators,) {
	const groupSize = 32;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	let usedGlads = [];
	return new Promise(async (resolve, reject) => {
		let toRecordObj = {};
		for(let i in allGladiators){
			const mainGlad = allGladiators[i];
			if (mainGlad.level >= 3) {
				const startOfTick = new Date();
				let added = [];
                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				
				let localGroup = await getMemoryGroup(mainGlad, groupSize);
//				console.log("  -TOURN>>< Starting Best of Three Tournament><",tournyName,, localGroup.length,'/',memoryByLvl[mainGlad.level].length);

				let result = await bestOfThreeTournament(localGroup,tournyName,toRecordObj);
				doSaveTournament(localGroup,result.report,"quarter",result.winner);
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Level:${mainGlad.level} Age:${ mainGlad.age } Doing Quarter tournament size: ${localGroup.length} WINNER: ${result.winner.name}`);
					addToRecord2(toRecordObj,result.winner,"quarterWin");
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} age:${mainGlad.age} level: ${mainGlad.level} Doing Quarter tournament size: ${localGroup.length} WINNER: NONE?!`);
				}
				
                usedGlads = usedGlads.concat(localGroup);
				

			}
		}
		resolve({usedGlads,toRecordObj});
	});
}

async function regionalTournament(allGladiators) {
	const groupSize = 16;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	let usedGlads = [];
	return new Promise(async (resolve, reject) => {
		let toRecordObj = {};
		for(let i in allGladiators){
			const mainGlad = allGladiators[i];
			if (mainGlad.level >= 3) {
				const startOfTick = new Date();
				let added = [];
                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				
				let localGroup = await getMemoryGroup(mainGlad, groupSize);
//				console.log("  -TOURN>>< Starting Single Elimination><",tournyName,mainGlad.level, mainGlad.age, localGroup.length,'/',groupSize,memoryByLvl[mainGlad.level].length);
				let result = await singleElimination(localGroup,tournyName,toRecordObj);
				doSaveTournament(localGroup,result.report,"monthly",result.winner)
				if(result.winner){
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing regional tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: ${result.winner.name}`);
					addToRecord2(toRecordObj,result.winner,"monthWin");
				} else  {
					console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms ${mainGlad.name} Doing regional tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} WINNER: NONE?!`);
				}
				
                usedGlads = usedGlads.concat(localGroup);
				

			}
		}
		resolve({usedGlads,toRecordObj});
	});
}

async function localTournament(allGladiators) {
	const groupSize = 8;
	// Go through each gladiators
	// find 7 other Memories that is the same level and +/- 6 days in age.
	let usedGlads = [];
	return new Promise(async (resolve, reject) => {

		let toRecordObj = {};
//		console.log('  -> Starting Local');
		for(let i in allGladiators){
			const mainGlad = allGladiators[i];
			if (mainGlad.level >= 3) {
				const startOfTick = new Date();
                let tournyName = mainGlad.name[0]+mainGlad.name[1]+mainGlad.name[4];
				let localGroup = await  getMemoryGroup(mainGlad, groupSize);
				// So here we will randomize the group before we start the roundRobin
				//console.log("  -TOURN>>< Starting RoundRobin><",tournyName,mainGlad.level, mainGlad.age, localGroup.length,'/',memoryByLvl[mainGlad.level].length);

				let result = await doRoundRobin(localGroup,tournyName,toRecordObj);
				// we will need all owners, and make sure it's unique
				// we will need all glaidators and memories seperated.
					let string = "";
					result.winner.forEach(win =>{
						string += win.name+ ","
	 					addToRecord2(toRecordObj,win,"weekWin");
					} );
					result.winner.name = string;
			
				await doSaveTournament(localGroup,result.report,"weekly",result.winner)

				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms Doing Local tournament size: ${localGroup.length} age:${mainGlad.age} level: ${mainGlad.level} ${mainGlad.name} WINNER: ${string}`);				

				// and it will repeat over and over again.
                usedGlads = usedGlads.concat(localGroup);

			}
		}
		resolve({usedGlads,toRecordObj});
	});
}

module.exports = { localTournament ,regionalTournament , quarterTournament, nationalTournament};
