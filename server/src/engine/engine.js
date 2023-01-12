const timeBetweenTicks = 10000; 
const Tick = require('./game/tick');
let timeToLastTick;

async function doGameTick(){
    console.log('  -EN> Starting Tick:');
    const startOfTick = new Date();
    await Tick.doTick();
    const endOfTick = new Date();
    console.log(`  -EN> Game Tick took: ${endOfTick - startOfTick}ms  ::  ${Tick.getDate()}`);
}

async function startLoop(){
    const currentTick = new Date();
    
//     console.log('  -> Time Sense Last Tick:',currentTick - timeToLastTick);
    if((currentTick - timeToLastTick) > timeBetweenTicks){
        timeToLastTick = new Date();
        doGameTick();
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
