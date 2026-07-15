const express = require("express");

const routes = require("./routes");
require("./config/database");
require("./database/initDatabase.js");
//require("./database/seedDatabase");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
