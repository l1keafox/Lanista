const express = require("express");
const path = require("path");
require('dotenv').config({});
const userRouter = require('./src/routers/users');
const gladiatorRouter = require('./src/routers/gladiators');
const ownerRouter = require('./src/routers/owner');


const db = require("./src/config/connection");
const cors = require('cors');
const { Engine } = require("./src/engine/");
const PORT = process.env.PORT || 3001;
const app = express();
// Socket.io Stuff

const { initIo } = require("./src/socket/index"); // initIo to initalize the server, io later on just to grab the object.
const ioServer = initIo(app); // initalizing io into serverIo
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRouter);
app.use(gladiatorRouter);
app.use(ownerRouter);
app.use(express.static('public')); 
app.use('/assets', express.static('assets'));
// app.use(assetsRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

}
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

db.once("open", () => {
  ioServer.listen(PORT, () => {
    // IO port being opened.
    console.log(`  -API> API server run on port ${PORT}!`);
    console.log(`  -IO> Socket.io listening on http://localHost:${PORT}?`);
    Engine.init();
  });
});
