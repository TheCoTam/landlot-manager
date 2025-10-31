import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const PHONE_NUMBER = "0972782236";
export const EMAIL = "hoangnguyenanhtuyen@gmail.com";
export const USER_ID = "hoang.the.anh.338668";

export const CONTACT_OPTIONS = [
  {
    iconComponent: FontAwesome,
    name: "facebook",
    label: "Liên hệ Facebook",
    uri: `https://m.me/${USER_ID}`,
  },
  {
    iconComponent: Feather,
    name: "mail",
    label: "Liên hệ Mail",
    uri: `mailto:${EMAIL}`,
  },
  {
    iconComponent: Feather,
    name: "phone",
    label: "Liên hệ SĐT",
    uri: `tel:${PHONE_NUMBER}`,
  },
  {
    iconComponent: FontAwesome6,
    name: "z",
    label: "Liên hệ Zalo",
    uri: `https://zalo.me/${PHONE_NUMBER}`,
  },
];
