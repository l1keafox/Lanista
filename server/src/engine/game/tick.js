// This is what happens in a tick.

// 30 days in a month
// 12 months in a year
// each day currently is setup 
// const numEventsPerDay = 8;
// const secsPerEvents = 30;

// Game will start on 
let date = {
    time: 1, // This is # of events per day maxed at 8
    day: 1, // Days maxed at 30
    month: 1, // maxed at 12
    year: 1, // never maxed?
}


module.exports = { 
    doTick: function() {
        
    },
    getDate:`${date.day}/${date.month}/${date.year}`

 };
