import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform,
} from 'react-native';

import EditAttendanceScreen from './EditAttendanceScreen.js';

// ─── Mock student data per class ─────────────────────────────────────────────
const CLASS_STUDENTS = {
  '10-A': [
    { id: 1, name: 'Aarav Sharma',    roll: '01' },
    { id: 2, name: 'Bhavna Patel',    roll: '02' },
    { id: 3, name: 'Chirag Mehta',    roll: '03' },
    { id: 4, name: 'Deepika Rao',     roll: '04' },
    { id: 5, name: 'Eshan Verma',     roll: '05' },
    { id: 6, name: 'Farida Khan',     roll: '06' },
    { id: 7, name: 'Gaurav Joshi',    roll: '07' },
    { id: 8, name: 'Hina Desai',      roll: '08' },
  ],
  '10-B': [
    { id: 9,  name: 'Ishaan Gupta',   roll: '01' },
    { id: 10, name: 'Jyoti Nair',     roll: '02' },
    { id: 11, name: 'Karan Singh',    roll: '03' },
    { id: 12, name: 'Lavanya Iyer',   roll: '04' },
    { id: 13, name: 'Manav Tiwari',   roll: '05' },
    { id: 14, name: 'Nikita Bose',    roll: '06' },
  ],
  '11-A': [
    { id: 15, name: 'Om Prakash',     roll: '01' },
    { id: 16, name: 'Pooja Reddy',    roll: '02' },
    { id: 17, name: 'Rohit Malhotra', roll: '03' },
    { id: 18, name: 'Sneha Pillai',   roll: '04' },
    { id: 19, name: 'Tanvi Shah',     roll: '05' },
    { id: 20, name: 'Uday Kapoor',    roll: '06' },
    { id: 21, name: 'Vaishnavi More', roll: '07' },
  ],
  '12-C': [
    { id: 22, name: 'Waqar Ahmed',    roll: '01' },
    { id: 23, name: 'Xena D\'Souza',  roll: '02' },
    { id: 24, name: 'Yash Kulkarni',  roll: '03' },
    { id: 25, name: 'Zara Siddiqui',  roll: '04' },
    { id: 26, name: 'Arjun Pawar',    roll: '05' },
  ],
};

