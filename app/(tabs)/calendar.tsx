import { AuthGuard } from "@/components/AuthGuard";
import {
  Activity,
  Calendar as CalendarIcon,
  CircleCheck as CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Plus,
  Target,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScheduledWorkout {
  id: string;
  date: string; // YYYY-MM-DD format
  workoutName: string;
  exercises: number;
  duration: number;
  completed: boolean;
  completedAt?: string;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  workouts: ScheduledWorkout[];
}

export default function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [newWorkoutDuration, setNewWorkoutDuration] = useState("45");

  // Mock data - in a real app, this would come from your state management/database
  const [scheduledWorkouts, setScheduledWorkouts] = useState<
    ScheduledWorkout[]
  >([
    {
      id: "1",
      date: "2025-01-15",
      workoutName: "Upper Body Strength",
      exercises: 6,
      duration: 45,
      completed: true,
      completedAt: "2025-01-15T10:30:00Z",
    },
    {
      id: "2",
      date: "2025-01-17",
      workoutName: "Cardio HIIT",
      exercises: 8,
      duration: 30,
      completed: false,
    },
    {
      id: "3",
      date: "2025-01-20",
      workoutName: "Leg Day",
      exercises: 7,
      duration: 60,
      completed: false,
    },
  ]);

  const today = new Date().toISOString().split("T")[0];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split("T")[0];
      days.push({
        date: dateString,
        day,
        isCurrentMonth: false,
        isToday: dateString === today,
        workouts: scheduledWorkouts.filter((w) => w.date === dateString),
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0];
      days.push({
        date: dateString,
        day,
        isCurrentMonth: true,
        isToday: dateString === today,
        workouts: scheduledWorkouts.filter((w) => w.date === dateString),
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateString = date.toISOString().split("T")[0];
      days.push({
        date: dateString,
        day,
        isCurrentMonth: false,
        isToday: dateString === today,
        workouts: scheduledWorkouts.filter((w) => w.date === dateString),
      });
    }

    return days;
  }, [currentDate, scheduledWorkouts, today]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayPress = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };

  const handleScheduleWorkout = () => {
    if (!selectedDate) return;
    setShowScheduleModal(true);
  };

  const saveScheduledWorkout = () => {
    if (!newWorkoutName.trim() || !selectedDate) {
      Alert.alert("Error", "Please enter a workout name");
      return;
    }

    const newWorkout: ScheduledWorkout = {
      id: Date.now().toString(),
      date: selectedDate,
      workoutName: newWorkoutName.trim(),
      exercises: 0, // Would be set when creating the actual workout
      duration: parseInt(newWorkoutDuration) || 45,
      completed: false,
    };

    setScheduledWorkouts((prev) => [...prev, newWorkout]);
    setNewWorkoutName("");
    setNewWorkoutDuration("45");
    setShowScheduleModal(false);
    Alert.alert("Success", "Workout scheduled successfully!");
  };

  const toggleWorkoutCompletion = (workoutId: string) => {
    setScheduledWorkouts((prev) =>
      prev.map((workout) => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            completed: !workout.completed,
            completedAt: !workout.completed
              ? new Date().toISOString()
              : undefined,
          };
        }
        return workout;
      })
    );
  };

  const selectedDateWorkouts = selectedDate
    ? scheduledWorkouts.filter((w) => w.date === selectedDate)
    : [];

  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWorkoutStatusColor = (workout: ScheduledWorkout) => {
    if (workout.completed) return "#059669";
    if (workout.date < today) return "#EF4444";
    return "#3B82F6";
  };

  const getWorkoutStatusText = (workout: ScheduledWorkout) => {
    if (workout.completed) return "Completed";
    if (workout.date < today) return "Missed";
    return "Scheduled";
  };

  return (
    <AuthGuard>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Workout Calendar</Text>
            <Text style={styles.subtitle}>
              Plan and track your fitness journey
            </Text>
          </View>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateMonth("prev")}
            >
              <ChevronLeft size={24} color="#3B82F6" />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateMonth("next")}
            >
              <ChevronRight size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((day) => (
              <Text key={day} style={styles.dayName}>
                {day}
              </Text>
            ))}
          </View>
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={`${day.date}-${index}`}
                style={[
                  styles.calendarDay,
                  !day.isCurrentMonth && styles.calendarDayInactive,
                  day.isToday && styles.calendarDayToday,
                  selectedDate === day.date && styles.calendarDaySelected,
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    !day.isCurrentMonth && styles.calendarDayTextInactive,
                    day.isToday && styles.calendarDayTextToday,
                    selectedDate === day.date && styles.calendarDayTextSelected,
                  ]}
                >
                  {day.day}
                </Text>
                {/* Workout indicators */}
                <View style={styles.workoutIndicators}>
                  {day.workouts.slice(0, 3).map((workout, idx) => (
                    <View
                      key={workout.id}
                      style={[
                        styles.workoutDot,
                        { backgroundColor: getWorkoutStatusColor(workout) },
                      ]}
                    />
                  ))}
                  {day.workouts.length > 3 && (
                    <Text style={styles.moreWorkouts}>
                      +{day.workouts.length - 3}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* Selected Date Details */}
          {selectedDate && (
            <View style={styles.selectedDateSection}>
              <View style={styles.selectedDateHeader}>
                <Text style={styles.selectedDateTitle}>
                  {formatSelectedDate(selectedDate)}
                </Text>
                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={handleScheduleWorkout}
                >
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.scheduleButtonText}>Schedule</Text>
                </TouchableOpacity>
              </View>
              {selectedDateWorkouts.length > 0 ? (
                <View style={styles.workoutsList}>
                  {selectedDateWorkouts.map((workout) => (
                    <View key={workout.id} style={styles.workoutCard}>
                      <View style={styles.workoutCardHeader}>
                        <View style={styles.workoutIcon}>
                          <Dumbbell size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.workoutInfo}>
                          <Text style={styles.workoutName}>
                            {workout.workoutName}
                          </Text>
                          <View style={styles.workoutMeta}>
                            <View style={styles.workoutMetaItem}>
                              <Clock size={14} color="#6B7280" />
                              <Text style={styles.workoutMetaText}>
                                {workout.duration} min
                              </Text>
                            </View>
                            {workout.exercises > 0 && (
                              <View style={styles.workoutMetaItem}>
                                <Target size={14} color="#6B7280" />
                                <Text style={styles.workoutMetaText}>
                                  {workout.exercises} exercises
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.completionButton}
                          onPress={() => toggleWorkoutCompletion(workout.id)}
                        >
                          <CheckCircle
                            size={24}
                            color={workout.completed ? "#059669" : "#D1D5DB"}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={[
                          styles.workoutStatus,
                          {
                            backgroundColor:
                              getWorkoutStatusColor(workout) + "20",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.workoutStatusText,
                            { color: getWorkoutStatusColor(workout) },
                          ]}
                        >
                          {getWorkoutStatusText(workout)}
                        </Text>
                        {workout.completed && workout.completedAt && (
                          <Text style={styles.completedTime}>
                            Completed at{" "}
                            {new Date(workout.completedAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noWorkouts}>
                  <Activity size={48} color="#D1D5DB" />
                  <Text style={styles.noWorkoutsText}>
                    No workouts scheduled
                  </Text>
                  <Text style={styles.noWorkoutsSubtext}>
                    Tap Schedule to add a workout for this day
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
        {/* Schedule Workout Modal */}
        <Modal
          visible={showScheduleModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowScheduleModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Workout</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowScheduleModal(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalDateText}>
                {selectedDate && formatSelectedDate(selectedDate)}
              </Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Workout Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter workout name"
                  value={newWorkoutName}
                  onChangeText={setNewWorkoutName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (minutes)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="45"
                  value={newWorkoutDuration}
                  onChangeText={setNewWorkoutDuration}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveScheduledWorkout}
              >
                <CalendarIcon size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Schedule Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  dayNamesRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDayInactive: {
    opacity: 0.3,
  },
  calendarDayToday: {
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  calendarDaySelected: {
    backgroundColor: "#3B82F6",
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  calendarDayTextInactive: {
    color: "#9CA3AF",
  },
  calendarDayTextToday: {
    color: "#3B82F6",
  },
  calendarDayTextSelected: {
    color: "#FFFFFF",
  },
  workoutIndicators: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  workoutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreWorkouts: {
    fontSize: 8,
    fontWeight: "600",
    color: "#6B7280",
  },
  selectedDateSection: {
    margin: 24,
    marginTop: 0,
  },
  selectedDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  scheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  workoutsList: {
    gap: 12,
  },
  workoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  workoutCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  workoutMeta: {
    flexDirection: "row",
    gap: 16,
  },
  workoutMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  workoutMetaText: {
    fontSize: 14,
    color: "#6B7280",
  },
  completionButton: {
    padding: 4,
  },
  workoutStatus: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  workoutStatusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  completedTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  noWorkouts: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noWorkoutsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  noWorkoutsSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 24,
    gap: 24,
  },
  modalDateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
    textAlign: "center",
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
