import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

function analyzeReviewComments(): Map<string, number> {
  let cnt = new Map<string, number>();
  data.products.forEach((obj: any) => {
    obj.reviews.forEach((review: any) => {
      let words = review.comment
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);
      words.forEach((word: string) => {
        if (word.length >= 3) cnt.set(word, (cnt.get(word) || 0) + 1);
      });
    })
  });
  return cnt;
}

let ans = analyzeReviewComments();
console.log(Object.fromEntries(ans)); // Convert Map to object for readable output