const express = require("express");
const path = require("path");

const routes = require("./routes");
require("./config/database");
require("./database/initDatabase.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
