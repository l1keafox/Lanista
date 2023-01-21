/*

Tournaments take two things, gladiators and Memories;

*/
const { doDuel } = require('./duel');
const { prepMemoryForFight,prepModelForFight } = require('./duel')



function getRandomMemorys(memoryGroup, size){
    let rtnArray = [];
    for(let i = 0; i < size; i ++){
        rtnArray.push( memoryGroup[  Math.floor( Math.random()* memoryGroup.length ) ] );
    }
    return rtnArray;
}

function tournamentRound(group){
    // now we should create an function that takes any number of gladiators and returns half the number after a clash.

    let winnerArray = [];
    for(let i = 0; i < group.length ; i+=2){

        if(!group[i+1]){
            winnerArray.push( group[i] );
        } else {
            let report = doDuel(group[i],group[i+1]);
            
            if( report.finally.winner == group[i].name){
                winnerArray.push( group[i] );
            } else if( report.finally.winner == group[i+1].name) {
                winnerArray.push( group[i+1] );
            } else {
                // draw so.
            }

        }
    }
    return winnerArray;
}

function doTournament(group){
    do{
        group  = tournamentRound(group);
    }while(group.length > 1);
    return group[0];
}


function localTournament(allGladiators,memoryByLvl){
    const groupSize = 8;
    // Go through each gladiators
    // find 7 other Memories that is the same level and +/- 6 days in age.
    allGladiators.forEach( mainGlad =>{
        if(mainGlad.level >= 3){
            const startOfTick = new Date();
            const MemoryByAge = memoryByLvl[mainGlad.level].filter(memory =>{
                if( Math.abs (memory.age - mainGlad.age ) <= 6 && memory.name !== mainGlad.name ){
                    return memory;
                }
            });
            //console.log(mainGlad.level, mainGlad.age, MemoryByAge.length,'/',memoryByLvl[mainGlad.level].length);
            let localGroup = getRandomMemorys(MemoryByAge, groupSize);
            // So here we will randomize the group before we start the roundRobin
            localGroup.sort(() => Math.random() - 0.5);
            let winner = doTournament(localGroup);
            console.log(`${mainGlad.name} Doing Local tournament size: ${localGroup.length} WINNER: ${winner.name}`);
            console.log(`  -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms`);
            // and it will repeat over and over again.
//            winner.weekWin++;
  //          winner.save();            
        }
    });

}


module.exports = {localTournament}