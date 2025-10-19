import { Search } from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { OPTIONS } from "@/Constants/FileTabSelector";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface FileFilterProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  setSearchValue: (value: string) => void;
}

const FileFilter = ({
  selectedOption,
  setSelectedOption,
  setSearchValue,
}: FileFilterProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(inputValue);

  useEffect(() => {
    setSearchValue(debouncedValue.toLowerCase());
  }, [debouncedValue]);

  return (
    <>
      <View className="flex flex-row items-center m-4 border gap-2 px-2 rounded-lg bg-gray-200 border-gray-400">
        <Search size={23} />
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Nhập tên file..."
          className="flex-1 text-lg"
        />
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
    </>
  );
};

export default FileFilter;
