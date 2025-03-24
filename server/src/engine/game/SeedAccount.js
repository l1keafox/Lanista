/*

This is an file just created to create the base seed account. This is an special account that 
will be created first! and will acutally probably be ahead of everyone else by 1 week age wise. (6x8) ticks ahead

The base seed account will create 124 gladiators to grow and seed Memories as they grow. These Memories will be the basis of all tournaments
from here on.

*/

const schools = require("./SeedSchools");

async function SeedAccount() {
  for (let key in schools) {
    await schools[key]();
  }
}
module.exports = SeedAccount;
