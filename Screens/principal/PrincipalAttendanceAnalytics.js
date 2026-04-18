import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  textSub: '#6B7280',
  red: '#E53935',
  orange: '#F97316',
  green: '#22C55E',
  blue: '#1B3FA0',
  lightBlue: '#EEF2FF',
  lightGreen: '#ECFDF5',
  lightOrange: '#FFF7ED',
};

const classAttendanceData = [
  { label: 'Grade 1A', present: 95, absent: 5,  color: COLORS.green },
  { label: 'Grade 2B', present: 88, absent: 12, color: COLORS.blue },
  { label: 'Grade 3C', present: 92, absent: 8,  color: COLORS.orange },
  { label: 'Grade 4A', present: 78, absent: 22, color: COLORS.red },
  { label: 'Grade 5B', present: 96, absent: 4,  color: '#8B5CF6' },
  { label: 'Grade 6A', present: 85, absent: 15, color: '#06B6D4' },
  { label: 'Grade 7C', present: 91, absent: 9,  color: '#EC4899' },
  { label: 'Grade 8B', present: 83, absent: 17, color: COLORS.primary },
];

const staffAttendanceData = [
  { name: 'Teaching Staff',     present: 94, total: 48, color: COLORS.green },
  { name: 'Admin Staff',        present: 97, total: 15, color: COLORS.blue },
  { name: 'Support Staff',      present: 89, total: 22, color: COLORS.orange },
  { name: 'Lab Assistants',     present: 100, total: 8, color: '#8B5CF6' },
];

const weeklyAttendance = [
  { day: 'Mon', students: 92, staff: 96 },
  { day: 'Tue', students: 95, staff: 98 },
  { day: 'Wed', students: 88, staff: 94 },
  { day: 'Thu', students: 91, staff: 97 },
  { day: 'Fri', students: 85, staff: 93 },
];

function AnimatedBar({ percentage, color, delay = 0 }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(widthAnim, { toValue: percentage, duration: 900, useNativeDriver: false }).start();
    }, delay);
    return () => clearTimeout(t);
  }, [percentage]);

  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={[styles.progressFill, {
          width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          backgroundColor: color,
        }]}
      />
    </View>
  );
}

const RingChart = ({ value, color, size = 80 }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: 10, borderColor: '#E8ECF5', position: 'absolute'
      }} />
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: 10, borderColor: color,
        borderTopColor: value < 25 ? '#E8ECF5' : color,
        borderRightColor: value < 50 ? '#E8ECF5' : color,
        borderBottomColor: value < 75 ? '#E8ECF5' : color,
        borderLeftColor: value < 100 ? (value < 25 ? '#E8ECF5' : color) : color,
        position: 'absolute',
        transform: [{ rotate: '-45deg' }],
      }} />
      <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textDark }}>{value}%</Text>
    </View>
  );
};

export default function PrincipalAttendanceAnalytics({ onToggleSidebar, onBack }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('class');

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const overallStudent = Math.round(
    classAttendanceData.reduce((s, c) => s + c.present, 0) / classAttendanceData.length
  );
  const overallStaff = Math.round(
    staffAttendanceData.reduce((s, c) => s + c.present, 0) / staffAttendanceData.length
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* Summary */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightGreen }]}>
              <Text style={[styles.summaryNum, { color: COLORS.green }]}>{overallStudent}%</Text>
              <Text style={styles.summaryLbl}>Student Avg</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightBlue }]}>
              <Text style={[styles.summaryNum, { color: COLORS.primary }]}>{overallStaff}%</Text>
              <Text style={styles.summaryLbl}>Staff Avg</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightOrange }]}>
              <Text style={[styles.summaryNum, { color: COLORS.orange }]}>Today</Text>
              <Text style={styles.summaryLbl}>Apr 16, 2024</Text>
            </View>
          </View>

          {/* Weekly Trend */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week's Trend</Text>
            <View style={styles.card}>
              {weeklyAttendance.map((d, i) => (
                <View key={i} style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={styles.performanceLabel}>{d.day} — Students</Text>
                    <Text style={styles.performanceValue}>{d.students}%</Text>
                  </View>
                  <AnimatedBar percentage={d.students} color={COLORS.blue} delay={i * 60} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 4 }}>
                    <Text style={[styles.performanceLabel, { color: COLORS.textMuted }]}>{d.day} — Staff</Text>
                    <Text style={styles.performanceValue}>{d.staff}%</Text>
                  </View>
                  <AnimatedBar percentage={d.staff} color={COLORS.green} delay={i * 60 + 30} />
                </View>
              ))}
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.blue }]} />
                  <Text style={styles.legendText}>Students</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.green }]} />
                  <Text style={styles.legendText}>Staff</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {['class', 'staff'].map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, activeTab === t && styles.tabActive]}
                onPress={() => setActiveTab(t)}
              >
                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                  {t === 'class' ? 'Class-wise' : 'Staff-wise'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Class Attendance */}
          {activeTab === 'class' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Class Attendance</Text>
              <View style={styles.card}>
                {classAttendanceData.map((c, i) => (
                  <View key={i} style={styles.performanceItem}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={styles.performanceLabel}>{c.label}</Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={[styles.performanceLabel, { color: COLORS.green, fontSize: 11 }]}>✓ {c.present}%</Text>
                        <Text style={[styles.performanceLabel, { color: COLORS.red, fontSize: 11 }]}>✗ {c.absent}%</Text>
                      </View>
                    </View>
                    <View style={styles.stackBar}>
                      <Animated.View style={[styles.stackBarPresent, { width: `${c.present}%`, backgroundColor: c.color }]} />
                      <Animated.View style={[styles.stackBarAbsent, { width: `${c.absent}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Staff Attendance */}
          {activeTab === 'staff' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Staff Attendance</Text>
              <View style={styles.staffGrid}>
                {staffAttendanceData.map((s, i) => (
                  <View key={i} style={styles.staffCard}>
                    <RingChart value={s.present} color={s.color} size={80} />
                    <Text style={styles.staffCardName}>{s.name}</Text>
                    <Text style={styles.staffCardSub}>
                      {Math.round(s.total * s.present / 100)}/{s.total} Present
                    </Text>
                  </View>
                ))}
              </View>

              <View style={[styles.card, { marginTop: 12 }]}>
                {staffAttendanceData.map((s, i) => (
                  <View key={i} style={styles.performanceItem}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={styles.performanceLabel}>{s.name}</Text>
                      <Text style={styles.performanceValue}>{s.present}%</Text>
                    </View>
                    <AnimatedBar percentage={s.present} color={s.color} delay={i * 80} />
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: '#E8ECF5' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightBlue, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 26, color: COLORS.primary, fontWeight: '700', lineHeight: 30 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark, flex: 1, textAlign: 'center' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  progressBar: { height: 8, backgroundColor: '#E8ECF5', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 4 },
  performanceItem: { marginBottom: 16 },
  performanceLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textDark, marginBottom: 6 },
  performanceValue: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },
  stackBar: { height: 10, flexDirection: 'row', borderRadius: 5, overflow: 'hidden', backgroundColor: '#E8ECF5' },
  stackBarPresent: { height: '100%' },
  stackBarAbsent: { height: '100%', backgroundColor: COLORS.red + '55' },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  summaryNum: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  summaryLbl: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: '#E8ECF5', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: COLORS.textSub },
  staffGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  staffCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  staffCardName: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginTop: 10, textAlign: 'center' },
  staffCardSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
});
