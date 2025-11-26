import { File, Paths } from "expo-file-system";
import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";
import { utils as excelUtils, write } from "xlsx";

import {
  NUM_OF_COLS_DATA,
  WORD_HEADER_KEYWORDS,
} from "@/Constants/word/WordHeader";
import { AdjacentLot } from "./excelUtils";

interface DocxBody {
  "w:p"?: any | any[];
  "w:tbl"?: any | any[];
  [key: string]: any;
}

export async function LoadFileFromUri(uri: string) {
  const file = new File(uri);
  const base64Data = await file.base64();
  const zip = await JSZip.loadAsync(base64Data, { base64: true });

  const docXml = await zip.file("word/document.xml")?.async("string");
  if (!docXml) throw new Error("Không tìm thấy nội dung trong file Word");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const json = parser.parse(docXml);
  const body = json["w:document"]["w:body"];

  return extractWordData(body);
}

export function extractWordData(docXml: DocxBody) {
  // Extract tables from the document body
  const tables = Array.isArray(docXml["w:tbl"])
    ? docXml["w:tbl"]
    : [docXml["w:tbl"]];

  for (const table of tables) {
    const rows = Array.isArray(table["w:tr"]) ? table["w:tr"] : [table["w:tr"]];
    if (!rows?.length || !rows[0]?.["w:tc"]) continue;

    const firstRow = rows[0];
    const cells = Array.isArray(firstRow["w:tc"])
      ? firstRow["w:tc"]
      : [firstRow["w:tc"]];
    const cellsData = cells.map((cell: any) => extractTextFromCell(cell));
    if (cellsData.length !== WORD_HEADER_KEYWORDS.length) continue;

    if (isRowMatched(cellsData, WORD_HEADER_KEYWORDS)) {
      const tableData: string[][] = rows.map((row: any) => {
        // Extract cells from each row (convert to array if single cell)
        const cells = Array.isArray(row["w:tc"]) ? row["w:tc"] : [row["w:tc"]];

        return cells.map((cell: any) => extractTextFromCell(cell));
      });

      const resData: AdjacentLot[] = [];
      const currentAdjacentLots: AdjacentLot = { id: 0, lots: [] };
      for (const row of tableData) {
        if (isRowMatched(row, WORD_HEADER_KEYWORDS)) continue;
        if (isRowMatched(row, ["đồng", "m2", "lô đất"], 0.6)) continue;
        if (isRowMatched(row, ["tổng"])) continue;
        if (isRowMatched(row, ["liền kề", "lk"], 0.5)) {
          if (currentAdjacentLots.id !== 0)
            resData.push({ ...currentAdjacentLots });
          const id = parseInt(
            row
              .find(
                (item) =>
                  item.toLowerCase().includes("lk") ||
                  item.toLowerCase().includes("liền kề")
              )
              ?.replace(/\D/g, "") || "0"
          );

          currentAdjacentLots.id = id;
          currentAdjacentLots.lots = [];
          continue;
        }

        if (row.length === NUM_OF_COLS_DATA) {
          const lotId = parseInt(row[1]) || 0;
          const area = parseFloat(row[2].replace(",", ".")) || 0;

          currentAdjacentLots.lots.push({
            lotId,
            area,
            auctionPrice: 0,
            total: 0,
          });
          continue;
        }

        if (currentAdjacentLots.id !== 0)
          resData.push({ ...currentAdjacentLots });
        currentAdjacentLots.id = 0;
        currentAdjacentLots.lots = [];
        resData.push({ id: -1, lots: [], section: row.join(" ") });
      }

      resData.push({ ...currentAdjacentLots });
      return resData;
    }
  }

  return [];
}

const isRowMatched = (
  cellsData: string[],
  keywords: string[],
  threshold: number = 0.8
) => {
  const cellsText = cellsData.map((cell) => cell.toLowerCase()).join("");
  const matchCount = keywords.filter((keyword) =>
    cellsText.includes(keyword)
  ).length;
  return matchCount / keywords.length >= threshold;
};

function extractTextFromCell(cell: any): string {
  // Return empty string if no paragraphs in cell
  if (!cell["w:p"]) return "";
  // Ensure paragraphs are in an array
  const paragraphs = Array.isArray(cell["w:p"]) ? cell["w:p"] : [cell["w:p"]];
  const texts: any[] = [];

  for (const p of paragraphs) {
    if (!p["w:r"]) continue;
    const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
    for (const r of runs) {
      const t = r["w:t"];
      if (t !== undefined) {
        const text = typeof t === "object" ? (t["#text"] ?? "") : t;
        texts.push(text);
      }
    }
  }

  return texts.join(" ").trim();
}

export const createExcelFile = async (
  data: AdjacentLot[],
  fileName: string
) => {
  try {
    const rows = [];

    // Header
    rows.push(["Lô đất", "Diện tích", "Đơn giá", "Thành tiền", "Ghi chú"]);

    // Body
    data.forEach((group) => {
      if (group.id === -1) {
        rows.push([group.section, "", "", "", ""]);
      } else {
        rows.push([`Liền kề ${group.id}`, "", "", "", ""]);

        group.lots.forEach((lot) => {
          rows.push([lot.lotId, lot.area, lot.auctionPrice, lot.total, ""]);
        });
      }
    });

    // Tạo worksheet
    const worksheet = excelUtils.aoa_to_sheet(rows);

    // Merge ô cho section và group
    const merges: any[] = [];
    let rowIndex = 1;

    data.forEach((group) => {
      if (group.id === -1) {
        merges.push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: 4 },
        });
        rowIndex++;
      } else {
        merges.push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: 4 },
        });
        rowIndex++;

        group.lots.forEach(() => {
          rowIndex++;
        });
      }
    });

    worksheet["!merges"] = merges;

    // Tạo workbook
    const workbook = excelUtils.book_new();
    excelUtils.book_append_sheet(workbook, worksheet, fileName);

    // Xuất file dạng base64
    const arrayBuffer = write(workbook, { type: "array", bookType: "xlsx" });
    const uint8 = new Uint8Array(arrayBuffer);
    const file = new File(Paths.document, `${fileName}.xlsx`);
    await file.create({ overwrite: true });
    await file.write(uint8);
  } catch (error) {
    console.log("Error creating Excel:", error);
  }
};
