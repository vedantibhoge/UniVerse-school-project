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
  lightRed: '#FEF2F2',
};

const newAdmissionStudents = [
  { id: 1, name: 'Aarav Sharma',    grade: 'Grade 1A', date: '01 Apr 2024', status: 'Active',   avatar: '👦' },
  { id: 2, name: 'Priya Patil',     grade: 'Grade 1B', date: '02 Apr 2024', status: 'Active',   avatar: '👧' },
  { id: 3, name: 'Rohan Desai',     grade: 'Grade 2A', date: '03 Apr 2024', status: 'Active',   avatar: '👦' },
  { id: 4, name: 'Sneha Kulkarni',  grade: 'Grade 2C', date: '04 Apr 2024', status: 'Pending',  avatar: '👧' },
  { id: 5, name: 'Karan Mehta',     grade: 'Grade 3B', date: '05 Apr 2024', status: 'Active',   avatar: '👦' },
  { id: 6, name: 'Ananya Joshi',    grade: 'Grade 3A', date: '06 Apr 2024', status: 'Active',   avatar: '👧' },
  { id: 7, name: 'Vikram Rao',      grade: 'Grade 4B', date: '07 Apr 2024', status: 'Active',   avatar: '👦' },
  { id: 8, name: 'Divya Nair',      grade: 'Grade 4C', date: '08 Apr 2024', status: 'Pending',  avatar: '👧' },
  { id: 9, name: 'Arjun Iyer',      grade: 'Grade 5A', date: '09 Apr 2024', status: 'Active',   avatar: '👦' },
  { id: 10, name: 'Meera Pillai',   grade: 'Grade 5B', date: '10 Apr 2024', status: 'Active',   avatar: '👧' },
  { id: 11, name: 'Sahil Patel',    grade: 'Grade 6A', date: '11 Apr 2024', status: 'Active',   avatar: '👦' },
  { id: 12, name: 'Pooja Verma',    grade: 'Grade 6C', date: '12 Apr 2024', status: 'Inactive', avatar: '👧' },
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

export default function PrincipalEnrollmentTrends({ onToggleSidebar, onBack }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const filters = ['All', 'Active', 'Pending', 'Inactive'];
  const filtered = filter === 'All'
    ? newAdmissionStudents
    : newAdmissionStudents.filter(s => s.status === filter);

  const statusColor = (s) => s === 'Active' ? COLORS.green : s === 'Pending' ? COLORS.orange : COLORS.red;
  const statusBg = (s) => s === 'Active' ? COLORS.lightGreen : s === 'Pending' ? COLORS.lightOrange : COLORS.lightRed;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enrollment Trends</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightBlue }]}>
              <Text style={styles.summaryNum}>{newAdmissionStudents.length}</Text>
              <Text style={styles.summaryLbl}>Total Admitted</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightGreen }]}>
              <Text style={[styles.summaryNum, { color: COLORS.green }]}>
                {newAdmissionStudents.filter(s => s.status === 'Active').length}
              </Text>
              <Text style={styles.summaryLbl}>Active</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightOrange }]}>
              <Text style={[styles.summaryNum, { color: COLORS.orange }]}>
                {newAdmissionStudents.filter(s => s.status === 'Pending').length}
              </Text>
              <Text style={styles.summaryLbl}>Pending</Text>
            </View>
          </View>

          {/* Grade-wise Bar */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admission by Grade</Text>
            <View style={styles.card}>
              {[1,2,3,4,5,6].map(g => {
                const count = newAdmissionStudents.filter(s => s.grade.startsWith(`Grade ${g}`)).length;
                const pct = (count / newAdmissionStudents.length) * 100;
                return (
                  <View key={g} style={styles.performanceItem}>
                    <Text style={styles.performanceLabel}>Grade {g}</Text>
                    <AnimatedBar percentage={pct} color={COLORS.primary} delay={g * 80} />
                    <Text style={styles.performanceValue}>{count} students</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Admission Students</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsRow}>
              {filters.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterTab, filter === f && styles.filterTabActive]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filtered.map((s, i) => (
              <Animated.View key={s.id} style={styles.studentRow}>
                <View style={styles.studentAvatar}>
                  <Text style={{ fontSize: 22 }}>{s.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{s.name}</Text>
                  <Text style={styles.studentSub}>{s.grade} · Admitted: {s.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusBg(s.status) }]}>
                  <Text style={[styles.statusText, { color: statusColor(s.status) }]}>{s.status}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
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
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  summaryNum: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  summaryLbl: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },
  filterTabsRow: { marginBottom: 12 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E8ECF5', marginRight: 8 },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  filterTabTextActive: { color: COLORS.white },
  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  studentAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lightBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  studentName: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 3 },
  studentSub: { fontSize: 12, color: COLORS.textMuted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
