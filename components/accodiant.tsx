import { Triangle } from "lucide-react-native";
import React, { ReactNode, useState } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type AccordionItemProps = {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  viewKey: string;
  style?: StyleProp<ViewStyle>;
  duration?: number;
};

function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 300,
}: AccordionItemProps) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}
    >
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}

function AccordionContent({
  data,
}: {
  data: { lotId: number; area: number; auctionPrice?: number }[];
}) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const items = [
    {
      lotId: "Lô 1",
      area: 142.5,
      price: "19.200.000đ",
      total: "1.628.000.000đ",
    },
    {
      lotId: "Lô 2",
      area: 150.0,
      price: "20.000.000đ",
      total: "1.800.000.000đ",
    },
    {
      lotId: "Lô 3",
      area: 130.0,
      price: "18.500.000đ",
      total: "1.550.000.000đ",
    },
    {
      lotId: "Lô 4",
      area: 160.0,
      price: "21.000.000đ",
      total: "1.920.000.000đ",
    },
    {
      lotId: "Lô 5",
      area: 145.0,
      price: "19.500.000đ",
      total: "1.750.000.000đ",
    },
    {
      lotId: "Lô 6",
      area: 155.0,
      price: "20.500.000đ",
      total: "1.850.000.000đ",
    },
    {
      lotId: "Lô 7",
      area: 135.0,
      price: "18.800.000đ",
      total: "1.600.000.000đ",
    },
    {
      lotId: "Lô 8",
      area: 165.0,
      price: "21.500.000đ",
      total: "1.775.000.000đ",
    },
    {
      lotId: "Lô 9",
      area: 140.0,
      price: "19.000.000đ",
      total: "1.680.000.000đ",
    },
  ];

  return (
    <View className="w-full px-6 flex flex-row">
      <View className="border-r border-dashed h-full" />
      <View className="w-full">
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setHeaderHeight(height);
          }}
        >
          <ItemHeader />
        </View>
        <ScrollView
          style={{ height: headerHeight * 5 + 2 }}
          className="bg-white"
          nestedScrollEnabled
        >
          {data.map((item, index) => (
            <Item
              key={index}
              lotId={item.lotId}
              area={item.area}
              price={item.auctionPrice || 0}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function ItemHeader() {
  return (
    <View className="border-b border-dashed px-6 py-4 text-lg flex flex-row">
      <Text className="flex-[1.5] text-center">Lô đất</Text>
      <Text className="flex-[2] text-center">Diện tích</Text>
      <Text className="flex-[3] text-right">Giá đấu</Text>
      <Text className="flex-[3.5] text-right">Thành tiền</Text>
    </View>
  );
}

function Item({
  lotId,
  area,
  price,
}: {
  lotId: number;
  area: number;
  price: number;
}) {
  return (
    <View className="border-b border-dashed px-6 py-4 text-lg flex flex-row">
      <Text className="flex-[1.5] text-center">{lotId}</Text>
      <Text className="flex-[2] text-center">{area}</Text>
      <Text className="flex-[3] text-right">{price}</Text>
      <Text className="flex-[3.5] text-right">{area * price}</Text>
    </View>
  );
}

function Parent({
  open,
  data,
}: {
  open: SharedValue<boolean>;
  data: { lotId: number; area: number; auctionPrice?: number }[];
}) {
  return (
    <View className="w-full">
      <AccordionItem isExpanded={open} viewKey="Accordion">
        <AccordionContent data={data} />
      </AccordionItem>
    </View>
  );
}

export default function Accordion({
  label,
  subLabel,
  index,
  openIndex,
  data,
}: {
  label: string;
  subLabel?: string;
  index: number;
  openIndex: SharedValue<number | null>;
  data: { lotId: number; area: number; auctionPrice?: number }[];
}) {
  const isOpen = useDerivedValue(() => openIndex.value === index);
  const rotation = useDerivedValue(() =>
    withTiming(isOpen.value ? 180 : 90, { duration: 300 })
  );
  const onPress = () => {
    openIndex.value = openIndex.value === index ? null : index;
  };

  const animatedTriangleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View>
      <TouchableHighlight
        onPress={onPress}
        underlayColor={"#bfdbfe"}
        className="w-full border-2 border-blue-300 rounded-full p-4"
      >
        <View className="flex flex-row items-center gap-8">
          <Animated.View style={animatedTriangleStyle}>
            <Triangle size={15} />
          </Animated.View>
          <Text className="text-xl font-semibold">{label}</Text>
          <Text className="text-xl font-semibold">{subLabel}</Text>
        </View>
      </TouchableHighlight>

      <View className="flex-1 items-center justify-center">
        <Parent open={isOpen} data={data} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
  } as ViewStyle,
  animatedView: {
    width: "100%",
    overflow: "hidden",
  } as ViewStyle,
});
