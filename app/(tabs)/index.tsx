import { AuthGuard } from "@/components/AuthGuard";
import { Clock, Dumbbell, Target } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutsTab() {
  const workouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      exercises: 6,
      duration: 45,
      lastPerformed: "2 days ago",
    },
    {
      id: 2,
      name: "Cardio HIIT",
      exercises: 8,
      duration: 30,
      lastPerformed: "1 week ago",
    },
  ];

  return (
    <AuthGuard>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>My Workouts</Text>
            <Text style={styles.subtitle}>Track your fitness journey</Text>
          </View>
          <View style={styles.workoutsList}>
            {workouts.map((workout) => (
              <TouchableOpacity key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutIcon}>
                    <Dumbbell size={24} color="#3B82F6" />
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutMeta}>
                      Last: {workout.lastPerformed}
                    </Text>
                  </View>
                </View>
                <View style={styles.workoutStats}>
                  <View style={styles.stat}>
                    <Target size={16} color="#6B7280" />
                    <Text style={styles.statText}>
                      {workout.exercises} exercises
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.statText}>{workout.duration} min</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Ready to create your first workout?
            </Text>
            <Text style={styles.emptySubtext}>
              Tap the Create tab to get started
            </Text>
          </View>
        </ScrollView>
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
  workoutsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  workoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: 14,
    color: "#6B7280",
  },
  workoutStats: {
    flexDirection: "row",
    gap: 20,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
