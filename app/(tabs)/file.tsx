import FileItem from "@/components/document/fileItem";
import FileManagerHeader from "@/components/document/header";
import { EXCEL_FILE_EXTENSIONS } from "@/Constants/fileManager/fileExtension";
import { OPTIONS } from "@/Constants/FileTabSelector";
import { File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { Search } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FileManager() {
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0].value);
  const [files, setFiles] = useState<File[]>([]);

  const loadFiles = () => {
    try {
      const directory = Paths.document;
      const filteredFiles = directory
        .list()
        .filter((item) =>
          EXCEL_FILE_EXTENSIONS.some((ext) =>
            item.uri.toLowerCase().endsWith(ext)
          )
        ) as File[];

      setFiles(filteredFiles);
    } catch (error) {
      console.log("Error loading files", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1">
      <FileManagerHeader loadFiles={loadFiles} />
      <View className="flex flex-row items-center m-4 border gap-2 px-2 rounded-lg bg-gray-200 border-gray-400">
        <Search size={23} />
        <TextInput placeholder="Nhập tên file..." className="flex-1 text-lg" />
      </View>
      <View className="border-b border-gray-300 pl-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`px-4 py-2 mr-2 border-b-2 ${selectedOption === option.value ? "border-blue-400" : "border-transparent"}`}
              onPress={() => setSelectedOption(option.value)}
            >
              <Text
                className={`text-lg ${selectedOption === option.value && "text-blue-500"}`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className="px-4">
        <ScrollView>
          {files.map((file, index) => {
            const fileName = file.uri.split("/").pop() || "Unknown";
            const fileType = fileName.split(".").pop() || "unknown";

            const handleDeleteFile = () => {
              file.delete();
            };
            return (
              <FileItem
                key={index}
                name={fileName}
                type={fileType}
                date={file.modificationTime}
                size={file.size}
                uri={file.uri}
                getBase64={() =>
                  (file.base64 as unknown as () => Promise<string>)()
                }
                loadFiles={loadFiles}
                onDelete={handleDeleteFile}
              />
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default FileManager;
