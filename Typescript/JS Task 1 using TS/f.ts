import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

type node = {
  product_id: string;
  name: string;
  avgRating: number;
};

function getTopRatedProducts(): node[] {
  return data.products
    .filter((obj: any) => obj.reviews.length >= 4)
    .map((obj: any) => {
      let total = obj.reviews.reduce((sum: number, cur: any) => sum + cur.rating, 0);
      let avg = Number((total / obj.reviews.length).toFixed(2));

      return {product_id: obj.product_id, name: obj.name, avgRating: avg};
    })
    .sort((a: node, b: node) => b.avgRating - a.avgRating)
    .slice(0, 3);
}

console.log(getTopRatedProducts());