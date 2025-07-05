import { Exercise, supabase } from "@/lib/supabase";
import {
  Activity,
  Dumbbell,
  Plus,
  Search,
  Target,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
];

interface ExercisePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export default function ExercisePicker({
  visible,
  onClose,
  onSelectExercise,
}: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customExercise, setCustomExercise] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exercises from Supabase
  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("exercises").select("*").order("name");

      // Apply category filter
      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(
          `name.ilike.%${searchQuery}%,muscle_groups.ilike.%${searchQuery}%`
        );
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        throw fetchError;
      }

      setExercises(data || []);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      setError(
        `Failed to load exercises: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Test Supabase connection
  const testConnection = async () => {
    try {
      console.log("Testing Supabase connection...");
      const { data, error } = await supabase
        .from("exercises")
        .select("count(*)", { count: "exact" });

      console.log("Connection test result:", { data, error });

      if (error) {
        setError(`Connection failed: ${error.message}`);
      } else {
        console.log("Supabase connection successful");
      }
    } catch (err) {
      console.error("Connection test failed:", err);
      setError(
        `Connection test failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // Fetch exercises when modal opens or filters change
  useEffect(() => {
    if (visible) {
      // testConnection();
      fetchExercises();
    }
  }, [visible, selectedCategory, searchQuery]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      setCustomExercise("");
      setSelectedCategory("All");
      setError(null);
    }
  }, [visible]);

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise);
    setSearchQuery("");
    setCustomExercise("");
    onClose();
  };

  const handleAddCustomExercise = async () => {
    if (!customExercise.trim()) {
      Alert.alert("Error", "Please enter an exercise name");
      return;
    }

    try {
      setLoading(true);

      // Create a custom exercise object
      const customExerciseData = {
        name: customExercise.trim(),
        category: "Custom",
        muscle_groups: "Various",
        instructions: "Custom exercise - add your own instructions",
        equipment: "Various",
        difficulty: "beginner" as const,
      };

      console.log("Adding custom exercise:", customExerciseData);

      // Insert into database
      const { data, error: insertError } = await supabase
        .from("exercises")
        .insert([customExerciseData])
        .select()
        .single();

      console.log("Custom exercise insert result:", {
        data,
        error: insertError,
      });

      if (insertError) {
        throw insertError;
      }

      if (data) {
        handleSelectExercise(data);
      }
    } catch (err) {
      console.error("Error adding custom exercise:", err);
      Alert.alert(
        "Error",
        `Failed to add custom exercise: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Chest":
      case "Back":
      case "Shoulders":
      case "Arms":
        return <Dumbbell size={16} color="#6B7280" />;
      case "Legs":
        return <Target size={16} color="#6B7280" />;
      case "Core":
      case "Cardio":
        return <Activity size={16} color="#6B7280" />;
      default:
        return <Dumbbell size={16} color="#6B7280" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "#059669";
      case "intermediate":
        return "#D97706";
      case "advanced":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Exercise</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Custom Exercise Input */}
        <View style={styles.customExerciseSection}>
          <Text style={styles.sectionTitle}>Or add custom exercise</Text>
          <View style={styles.customExerciseContainer}>
            <TextInput
              style={styles.customExerciseInput}
              placeholder="Enter custom exercise name"
              value={customExercise}
              onChangeText={setCustomExercise}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={[
                styles.addCustomButton,
                (!customExercise.trim() || loading) &&
                  styles.addCustomButtonDisabled,
              ]}
              onPress={handleAddCustomExercise}
              disabled={!customExercise.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Plus size={16} color="#FFFFFF" />
                  <Text
                    style={[
                      styles.addCustomButtonText,
                      (!customExercise.trim() || loading) &&
                        styles.addCustomButtonTextDisabled,
                    ]}
                  >
                    Add
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchExercises}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Debug Info */}
        {/* {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Debug: {exercises.length} exercises loaded, Loading:{" "}
              {loading.toString()}, Error: {error ? "Yes" : "No"}
            </Text>
          </View>
        )} */}

        {/* Exercise List */}
        <ScrollView
          style={styles.exerciseList}
          showsVerticalScrollIndicator={false}
        >
          {loading && exercises.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading exercises...</Text>
            </View>
          ) : (
            <>
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseItem}
                  onPress={() => handleSelectExercise(exercise)}
                >
                  <View style={styles.exerciseIcon}>
                    {getCategoryIcon(exercise.category)}
                  </View>
                  <View style={styles.exerciseInfo}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor:
                              getDifficultyColor(
                                exercise.difficulty || "beginner"
                              ) + "20",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.difficultyText,
                            {
                              color: getDifficultyColor(
                                exercise.difficulty || "beginner"
                              ),
                            },
                          ]}
                        >
                          {getDifficultyText(exercise.difficulty || "beginner")}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.exerciseMuscle}>
                      {exercise.muscle_groups}
                    </Text>
                    {exercise.equipment && (
                      <Text style={styles.exerciseEquipment}>
                        Equipment: {exercise.equipment}
                      </Text>
                    )}
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {exercise.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {!loading && exercises.length === 0 && !error && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No exercises found</Text>
                  <Text style={styles.noResultsSubtext}>
                    {searchQuery ? "Try a different search term or " : ""}
                    Add a custom exercise above
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  customExerciseSection: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  customExerciseContainer: {
    flexDirection: "row",
    gap: 12,
  },
  customExerciseInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addCustomButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "center",
    minWidth: 80,
  },
  addCustomButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  addCustomButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  addCustomButtonTextDisabled: {
    color: "#9CA3AF",
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  debugContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#374151",
    fontFamily: "monospace",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  exerciseList: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  exerciseMuscle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  exerciseEquipment: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },
  noResults: {
    alignItems: "center",
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
