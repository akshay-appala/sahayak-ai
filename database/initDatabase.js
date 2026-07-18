const fs = require("fs");
const path = require("path");
const db = require("../config/database");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

db.exec(schema, (err) => {
  if (err) {
    console.error("Schema Error:", err.message);
  } else {
    console.log("Database tables created.");

    require("./seedDatabase");
  }
});
