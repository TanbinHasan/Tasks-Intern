const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);

function f() {
  let ans = new Map();
  for (const obj of data.products) {
    console.log(obj.features);
    // for (let word of )
  }
  return ans;
}

ans = f();
console.log(ans);