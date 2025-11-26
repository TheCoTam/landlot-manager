import { FileSpreadsheet, LucideIcon, Plus } from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

interface SelectFileProps {
  handlePickFile: () => void;
  pickedFile: boolean;
  fileName: string;
  fileIcon?: LucideIcon;
  iconColor?: string;
}

const SelectFile = ({
  handlePickFile,
  fileName,
  pickedFile,
  fileIcon = FileSpreadsheet,
  iconColor = "green",
}: SelectFileProps) => {
  const SIZE = Dimensions.get("window").width * 0.3;
  const IconComponent = fileIcon;

  return (
    <View className="p-5 flex flex-row gap-5">
      <View
        className="border-[3px] rounded-xl aspect-square items-center justify-center"
        style={{ width: SIZE, borderColor: "gray" }}
      >
        <TouchableOpacity
          className="w-full h-full items-center justify-center"
          onPress={handlePickFile}
        >
          {!pickedFile ? (
            <Plus size={SIZE * 0.8} color="gray" strokeWidth={3} />
          ) : (
            <IconComponent size={SIZE * 0.8} color={iconColor} />
          )}
        </TouchableOpacity>
      </View>
      <Text
        key="splitter"
        className="text-2xl font-semibold self-center flex-1 line-clamp-4"
      >
        {fileName}
      </Text>
    </View>
  );
};

export default SelectFile;
