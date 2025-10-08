export type AdjacentLot = {
  id: number;
  lots: { lotId: number; area: number; auctionPrice?: number }[];
};

export function refineData(sheetData: any[]) {
  const [headers, ...rawData] = sheetData;

  const landIdHeader = headers.findIndex((item: String) =>
    item.toString().toLowerCase().includes("lô đất")
  );
  const areaHeader = headers.findIndex((item: String) =>
    item.toString().toLowerCase().includes("diện tích")
  );
  //   const auctionPriceHeader = headers.findIndex((item: String) =>
  //     item.toString().toLowerCase().includes("giá đấu")
  //   );

  if (landIdHeader === -1 || areaHeader === -1) return [];

  const refinedData: AdjacentLot[] = [];
  const currentAdjacentLots: AdjacentLot = { id: 0, lots: [] };

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];

    const landId = row[landIdHeader].toString().toLowerCase();

    if (landId.includes("lk") || landId.includes("liền kề")) {
      refinedData.push({ ...currentAdjacentLots });
      currentAdjacentLots.id = parseInt(landId.replace(/\D/g, ""));

      currentAdjacentLots.lots = [];

      continue;
    }

    const area = parseFloat(row[areaHeader]);
    const tmpLot = {
      lotId: parseInt(landId.replace(/\D/g, "")),
      area: isNaN(area) ? 0 : area,
    };

    currentAdjacentLots.lots.push(tmpLot);
  }
  refinedData.push({ ...currentAdjacentLots });
  refinedData.shift();

  return refinedData;
}
