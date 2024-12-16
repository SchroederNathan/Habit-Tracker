import { generateLast90Days } from "@/helpers/CardHelpers";
import { Habit } from "@/models/models";
import clsx from "clsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // import plugin
import utc from "dayjs/plugin/utc"; // Day.js timezone depends on utc plugin
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Icons from "react-native-heroicons/solid";

dayjs.extend(utc); // use plugin
dayjs.extend(timezone); // use plugin

// dayjs.extend(isSameOrBefore);

interface HabitProps extends Habit {
  habitEntry: (id: string, date: string) => void;
}

const HabitCard = ({ id, name, description, days, habitEntry }: HabitProps) => {
  const completedDates = days.map((day) =>
    dayjs(day.date).format("YYYY-MM-DD")
  );

  const last60Days = generateLast90Days();

  // Count occurrences of each date
  const dateCounts: Record<string, number> = completedDates.reduce(
    (acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Function to map count to opacity class
  const getColor = (date: string) => {
    const count = dateCounts[date] || 0;
    if (count >= 4) return "bg-primary"; // Full opacity
    if (count === 3) return "bg-primary/75";
    if (count === 2) return "bg-primary/50";
    if (count === 1) return "bg-primary/25";
    return "bg-primary/10"; // Default for uncompleted days
  };

  const getHaptic = () => {
    // get todays date
    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const count = dateCounts[date] || 0;
    if (count >= 4)
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (count === 3)
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (count === 2)
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (count === 1)
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (count === 0)
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  };

  return (
    <View
      key={id}
      className="bg-white rounded-lg flex-col p-3 mb-3 shadow-lg shadow-black/10"
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View className="bg-primary/10 w-12 aspect-square rounded-lg flex justify-center items-center me-3">
            <Icons.CodeBracketIcon fill={"#0b357f"} size={24} />
          </View>
          {/* Habit Name */}
          <View className="flex-col justify-center">
            <Text className="text-lg font-lsemibold text-text ">{name}</Text>
            {description && (
              <Text className="text-md font-lsemibold text-text/70">
                {description}
              </Text>
            )}
          </View>
        </View>
        {/* Button */}
        <TouchableOpacity
          className="bg-primary w-12 aspect-square rounded-lg flex justify-center items-center"
          onPress={() => {
            const currentDate = dayjs();
            const formattedDate = currentDate.format('YYYY-MM-DD');
            habitEntry(id, formattedDate);
            getHaptic();
          }}
        >
          <Icons.CheckIcon fill={"white"} size={24} />
        </TouchableOpacity>
      </View>
      {/* Days Grid and Button */}
      <View className="flex-row items-center ">
        {/* Days Grid */}
        <View className="flex-row flex-wrap justify-center items-center gap-[4px] -mx-2">
          {last60Days.map((day) => (
            <View
              key={day}
              className={clsx("aspect-square rounded-md", getColor(day))}
              style={{
                flexBasis: `${100 / 23}%`, // Adjust for a 23-column grid
              }}
              accessibilityLabel={`Date: ${dayjs(day).format("MMM D, YYYY")}`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default HabitCard;
