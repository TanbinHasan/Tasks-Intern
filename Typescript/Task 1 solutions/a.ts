import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

function getProductByCategory(category: string): string[] {
  return data.products
    .filter((obj: any) => obj.category === category)
    .map((obj: any) => obj.name)
    .sort();
}

console.log(getProductByCategory("Electronics"));