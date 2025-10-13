import {
  AdjacentLot,
  generateHTMLForPreview,
  generateHTMLForPrint,
} from "@/utils/homeUtils";
import { printAsync, printToFileAsync } from "expo-print";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

const ExportModal = ({
  visible,
  onClose,
  data,
}: {
  visible: boolean;
  onClose: () => void;
  data: AdjacentLot[];
}) => {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const htmlForPrint = generateHTMLForPrint(data);
  const htmlForPreview = generateHTMLForPreview(data);
  const generatePDF = async () => {
    const { uri } = await printToFileAsync({ html: htmlForPrint });
    console.log("PDF đã tạo:", uri);
    setPdfUri(uri);
  };

  // const sharePDF = async () => {
  //   const { uri } = await printToFileAsync({
  //     html,
  //     fileName: "preview.pdf", // ghi đè mỗi lần
  //   } as any);

  //   // console.log("PDF được lưu tại:", uri);

  //   // Chỉ mở xem, không in
  //   await shareAsync(uri, {
  //     mimeType: "application/pdf",
  //     dialogTitle: "Xem PDF",
  //   });
  // };

  const handlePreview = async () => {
    await printAsync({ html: htmlForPrint });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      className=""
    >
      <View className="flex-1 bg-white flex items-center">
        <View className="flex flex-row px-3 py-5 w-full items-center justify-between">
          <TouchableOpacity
            onPress={onClose}
            className="flex flex-row items-center"
          >
            <ChevronLeft size={20} />
            <Text className="font-semibold text-sm">Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePreview}
            className="flex flex-row items-center"
          >
            <Text className="font-semibold text-sm">Xuất file</Text>
            <ChevronRight size={20} />
          </TouchableOpacity>
        </View>
        <Text
          key="preview-title"
          className="text-2xl font-bold mb-4 w-full text-center border-b pb-4 border-gray-400"
        >
          Xem trước
        </Text>
        <View className="w-full flex-1 my-5">
          <WebView originWhitelist={["*"]} source={{ html: htmlForPreview }} />
        </View>
      </View>
    </Modal>
  );
};

export default ExportModal;
