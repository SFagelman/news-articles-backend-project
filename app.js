const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid route" });
});

//////////////////////////////////

module.exports = app;
