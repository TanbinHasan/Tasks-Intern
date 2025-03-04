import * as fs from "fs";
const rw: string = fs.readFileSync("data.json", "utf-8");
const data: any = JSON.parse(rw);

type node = {
  [product_id: string]: {
    positiveCount: number;
    negativeCount: number;
  };
};

function f(): node[] {
  let posWords = ["great", "excellent", "good", "amazing", "comfortable"];
  let negWords = ["poor", "bad", "heavy", "complex", "pricey"];
  let ans: node[] = [];
  data.products.forEach((obj: any) => {
    let posCnt = 0, negCnt = 0;
    obj.reviews.forEach((review: any) => {
      const comment = review.comment.toLowerCase();
      // check the comment contain any positive word or not
      if (posWords.some(word => comment.includes(word))) {
        ++posCnt;
      }
      if (negWords.some(word => comment.includes(word))) {
        ++negCnt;
      }
    });
    let cur: node = {
      [obj.product_id]: {
        positiveCount: posCnt,
        negativeCount: negCnt
      }
    };
    ans.push(cur);
  });
  return ans;
}

console.log(f());