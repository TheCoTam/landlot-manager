import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { AdjacentLot } from "@/utils/homeUtils";
import { CircleQuestionMark, Pencil } from "lucide-react-native";
import { useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import Accordion from "../accodiant";
import EditPriceModal, { EditedLot } from "./EditPriceModal";
import EmptyData from "./EmptyData";
import GuildModal from "./GuildModal";

type DetailDataProps = {
  data: AdjacentLot[];
  onUpdate: (editedlot: EditedLot) => void;
};
export const DetailData = ({ data, onUpdate }: DetailDataProps) => {
  const [guildVisible, setGuildVisible] = useState(false);
  const [editPriceVisible, setEditPriceVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  let totalLots = 0;
  data.map((adjacentLot) => (totalLots += adjacentLot.lots.length));

  const openIndex = useSharedValue<number | null>(null);
  const onCloseGuildModal = () => {
    setGuildVisible(false);
  };
  const onCloseEditPriceModal = () => {
    setEditPriceVisible(false);
  };
  const handleAccordionPress = () => {
    // Cuộn lên 50px mỗi khi bấm
    // scrollRef.current?.scrollTo({
    //   y: 50,
    //   animated: true,
    // });

    console.log("Scrolled to 50px");
  };

  return (
    <View
      className="px-4 flex-1 mb-2 gap-4
    "
    >
      <View className="flex flex-row justify-between items-center">
        <Text className="text-2xl font-semibold">Tổng số lô: {totalLots}</Text>
        <View className="flex flex-row items-center gap-6">
          {data.length > 0 && (
            <TouchableOpacity onPress={() => setEditPriceVisible(true)}>
              <Pencil size={22} />
            </TouchableOpacity>
          )}
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
                onPressAccordion={handleAccordionPress}
              />
            ))}
          </View>
        </ScrollView>
      )}
      <GuildModal visible={guildVisible} onClose={onCloseGuildModal} />
      <EditPriceModal
        visible={editPriceVisible}
        onClose={onCloseEditPriceModal}
        data={data}
        onUpdate={onUpdate}
      />
    </View>
  );
};
