const timeBetweenTicks = process.env.MONGODB_CONNECTION_STRING? process.env.MONGODB_CONNECTION_STRING : 15000; 

const Tick = require('./game/tick');
let timeToLastTick;
async function doGameTick(){
//    console.log('  -EN> Starting Tick:');
return new Promise(async (resolve, reject) => {
    const startOfTick = new Date();
    await Tick.doTick();
    const endOfTick = new Date();
    console.log(`  -EN> Game Tick took: ${endOfTick - startOfTick}ms  ::  ${Tick.getDate()}`);
    resolve(true);
});

}

async function startLoop(){
    const currentTick = new Date();
    
//     console.log('  -> Time Sense Last Tick:',currentTick - timeToLastTick);
    if((currentTick - timeToLastTick) > timeBetweenTicks ){
        timeToLastTick = new Date();
        await doGameTick();
    }
    setTimeout(()=>{
        startLoop(); // calls it self in the end to determine the time.
    },5);
    
    
}

module.exports = { 
    init : async function() {
        
        console.log(`  -EN> Starting Game Engine Tick Time:${timeBetweenTicks}ms`);
        timeToLastTick = new Date(); // this is what starts thecount;
        await doGameTick();
        startLoop();
    },
 };
