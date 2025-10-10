import { Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const GuildModel = ({ visible, onClose }: Props) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-80">
          <Text className="text-lg font-bold mb-4">Thông báo</Text>
          <Text>Nội dung dialog ở đây</Text>

          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-500 mt-4 rounded-lg p-3"
          >
            <Text className="text-white text-center">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GuildModel;
