import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkoutDetails = useCallback(async () => {
    console.log("id", id);
    const { data, error } = await supabase
      .from("workouts")
      .select(
        `
        *,
        workout_exercises (
          sets,
          reps,
          reps_min,
          reps_max,
          is_bodyweight,
          resistance_value,
          resistance_unit,
          exercise:exercises (
            name
          )
        )
      `
      )
      .eq("id", id)
      .single();

    console.log("after query", data);

    if (error) {
      console.error("Error fetching workout details:", error.message);
      return null;
    }

    // Transform the exercises into expected structure
    console.log("data", data);
    const exercises = data.workout_exercises.map((we: any) => ({
      name: we.exercises.name,
      sets: we.sets,
      reps: we.reps,
      repsMin: we.reps_min,
      repsMax: we.reps_max,
      isBodyWeight: we.is_bodyweight,
      weight: we.is_bodyweight
        ? "BW"
        : `${we.resistance_value} ${we.resistance_unit || ""}`,
    }));

    setWorkout({
      ...data,
      exercises,
    });
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchWorkoutDetails();
  }, [fetchWorkoutDetails]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!workout) {
    return <Text style={{ padding: 20 }}>Workout not found.</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{workout.name}</Text>
      <Text style={{ color: "#6B7280", marginBottom: 10 }}>
        {workout.exercises?.length || 0} exercises
      </Text>

      {workout.exercises?.map((exercise: any, idx: number) => (
        <View key={idx} style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {exercise.name}
          </Text>
          <Text style={{ color: "#6B7280" }}>
            {exercise.sets} sets ×{" "}
            {exercise.repsMin && exercise.repsMax
              ? `${exercise.repsMin}-${exercise.repsMax} reps`
              : `${exercise.reps} reps`}{" "}
            × {exercise.weight}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
