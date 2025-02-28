const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);

function f() {
  let ans = [];
  for (const obj of data.products) {
    let ok1 = false, ok2 = false;
    for (let i of obj.reviews) {
      if (i.rating >= 5) ok1 = true;
      if (i.rating <= 2) ok2 = true;
    }
    if (ok1 == false || ok2 == false) continue;
    const cur = new Object();
    cur.name = obj.name;
    ans.push(cur);
  }
  return ans;
}

ans = f();
console.log(ans);