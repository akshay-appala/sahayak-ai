const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../database", "app.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to sqlite database.");
  }
});

module.exports = db;
