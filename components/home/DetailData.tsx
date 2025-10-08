import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { AdjacentLot } from "@/utils/homeUtils";
import { CircleQuestionMark } from "lucide-react-native";
import { useSharedValue } from "react-native-reanimated";
import Accordion from "../accodiant";
import EmptyData from "./EmptyData";

type DetailDataProps = {
  data: AdjacentLot[];
};
export const DetailData = ({ data }: DetailDataProps) => {
  let totalLots = 0;
  data.map((adjacentLot) => (totalLots += adjacentLot.lots.length));

  const openIndex = useSharedValue<number | null>(null);
  return (
    <View
      className="px-4 flex-1 mb-2 gap-4
    "
    >
      <View className="flex flex-row justify-between items-center">
        <Text className="text-2xl font-semibold">Tổng số lô: {totalLots}</Text>
        <TouchableOpacity>
          <CircleQuestionMark />
        </TouchableOpacity>
      </View>
      {data.length === 0 ? (
        <EmptyData />
      ) : (
        <ScrollView>
          <View className="gap-4 mb-2">
            {data.map((item, index) => (
              <Accordion
                key={index}
                label={`Liền kề ${item.id}`}
                subLabel={`${item.lots.length} lô`}
                index={index}
                openIndex={openIndex}
                data={item.lots}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
