import * as Linking from "expo-linking";
import { Facebook, Mail } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const handleOpenFacebook = async () => {
    const url = "https://www.facebook.com/hoang.the.anh.338668";
    // const appUrl = "fb://profile/hoang.the.anh.338668";
    const appUrl = "fb://facewebmodal/f?href=" + url;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        // Nếu app không mở được, fallback sang trình duyệt
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Không thể mở Facebook:", error);
    }
  };

  return (
    <SafeAreaView className="items-center justify-center flex-1 gap-16">
      <View className="border-[3px] border-blue-300 rounded-xl p-1 w-48 aspect-square"></View>
      <View className="gap-5">
        <TouchableOpacity
          className="border-2 border-blue-300 px-4 py-2 rounded-full flex flex-row items-center gap-5"
          // onPress={handleOpenFacebook}
        >
          <Facebook size={32} color="blue" />
          <Text className="text-xl text-blue-800 font-semibold">
            Contact with Facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="border-2 border-blue-300 px-4 py-2 rounded-full flex flex-row items-center gap-5">
          <Mail size={32} color="blue" />
          <Text className="text-xl text-blue-800 font-semibold">
            Contact with Email
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
