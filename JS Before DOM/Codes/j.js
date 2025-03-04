const fs = require("fs");
const rw = fs.readFileSync("data.json");
const data = JSON.parse(rw);

var pos = new Set(["great", "excellent", "good", "amazing",
"comfortable"]);
var neg = new Set(["poor", "bad", "heavy",
"complex", "pricey"]);

function f() {
  let ans = [];
  for (let product of data.products) {
    let x = 0, y = 0;
    for (let obj of product.reviews) {
      let cur = obj.comment;
      let store = cur.split(" ");
      for (let word of store) {
        word = word.toLowerCase();
        let len = word.length;
        if ((word[len - 1] >= 'a' && word[len - 1] <= 'z') == false) word = word.substring(0, len - 1);
        if (pos.has(word)) x = 1;
        if (neg.has(word)) y = 1;
      }
      let obj1 = new Object();
      obj1.product_id = product.product_id;
      obj1.positiveCount = x;
      obj1.negativeCount = y;
      ans.push(obj1);
    }
  }
  return ans;
}

let ans = f();
console.log(ans);