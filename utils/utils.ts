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

export const filterData = (data: AdjacentLot[]) => {
  const filteredData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === -1) {
      filteredData.push({ ...data[i] });
      continue;
    }

    const tmpLots = data[i].lots.filter(
      (lot) => lot.auctionPrice && lot.auctionPrice > 0
    );

    if (tmpLots.length > 0) {
      filteredData.push({
        id: data[i].id,
        lots: tmpLots,
      });
    }
  }
  return filteredData;
};

export function exTractIdAndSection(data: AdjacentLot[]) {
  const sectionList: string[] = [];
  const landIdList: number[][] = [];
  let currentGroup: number[] = [];

  for (const item of data) {
    if (item.id === -1) {
      sectionList.push(item.section || "");
      if (currentGroup.length > 0) landIdList.push([...currentGroup]);
      currentGroup = [];
    } else {
      currentGroup.push(item.id);
    }
  }
  landIdList.push([...currentGroup]);
  return { sectionList, landIdList };
}

export function getLotsDetailsBySectionAndId(
  data: AdjacentLot[],
  sectionIndex: number,
  landId: number
) {
  let currentGroupIndex = 0;

  for (const item of data) {
    if (item.id === -1) {
      currentGroupIndex += 1;
      continue;
    }

    if (currentGroupIndex < sectionIndex) continue;

    if (item.id === landId) {
      return item.lots;
    }
  }

  return [];
}
