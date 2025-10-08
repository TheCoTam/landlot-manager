import { DetailData } from "@/components/home/DetailData";
import SelectFile from "@/components/home/SelectFile";
import { AdjacentLot, refineData } from "@/utils/homeUtils";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as XLSX from "xlsx";

const Home = () => {
  const [data, setData] = useState<AdjacentLot[]>([]);
  const [fileName, setFileName] = useState<string>("Chọn file cần xử lý");
  const insets = useSafeAreaInsets(); // Get safe area insets

  const handlePickFile = async () => {
    try {
      const selectedFile = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
      });

      if (selectedFile.canceled) return;
      const fileUri = selectedFile.assets[0].uri;

      const excelFile = new FileSystem.File(fileUri);
      const base64Data = await excelFile.base64();
      const workbook = XLSX.read(base64Data, { type: "base64" });

      const sheetNames = workbook.SheetNames;

      const firstSheet = workbook.Sheets[sheetNames[0]];

      const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      const refinedData = refineData(sheetData);

      setData(refinedData);
      setFileName(selectedFile.assets[0].name);
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <SelectFile
        handlePickFile={handlePickFile}
        fileName={fileName}
        pickedFile={data.length > 0}
      />
      <View className="h-[2px] bg-gray-300 shadow-md my-3" />
      <DetailData data={data} />
    </SafeAreaView>
  );
};

export default Home;
