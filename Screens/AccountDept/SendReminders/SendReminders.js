import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const C = {
  bg: '#F5F7FA',
  white: '#FFFFFF',
  blue: '#1E5EFF',
  blueLight: '#EEF3FF',
  red: '#EF4444',
  redLight: '#FEE2E2',
  green: '#22C55E',
  greenLight: '#DCFCE7',
  text: '#1A202C',
  textSec: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E9F0',
};

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#1E5EFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DEFaulters = [
  { id: 'S/01', name: 'Varun Mehta', className: 'Grade 8-D', amount: '₹41,000', status: 'Overdue' },
  { id: 'S/14', name: 'Sara Khan', className: 'Grade 11-A', amount: '₹15,500', status: 'Pending' },
  { id: 'S/25', name: 'Amit Roy', className: 'Grade 9-B', amount: '₹28,500', status: 'Overdue' },
  { id: 'S/32', name: 'Priya Singh', className: 'Grade 10-C', amount: '₹12,300', status: 'Pending' },
];

export default function SendReminders({ onBack }) {
  const [selectedIds, setSelectedIds] = useState(['S/01', 'S/25']);

  const selectedCount = selectedIds.length;

  const selectedStudents = useMemo(
    () => DEFaulters.filter((item) => selectedIds.includes(item.id)),
    [selectedIds]
  );

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const sendReminders = () => {
    if (selectedIds.length === 0) {
      Alert.alert('No Students Selected', 'Select at least one student to send reminders.');
      return;
    }

    Alert.alert(
      'Reminders Sent',
      `SMS/Email reminder sent to ${selectedIds.length} student(s).`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Send Reminders</Text>
          <Text style={styles.headerSub}>Select students and send fee reminders</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Selected</Text>
          <Text style={styles.summaryValue}>{selectedCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Recipients</Text>
          <Text style={styles.summaryValue}>{DEFaulters.length}</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {DEFaulters.map((student) => {
          const selected = selectedIds.includes(student.id);
          return (
            <TouchableOpacity
              key={student.id}
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => toggleSelection(student.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{student.name}</Text>
                  <Text style={styles.amount}>{student.amount}</Text>
                </View>
                <Text style={styles.meta}>{student.id} • {student.className}</Text>
                <View style={[styles.badge, student.status === 'Overdue' ? styles.badgeRed : styles.badgeBlue]}>
                  <Text style={[styles.badgeText, student.status === 'Overdue' ? styles.badgeTextRed : styles.badgeTextBlue]}>
                    {student.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.templateCard}>
          <Text style={styles.sectionTitle}>Reminder Template</Text>
          <Text style={styles.templateText}>
            Dear Parent/Guardian, this is a gentle reminder that the school fee payment is pending.
            Please clear the dues at the earliest to avoid inconvenience.
          </Text>
        </View>

        <View style={styles.selectionCard}>
          <Text style={styles.sectionTitle}>Selected Students</Text>
          {selectedStudents.map((s) => (
            <Text key={s.id} style={styles.selectionItem}>• {s.name} — {s.amount}</Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.sendBtn]} onPress={sendReminders} activeOpacity={0.7}>
          <Text style={styles.sendBtnText}>Send Reminders</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  backBtn: { padding: 8 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  headerSub: { fontSize: 12, color: C.textSec, marginTop: 2 },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.white,
    margin: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  summaryBlock: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: C.textMuted, fontWeight: '600' },
  summaryValue: { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 4 },
  summaryDivider: { width: 1, height: 40, backgroundColor: C.border },

  body: { flex: 1 },
  bodyContent: { padding: 12, paddingBottom: 20 },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardSelected: { borderColor: C.blue, backgroundColor: C.blueLight },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxSelected: { backgroundColor: C.blue, borderColor: C.blue },
  checkMark: { color: C.white, fontWeight: '700' },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  name: { fontSize: 14, fontWeight: '700', color: C.text, flex: 1 },
  amount: { fontSize: 14, fontWeight: '800', color: C.blue },
  meta: { fontSize: 12, color: C.textMuted, marginTop: 4, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeRed: { backgroundColor: C.redLight },
  badgeBlue: { backgroundColor: C.blueLight },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextRed: { color: C.red },
  badgeTextBlue: { color: C.blue },

  templateCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  selectionCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 8 },
  templateText: { fontSize: 13, color: C.textSec, lineHeight: 20 },
  selectionItem: { fontSize: 13, color: C.textSec, marginTop: 4 },

  footer: {
    flexDirection: 'row',
    backgroundColor: C.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: 10,
  },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: C.border },
  cancelBtnText: { color: C.text, fontWeight: '700', fontSize: 14 },
  sendBtn: { backgroundColor: C.blue },
  sendBtnText: { color: C.white, fontWeight: '700', fontSize: 14 },
});
