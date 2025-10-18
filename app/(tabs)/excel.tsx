import { getDocumentAsync } from "expo-document-picker";
import { File } from "expo-file-system";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { read as xlsxRead, utils as xlsxUtils } from "xlsx";

import { DetailData } from "@/components/DetailData";
import { EditedLot } from "@/components/excel/EditPriceModal";
import ExportButton from "@/components/ExportButton";
import ExportModal from "@/components/ExportModal";
import SelectFile from "@/components/SelectFile";
import { OPTIONS } from "@/Constants/DataFilter";
import { AdjacentLot, loadFileFromUri, refineData } from "@/utils/excelUtils";
import { filterData } from "@/utils/utils";

const Excel = () => {
  const [data, setData] = useState<AdjacentLot[]>([]);
  const [displayData, setDisplayData] = useState<AdjacentLot[]>([]);
  const [fileName, setFileName] = useState<string>("Chọn file cần xử lý");
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0].value);
  const router = useRouter();
  const { uri, fileName: paramFileName } = useLocalSearchParams();

  useEffect(() => {
    if (selectedOption === "all") {
      setDisplayData(data);
    } else if (selectedOption === "auctioned") {
      setDisplayData(filterData(data));
    }
  }, [data, selectedOption]);

  useFocusEffect(
    useCallback(() => {
      const loadDataFromUri = async () => {
        if (uri && paramFileName) {
          const dataFromUri = await loadFileFromUri(uri.toString());
          setData(dataFromUri);
          setFileName(paramFileName.toString());

          router.replace("/excel");
        }
      };

      loadDataFromUri();
    }, [uri, paramFileName])
  );

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

        if (currentGroupIndex < editedLot.section!) return adjacentLot;

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

export default Excel;
