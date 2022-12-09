// This is what happens in a tick.
// Game will start on 
const { GameDate } = require("./../../models");
let date = {
    time: 1, // This is # of events per day maxed at 8
    day: 1, // Days maxed at 30
    month: 1, // maxed at 12
    year: 1, // never maxed?
}


module.exports = { 
    doTick: async function() {
        let gameDate = await GameDate.find();
        gameDate = gameDate[0]; // Because there should only be 1 gameDate ever!;
        await gameDate.addTime();
        date ={
            time: gameDate.time,
            day: gameDate.day,
            month: gameDate.month,
            year: gameDate.year,
        };
    },
    getDate: function(){
        return `Time: ${date.time}:00  ${date.month}/${date.day}/${date.year}`
    }

 };
