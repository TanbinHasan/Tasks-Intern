const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);

function f() {
  let ans = [];
  for (const obj of data.products) {
    let avg = 0, sz = 0;
    for (let i of obj.reviews) {
      avg += i.rating;
      ++sz;
    }
    if (sz != 0) avg /= sz;
    const cur = new Object();
    cur.name = obj.name;
    cur.avgRating = avg;
    ans.push(cur);
  }
  return ans;
}

ans = f();
console.log(ans);