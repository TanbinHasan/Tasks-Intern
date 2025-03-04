import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

function getProductByFeature(feature: string): string[] {
  const searchTerm = feature.toLowerCase();
  return data.products
    .filter((obj: any) => obj.features.some((feat: string) => feat.toLowerCase().includes(searchTerm)))
    .map((obj: any) => obj.product_id);
}

console.log(getProductByFeature("Bluetooth"));