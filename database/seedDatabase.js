const fs = require("fs");
const path = require("path");
const db = require("../config/database");

const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");

db.exec(seed, (err) => {
  if (err) {
    console.error("Seed Error:", err.message);
  } else {
    console.log("Database seeded successfully.");
  }
});
