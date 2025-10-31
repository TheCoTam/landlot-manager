import ProcessScreenContainer from "@/components/ProsscessScreenContainer";
import { LoadFileFromUri } from "@/utils/wordUtils";
import { FileText } from "lucide-react-native";

const Word = () => {
  const type = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
  ];

  return (
    <ProcessScreenContainer
      screenUri="/word"
      documentTypes={type}
      loadFileFromUri={LoadFileFromUri}
      selectFileIcon={FileText}
      selectFileIconColor="blue"
    />
  );
};

export default Word;
