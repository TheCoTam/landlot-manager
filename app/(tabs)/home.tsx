import { getDocumentAsync } from "expo-document-picker";
import { File } from "expo-file-system";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { read as xlsxRead, utils as xlsxUtils } from "xlsx";

import { DetailData } from "@/components/home/DetailData";
import { EditedLot } from "@/components/home/EditPriceModal";
import ExportButton from "@/components/home/ExportButton";
import SelectFile from "@/components/home/SelectFile";

import ExportModal from "@/components/home/ExportModal";
import { AdjacentLot, refineData } from "@/utils/homeUtils";

const Home = () => {
  const [data, setData] = useState<AdjacentLot[]>([]);
  const [fileName, setFileName] = useState<string>("Chọn file cần xử lý");
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const handlePickFile = async () => {
    try {
      const selectedFile = await getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
      });

      if (selectedFile.canceled) return;
      const fileUri = selectedFile.assets[0].uri;

      const excelFile = new File(fileUri);
      const base64Data = await excelFile.base64();
      const workbook = xlsxRead(base64Data, { type: "base64" });

      const sheetNames = workbook.SheetNames;

      const firstSheet = workbook.Sheets[sheetNames[0]];

      const sheetData = xlsxUtils.sheet_to_json(firstSheet, { header: 1 });

      const refinedData = refineData(sheetData);

      setData(refinedData);
      setFileName(selectedFile.assets[0].name);
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  const handleUpdateLot = (editedLot: EditedLot) => {
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
      />
      <View className="h-[2px] bg-gray-300 shadow-md my-3" />

      <DetailData data={data} onUpdate={handleUpdateLot} />
      <ExportButton onExport={handleExport} />
      <ExportModal
        visible={exportModalVisible}
        onClose={handleCloseExportModal}
        data={data}
      />
    </SafeAreaView>
  );
};

export default Home;
