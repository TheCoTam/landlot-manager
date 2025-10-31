import { EXCEL_FILE_EXTENSIONS } from "@/Constants/fileManager/fileExtension";
import AntDesign from "@expo/vector-icons/AntDesign";
import { File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FileFilter from "@/components/document/fileFilter";
import FileItem from "@/components/document/fileItem";
import FileManagerHeader from "@/components/document/header";
import { OPTIONS } from "@/Constants/FileTabSelector";

function FileManager() {
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0].value);
  const [files, setFiles] = useState<File[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredFiles = useMemo(
    () =>
      files
        .filter((file) => {
          const fileName = file.uri.split("/").pop() || "Unknown";
          if (!fileName.toLocaleLowerCase().includes(searchValue)) return false;

          switch (selectedOption) {
            case "all":
              return true;
            case "excel":
              const EXCEL_EXT = [".xls", ".xlsx"];
              return EXCEL_EXT.some((ext) =>
                file.uri.toLowerCase().endsWith(ext)
              );
            case "word":
              const WORD_EXT = [".doc", ".docx"];
              return WORD_EXT.some((ext) =>
                file.uri.toLowerCase().endsWith(ext)
              );
            case "pdf":
              return file.uri.toLowerCase().endsWith(".pdf");
            default:
              return true;
          }
        })
        .sort((a, b) =>
          selectedOption === "recent" ? b.creationTime! - a.creationTime! : 0
        ),
    [files, selectedOption, searchValue]
  );

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
      <FileFilter
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setSearchValue={setSearchValue}
      />
      <View className="px-4 flex-1">
        {filteredFiles.length > 0 ? (
          <ScrollView>
            {filteredFiles.map((file, index) => {
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
        ) : (
          <View className="flex-1 flex gap-5 justify-center items-center">
            <AntDesign name="frown" size={120} color="gray" />
            <Text className="text-xl text-gray-500 font-semibold">
              Không tìm thấy tài liệu.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default FileManager;
