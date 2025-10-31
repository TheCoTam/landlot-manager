import { IMAGES } from "@/assets/images";
import { CONTACT_OPTIONS } from "@/Constants/contact";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Contact = () => {
  return (
    <SafeAreaView className="items-center justify-center flex-1 gap-16">
      <View className="border-[3px] border-blue-300 rounded-xl p-1 w-48 aspect-square overflow-hidden">
        <Image source={IMAGES.splash} className="w-full h-full object-cover" />
      </View>
      <View className="gap-5">
        {CONTACT_OPTIONS.map((option, index) => {
          const IconComponent = option.iconComponent;
          return (
            <TouchableOpacity
              key={index}
              className="border-2 border-blue-300 px-6 py-2 rounded-full flex flex-row items-center gap-5"
              onPress={() => Linking.openURL(option.uri)}
            >
              <View className="aspect-square w-10 h-10 flex items-center justify-center">
                <IconComponent
                  name={option.name as any}
                  size={28}
                  color="blue"
                />
              </View>
              <Text className="text-xl text-blue-800 font-semibold">
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default Contact;
