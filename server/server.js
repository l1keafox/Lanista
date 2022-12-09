const express = require("express");
const path = require("path");
//const { authMiddleware } = require('./utils/auth');

const db = require("./config/connection");

const {Engine} = require('./engine/');

const PORT = process.env.PORT || 3001;
const app = express();

// Socket.io Stuff
const { initIo } = require("./socket/index"); // initIo to initalize the server, io later on just to grab the object.
const ioServer = initIo(app); // initalizing io into serverIo

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  ioServer.listen(PORT, () => {
    // IO port being opened.

    console.log(`  -EX> Express server running on port ${PORT}!`);
    console.log(`  -IO> Socket.io listening on http://localHost:${PORT}?`);
    Engine.init();
  });
});


