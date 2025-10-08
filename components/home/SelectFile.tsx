import { FileSpreadsheet, Plus } from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface SelectFileProps {
  handlePickFile: () => void;
  pickedFile: boolean;
  fileName: string;
}

const SelectFile = ({
  handlePickFile,
  fileName,
  pickedFile,
}: SelectFileProps) => {
  const SIZE = Dimensions.get("window").width * 0.3;

  return (
    <View className="p-10 flex flex-row gap-5">
      <View
        className="border-[3px] rounded-xl aspect-square items-center justify-center"
        style={{ width: SIZE, borderColor: "gray" }}
      >
        {!pickedFile ? (
          <TouchableOpacity
            className="w-full h-full items-center justify-center"
            onPress={handlePickFile}
          >
            <Plus size={SIZE * 0.8} color="gray" strokeWidth={3} />
          </TouchableOpacity>
        ) : (
          <FileSpreadsheet size={SIZE * 0.8} color="green" />
        )}
      </View>
      <Text key="splitter" className="text-3xl font-semibold self-center">
        {fileName}
      </Text>
    </View>
  );
};

export default SelectFile;
