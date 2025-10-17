import { AdjacentLot } from "./excelUtils";

export function splitDataById(data: AdjacentLot[], spliter: number = -1) {
  let tmpArray: AdjacentLot[] = [];
  const resultArray: AdjacentLot[][] = [];

  for (const item of data) {
    if (item.id === spliter) {
      if (tmpArray.length > 0) resultArray.push([...tmpArray]);
      tmpArray = [item];
      continue;
    }
    tmpArray.push(item);
  }
  resultArray.push([...tmpArray]);
  return resultArray;
}
