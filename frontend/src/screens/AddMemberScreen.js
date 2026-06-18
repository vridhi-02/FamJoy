import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal, useWindowDimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { useFamily } from "../context/FamilyContext";

const RELATIONS = ["Parent", "Sibling", "Child", "Partner", "Grandparent"];

export default function AddMemberScreen({ navigation }) {
  const { addMember } = useFamily();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [relation, setRelation] = useState("Parent");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  const { width } = useWindowDimensions();

  const dynamicStyles = useMemo(() => ({
    backArrow: Math.min(width * 0.05, 20),
    title: Math.min(width * 0.045, 18),
    label: Math.min(width * 0.032, 13),
    required: Math.min(width * 0.035, 14),
    input: Math.min(width * 0.035, 14),
    errorText: Math.min(width * 0.027, 11),
    chipText: Math.min(width * 0.032, 13),
    dateInputText: Math.min(width * 0.035, 14),
    calendarIcon: Math.min(width * 0.045, 18),
    calendarTitle: Math.min(width * 0.04, 16),
    calendarCloseText: Math.min(width * 0.04, 16),
    calendarConfirmText: Math.min(width * 0.04, 16),
    btnText: Math.min(width * 0.04, 16),
  }), [width]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!birthDate) {
      newErrors.birthDate = "Birthday is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateToCalendar = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const handleDateSelect = (day) => {
    const formatted = formatDate(day.dateString);
    setBirthDate(formatted);
    setShowCalendar(false);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        addMember({
          name: name.trim(),
          relation,
          bday: birthDate,
          notes: notes.trim(),
        });
        setLoading(false);
        Alert.alert("Success", `${name} has been added to the family! 🎉`, [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Failed to add member");
      }
    }, 800);
  };

  const getAvatarColor = (rel) => {
    const colors = {
      Parent: "#FFD4E5",
      Sibling: "#D4EDFF",
      Child: "#D4FFD4",
      Partner: "#FFE8D4",
      Grandparent: "#F0D4FF",
    };
    return colors[rel] || "#FFD4E5";
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={[styles.backArrow, { fontSize: dynamicStyles.backArrow }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: dynamicStyles.title }]}>Add Family Member</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.body} 
        contentContainerStyle={{ gap: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Name Input */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Full Name</Text>
            <Text style={[styles.required, { fontSize: dynamicStyles.required }]}>*</Text>
          </View>
          <TextInput 
            style={[styles.input, errors.name && styles.inputError, { fontSize: dynamicStyles.input }]} 
            placeholder="Enter full name" 
            placeholderTextColor="#ddd"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: "" });
              }
            }}
            editable={!loading}
          />
          {errors.name && <Text style={[styles.errorText, { fontSize: dynamicStyles.errorText }]}>{errors.name}</Text>}
        </View>

        {/* Relationship Selection */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Relationship</Text>
            <Text style={[styles.required, { fontSize: dynamicStyles.required }]}>*</Text>
          </View>
          <View style={styles.chipsContainer}>
            {RELATIONS.map(r => (
              <TouchableOpacity 
                key={r} 
                style={[
                  styles.chip, 
                  relation === r && styles.chipSelected,
                ]} 
                onPress={() => setRelation(r)}
                disabled={loading}
              >
                <Text style={[styles.chipText, relation === r && styles.chipTextSelected, { fontSize: dynamicStyles.chipText }]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Birthday Input */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Birthday</Text>
            <Text style={[styles.required, { fontSize: dynamicStyles.required }]}>*</Text>
          </View>
          <TouchableOpacity 
            style={[styles.input, styles.dateInput, errors.birthDate && styles.inputError]}
            onPress={() => !loading && setShowCalendar(true)}
            disabled={loading}
          >
            <Text style={[styles.dateInputText, !birthDate && styles.placeholder, { fontSize: dynamicStyles.dateInputText }]}>
              {birthDate || "Select date (DD/MM/YYYY)"}
            </Text>
            <Text style={[styles.calendarIcon, { fontSize: dynamicStyles.calendarIcon }]}>📆</Text>
          </TouchableOpacity>
          {errors.birthDate && <Text style={[styles.errorText, { fontSize: dynamicStyles.errorText }]}>{errors.birthDate}</Text>}
        </View>

        {/* Notes Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.label, { fontSize: dynamicStyles.label }]}>Notes & Fun Facts</Text>
          <TextInput 
            style={[styles.input, styles.notesInput, { fontSize: dynamicStyles.input }]} 
            placeholder="Hobbies, favorite color, fun facts..." 
            placeholderTextColor="#ddd"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            editable={!loading}
          />
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.calendarModal}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={[styles.calendarTitle, { fontSize: dynamicStyles.calendarTitle }]}>Select Birthday</Text>
              <TouchableOpacity 
                onPress={() => setShowCalendar(false)}
                style={styles.calendarClose}
              >
                <Text style={[styles.calendarCloseText, { fontSize: dynamicStyles.calendarCloseText }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleDateSelect}
              maxDate={new Date().toISOString().split('T')[0]}
              markedDates={
                birthDate 
                  ? { [formatDateToCalendar(birthDate)]: { selected: true, selectedColor: "#FF6B9D" } }
                  : {}
              }
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#1A1A2E',
                selectedDayBackgroundColor: '#FF6B9D',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#FF6B9D',
                dayTextColor: '#1A1A2E',
                textDisabledColor: '#ddd',
                dotColor: '#FF6B9D',
                selectedDotColor: '#ffffff',
                monthTextColor: '#1A1A2E',
                arrowColor: '#FF6B9D',
              }}
            />
            <TouchableOpacity 
              style={styles.calendarConfirm}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={[styles.calendarConfirmText, { fontSize: dynamicStyles.calendarConfirmText }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={[styles.btnText, { fontSize: dynamicStyles.btnText }]}>
            {loading ? "Saving..." : "✓ Save Member"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { 
    backgroundColor: "#fff", 
    paddingTop: "14%", 
    paddingBottom: "4%", 
    paddingHorizontal: "4%", 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
  },
  backBtn: { 
    width: "10%",
    aspectRatio: 1,
    minWidth: 40,
    borderRadius: 10, 
    backgroundColor: "#f5f5f5", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  backArrow: { 
    color: "#1A1A2E",
    fontWeight: "600",
  },
  title: { 
    fontWeight: "700", 
    color: "#1A1A2E",
    flex: 1,
    textAlign: "center",
  },
  body: { flex: 1, padding: "5%" },
  inputSection: { gap: 8 },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: { 
    fontWeight: "700", 
    color: "#555", 
    letterSpacing: 0.3,
  },
  required: {
    color: "#FF6B9D",
    fontWeight: "bold",
  },
  input: { 
    backgroundColor: "#f9f9f9", 
    borderRadius: 12, 
    padding: "3.5%", 
    color: "#1A1A2E",
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  inputError: {
    borderColor: "#FF6B9D",
    backgroundColor: "#FFF5F9",
  },
  errorText: {
    color: "#FF6B9D",
    fontWeight: "600",
    marginTop: 4,
  },
  chipsContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: "2.5%" 
  },
  chip: { 
    paddingHorizontal: "3.5%", 
    paddingVertical: "2.2%", 
    borderRadius: 22, 
    borderWidth: 1.5, 
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  chipSelected: { 
    borderColor: "#FF6B9D", 
    backgroundColor: "#FFF5F9" 
  },
  chipText: { 
    fontWeight: "500", 
    color: "#999" 
  },
  chipTextSelected: { 
    color: "#FF6B9D",
    fontWeight: "700",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateInputText: {
    color: "#1A1A2E",
    flex: 1,
  },
  placeholder: {
    color: "#ddd",
  },
  calendarIcon: {
    fontSize: 18,
  },
  notesInput: {
    height: 90,
    textAlignVertical: "top",
  },
  calendarModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 0,
    maxHeight: "85%",
  },
  calendarHeader: {
    paddingHorizontal: "5%",
    paddingTop: "4%",
    paddingBottom: "3%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  calendarTitle: {
    fontWeight: "700",
    color: "#1A1A2E",
  },
  calendarClose: {
    width: "8%",
    aspectRatio: 1,
    minWidth: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarCloseText: {
    color: "#1A1A2E",
  },
  calendarConfirm: {
    backgroundColor: "#FF6B9D",
    marginHorizontal: "5%",
    marginVertical: "4%",
    paddingVertical: "3.5%",
    borderRadius: 12,
    alignItems: "center",
  },
  calendarConfirmText: {
    color: "#fff",
    fontWeight: "700",
  },
  footer: { 
    backgroundColor: "#fff", 
    padding: "4%", 
    borderTopWidth: 1, 
    borderColor: "#f5f5f5",
    paddingBottom: "6%",
  },
  btnPrimary: { 
    backgroundColor: "#FF6B9D", 
    borderRadius: 12, 
    padding: "4%", 
    alignItems: "center",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "700",
  },
});
