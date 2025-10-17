import {
  FileDown,
  FileSpreadsheet,
  FileText,
  LucideIcon,
  Phone,
} from "lucide-react-native";

export type TabType = {
  name: string;
  label: string;
  icon: LucideIcon;
  route: string;
};

export const TAB_MENU: TabType[] = [
  {
    name: "excel",
    label: "Excel",
    icon: FileSpreadsheet,
    route: "/excel",
  },
  { name: "word", label: "Word", icon: FileText, route: "/word" },
  { name: "file", label: "Tài liệu", icon: FileDown, route: "/file" },
  { name: "contact", label: "Liên Hệ", icon: Phone, route: "/contact" },
];

export const TAB_MENU_HEIGHT = 80;
export const ICON_SIZE = 45;
