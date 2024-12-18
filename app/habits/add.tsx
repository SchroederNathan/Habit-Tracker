import { DismissKeyboard } from "@/helpers/CardHelpers";
import { heroIcons } from "@/helpers/Icons";
import { Habit } from "@/models/models";
import { guidGenerator } from "@/services/habitService";
import { useHabitsStore } from "@/zustand/store";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../components/FormField";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import NumberStepper from "../components/NumberStepper";

const AddHabitScreen = () => {
  const addHabit = useHabitsStore((state) => state.addHabit);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxEntries, setMaxEntries] = useState<number>(1);

  // Validate and filter icons to ensure they are valid
  const validIcons = useMemo(
    () => heroIcons.filter((icon) => icon && typeof icon === "function"),
    [heroIcons]
  );

  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(0); // Track selected icon by index

  const handleCreate = () => {
    const habit: Habit = {
      id: guidGenerator(),
      name: name,
      description: description,
      days: [],
      maxEntries: maxEntries,
      icon: selectedIconIndex,
    };

    if (name.trim()) {
      addHabit(habit);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    }
  };

  const renderIcon = (IconComponent: any, index: number) => {
    return (
      <TouchableOpacity
        key={`icon-${index}`}
        className={`
          bg-secondary-container 
          w-12
          h-12
          rounded-lg 
          flex 
          justify-center 
          items-center 
          ${selectedIconIndex === index ? "border-2 border-secondary" : ""}
        `}
        onPress={() => setSelectedIconIndex(index)}
      >
        <IconComponent color={"#232323"} size={24} strokeWidth={2} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background overflow-visible relative">
      <Header name="Add Habit" />
      <DismissKeyboard>
        <ScrollView className="flex-1 px-4 py-2 bg-background">
          <FormField
            title="Name"
            value={name}
            maxLength={42}
            hideMaxLength={true}
            placeholder={"Ex. Morning Run"}
            handleChangeText={setName}
            keyboardType="default"
            otherStyles="mb-4"
          />

          <FormField
            title="Description"
            value={description}
            maxLength={42}
            placeholder={"Add a brief description (optional)"}
            handleChangeText={setDescription}
            keyboardType="default"
            otherStyles="mb-4"
          />

          <NumberStepper
            title="Entries Per Day"
            otherStyles="mb-4"
            value={maxEntries}
            onChange={setMaxEntries}
          />

          <Text className="text-text font-lmedium mb-2">Icon</Text>

          {/* Update the icon container */}
          <View className="flex-row flex-wrap gap-2 mb-4 justify-between">
            {validIcons.map((IconComponent, index) =>
              renderIcon(IconComponent, index)
            )}
          </View>

          <PrimaryButton
            title="Create"
            otherStyles="mt-4 mb-4"
            onPress={handleCreate}
            color="bg-primary"
          />
        </ScrollView>
      </DismissKeyboard>
    </SafeAreaView>
  );
};

export default AddHabitScreen;
