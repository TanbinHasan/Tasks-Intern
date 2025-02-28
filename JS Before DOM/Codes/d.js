const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);

function f() {
  let ans = [];
  let v1 = [], v2 = [], v3 = [];
  for (const obj of data.products) {
    if (obj.stock < 50) v1.push(obj.name);
    else if (obj.stock >= 50 && obj.stock <= 100) v2.push(obj.name);
    else if (obj.stock > 100) v3.push(obj.name);
  }
  let obj = new Object();
  obj.Low = v1;
  obj.Medium = v2;
  obj.High = v3;
  ans.push(obj);
  return ans;
}

ans = f();
console.log(ans);