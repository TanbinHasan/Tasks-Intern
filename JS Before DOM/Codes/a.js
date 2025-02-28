const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);

function f() {
  names = [];
  for (let obj of data.products) {
    if (obj.category == 'Electronics') names.push(obj.name);
  }
  names.sort();
  return names;
}

let answer = f();
// console.log(answer);