const STATUS_CONFIG = {
  P: { label: 'P', full: 'Present', color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
  A: { label: 'A', full: 'Absent',  color: '#C62828', bg: '#FFEBEE', border: '#EF9A9A' },
  L: { label: 'L', full: 'Leave',   color: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
};

// ─── Student List Screen (class overview) ────────────────────────────────────
function StudentListScreen({ classKey, savedAttendance, onBack, onMarkAttendance }) {
  const students = CLASS_STUDENTS[classKey] || [];
  const attendance = savedAttendance[classKey];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Class {classKey} · Students</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Class summary */}
        {attendance ? (
          <View style={styles.attendanceSummaryCard}>
            <Text style={styles.formSectionLabel}>Today's Summary</Text>
            <View style={styles.statsRow}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = Object.values(attendance).filter((v) => v === key).length;
                return (
                  <View key={key} style={[styles.statBox, { borderColor: cfg.border }]}>
                    <Text style={[styles.statNumber, { color: cfg.color }]}>{count}</Text>
                    <Text style={styles.statLabel}>{cfg.full}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.notMarkedBanner}>
            <Text style={styles.notMarkedText}>⚠️  Attendance not marked yet for today.</Text>
          </View>
        )}

        {/* Student list */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Students ({students.length})</Text>
          {students.map((student, index) => {
            const status = attendance ? attendance[student.id] : null;
            const cfg = status ? STATUS_CONFIG[status] : null;
            return (
              <View
                key={student.id}
                style={[
                  styles.studentRow,
                  index === students.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: cfg ? cfg.bg : '#EEF2FF' }]}>
                  <Text style={[styles.avatarText, { color: cfg ? cfg.color : '#1B3FA0' }]}>
                    {student.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>Roll No. {student.roll}</Text>
                </View>
                {cfg && (
                  <View style={[styles.statusPill, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                    <Text style={[styles.statusPillText, { color: cfg.color }]}>{cfg.full}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={onMarkAttendance}>
          <Text style={styles.saveBtnText}>✏️  {attendance ? 'Edit' : 'Mark'} Attendance</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function TeacherAttendance() {
  const [screen, setScreen] = useState('home');           // 'home' | 'list' | 'mark'
  const [selectedClass, setSelectedClass] = useState('10-A');
  // savedAttendance: { '10-A': { studentId: 'P'|'A'|'L', ... }, ... }
  const [savedAttendance, setSavedAttendance] = useState({});

  const handleSaveAttendance = (classKey, attendanceMap) => {
    setSavedAttendance((prev) => ({ ...prev, [classKey]: attendanceMap }));
  };

  // Stats for currently selected class on home screen
  const todayAttendance = savedAttendance[selectedClass];
  const students = CLASS_STUDENTS[selectedClass] || [];
  const counts = todayAttendance
    ? Object.values(todayAttendance).reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, { P: 0, A: 0, L: 0 })
    : { P: 0, A: 0, L: 0 };

  if (screen === 'list') {
    return (
      <StudentListScreen
        classKey={selectedClass}
        savedAttendance={savedAttendance}
        onBack={() => setScreen('home')}
        onMarkAttendance={() => setScreen('mark')}
      />
    );
  }

  if (screen === 'mark') {
    return (
      <EditAttendanceScreen
        classKey={selectedClass}
        students={CLASS_STUDENTS[selectedClass] || []}
        initialAttendance={savedAttendance[selectedClass]}
        onBack={() => setScreen('list')}
        onSave={handleSaveAttendance}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Attendance Management</Text>
          <Text style={styles.subtitle}>Mark and track student attendance</Text>
        </View>

        {/* Select Class */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Class</Text>
          <Text style={styles.cardHint}>Tap a class to view its student list</Text>
          <View style={styles.classButtons}>
            {Object.keys(CLASS_STUDENTS).map((cls) => {
              const marked = !!savedAttendance[cls];
              return (
                <TouchableOpacity
                  key={cls}
                  onPress={() => { setSelectedClass(cls); setScreen('list'); }}
                  style={[styles.classBtn, selectedClass === cls && styles.classBtnActive]}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.classBtnText, selectedClass === cls && styles.classBtnTextActive]}>
                    {cls}
                  </Text>
                  {marked && (
                    <View style={styles.markedDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Today's Attendance summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Attendance</Text>
          <Text style={styles.cardSubtitle}>Class {selectedClass}</Text>

          {todayAttendance ? (
            <>
              <View style={styles.statsRow}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <View key={key} style={[styles.statBox, { borderColor: cfg.border }]}>
                    <Text style={[styles.statNumber, { color: cfg.color }]}>{counts[key]}</Text>
                    <Text style={styles.statLabel}>{cfg.full}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.progressBarWrap}>
                <View style={[styles.progressSegment, { flex: counts.P, backgroundColor: '#4CAF50' }]} />
                <View style={[styles.progressSegment, { flex: counts.A, backgroundColor: '#E53935' }]} />
                <View style={[styles.progressSegment, { flex: counts.L, backgroundColor: '#FF9800' }]} />
              </View>
              <Text style={styles.progressCaption}>
                {counts.P} present · {counts.A} absent · {counts.L} on leave · {students.length} total
              </Text>
            </>
          ) : (
            <View style={styles.notMarkedBanner}>
              <Text style={styles.notMarkedText}>⚠️  Attendance not marked yet for Class {selectedClass}.</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => setScreen('mark')}
          >
            <Text style={styles.buttonText}>
              ✏️  {todayAttendance ? 'Edit' : 'Mark'} Attendance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick overview of all classes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>All Classes Overview</Text>
          {Object.keys(CLASS_STUDENTS).map((cls) => {
            const att = savedAttendance[cls];
            const total = CLASS_STUDENTS[cls].length;
            const present = att ? Object.values(att).filter((v) => v === 'P').length : null;
            return (
              <TouchableOpacity
                key={cls}
                style={styles.overviewRow}
                activeOpacity={0.75}
                onPress={() => { setSelectedClass(cls); setScreen('list'); }}
              >
                <View style={styles.overviewLeft}>
                  <Text style={styles.overviewClass}>{cls}</Text>
                  <Text style={styles.overviewTotal}>{total} students</Text>
                </View>
                {present !== null ? (
                  <View style={styles.overviewRight}>
                    <View style={styles.miniProgress}>
                      <View style={[styles.miniProgressFill, { width: `${(present / total) * 100}%` }]} />
                    </View>
                    <Text style={styles.overviewPct}>{present}/{total} present</Text>
                  </View>
                ) : (
                  <View style={styles.overviewBadge}>
                    <Text style={styles.overviewBadgeText}>Not marked</Text>
                  </View>
                )}
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FF' },
  content:   { flex: 1, padding: 16 },

  header:   { marginBottom: 20, marginTop: 8 },
  title:    { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },

  // Screen header
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    ...Platform.select({ web: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } }),
    elevation: 2,
  },
  backBtn:    { padding: 4 },
  backArrow:  { fontSize: 22, color: '#1B3FA0', fontWeight: '600' },
  screenTitle:{ fontSize: 17, fontWeight: 'bold', color: '#1A1A2E' },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle:    { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#888', marginBottom: 12 },
  cardHint:     { fontSize: 12, color: '#888', marginBottom: 12 },

  // Class tabs
  classButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  classBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  classBtnActive: { backgroundColor: '#1B3FA0', borderColor: '#1B3FA0' },
  classBtnText:   { fontSize: 14, color: '#666', fontWeight: '500' },
  classBtnTextActive: { color: '#FFFFFF' },
  markedDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },

  // Buttons
  button: {
    backgroundColor: '#1B3FA0',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  saveBtn: {
    backgroundColor: '#1B3FA0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  // Footer bar
  footerBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    ...Platform.select({ web: { boxShadow: '0 -1px 4px rgba(0,0,0,0.06)' } }),
  },

  // Summary bar (mark screen)
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

  // Search
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
  searchIcon:  { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#1A1A2E' },

  // Bulk row
  bulkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  bulkLabel:   { fontSize: 12, color: '#888', fontWeight: '600', marginRight: 4 },
  bulkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  bulkBtnText: { fontSize: 12, fontWeight: '700' },

  // Student row
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
  avatarText:   { fontSize: 16, fontWeight: 'bold' },
  studentInfo:  { flex: 1 },
  studentName:  { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  studentRoll:  { fontSize: 12, color: '#888', marginTop: 2 },

  // P/A/L toggle
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

  // Status pill
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusPillText: { fontSize: 12, fontWeight: '700' },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 1,
  },
  statNumber: { fontSize: 22, fontWeight: 'bold' },
  statLabel:  { fontSize: 11, color: '#888', marginTop: 3, fontWeight: '600' },

  // Segmented progress bar
  progressBarWrap: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E8EAED',
    marginBottom: 6,
  },
  progressSegment: { height: '100%' },
  progressCaption: { fontSize: 11, color: '#999', textAlign: 'center' },

  // Attendance summary card (list screen)
  attendanceSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  formSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Not marked banner
  notMarkedBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  notMarkedText: { fontSize: 13, color: '#E65100', fontWeight: '600', textAlign: 'center' },

  // Overview rows
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
  },
  overviewLeft:  { flex: 1 },
  overviewClass: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  overviewTotal: { fontSize: 12, color: '#888', marginTop: 2 },
  overviewRight: { alignItems: 'flex-end', marginRight: 8 },
  miniProgress: {
    width: 80,
    height: 6,
    backgroundColor: '#E8EAED',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 3,
  },
  miniProgressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 3 },
  overviewPct:  { fontSize: 11, color: '#555' },
  overviewBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  overviewBadgeText: { fontSize: 11, color: '#E65100', fontWeight: '600' },
  chevron: { fontSize: 20, color: '#BDBDBD', fontWeight: '300' },
});