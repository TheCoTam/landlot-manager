import { useDebounce } from "@/hooks/use-debounce";
import { AdjacentLot, Lot } from "@/utils/excelUtils";
import {
  exTractIdAndSection,
  getLotsDetailsBySectionAndId,
} from "@/utils/utils";
import { Camera } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: AdjacentLot[];
  onUpdate: (lot: EditedLot) => void;
}

export type EditedLot = {
  section?: number;
  landId: number;
  lotId: number;
  area: number;
  auctionPrice: number;
  total?: number;
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const SectionSelection = ({
  sectionList,
  value,
  setValue,
}: {
  sectionList: string[];
  value: number;
  setValue: (value: number) => void;
}) => {
  const dropdownData = sectionList.map((section, index) => ({
    label: section,
    value: (index + 1).toString(),
  }));

  return (
    <View className="flex flex-row">
      <Dropdown
        data={dropdownData}
        labelField="label"
        valueField="value"
        placeholder="Chọn khu vực thôn, xã"
        value={value.toString()}
        onChange={(item) => setValue(parseInt(item.value))}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
      />
    </View>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const LandSelection = React.memo(
  ({
    landIdList,
    value,
    setValue,
    disabled = false,
  }: {
    landIdList: number[];
    value: number;
    setValue: (value: number) => void;
    disabled?: boolean;
  }) => {
    const dropdownData = landIdList.map((num) => ({
      label: num.toString(),
      value: num,
    }));

    useEffect(() => {
      setValue(-1);
    }, [landIdList]);

    return (
      <View className="flex flex-row gap-2 items-center flex-[3]">
        <Text className="text-lg">Liền kề:</Text>
        <Dropdown
          data={dropdownData}
          labelField="label"
          valueField="value"
          placeholder="Chọn liền kề"
          value={value}
          onChange={(item) => setValue(item.value)}
          disable={disabled}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
          placeholderStyle={{ color: "#999" }}
          selectedTextStyle={{ color: "#000" }}
        />
      </View>
    );
  }
);

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const LotSelection = ({
  lotsData,
  value,
  setValue,
}: {
  lotsData: Lot[];
  value: number;
  setValue: ({
    lotId,
    area,
    price,
  }: {
    lotId: number;
    area: number;
    price: number;
  }) => void;
}) => {
  const refinedData = lotsData.map((item) => ({
    ...item,
    lotId: item.lotId.toString(),
  }));

  useEffect(() => {
    setValue({
      lotId: -1,
      area: 0,
      price: 0,
    });
  }, [lotsData]);

  return (
    <View className="flex flex-row gap-2 items-center flex-[2]">
      <Text className="text-lg">Lô:</Text>
      <Dropdown
        data={refinedData}
        labelField="lotId"
        valueField="lotId"
        placeholder="Chọn lô"
        value={String(value)}
        onChange={(item) => {
          setValue({
            lotId: parseInt(item.lotId),
            area: item.area,
            price: item.auctionPrice,
          });
        }}
        disable={refinedData.length === 0}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
        placeholderStyle={{ color: "#999" }}
        selectedTextStyle={{ color: "#000" }}
      />
    </View>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const LotArea = ({ area }: { area: number }) => {
  return (
    <View>
      <Text className="text-lg">Diện tích: {area} m²</Text>
    </View>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const LotAuctionPrice = ({
  defaultValue,
  onChangePrice,
  disabled = false,
}: {
  defaultValue: string;
  onChangePrice: (text: string) => void;
  disabled?: boolean;
}) => {
  const [rawValue, setRawValue] = useState(defaultValue || "");
  const [displayValue, setDisplayValue] = useState(defaultValue || "");
  const debouncedValue = useDebounce(rawValue);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (defaultValue !== rawValue) {
      setRawValue(defaultValue || "");
      setDisplayValue(formatCurrency(defaultValue || ""));
    }
  }, [defaultValue]);

  useEffect(() => {
    onChangePrice(debouncedValue);
  }, [debouncedValue]);

  const formatCurrency = (value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const handleChangeText = (text: string) => {
    // Chỉ giữ lại ký tự số
    const numericText = text.replace(/\D/g, "");
    setRawValue(numericText);
    setDisplayValue(formatCurrency(numericText));
  };

  return (
    <View className="flex flex-row gap-4 items-center">
      <Text className="text-lg">Giá đấu:</Text>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="flex flex-row flex-1 items-center border border-gray-300 rounded-md px-2"
      >
        <TextInput
          ref={inputRef}
          placeholder="Nhập giá đấu"
          keyboardType="numeric"
          className=" flex-1 text-lg"
          value={displayValue}
          onChangeText={handleChangeText}
          editable={!disabled}
        />
        <Text className="ml-1 text-gray-600 text-lg">VND/m²</Text>
      </Pressable>
    </View>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const TotalPrice = ({ total }: { total: number }) => {
  const formatedTotal = new Intl.NumberFormat("vi-VN").format(total) + "  VND";

  return (
    <View>
      <Text className="text-lg">Thành tiền: {formatedTotal}</Text>
    </View>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const EditPriceModal = ({ visible, onClose, data, onUpdate }: Props) => {
  const { sectionList, landIdList } = useMemo(() => {
    return exTractIdAndSection(data);
  }, [data]);
  const [landIds, setLandIds] = useState<number[]>(landIdList[0]);
  const [editedLot, setEditedLot] = useState<EditedLot>({
    section: -1,
    landId: -1,
    lotId: -1,
    area: 0,
    auctionPrice: 0,
    total: 0,
  } as EditedLot);
  const [lotsList, setLotsList] = useState<Lot[]>([]);

  const possiableUpdate = editedLot.landId !== -1 && editedLot.lotId !== -1;

  useEffect(() => {
    if (landIdList && landIdList.length > 0) {
      setLandIds(landIdList[0]);
    }
  }, [landIdList]);

  const handleSetSection = (sectionIndex: number) => {
    setEditedLot({
      section: sectionIndex,
      landId: -1,
      lotId: -1,
      area: 0,
      auctionPrice: 0,
      total: 0,
    } as EditedLot);
    const landIdsForSection = landIdList[sectionIndex - 1] || [];
    setLandIds(landIdsForSection);
  };

  const setLandSelection = (value: number) => {
    setEditedLot(
      (prev) =>
        ({
          section: prev.section,
          landId: value,
          lotId: -1,
          area: 0,
          auctionPrice: 0,
        }) as EditedLot
    );
    setLotsList(
      getLotsDetailsBySectionAndId(data, editedLot.section || 0, value)
    );
  };

  const setLotSelection = ({
    lotId,
    area,
    price,
  }: {
    lotId: number;
    area: number;
    price: number;
  }) => {
    const _price = Math.max(parseInt(String(price)) || 0, 0);
    const _area = Math.max(parseFloat(String(area)) || 0, 0);
    const total = _area * _price;

    setEditedLot(
      (prev) =>
        ({
          ...prev,
          lotId,
          area: _area,
          auctionPrice: _price,
          total,
        }) as EditedLot
    );
  };

  const handleChangeAuctionPrice = (text: string) => {
    const price = Math.max(parseInt(text) || 0, 0);
    const area = Math.max(parseFloat(String(editedLot.area)) || 0, 0);
    const total = area * price;

    setEditedLot((prev) => ({
      ...prev,
      auctionPrice: price,
      total,
    }));
  };

  const handleCloseModal = () => {
    setEditedLot({
      section: -1,
      landId: -1,
      lotId: -1,
      area: 0,
      auctionPrice: 0,
      total: 0,
    } as EditedLot);
    setLotsList([]);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-[85%] flex gap-6">
          <View className="flex flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold">Thay đổi giá đấu lô đất</Text>
            <TouchableOpacity>
              <Camera />
            </TouchableOpacity>
          </View>

          <View className="flex gap-4">
            {sectionList.length > 0 && (
              <SectionSelection
                sectionList={sectionList}
                value={editedLot.section || -1}
                setValue={handleSetSection}
              />
            )}
            <View className="flex flex-row items-center gap-4">
              <LandSelection
                landIdList={landIds}
                value={editedLot.landId}
                setValue={setLandSelection}
                disabled={sectionList.length > 0 && editedLot.section === -1}
              />
              <LotSelection
                lotsData={lotsList}
                value={editedLot.lotId}
                setValue={setLotSelection}
              />
            </View>
            <LotArea area={editedLot.area} />
            <LotAuctionPrice
              defaultValue={String(editedLot.auctionPrice)}
              onChangePrice={handleChangeAuctionPrice}
              disabled={editedLot.lotId === -1}
            />
            <TotalPrice total={editedLot.total || 0} />
          </View>
          <Text className="italic text-gray-400">
            * Vui lòng chọn lần lượt liền kề, lô đất và điền giá đấu để cập nhật
            dữ liệu
          </Text>
          <View className="flex flex-row items-center justify-end gap-6">
            <TouchableOpacity
              onPress={handleCloseModal}
              className="bg-white border border-gray-300 rounded-lg p-3"
            >
              <Text className="text-center">Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`${possiableUpdate ? "bg-blue-500" : "bg-blue-300"} rounded-lg p-3`}
              disabled={!possiableUpdate}
              onPress={() => {
                onUpdate(editedLot);
                handleCloseModal();
              }}
            >
              <Text className="text-white text-center">Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditPriceModal;
