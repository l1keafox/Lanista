const mongoose = require('mongoose');
require('dotenv').config({});
mongoose.set('strictQuery', true)
console.log( process.env.MONGODB_CONNECTION_STRING)
if(process.env.MONGODB_CONNECTION_STRING){
  console.log(' COnnecting oto :',process.env.MONGODB_CONNECTION_STRING);
} else {
  console.log(' Connecitn got Local');
}
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING  || 'mongodb://127.0.0.1:27017/Lanista',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = mongoose.connection;
