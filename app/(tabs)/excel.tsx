import ProcessScreenContainer from "@/components/ProsscessScreenContainer";
import { loadFileFromUri } from "@/utils/excelUtils";

const Excel = () => {
  const type = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  return (
    <ProcessScreenContainer
      screenUri="/excel"
      documentTypes={type}
      loadFileFromUri={loadFileFromUri}
    />
  );
};

export default Excel;
