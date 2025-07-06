import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Hash,
  MoveVertical as MoreVertical,
  Play,
  Target,
  User,
  Weight,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WorkoutExercise {
  name: string;
  sets: number;
  reps?: string;
  repsMin?: string;
  repsMax?: string;
  isBodyWeight: boolean;
  weight: string;
  category?: string;
  muscle_groups?: string;
}

interface Workout {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  exercises: WorkoutExercise[];
}

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
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
              name,
              category,
              muscle_groups
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        setError("Workout not found");
        return;
      }

      // Transform the exercises into expected structure
      const exercises = data.workout_exercises.map((we: any) => ({
        name: we.exercise.name,
        category: we.exercise.category,
        muscle_groups: we.exercise.muscle_groups,
        sets: we.sets,
        reps: we.reps,
        repsMin: we.reps_min,
        repsMax: we.reps_max,
        isBodyWeight: we.is_bodyweight,
        weight: we.is_bodyweight
          ? "BW"
          : we.resistance_value
          ? `${we.resistance_value} ${we.resistance_unit || "lbs"}`
          : "—",
      }));

      setWorkout({
        ...data,
        exercises,
      });
    } catch (err) {
      console.error("Error fetching workout details:", err);
      setError(err instanceof Error ? err.message : "Failed to load workout");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkoutDetails();
  }, [fetchWorkoutDetails]);

  const handleStartWorkout = () => {
    Alert.alert(
      "Start Workout",
      "This will begin a new workout session. Are you ready?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          style: "default",
          onPress: () => {
            // TODO: Navigate to workout session screen
            Alert.alert(
              "Coming Soon",
              "Workout session tracking will be available soon!"
            );
          },
        },
      ]
    );
  };

  const handleScheduleWorkout = () => {
    Alert.alert("Coming Soon", "Workout scheduling will be available soon!");
  };

  const getRepDisplay = (exercise: WorkoutExercise) => {
    if (exercise.repsMin && exercise.repsMax) {
      return `${exercise.repsMin}-${exercise.repsMax}`;
    }
    return exercise.reps || "—";
  };

  const getTotalSets = () => {
    return (
      workout?.exercises.reduce(
        (total, exercise) => total + exercise.sets,
        0
      ) || 0
    );
  };

  const getEstimatedDuration = () => {
    // Rough estimate: 2-3 minutes per set
    const totalSets = getTotalSets();
    const estimatedMinutes = Math.round(totalSets * 2.5);
    return estimatedMinutes;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !workout) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Workout Not Found</Text>
          <Text style={styles.errorText}>
            {error ||
              "The workout you're looking for doesn't exist or has been removed."}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchWorkoutDetails}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Workout Info */}
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          {workout.description && (
            <Text style={styles.workoutDescription}>{workout.description}</Text>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Target size={20} color="#3B82F6" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{workout.exercises.length}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Hash size={20} color="#059669" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{getTotalSets()}</Text>
                <Text style={styles.statLabel}>Total Sets</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Clock size={20} color="#D97706" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{getEstimatedDuration()}</Text>
                <Text style={styles.statLabel}>Est. Minutes</Text>
              </View>
            </View>
          </View>

          {/* Created Date */}
          <Text style={styles.createdDate}>
            Created on {formatDate(workout.created_at)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={handleScheduleWorkout}
          >
            <Calendar size={20} color="#3B82F6" />
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Exercises List */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>

          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  {exercise.muscle_groups && (
                    <Text style={styles.exerciseMuscles}>
                      {exercise.muscle_groups}
                    </Text>
                  )}
                </View>
                {exercise.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {exercise.category}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.exerciseDetails}>
                <View style={styles.exerciseDetailItem}>
                  <View style={styles.exerciseDetailIcon}>
                    <Hash size={16} color="#6B7280" />
                  </View>
                  <Text style={styles.exerciseDetailText}>
                    {exercise.sets} {exercise.sets === 1 ? "set" : "sets"}
                  </Text>
                </View>

                <View style={styles.exerciseDetailItem}>
                  <View style={styles.exerciseDetailIcon}>
                    <Target size={16} color="#6B7280" />
                  </View>
                  <Text style={styles.exerciseDetailText}>
                    {getRepDisplay(exercise)} reps
                  </Text>
                </View>

                <View style={styles.exerciseDetailItem}>
                  <View style={styles.exerciseDetailIcon}>
                    {exercise.isBodyWeight ? (
                      <User size={16} color="#059669" />
                    ) : (
                      <Weight size={16} color="#6B7280" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.exerciseDetailText,
                      exercise.isBodyWeight && styles.bodyWeightText,
                    ]}
                  >
                    {exercise.weight}
                  </Text>
                </View>
              </View>

              {/* Sets Preview */}
              <View style={styles.setsPreview}>
                <Text style={styles.setsPreviewTitle}>Sets</Text>
                <View style={styles.setsGrid}>
                  {Array.from({ length: exercise.sets }, (_, setIndex) => (
                    <View key={setIndex} style={styles.setPreview}>
                      <Text style={styles.setPreviewNumber}>
                        {setIndex + 1}
                      </Text>
                      <Text style={styles.setPreviewText}>
                        {getRepDisplay(exercise)} × {exercise.weight}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  workoutInfo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  workoutName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 40,
  },
  workoutDescription: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  createdDate: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  startButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059669",
    borderRadius: 16,
    paddingVertical: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scheduleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: "#3B82F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
  },
  exercisesSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 24,
  },
  exerciseMuscles: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3B82F6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  exerciseDetails: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  exerciseDetailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  exerciseDetailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  exerciseDetailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  bodyWeightText: {
    color: "#059669",
  },
  setsPreview: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  setsPreviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  setsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  setPreview: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  setPreviewNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 4,
  },
  setPreviewText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    fontWeight: "500",
  },
});
