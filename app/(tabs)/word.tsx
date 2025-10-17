import { getDocumentAsync } from "expo-document-picker";
import { File } from "expo-file-system";
import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DetailData } from "@/components/DetailData";
import { EditedLot } from "@/components/excel/EditPriceModal";
import SelectFile from "@/components/SelectFile";
import { extractWordData } from "@/utils/wordUtils";
import { FileText } from "lucide-react-native";

const Word = () => {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("Chọn file cần xử lý");
  const [selectedOption, setSelectedOption] = useState("");

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

  const handleUpdateLot = (editedLot: EditedLot) => {};

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
        displayData={data}
        onUpdate={handleUpdateLot}
        selectedFilter={selectedOption}
        setSelectedFilter={setSelectedOption}
      />
    </SafeAreaView>
  );
};

export default Word;
