import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Alert, useWindowDimensions } from "react-native";
import { useFamily } from "../context/FamilyContext";
import { logoutUser } from "../services/authService";

export default function HomeScreen({ navigation }) {
  const { members, deleteMember } = useFamily();
  const [refreshKey, setRefreshKey] = useState(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const dynamicStyles = useMemo(() => ({
    greeting: Math.min(width * 0.035, 14),
    familyName: Math.min(width * 0.07, 28),
    logoutBtnEmoji: Math.min(width * 0.05, 20),
    alertEmoji: Math.min(width * 0.07, 28),
    alertTitle: Math.min(width * 0.035, 14),
    alertText: Math.min(width * 0.03, 12),
    statValue: Math.min(width * 0.06, 24),
    statLabel: Math.min(width * 0.027, 11),
    sectionTitle: Math.min(width * 0.035, 14),
    memberName: Math.min(width * 0.035, 14),
    memberRel: Math.min(width * 0.027, 11),
    memberBday: Math.min(width * 0.027, 11),
    deleteEmoji: Math.min(width * 0.05, 20),
    emptyStateEmoji: Math.min(width * 0.12, 48),
    emptyStateText: Math.min(width * 0.035, 14),
    emptyStateSubtext: Math.min(width * 0.03, 12),
    birthdayName: Math.min(width * 0.032, 13),
    birthdayDays: Math.min(width * 0.027, 11),
    sendBtnText: Math.min(width * 0.027, 11),
    fabEmoji: Math.min(width * 0.08, 32),
  }), [width]);

  const upcomingBirthdays = members.filter(m => m.daysUntil <= 30).length;

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logoutUser();
              navigation.replace("Login");
            } catch (error) {
              Alert.alert("Error", error.message || "Logout failed");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteMember = (id, name) => {
    Alert.alert(
      "Delete Member",
      `Are you sure you want to remove ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteMember(id),
          style: "destructive",
        },
      ]
    );
  };

  const renderMemberCard = ({ item }) => (
    <View style={styles.memberCard}>
      <View style={[styles.avatar, { backgroundColor: item.color }]}>
        <Text style={{ fontSize: dynamicStyles.memberName }}>{item.avatar}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { fontSize: dynamicStyles.memberName }]}>{item.name}</Text>
        <Text style={[styles.memberRel, { fontSize: dynamicStyles.memberRel }]}>{item.relation}</Text>
        <Text style={[styles.memberBday, { fontSize: dynamicStyles.memberBday }]}>🎂 {item.bday}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => handleDeleteMember(item.id, item.name)}
        style={styles.deleteBtn}
      >
        <Text style={[styles.deleteBtnText, { fontSize: dynamicStyles.deleteEmoji }]}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View key={refreshKey} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { fontSize: dynamicStyles.greeting }]}>Good {new Date().getHours() < 12 ? "morning" : "afternoon"} ☀️</Text>
          <Text style={[styles.familyName, { fontSize: dynamicStyles.familyName }]}>Johnson Family</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={{ fontSize: dynamicStyles.logoutBtnEmoji }}>🚪</Text>
        </TouchableOpacity>
      </View>

      {upcomingBirthdays > 0 && (
        <View style={styles.upcomingAlert}>
          <Text style={{ fontSize: dynamicStyles.alertEmoji }}>🎂</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.alertTitle, { fontSize: dynamicStyles.alertTitle }]}>Birthdays Coming Up!</Text>
            <Text style={[styles.alertText, { fontSize: dynamicStyles.alertText }]}>
              {upcomingBirthdays} celebration{upcomingBirthdays > 1 ? 's' : ''} in the next 30 days
            </Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.body} 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { fontSize: dynamicStyles.statValue }]}>{members.length}</Text>
            <Text style={[styles.statLabel, { fontSize: dynamicStyles.statLabel }]}>Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { fontSize: dynamicStyles.statValue }]}>{upcomingBirthdays}</Text>
            <Text style={[styles.statLabel, { fontSize: dynamicStyles.statLabel }]}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { fontSize: dynamicStyles.statValue }]}>{members.length > 0 ? members.length * 2 : 0}</Text>
            <Text style={[styles.statLabel, { fontSize: dynamicStyles.statLabel }]}>Photos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: dynamicStyles.sectionTitle }]}>👥 Family Members</Text>
          <FlatList
            data={members}
            renderItem={renderMemberCard}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={{ fontSize: dynamicStyles.emptyStateEmoji }}>👨‍👩‍👧‍👦</Text>
                <Text style={[styles.emptyStateText, { fontSize: dynamicStyles.emptyStateText }]}>No family members yet</Text>
                <Text style={[styles.emptyStateSubtext, { fontSize: dynamicStyles.emptyStateSubtext }]}>Tap the + button to add someone</Text>
              </View>
            }
          />
        </View>

        {members.filter(m => m.daysUntil <= 30).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: dynamicStyles.sectionTitle }]}>🎉 Upcoming Birthdays</Text>
            {members
              .filter(m => m.daysUntil <= 30)
              .sort((a, b) => a.daysUntil - b.daysUntil)
              .map(member => (
                <View key={member.id} style={styles.birthdayItem}>
                  <View style={styles.birthdayInfo}>
                    <Text style={[styles.birthdayName, { fontSize: dynamicStyles.birthdayName }]}>{member.name}</Text>
                    <Text style={[styles.birthdayDays, { fontSize: dynamicStyles.birthdayDays }]}>
                      {member.daysUntil === 0 ? "🎉 Today!" : `${member.daysUntil} day${member.daysUntil > 1 ? 's' : ''} away`}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.sendBtn}>
                    <Text style={[styles.sendBtnText, { fontSize: dynamicStyles.sendBtnText }]}>Send Wish</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate("AddMember")}
      >
        <Text style={{ fontSize: dynamicStyles.fabEmoji, lineHeight: Math.min(width * 0.09, 36), fontWeight: "bold", color: "#fff" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { 
    backgroundColor: "#FF6B9D",
    paddingTop: "15%", 
    paddingBottom: "6%", 
    paddingHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { 
    color: "rgba(255,255,255,0.85)", 
    fontWeight: "500",
  },
  familyName: { 
    color: "#fff", 
    fontWeight: "800", 
    marginTop: 4,
  },
  logoutBtn: {
    width: "11%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
  },
  logoutBtnText: {
    fontSize: 20,
  },
  upcomingAlert: {
    backgroundColor: "#FFF5F9",
    marginHorizontal: "4%",
    marginTop: "4%",
    marginBottom: "2%",
    borderRadius: 12,
    padding: "3.5%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B9D",
  },
  alertEmoji: { fontSize: 28 },
  alertTitle: { fontWeight: "700", color: "#FF6B9D" },
  alertText: { color: "#FF8FB3", marginTop: 2 },
  body: { flex: 1, padding: "4%" },
  statsContainer: { flexDirection: "row", gap: "3%", marginBottom: "5%" },
  statCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: "3.5%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    minHeight: 100,
    justifyContent: "center",
  },
  statValue: { fontWeight: "800", color: "#FF6B9D" },
  statLabel: { color: "#999", marginTop: 4, fontWeight: "600" },
  section: { marginBottom: "5%" },
  sectionTitle: { fontWeight: "700", color: "#1A1A2E", marginBottom: "3%" },
  memberCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: "3%",
    flexDirection: "row",
    alignItems: "center",
    gap: "3%",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    minHeight: 70,
  },
  avatar: { width: "13%", aspectRatio: 1, borderRadius: 25, alignItems: "center", justifyContent: "center", minWidth: 50 },
  avatarEmoji: { fontSize: 24 },
  memberInfo: { flex: 1 },
  memberName: { fontWeight: "700", color: "#1A1A2E" },
  memberRel: { color: "#999", marginTop: 2 },
  memberBday: { color: "#FF6B9D", fontWeight: "600", marginTop: 3 },
  deleteBtn: { width: "10%", aspectRatio: 1, borderRadius: 16, backgroundColor: "#FFE0E8", alignItems: "center", justifyContent: "center", minWidth: 32 },
  deleteBtnText: { color: "#FF6B9D", fontWeight: "bold" },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyStateEmoji: { fontSize: 48, marginBottom: 8 },
  emptyStateText: { fontWeight: "600", color: "#1A1A2E" },
  emptyStateSubtext: { color: "#999", marginTop: 4 },
  birthdayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF5F9",
    borderRadius: 10,
    padding: "3.5%",
    marginBottom: "2%",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B9D",
  },
  birthdayInfo: { flex: 1 },
  birthdayName: { fontWeight: "700", color: "#1A1A2E" },
  birthdayDays: { color: "#FF8FB3", marginTop: 2 },
  sendBtn: { backgroundColor: "#FF6B9D", paddingHorizontal: "3%", paddingVertical: "1.5%", borderRadius: 6 },
  sendBtnText: { color: "#fff", fontWeight: "700" },
  fab: {
    position: "absolute",
    bottom: "6%",
    right: "6%",
    width: "15%",
    aspectRatio: 1,
    backgroundColor: "#FF6B9D",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 60,
    minHeight: 60,
  },
  fabText: { color: "#fff", fontSize: 32, lineHeight: 36, fontWeight: "bold" },
});
