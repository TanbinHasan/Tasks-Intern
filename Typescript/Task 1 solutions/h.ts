import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

function f(): string[] {
  return data.products
    .filter((obj: any) => {
      const hasHighest = obj.reviews.some((review: any) => review.rating === 5);
      const hasLowest = obj.reviews.some((review: any) => review.rating <= 2);
      return hasHighest && hasLowest;
    })
    .map((obj: any) => obj.name);
}

console.log(f());