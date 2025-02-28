const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);