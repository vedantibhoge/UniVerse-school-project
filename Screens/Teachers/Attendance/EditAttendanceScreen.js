import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';

const STATUS_CONFIG = {
  P: { label: 'P', full: 'Present', color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
  A: { label: 'A', full: 'Absent', color: '#C62828', bg: '#FFEBEE', border: '#EF9A9A' },
  L: { label: 'L', full: 'Leave', color: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
};

function buildAttendance(students, initialAttendance) {
  const result = {};
  students.forEach((student) => {
    const existing = initialAttendance?.[student.id];
    result[student.id] = existing || 'P';
  });
  return result;
}

export default function EditAttendanceScreen({
  classKey,
  students,
  initialAttendance,
  onBack,
  onSave,
}) {
  const [attendance, setAttendance] = useState(() => buildAttendance(students, initialAttendance));
  const [search, setSearch] = useState('');

  const toggle = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const counts = useMemo(
    () =>
      Object.values(attendance).reduce(
        (acc, status) => {
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        { P: 0, A: 0, L: 0 }
      ),
    [attendance]
  );

  const filtered = useMemo(
    () =>
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) || student.roll.includes(search)
      ),
    [students, search]
  );

  const handleSave = () => {
    onSave(classKey, attendance);
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Mark Attendance · {classKey}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.summaryBar}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <View key={key} style={[styles.summaryChip, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
            <Text style={[styles.summaryCount, { color: cfg.color }]}>{counts[key]}</Text>
            <Text style={[styles.summaryLabel, { color: cfg.color }]}>{cfg.full}</Text>
          </View>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or roll no."
          placeholderTextColor="#AAB"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.bulkRow}>
        <Text style={styles.bulkLabel}>Mark all:</Text>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <TouchableOpacity
            key={key}
            style={[styles.bulkBtn, { backgroundColor: cfg.bg, borderColor: cfg.border }]}
            onPress={() => {
              const next = {};
              students.forEach((student) => {
                next[student.id] = key;
              });
              setAttendance(next);
            }}
          >
            <Text style={[styles.bulkBtnText, { color: cfg.color }]}>{cfg.full}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map((student, index) => {
          const status = attendance[student.id];
          const cfg = STATUS_CONFIG[status];
          return (
            <View
              key={student.id}
              style={[
                styles.studentRow,
                index === filtered.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.avatar, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.avatarText, { color: cfg.color }]}>
                  {student.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentRoll}>Roll No. {student.roll}</Text>
              </View>

              <View style={styles.toggleGroup}>
                {Object.entries(STATUS_CONFIG).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.toggleBtn,
                      status === key
                        ? { backgroundColor: value.color, borderColor: value.color }
                        : { backgroundColor: '#F5F5F5', borderColor: '#DDE1EA' },
                    ]}
                    onPress={() => toggle(student.id, key)}
                  >
                    <Text style={[styles.toggleBtnText, { color: status === key ? '#FFF' : '#999' }]}>
                      {value.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
        <View style={styles.scrollSpacer} />
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>✅  Save Attendance ({students.length} students)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FF' },
  content: { flex: 1, padding: 16 },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    elevation: 2,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: '#1B3FA0', fontWeight: '600' },
  screenTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A2E' },
  headerSpacer: { width: 36 },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    gap: 8,
  },
  summaryChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  summaryCount: { fontSize: 20, fontWeight: 'bold' },
  summaryLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#1A1A2E' },
  bulkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  bulkLabel: { fontSize: 12, color: '#888', fontWeight: '600', marginRight: 4 },
  bulkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  bulkBtnText: { fontSize: 12, fontWeight: '700' },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: 'bold' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  studentRoll: { fontSize: 12, color: '#888', marginTop: 2 },
  toggleGroup: { flexDirection: 'row', gap: 6 },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnText: { fontSize: 13, fontWeight: 'bold' },
  footerBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
  },
  saveBtn: {
    backgroundColor: '#1B3FA0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  scrollSpacer: { height: 24 },
});
