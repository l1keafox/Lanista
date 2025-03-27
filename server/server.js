const express = require("express");
const path = require("path");
require("dotenv").config({});
const userRouter = require("./src/routers/users");
const gladiatorRouter = require("./src/routers/gladiators");
const ownerRouter = require("./src/routers/owner");

const db = require("./src/config/connection");
const cors = require("cors");
const { Engine } = require("./src/engine/");
const PORT = process.env.PORT || 3006;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRouter);
app.use(gladiatorRouter);
app.use(ownerRouter);
app.use(express.static("public"));
app.use("/assets", express.static("assets"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`  -API> API server running on port ${PORT}!`);
    Engine.init();
  });
});
