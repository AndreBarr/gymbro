import { AuthGuard } from "@/components/AuthGuard";
import ExercisePicker from "@/components/ExercisePicker";
import {
  ChevronDown,
  ChevronUp,
  Hash,
  Plus,
  Save,
  Search,
  Target,
  ToggleLeft,
  ToggleRight,
  Trash2,
  User,
  Weight,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  isBodyWeight: boolean;
  isRepRange: boolean;
  repMin: string;
  repMax: string;
  isCollapsed: boolean;
}

export default function CreateWorkoutTab() {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const addExercise = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: 3,
      reps: "",
      weight: "",
      isBodyWeight: false,
      isRepRange: false,
      repMin: "",
      repMax: "",
      isCollapsed: false,
    };

    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const toggleExerciseCollapse = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, isCollapsed: !exercise.isCollapsed };
        }
        return exercise;
      })
    );
  };

  const updateExercise = (
    exerciseId: string,
    field: keyof Exercise,
    value: any
  ) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, [field]: value };
        }
        return exercise;
      })
    );
  };

  const toggleBodyWeight = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            isBodyWeight: !exercise.isBodyWeight,
            weight: !exercise.isBodyWeight ? "" : exercise.weight,
          };
        }
        return exercise;
      })
    );
  };

  const toggleRepRange = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            isRepRange: !exercise.isRepRange,
            reps: !exercise.isRepRange ? "" : exercise.reps,
            repMin: !exercise.isRepRange ? exercise.reps : "",
            repMax: !exercise.isRepRange ? "" : "",
          };
        }
        return exercise;
      })
    );
  };

  const getRepDisplay = (exercise: Exercise) => {
    if (exercise.isRepRange) {
      const min = exercise.repMin || "—";
      const max = exercise.repMax || "—";
      return `${min}-${max}`;
    }
    return exercise.reps || "—";
  };

  const getExerciseSummary = (exercise: Exercise) => {
    const reps = getRepDisplay(exercise);
    const weight = exercise.isBodyWeight ? "BW" : exercise.weight || "—";
    return `${exercise.sets} sets × ${reps} × ${weight}`;
  };

  const saveWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert("Error", "Please enter a workout name");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise");
      return;
    }

    Alert.alert("Success", "Workout saved successfully!", [
      {
        text: "OK",
        onPress: () => {
          setWorkoutName("");
          setExercises([]);
        },
      },
    ]);
  };

  return (
    <AuthGuard>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Workout</Text>
            <Text style={styles.subtitle}>
              Design your perfect training session
            </Text>
          </View>
          <View style={styles.content}>
            {/* Workout Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Workout Name</Text>
              <TextInput
                style={styles.workoutNameInput}
                placeholder="Enter workout name"
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {/* Add Exercise */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Exercise</Text>
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => setShowExercisePicker(true)}
              >
                <Search size={20} color="#3B82F6" />
                <Text style={styles.addExerciseButtonText}>
                  Choose from library or add custom
                </Text>
                <Plus size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {/* Exercises List */}
            {exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <TouchableOpacity
                  style={styles.exerciseHeader}
                  onPress={() => toggleExerciseCollapse(exercise.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.exerciseIcon}>
                    <Target size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {exercise.isCollapsed && (
                      <Text style={styles.exerciseSummary}>
                        {getExerciseSummary(exercise)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.exerciseActions}>
                    <TouchableOpacity
                      style={styles.removeExerciseButton}
                      onPress={() => removeExercise(exercise.id)}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                    <View style={styles.collapseButton}>
                      {exercise.isCollapsed ? (
                        <ChevronDown size={20} color="#6B7280" />
                      ) : (
                        <ChevronUp size={20} color="#6B7280" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {!exercise.isCollapsed && (
                  <View style={styles.exerciseDetails}>
                    {/* Sets Control */}
                    <View style={styles.controlRow}>
                      <Text style={styles.controlLabel}>Sets</Text>
                      <View style={styles.setsControl}>
                        <TouchableOpacity
                          style={styles.controlButton}
                          onPress={() =>
                            updateExercise(
                              exercise.id,
                              "sets",
                              Math.max(1, exercise.sets - 1)
                            )
                          }
                        >
                          <Text style={styles.controlButtonText}>−</Text>
                        </TouchableOpacity>
                        <View style={styles.controlDisplay}>
                          <Text style={styles.controlNumber}>
                            {exercise.sets}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.controlButton}
                          onPress={() =>
                            updateExercise(
                              exercise.id,
                              "sets",
                              exercise.sets + 1
                            )
                          }
                        >
                          <Text style={styles.controlButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* Rep Range Toggle */}
                    <View style={styles.toggleRow}>
                      <Text style={styles.toggleLabel}>Rep Range</Text>
                      <TouchableOpacity
                        style={styles.toggle}
                        onPress={() => toggleRepRange(exercise.id)}
                      >
                        {exercise.isRepRange ? (
                          <ToggleRight size={24} color="#3B82F6" />
                        ) : (
                          <ToggleLeft size={24} color="#9CA3AF" />
                        )}
                      </TouchableOpacity>
                    </View>
                    {/* Reps Input */}
                    <View style={styles.inputsRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>
                          {exercise.isRepRange ? "Rep Range" : "Reps"}
                        </Text>
                        {exercise.isRepRange ? (
                          <View style={styles.rangeContainer}>
                            <View style={styles.rangeInputContainer}>
                              <Hash size={16} color="#6B7280" />
                              <TextInput
                                style={styles.rangeInput}
                                placeholder="8"
                                value={exercise.repMin}
                                onChangeText={(value) =>
                                  updateExercise(exercise.id, "repMin", value)
                                }
                                keyboardType="numeric"
                                placeholderTextColor="#9CA3AF"
                              />
                            </View>
                            <Text style={styles.rangeSeparator}>to</Text>
                            <View style={styles.rangeInputContainer}>
                              <Hash size={16} color="#6B7280" />
                              <TextInput
                                style={styles.rangeInput}
                                placeholder="12"
                                value={exercise.repMax}
                                onChangeText={(value) =>
                                  updateExercise(exercise.id, "repMax", value)
                                }
                                keyboardType="numeric"
                                placeholderTextColor="#9CA3AF"
                              />
                            </View>
                          </View>
                        ) : (
                          <View style={styles.inputContainer}>
                            <Hash size={16} color="#6B7280" />
                            <TextInput
                              style={styles.input}
                              placeholder="12"
                              value={exercise.reps}
                              onChangeText={(value) =>
                                updateExercise(exercise.id, "reps", value)
                              }
                              keyboardType="numeric"
                              placeholderTextColor="#9CA3AF"
                            />
                          </View>
                        )}
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Weight</Text>
                        <View
                          style={[
                            styles.inputContainer,
                            exercise.isBodyWeight && styles.bodyWeightContainer,
                          ]}
                        >
                          <TouchableOpacity
                            style={styles.bodyWeightToggle}
                            onPress={() => toggleBodyWeight(exercise.id)}
                          >
                            {exercise.isBodyWeight ? (
                              <User size={16} color="#059669" />
                            ) : (
                              <Weight size={16} color="#6B7280" />
                            )}
                          </TouchableOpacity>
                          {exercise.isBodyWeight ? (
                            <Text style={styles.bodyWeightText}>
                              Body Weight
                            </Text>
                          ) : (
                            <TextInput
                              style={styles.input}
                              placeholder="135 lbs"
                              value={exercise.weight}
                              onChangeText={(value) =>
                                updateExercise(exercise.id, "weight", value)
                              }
                              keyboardType="numeric"
                              placeholderTextColor="#9CA3AF"
                            />
                          )}
                        </View>
                      </View>
                    </View>
                    {/* Sets Preview */}
                    <View style={styles.setsPreview}>
                      <Text style={styles.setsPreviewTitle}>Sets Preview</Text>
                      <View style={styles.setsGrid}>
                        {Array.from({ length: exercise.sets }, (_, index) => (
                          <View key={index} style={styles.setPreview}>
                            <Text style={styles.setPreviewNumber}>
                              {index + 1}
                            </Text>
                            <Text style={styles.setPreviewText}>
                              {getRepDisplay(exercise)} ×{" "}
                              {exercise.isBodyWeight
                                ? "BW"
                                : exercise.weight || "—"}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
            {/* Save Button */}
            {exercises.length > 0 && (
              <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Workout</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        {/* Exercise Picker Modal */}
        <ExercisePicker
          visible={showExercisePicker}
          onClose={() => setShowExercisePicker(false)}
          onSelectExercise={addExercise}
        />
      </SafeAreaView>
    </AuthGuard>
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
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  content: {
    padding: 24,
    paddingTop: 0,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  workoutNameInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addExerciseButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "600",
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
  },
  exerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  exerciseSummary: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  exerciseActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  removeExerciseButton: {
    padding: 4,
  },
  collapseButton: {
    padding: 4,
  },
  exerciseDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  setsControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  controlDisplay: {
    minWidth: 40,
    alignItems: "center",
  },
  controlNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B82F6",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  toggle: {
    padding: 4,
  },
  inputsRow: {
    flexDirection: "row",
    gap: 16,
  },
  inputGroup: {
    flex: 1,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bodyWeightContainer: {
    backgroundColor: "#ECFDF5",
    borderColor: "#D1FAE5",
  },
  bodyWeightToggle: {
    padding: 2,
  },
  bodyWeightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rangeInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rangeInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  rangeSeparator: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    paddingHorizontal: 4,
  },
  setsPreview: {
    gap: 12,
  },
  setsPreviewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  setsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  setPreview: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 8,
    minWidth: 60,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  setPreviewNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 2,
  },
  setPreviewText: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#059669",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
