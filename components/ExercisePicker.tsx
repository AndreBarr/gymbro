import { Activity, Dumbbell, Search, Target, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Exercise {
  name: string;
  category: string;
  muscle: string;
}

const PREDEFINED_EXERCISES: Exercise[] = [
  // Chest
  { name: "Push-ups", category: "Chest", muscle: "Chest, Triceps" },
  { name: "Bench Press", category: "Chest", muscle: "Chest, Triceps" },
  { name: "Incline Bench Press", category: "Chest", muscle: "Upper Chest" },
  { name: "Decline Bench Press", category: "Chest", muscle: "Lower Chest" },
  { name: "Dumbbell Flyes", category: "Chest", muscle: "Chest" },
  { name: "Chest Dips", category: "Chest", muscle: "Chest, Triceps" },

  // Back
  { name: "Pull-ups", category: "Back", muscle: "Lats, Biceps" },
  { name: "Chin-ups", category: "Back", muscle: "Lats, Biceps" },
  { name: "Deadlifts", category: "Back", muscle: "Back, Glutes, Hamstrings" },
  { name: "Bent-over Rows", category: "Back", muscle: "Lats, Rhomboids" },
  { name: "T-Bar Rows", category: "Back", muscle: "Lats, Rhomboids" },
  { name: "Lat Pulldowns", category: "Back", muscle: "Lats" },
  { name: "Seated Cable Rows", category: "Back", muscle: "Lats, Rhomboids" },

  // Legs
  { name: "Squats", category: "Legs", muscle: "Quads, Glutes" },
  { name: "Lunges", category: "Legs", muscle: "Quads, Glutes" },
  { name: "Leg Press", category: "Legs", muscle: "Quads, Glutes" },
  {
    name: "Romanian Deadlifts",
    category: "Legs",
    muscle: "Hamstrings, Glutes",
  },
  { name: "Leg Curls", category: "Legs", muscle: "Hamstrings" },
  { name: "Leg Extensions", category: "Legs", muscle: "Quadriceps" },
  { name: "Calf Raises", category: "Legs", muscle: "Calves" },
  { name: "Bulgarian Split Squats", category: "Legs", muscle: "Quads, Glutes" },

  // Shoulders
  {
    name: "Overhead Press",
    category: "Shoulders",
    muscle: "Shoulders, Triceps",
  },
  { name: "Lateral Raises", category: "Shoulders", muscle: "Side Delts" },
  { name: "Front Raises", category: "Shoulders", muscle: "Front Delts" },
  { name: "Rear Delt Flyes", category: "Shoulders", muscle: "Rear Delts" },
  { name: "Arnold Press", category: "Shoulders", muscle: "Shoulders" },
  { name: "Upright Rows", category: "Shoulders", muscle: "Shoulders, Traps" },

  // Arms
  { name: "Bicep Curls", category: "Arms", muscle: "Biceps" },
  { name: "Hammer Curls", category: "Arms", muscle: "Biceps, Forearms" },
  { name: "Tricep Dips", category: "Arms", muscle: "Triceps" },
  { name: "Tricep Extensions", category: "Arms", muscle: "Triceps" },
  {
    name: "Close-grip Bench Press",
    category: "Arms",
    muscle: "Triceps, Chest",
  },
  { name: "Preacher Curls", category: "Arms", muscle: "Biceps" },

  // Core
  { name: "Plank", category: "Core", muscle: "Core" },
  { name: "Crunches", category: "Core", muscle: "Abs" },
  { name: "Russian Twists", category: "Core", muscle: "Obliques" },
  { name: "Mountain Climbers", category: "Core", muscle: "Core, Cardio" },
  { name: "Dead Bug", category: "Core", muscle: "Core" },
  { name: "Bicycle Crunches", category: "Core", muscle: "Abs, Obliques" },

  // Cardio
  { name: "Burpees", category: "Cardio", muscle: "Full Body" },
  { name: "Jumping Jacks", category: "Cardio", muscle: "Full Body" },
  { name: "High Knees", category: "Cardio", muscle: "Legs, Cardio" },
  { name: "Jump Rope", category: "Cardio", muscle: "Full Body" },
  { name: "Box Jumps", category: "Cardio", muscle: "Legs, Cardio" },
];

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
  onSelectExercise: (exerciseName: string) => void;
}

export default function ExercisePicker({
  visible,
  onClose,
  onSelectExercise,
}: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customExercise, setCustomExercise] = useState("");

  const filteredExercises = PREDEFINED_EXERCISES.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectExercise = (exerciseName: string) => {
    onSelectExercise(exerciseName);
    setSearchQuery("");
    setCustomExercise("");
    onClose();
  };

  const handleAddCustomExercise = () => {
    if (customExercise.trim()) {
      handleSelectExercise(customExercise.trim());
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
                !customExercise.trim() && styles.addCustomButtonDisabled,
              ]}
              onPress={handleAddCustomExercise}
              disabled={!customExercise.trim()}
            >
              <Text
                style={[
                  styles.addCustomButtonText,
                  !customExercise.trim() && styles.addCustomButtonTextDisabled,
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercise List */}
        <ScrollView
          style={styles.exerciseList}
          showsVerticalScrollIndicator={false}
        >
          {filteredExercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseItem}
              onPress={() => handleSelectExercise(exercise.name)}
            >
              <View style={styles.exerciseIcon}>
                {getCategoryIcon(exercise.category)}
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {exercise.category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {filteredExercises.length === 0 && searchQuery && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No exercises found</Text>
              <Text style={styles.noResultsSubtext}>
                Try a different search term or add a custom exercise
              </Text>
            </View>
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
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
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
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  exerciseMuscle: {
    fontSize: 14,
    color: "#6B7280",
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
