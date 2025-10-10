import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { AdjacentLot } from "@/utils/homeUtils";
import { CircleQuestionMark, Pencil } from "lucide-react-native";
import { useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import Accordion from "../accodiant";
import EditPriceModel, { EditedLot } from "./EditPriceModel";
import EmptyData from "./EmptyData";
import GuildModel from "./GuildModel";

type DetailDataProps = {
  data: AdjacentLot[];
  onUpdate: (editedlot: EditedLot) => void;
};
export const DetailData = ({ data, onUpdate }: DetailDataProps) => {
  const [guildVisible, setGuildVisible] = useState(false);
  const [editPriceVisible, setEditPriceVisible] = useState(false);
  let totalLots = 0;
  data.map((adjacentLot) => (totalLots += adjacentLot.lots.length));

  const openIndex = useSharedValue<number | null>(null);
  const onCloseGuildModel = () => {
    setGuildVisible(false);
  };
  const onCloseEditPriceModel = () => {
    setEditPriceVisible(false);
  };

  return (
    <View
      className="px-4 flex-1 mb-2 gap-4
    "
    >
      <View className="flex flex-row justify-between items-center">
        <Text className="text-2xl font-semibold">Tổng số lô: {totalLots}</Text>
        <View className="flex flex-row items-center gap-6">
          <TouchableOpacity onPress={() => setEditPriceVisible(true)}>
            <Pencil size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGuildVisible(true)}>
            <CircleQuestionMark />
          </TouchableOpacity>
        </View>
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
      <GuildModel visible={guildVisible} onClose={onCloseGuildModel} />
      <EditPriceModel
        visible={editPriceVisible}
        onClose={onCloseEditPriceModel}
        data={data}
        onUpdate={onUpdate}
      />
    </View>
  );
};
