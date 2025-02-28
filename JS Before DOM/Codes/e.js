const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);

function f() {
  let store = new Set();
  for (let obj of data.products) {
    for (let j of obj.reviews) store.add(j.user_id);
  }
  return store;
}

let ans = f();
console.log(ans);