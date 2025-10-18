import { getDocumentAsync } from "expo-document-picker";
import { File } from "expo-file-system";
import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";
import { FileText } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DetailData } from "@/components/DetailData";
import { EditedLot } from "@/components/excel/EditPriceModal";
import ExportButton from "@/components/ExportButton";
import ExportModal from "@/components/ExportModal";
import SelectFile from "@/components/SelectFile";
import { OPTIONS } from "@/Constants/DataFilter";
import { AdjacentLot } from "@/utils/excelUtils";
import { filterData } from "@/utils/utils";
import { extractWordData } from "@/utils/wordUtils";

const Word = () => {
  const [data, setData] = useState<AdjacentLot[]>([]);
  const [displayData, setDisplayData] = useState<AdjacentLot[]>([]);
  const [fileName, setFileName] = useState<string>("Chọn file cần xử lý");
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0].value);

  useEffect(() => {
    if (selectedOption === "all") {
      setDisplayData(data);
    } else if (selectedOption === "auctioned") {
      setDisplayData(filterData(data));
    }
  }, [data, selectedOption]);

  const handlePickFile = async () => {
    try {
      const selectedFile = await getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
          "application/msword", // .doc
        ],
      });

      if (selectedFile.canceled) return;
      const fileUri = selectedFile.assets[0].uri;

      const wordFile = new File(fileUri);
      const base64Data = await wordFile.base64();
      const zip = await JSZip.loadAsync(base64Data, { base64: true });

      const docXml = await zip.file("word/document.xml")?.async("string");
      if (!docXml) throw new Error("Không tìm thấy nội dung trong file Word");

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });

      const json = parser.parse(docXml);
      const body = json["w:document"]["w:body"];

      const tableData = extractWordData(body);
      setData(tableData);
      setFileName(selectedFile.assets[0].name);
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  const handleUpdateLot = (editedLot: EditedLot) => {
    if (editedLot.section === -1) {
      setData((prevData) =>
        prevData.map((adjacentLot) => {
          if (adjacentLot.id !== editedLot.landId) return adjacentLot;

          const updatedLots = adjacentLot.lots.map((lot) =>
            lot.lotId === editedLot.lotId
              ? {
                  lotId: lot.lotId,
                  auctionPrice: editedLot.auctionPrice || 0,
                  area: lot.area,
                  total: editedLot.total || 0,
                }
              : lot
          );

          return {
            ...adjacentLot,
            lots: updatedLots,
          };
        })
      );
      return;
    }

    let currentGroupIndex = 0;
    setData((prevData) =>
      prevData.map((adjacentLot) => {
        if (adjacentLot.id === -1) {
          currentGroupIndex += 1;
          return adjacentLot;
        }

        if (
          currentGroupIndex < editedLot.section! ||
          currentGroupIndex > editedLot.section!
        )
          return adjacentLot;

        if (adjacentLot.id !== editedLot.landId) return adjacentLot;

        const updatedLots = adjacentLot.lots.map((lot) =>
          lot.lotId === editedLot.lotId
            ? {
                lotId: lot.lotId,
                auctionPrice: editedLot.auctionPrice || 0,
                area: lot.area,
                total: editedLot.total || 0,
              }
            : lot
        );
        return {
          ...adjacentLot,
          lots: updatedLots,
        };
      })
    );
  };

  const handleExport = () => {
    setExportModalVisible(true);
  };

  const handleCloseExportModal = () => {
    setExportModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <SelectFile
        handlePickFile={handlePickFile}
        fileName={fileName}
        pickedFile={data.length > 0}
        fileIcon={FileText}
        iconColor="blue"
      />
      <View className="h-[2px] bg-gray-300 shadow-md my-3" />

      <DetailData
        data={data}
        displayData={displayData}
        onUpdate={handleUpdateLot}
        selectedFilter={selectedOption}
        setSelectedFilter={setSelectedOption}
      />
      {displayData.filter((item) => item.id !== -1).length > 0 && (
        <ExportButton onExport={handleExport} />
      )}
      <ExportModal
        visible={exportModalVisible}
        onClose={handleCloseExportModal}
        data={displayData}
        inputFilename={fileName}
      />
    </SafeAreaView>
  );
};

export default Word;
