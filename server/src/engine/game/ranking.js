const { RankList, Owner } = require("./../../models");
const _maxRanking = 20;

async function doPointRanking(gladArray) {
  console.log(
    `  -> Doing Point ranking ${gladArray.length} Deleting old lists`,
  );
  let rankArray = []; // this is what will be stored.
  // so we will go through all t
  for (let glad of gladArray) {
    if (!glad.winRecord) continue;
    const total = glad.winRecord + glad.lossRecord;
    let ratio = glad.winRecord / total;
    let points = Math.round(ratio * glad.winRecord);
    // console.log("Win", glad.winRecord, "loss", glad.lossRecord, "total",total,ratio , "Total points::", points );

    // lets first see if there are any entries.
    const owner2 = await Owner.findById(glad.ownerId);
    let obj = {
      gladiatorId: glad._id,
      ownerId: glad.ownerId,
      comment: `${glad.name} //  Trainer: ${owner2.userName}`,
      points: points,
    };
    // const gladed = await new RankEntry(obj);
    if (rankArray.length == 0) {
      rankArray.push(obj);
    } else {
      // Now we will go through the array and see if it's higher than
      // then entry.
      let didEntry = false;
      for (let ind in rankArray) {
        const entry = rankArray[ind];
        if (points > entry.points) {
          // add it to this array here.
          rankArray.splice(ind, 0, obj);
          didEntry = true;
          break;
        }
      }
      // if we at the end of the array we will add it.
      if (!didEntry && rankArray.length <= _maxRanking) {
        rankArray.push(obj);
      }
    }

    // here we will test too see if the array is greater than 10,
    // and get rid of the top.
  }
  await RankList.deleteMany({});
  const newRank = await new RankList({ name: "points", ranking: rankArray });
  newRank.save();
}

module.exports = { doPointRanking };
