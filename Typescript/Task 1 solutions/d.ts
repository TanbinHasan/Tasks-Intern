import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

type node = {
  Low: string[];
  Medium: string[];
  High: string[];
}

function groupProductsByStock(): node {
  let ans: node = {
    Low: [],
    Medium: [],
    High: [],
  };
  data.products.forEach((obj: any) => {
    if (obj.stock < 50) {
      ans.Low.push(obj.name);
    } else if (obj.stock <= 100) {
      ans.Medium.push(obj.name);
    } else {
      ans.High.push(obj.name);
    }
  });
  return ans;
}

console.log(groupProductsByStock());