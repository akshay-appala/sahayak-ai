const express = require("express");
const db = require("./config/database");
require("./database/initDatabase.js");
//require("./database/seedDatabase");
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
