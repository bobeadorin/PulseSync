import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SessionData } from "../../types";
import useWorkoutSessionData from "../../hooks/useWorkoutSessionData";

const predefinedTimes = [15, 30, 45, 60, 90, 120];

export default function SessionForm() {
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [includeWorkoutTime, setIncludeWorkoutTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState(predefinedTimes[0]);
  const [customTime, setCustomTime] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { setSessionData } = useWorkoutSessionData();

  const handleSubmit = () => {
    const workoutTime = includeWorkoutTime ? (customTime ? parseInt(customTime) : selectedTime) : null;

    const formData: SessionData = {
      doctorName,
      patientName,
      age: parseInt(age),
      workoutTime,
    };
    if (formData.doctorName.trim() !== "" && formData.patientName.trim() !== "" && formData.age > 0) {
      setSessionData(formData);
      router.replace("/sessionStartFormPages/initialization");
    } else return;
    console.log("Form submitted:", formData);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.header}>Session Details</Text>

          {/* Doctor's Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Doctor's Name</Text>
            <TextInput style={styles.input} placeholder="Dr. Smith" value={doctorName} onChangeText={setDoctorName} />
          </View>

          {/* Patient Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Patient Name</Text>
            <TextInput style={styles.input} placeholder="John Doe" value={patientName} onChangeText={setPatientName} />
          </View>

          {/* Age */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} placeholder="30" value={age} onChangeText={setAge} keyboardType="numeric" />
          </View>

          {/* Workout Time Toggle */}
          <View style={[styles.switchContainer, { justifyContent: "center" }]}>
            <Text style={styles.label}>Include Workout Time</Text>
            <Switch
              value={includeWorkoutTime}
              onValueChange={setIncludeWorkoutTime}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={includeWorkoutTime ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          {/* Workout Time Selection */}
          {includeWorkoutTime && (
            <View style={styles.timeSelectionContainer}>
              <Text style={styles.label}>Workout Time (minutes)</Text>

              <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDropdown(!showDropdown)}>
                <Text style={styles.dropdownButtonText}>{customTime ? `${customTime} (custom)` : selectedTime}</Text>
                <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={20} color="#666" />
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdownOptions}>
                  {predefinedTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={styles.optionItem}
                      onPress={() => {
                        setSelectedTime(time);
                        setCustomTime("");
                        setShowDropdown(false);
                      }}
                    >
                      <Text>{time} minutes</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setShowDropdown(false);
                    }}
                  >
                    <Text>Custom time...</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(!selectedTime || customTime) && (
                <TextInput
                  style={styles.input}
                  placeholder="Enter custom time in minutes"
                  value={customTime}
                  onChangeText={setCustomTime}
                  keyboardType="numeric"
                />
              )}
            </View>
          )}

          {/* Submit Button - Centered */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  timeSelectionContainer: {
    marginBottom: 15,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownOptions: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    marginBottom: 10,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    maxWidth: 200,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
