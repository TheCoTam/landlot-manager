import { Construction, File, LucideIcon, Phone } from "lucide-react-native";

export type TabType = {
  name: string;
  label: string;
  icon: LucideIcon;
  route: string;
};

export const TAB_MENU: TabType[] = [
  {
    name: "home",
    label: "Bảo trì",
    icon: Construction,
    route: "/home",
  },
  { name: "file", label: "Tài liệu", icon: File, route: "/file" },
  { name: "contact", label: "Liên Hệ", icon: Phone, route: "/contact" },
];

export const TAB_MENU_HEIGHT = 80;
export const ICON_SIZE = 45;
