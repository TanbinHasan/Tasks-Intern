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
    if (sz < 4) continue;
    avg /= sz;
    const cur = new Object();
    cur.product_id = obj.product_id;
    cur.name = obj.name;
    cur.avgRating = avg;
    ans.push(cur);
  }
  ans.sort((a, b)=> {
    if (a.avgRating > b.avgRating) return -1;
    if (a.avgRating < b.avgRating) return 1;
    return 0;
  });
  while (ans.length > 3) ans.pop();
  return ans;
}

ans = f();
console.log(ans);