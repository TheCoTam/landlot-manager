import { FileOutput } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface Props {
  onExport: () => void;
}

const ExportButton = ({ onExport }: Props) => {
  return (
    <View className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg">
      <TouchableOpacity onPress={onExport}>
        <FileOutput color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

export default ExportButton;
