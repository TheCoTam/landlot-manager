import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { DiamondPlus, Eye, Share2, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { fileSizeFormater } from "@/utils/fileManagerUtils";
import PdfPreviewer from "../pdfPreviewer";

interface FileItemProps {
  name: string;
  type: string;
  date: number | null;
  size: number | null;
  uri: string;
  getBase64: () => Promise<string>;
  loadFiles: () => void;
  onDelete: () => void;
}

const DeleteFileModal = ({
  visible,
  onClose,
  onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
}) => {
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleCloseModal}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white w-[80%] rounded-2xl p-6 flex gap-4">
          <Text className="text-2xl font-semibold">Xoá file</Text>
          <Text>Bạn có chắc chắn muốn xóa file này không?</Text>
          <View className="ml-auto flex flex-row gap-6">
            <TouchableOpacity
              onPress={handleCloseModal}
              className="border rounded-lg px-2 py-1"
            >
              <Text>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              className="border border-red-500 bg-red-500 rounded-lg px-2 py-1"
            >
              <Text className="text-white">Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const ViewFileModal = ({
  visible,
  onClose,
  fileUri,
  fileName,
  base64,
}: {
  visible: boolean;
  onClose: () => void;
  fileUri: string;
  fileName: string;
  base64: string;
}) => {
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View className="flex-1 bg-white flex gap-5 p-4">
        <Text className="text-2xl font-semibold">Xem file</Text>
        <View className="border-2 border-gray-300 flex-1">
          <PdfPreviewer base64={base64} fileUri={fileUri} />
        </View>
        <TouchableOpacity
          onPress={handleCloseModal}
          className="border-2 rounded-lg px-2 py-1 items-center"
          style={{ borderColor: "#6b7280", backgroundColor: "#f3f4f6" }}
        >
          <Text>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const FileItem = ({
  name,
  type,
  date,
  size,
  uri,
  getBase64,
  loadFiles,
  onDelete,
}: FileItemProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [viewFileVisible, setViewFileVisible] = useState(false);
  const [base64, setBase64] = useState<string>("");
  const router = useRouter();

  const handleViewFile = async () => {
    const base64 = await getBase64();
    setBase64(base64);
    setViewFileVisible(true);
  };

  const handleShareFile = async () => {
    try {
      const isAvailable = await isAvailableAsync();

      if (!isAvailable) {
        alert("Chức năng hiện chưa khả dụng trên thiết bị này");
        return;
      }

      await shareAsync(uri);
    } catch (error) {
      console.log("Error on sharing file:", error);
    }
  };

  const handleDeleteFile = () => {
    onDelete();
    setDeleteVisible(false);
    loadFiles();
  };

  const handleNavigateToProcessing = () => {
    if (type === "xlsx" || type === "xls") {
      router.push({ pathname: "/excel", params: { uri, fileName: name } });
    } else {
      router.push({ pathname: "/word", params: { uri, fileName: name } });
    }
  };

  return (
    <View className="flex flex-row items-center border-b border-gray-300 mx-2 mt-4 pb-4">
      {type.toLowerCase() === "pdf" && (
        <AntDesign name="file-pdf" size={50} color="orange" />
      )}
      {type.toLowerCase() === "xlsx" && (
        <AntDesign name="file-excel" size={50} color="green" />
      )}
      {type.toLowerCase() === "docx" && (
        <AntDesign name="file-word" size={50} color="blue" />
      )}
      <View className="ml-2 gap-1">
        <Text className="text-xl font-semibold">
          {decodeURIComponent(name)}
        </Text>
        <Text className="text-gray-500">
          {type.toUpperCase()} - {fileSizeFormater(size)}
        </Text>
      </View>
      <View className="ml-auto flex flex-row items-center gap-4">
        {type === "pdf" ? (
          <TouchableOpacity onPress={handleViewFile}>
            <Eye color="gray" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNavigateToProcessing}>
            <DiamondPlus color="gray" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleShareFile}>
          <Share2 color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDeleteVisible(true)}>
          <Trash2 color="gray" />
        </TouchableOpacity>
      </View>
      <DeleteFileModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onDelete={handleDeleteFile}
      />
      <ViewFileModal
        visible={viewFileVisible}
        onClose={() => setViewFileVisible(false)}
        fileUri={uri}
        fileName={name}
        base64={base64}
      />
    </View>
  );
};

export default FileItem;
