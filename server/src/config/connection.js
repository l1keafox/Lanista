const mongoose = require('mongoose');
require('dotenv').config({});
mongoose.set('strictQuery', true)
if(process.env.MONGODB_CONNECTION_STRING){
  console.log('  -MON>Connecting to MONGOOSE ATLAS');
} else {
  console.log('  -MON>Connecting to local atlas');
}
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING  || 'mongodb://127.0.0.1:27017/Lanista',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = mongoose.connection;
