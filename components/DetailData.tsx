import { CircleQuestionMark, Pencil } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { OPTIONS } from "@/Constants/DataFilter";
import { AdjacentLot } from "@/utils/excelUtils";
import { splitDataById } from "@/utils/utils";
import Accordion from "./accodion";
import EditPriceModal, { EditedLot } from "./excel/EditPriceModal";
import EmptyData from "./excel/EmptyData";
import GuildModal from "./excel/GuildModal";
import RadioButton from "./radioButton";

type DetailDataProps = {
  data: AdjacentLot[];
  displayData: AdjacentLot[];
  onUpdate: (editedlot: EditedLot) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
};

export const DetailData = ({
  data,
  displayData,
  onUpdate,
  selectedFilter,
  setSelectedFilter,
}: DetailDataProps) => {
  const [guildVisible, setGuildVisible] = useState(false);
  const [editPriceVisible, setEditPriceVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  let totalLots = 0;
  displayData.map((adjacentLot) => (totalLots += adjacentLot.lots.length));

  const openIndex = useSharedValue<string | null>(null);
  const onCloseGuildModal = () => {
    setGuildVisible(false);
  };
  const onCloseEditPriceModal = () => {
    setEditPriceVisible(false);
  };
  const handleAccordionPress = () => {
    // TODO: Fix scroll issue

    console.log("Scrolled to 50px");
  };

  return (
    <View className="px-4 flex-1 gap-4">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-2xl font-semibold">Tổng số lô: {totalLots}</Text>
        <View className="flex flex-row gap-4">
          {OPTIONS.map((option) => (
            <RadioButton
              key={option.value}
              label={option.label}
              selected={selectedFilter === option.value}
              onPress={() => setSelectedFilter(option.value)}
            />
          ))}
        </View>
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
      {displayData.length === 0 ? (
        <EmptyData />
      ) : (
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {splitDataById(displayData).map((groupData, groupIndex) => {
            let section = "";
            if (groupData[0].id === -1) {
              section = groupData.shift()?.section || "";
            }

            return (
              <View key={groupIndex}>
                {section?.trim() !== "" && (
                  <Text className="text-lg mb-5">{section}</Text>
                )}
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  nestedScrollEnabled
                >
                  <View className="gap-4 bg-gray-">
                    {groupData.map((item, index) => (
                      <Accordion
                        key={index}
                        label={`Liền kề ${item.id}`}
                        subLabel={`${item.lots.length} lô`}
                        index={`${groupIndex}-${index}`}
                        openIndex={openIndex}
                        data={item.lots}
                        onPressAccordion={handleAccordionPress}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            );
          })}
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
