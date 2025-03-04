import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

function getAverageRatings(): {name: string; avg: number} [] {
  return data.products.map((obj: any) => {
    let sum = obj.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    let avgRating = obj.reviews.length > 0 ? Number((sum / obj.reviews.length).toFixed(2)) : 0;
    return {
      name: obj.name,
      avg: avgRating
    };
  });
}

console.log(getAverageRatings());