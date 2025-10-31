import { getDocumentAsync } from "expo-document-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { OPTIONS } from "@/Constants/DataFilter";
import { AdjacentLot } from "@/utils/excelUtils";
import { filterData } from "@/utils/utils";
import { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DetailData } from "./DetailData";
import ExportButton from "./ExportButton";
import ExportModal from "./ExportModal";
import SelectFile from "./SelectFile";
import { EditedLot } from "./excel/EditPriceModal";

interface Props {
  screenUri: string;
  loadFileFromUri: (uri: string) => Promise<AdjacentLot[]>;
  documentTypes: string[];
  selectFileIcon?: LucideIcon;
  selectFileIconColor?: string;
}

const ProcessScreenContainer = ({
  screenUri,
  loadFileFromUri,
  documentTypes,
  selectFileIcon,
  selectFileIconColor,
}: Props) => {
  const [data, setData] = useState<AdjacentLot[]>([]);
  const [fileName, setFileName] = useState<string>("Chọn file cần xử lý");
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0].value);
  const router = useRouter();
  const { uri, fileName: paramFileName } = useLocalSearchParams();
  const filteredData =
    selectedOption === "all"
      ? data
      : selectedOption === "auctioned"
        ? filterData(data)
        : [];

  useFocusEffect(
    useCallback(() => {
      const loadDataFromUri = async () => {
        if (uri && paramFileName) {
          const dataFromUri = await loadFileFromUri(uri.toString());
          setData(dataFromUri);
          setFileName(paramFileName.toString());

          router.replace(screenUri as any);
        }
      };

      loadDataFromUri();
    }, [uri, paramFileName])
  );

  const handlePickFile = async () => {
    try {
      const selectedFile = await getDocumentAsync({
        type: [...documentTypes],
      });
      if (selectedFile.canceled) return;
      const fileUri = selectedFile.assets[0].uri;
      const refinedData = await loadFileFromUri(fileUri);

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
        fileIcon={selectFileIcon}
        iconColor={selectFileIconColor}
      />
      <View className="h-[2px] bg-gray-300 shadow-md my-3" />

      <DetailData
        data={data}
        displayData={filteredData}
        onUpdate={handleUpdateLot}
        selectedFilter={selectedOption}
        setSelectedFilter={setSelectedOption}
      />
      {filteredData.filter((item) => item.id !== -1).length > 0 && (
        <ExportButton onExport={handleExport} />
      )}
      <ExportModal
        visible={exportModalVisible}
        onClose={handleCloseExportModal}
        data={filteredData}
        inputFilename={fileName}
      />
    </SafeAreaView>
  );
};

export default ProcessScreenContainer;
