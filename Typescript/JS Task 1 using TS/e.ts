import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

function getUniqueUserID(): Set<string> {
  let ans = new Set<string>();
  data.products.forEach((obj: any) => {
    obj.reviews.forEach((review: any) => {
      ans.add(review.user_id);
    });
  });
  return ans;
}

console.log(getUniqueUserID());