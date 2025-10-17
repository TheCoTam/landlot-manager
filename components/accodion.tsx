import { formatCurrency, Lot } from "@/utils/excelUtils";
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

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function AccordionContent({ data }: { data: Lot[] }) {
  const [headerHeight, setHeaderHeight] = useState(0);

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
          style={{ maxHeight: headerHeight * 5 + 2 }}
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

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

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
      <Text className="flex-[3] text-right">{formatCurrency(price)}</Text>
      <Text className="flex-[3.5] text-right">
        {formatCurrency(area * price)}
      </Text>
    </View>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function Parent({
  open,
  data,
  adjacent,
}: {
  open: SharedValue<boolean>;
  data: Lot[];
  adjacent: string;
}) {
  return (
    <View className="w-full">
      <AccordionItem isExpanded={open} viewKey={`${adjacent}-${data.length}`}>
        <AccordionContent data={data} />
      </AccordionItem>
    </View>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export default function Accordion({
  label,
  subLabel,
  index,
  openIndex,
  data,
  onPressAccordion,
}: {
  label: string;
  subLabel?: string;
  index: string;
  openIndex: SharedValue<string | null>;
  data: Lot[];
  onPressAccordion: () => void;
}) {
  const isOpen = useDerivedValue(() => openIndex.value === index);
  const rotation = useDerivedValue(() =>
    withTiming(isOpen.value ? 180 : 90, { duration: 300 })
  );
  const onPress = () => {
    // onPressAccordion();
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
        <Parent open={isOpen} data={data} adjacent={index.toString()} />
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
