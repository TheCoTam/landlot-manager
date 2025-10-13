export type Lot = {
  lotId: number;
  area: number;
  auctionPrice?: number;
  total?: number;
};

export type AdjacentLot = {
  id: number;
  lots: Lot[];
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

export const filterData = (data: AdjacentLot[]) => {
  const filteredData = [];
  for (let i = 0; i < data.length; i++) {
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

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export const generateHTMLForPrint = (data: AdjacentLot[]) => {
  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 5mm;
            margin: 0;
          }
          h1 {
            text-align: center;
            color: #1e40af;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
            font-size: 20px;

          }
          th, td {
            border: 1px solid #1e40af;
            padding: 8px;
            text-align: center;
            line-height: 1.8;
          }
          thead {
            background-color: #e0e7ff;
            display: table-row-group;
          }
          tr {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th style="width:13%">Lô đất</th>
              <th style="width:14%">Diện tích</th>
              <th style="width:23%">Đơn giá</th>
              <th style="width:25%">Thành tiền</th>
              <th style="width:25%">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (group) => `
                <tr>
                  <td colspan="5" style="text-align: left;">Liền kề ${group.id}</td>
                </tr>
                ${group.lots
                  .map(
                    (lot) => `
                    <tr>
                      <td>${lot.lotId}</td>
                      <td>${lot.area}</td>
                      <td style="text-align: right;">${formatCurrency(lot.auctionPrice || 0)}</td>
                      <td style="text-align: right;">${formatCurrency(lot.total || 0)}</td>
                      <td></td>
                    </tr>
                  `
                  )
                  .join("")}
              `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

export const generateHTMLForPreview = (data: AdjacentLot[]) => {
  return `
  <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 0mm;
            margin: 0;
          }
          h1 {
            text-align: center;
            color: #1e40af;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
            font-size: 30px;

          }
          th, td {
            border: 1px solid #1e40af;
            padding: 8px;
            text-align: center;
            line-height: 1.8;
          }
          thead {
            background-color: #e0e7ff;
          }
          .page {
            background: white;
            width: 100%;
            min-height: 297mm;
            padding: 0 5mm;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <table>
            <thead>
              <tr>
                <th style="width:13%">Lô đất</th>
                <th style="width:14%">Diện tích</th>
                <th style="width:23%">Đơn giá</th>
                <th style="width:25%">Thành tiền</th>
                <th style="width:25%">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (group) => `
                  <tr>
                    <td colspan="5" style="text-align: left;">Liền kề ${group.id}</td>
                  </tr>
                  ${group.lots
                    .map(
                      (lot) => `
                      <tr>
                        <td>${lot.lotId}</td>
                        <td>${lot.area}</td>
                        <td style="text-align: right;">${formatCurrency(lot.auctionPrice || 0)}</td>
                        <td style="text-align: right;">${formatCurrency(lot.total || 0)}</td>
                        <td></td>
                      </tr>
                    `
                    )
                    .join("")}
                `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
};
