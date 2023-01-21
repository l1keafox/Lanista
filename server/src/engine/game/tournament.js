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


function localTournament(allGladiators,memoryByLvl){
    const groupSize = 8;
    // Go through each gladiators
    // find 7 other Memories that is the same level and +/- 6 days in age.
    allGladiators.forEach( mainGlad =>{
        if(mainGlad.level >= 3){
            const MemoryByAge = memoryByLvl[mainGlad.level].filter(memory =>{
                if( Math.abs (memory.age - mainGlad.age ) <= 6 && memory.name !== mainGlad.name ){
                    return memory;
                }
            });
            console.log(mainGlad.level, mainGlad.age, MemoryByAge.length,'/',memoryByLvl[mainGlad.level].length);
            const localGroup = getRandomMemorys(MemoryByAge, groupSize);
            console.log("Local tournament:",localGroup.length);
        }
    });

}


module.exports = {localTournament}