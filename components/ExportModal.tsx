import {
  AdjacentLot,
  generateHTMLForPreview,
  generateHTMLForPrint,
} from "@/utils/excelUtils";
import { createExcelFile } from "@/utils/wordUtils";
import { File, Paths } from "expo-file-system";
import { printAsync, printToFileAsync } from "expo-print";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  PenLine,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { WebView } from "react-native-webview";

const ExportModal = ({
  visible,
  onClose,
  data,
  inputFilename,
  exportWithExcel,
}: {
  visible: boolean;
  onClose: () => void;
  data: AdjacentLot[];
  inputFilename: string;
  exportWithExcel: boolean;
}) => {
  const htmlForPrint = generateHTMLForPrint(data);
  const htmlForPreview = generateHTMLForPreview(data);
  const [fileName, setFileName] = useState(inputFilename.split(".")[0] || "");
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(fileName);
  const [isLoading, setIsLoading] = useState(false);
  const rotation = useSharedValue(0);

  useEffect(() => {
    setFileName(inputFilename.split(".")[0] || "");
    setInputValue(inputFilename.split(".")[0] || "");
  }, [inputFilename]);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 800 }), -1);
  }, []);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const createPDF = async () => {
    try {
      setIsLoading(true);

      const { uri } = await printToFileAsync({
        html: htmlForPrint,
      });

      const file = new File(uri);
      if (!file.exists) {
        console.log("Failed to create PDF file");
        return;
      }

      const appDirectory = Paths.document;
      const savedPath = `${appDirectory}/${fileName}.pdf`;

      // Nếu file đã tồn tại → xóa
      const existingFile = new File(savedPath);
      if (existingFile.exists) {
        await existingFile.delete();
      }

      // Rename + move
      await file.rename(`${fileName}.pdf`);
      await file.move(appDirectory);

      if (exportWithExcel) {
        await createExcelFile(data, fileName);
      }

      handleCloseModal();
    } catch (error) {
      console.log("Error creating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    await printAsync({
      html: htmlForPrint,
    });
  };

  const handleCancelInput = () => {
    setIsOpen(false);
    setInputValue(fileName);
  };

  const handleConfirmInput = () => {
    setIsOpen(false);
    setFileName(inputValue);
  };

  const handleCloseModal = () => {
    setFileName(inputFilename.split(".")[0] || "");
    setInputValue(inputFilename.split(".")[0] || "");
    onClose();
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
            onPress={handleCloseModal}
            className="flex flex-row items-center"
            disabled={isLoading}
          >
            <ChevronLeft size={20} />
            <Text className="font-semibold text-sm">Quay lại</Text>
          </TouchableOpacity>
          {isLoading ? (
            <Animated.View style={[rotationStyle]}>
              <LoaderCircle />
            </Animated.View>
          ) : (
            <TouchableOpacity
              onPress={createPDF}
              className="flex flex-row items-center"
            >
              <Text className="font-semibold text-sm">Xuất file</Text>
              <ChevronRight size={20} />
            </TouchableOpacity>
          )}
        </View>
        {isOpen ? (
          <View className="w-full flex items-center gap-4 mb-4">
            <View className="flex flex-row gap-3 items-center">
              <Text className="text-lg font-semibold">Nhập tên file:</Text>
              <TextInput
                value={inputValue}
                onChangeText={(value) => setInputValue(value)}
                placeholder="Tên file mới"
                className="border rounded-lg min-w-[100px] max-w-[250px] border-gray-400 py-2"
              />
            </View>
            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                className="border rounded-lg px-2 py-1"
                onPress={handleCancelInput}
              >
                <Text>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-lg px-2 py-1 border border-blue-500 bg-blue-500"
                disabled={inputValue.trim() === "" || inputValue === fileName}
                onPress={handleConfirmInput}
              >
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="w-full relative">
            <Text
              key="preview-title"
              className="text-2xl font-bold mb-4 w-full text-center border-b pb-4 border-gray-400"
            >
              Xem trước {fileName}.pdf
            </Text>
            <TouchableOpacity
              onPress={() => setIsOpen(true)}
              className="absolute top-1 right-4 p-1 border rounded-full border-gray-400"
              disabled={isLoading}
            >
              <PenLine size={14} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        <View className="w-full flex-1 mb-5">
          <WebView originWhitelist={["*"]} source={{ html: htmlForPreview }} />
        </View>
      </View>
    </Modal>
  );
};

export default ExportModal;
