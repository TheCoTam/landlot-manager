import { getDocumentAsync } from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { FilePlus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  loadFiles: () => void;
}

const FileManagerHeader = ({ loadFiles }: HeaderProps) => {
  const handlePickFile = async () => {
    try {
      const selectedFile = await getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
          "application/msword", // .doc
        ],
      });
      if (selectedFile.canceled) return;
      const fileUri = selectedFile.assets[0].uri;
      const file = new File(fileUri);
      if (!file.exists) {
        console.log("Failed to upload file");
        return;
      }
      const appDirectory = Paths.document;
      await file.rename(selectedFile.assets[0].name);
      await file.move(appDirectory);

      loadFiles();
    } catch (error) {
      console.log("Error picking file in FileManagerHeader:", error);
    }
  };

  return (
    <View className="flex flex-row items-center justify-between px-4 pt-10">
      <Text className="text-4xl font-semibold ">Tài liệu của tôi</Text>
      <TouchableOpacity onPress={handlePickFile}>
        <FilePlus size={30} color="green" />
      </TouchableOpacity>
    </View>
  );
};

export default FileManagerHeader;
