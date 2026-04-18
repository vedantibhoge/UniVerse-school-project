import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

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

// ─── DATA ───────────────────────────────────────────────────────────────────

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

const classPerformanceData = [
  { label: 'Grade 1', percentage: 88, color: COLORS.green,   students: 72,  avg: 88.2, pass: 98 },
  { label: 'Grade 2', percentage: 82, color: COLORS.blue,    students: 68,  avg: 82.5, pass: 95 },
  { label: 'Grade 3', percentage: 91, color: COLORS.orange,  students: 75,  avg: 91.0, pass: 99 },
  { label: 'Grade 4', percentage: 79, color: COLORS.red,     students: 70,  avg: 79.3, pass: 92 },
  { label: 'Grade 5', percentage: 85, color: '#8B5CF6',      students: 74,  avg: 85.6, pass: 96 },
  { label: 'Grade 6', percentage: 87, color: '#06B6D4',      students: 69,  avg: 87.1, pass: 97 },
  { label: 'Grade 7', percentage: 80, color: '#EC4899',      students: 71,  avg: 80.4, pass: 93 },
  { label: 'Grade 8', percentage: 83, color: COLORS.primary, students: 66,  avg: 83.8, pass: 94 },
  { label: 'Grade 9', percentage: 76, color: COLORS.orange,  students: 63,  avg: 76.2, pass: 89 },
  { label: 'Grade 10',percentage: 73, color: COLORS.red,     students: 60,  avg: 73.5, pass: 86 },
];

const subjectPerformance = [
  { subject: 'Mathematics',  score: 78, color: COLORS.blue },
  { subject: 'Science',      score: 85, color: COLORS.green },
  { subject: 'English',      score: 90, color: COLORS.orange },
  { subject: 'Social Studies', score: 82, color: '#8B5CF6' },
  { subject: 'Hindi',        score: 88, color: '#EC4899' },
];

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

const reportData = [
  {
    id: 'academic',
    title: 'Academic Performance Report',
    description: 'Quarterly analysis of student grades',
    icon: '📊',
    date: 'Updated: Apr 15, 2024',
    color: COLORS.lightBlue,
    accent: COLORS.primary,
  },
  {
    id: 'attendance',
    title: 'Attendance Analytics',
    description: 'Staff and student attendance trends',
    icon: '📈',
    date: 'Updated: Apr 16, 2024',
    color: COLORS.lightGreen,
    accent: COLORS.green,
  },
  {
    id: 'enrollment',
    title: 'Enrollment Trends',
    description: 'Student admission and drop-out analysis',
    icon: '🎓',
    date: 'Updated: Apr 12, 2024',
    color: COLORS.lightOrange,
    accent: COLORS.orange,
  },
];

// Class & Month options
const classOptions = [];
for (let grade = 1; grade <= 10; grade++) {
  for (const division of ['A', 'B', 'C']) {
    classOptions.push({ id: `${grade}${division}`, label: `Grade ${grade}${division}` });
  }
}

const monthOptions = [
  { id: 'Jan', label: 'January' }, { id: 'Feb', label: 'February' },
  { id: 'Mar', label: 'March' },   { id: 'Apr', label: 'April' },
  { id: 'May', label: 'May' },     { id: 'Jun', label: 'June' },
  { id: 'Jul', label: 'July' },    { id: 'Aug', label: 'August' },
  { id: 'Sep', label: 'September' },{ id: 'Oct', label: 'October' },
  { id: 'Nov', label: 'November' }, { id: 'Dec', label: 'December' },
];

// ─── SMALL COMPONENTS ───────────────────────────────────────────────────────

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

function ScreenHeader({ title, onBack }) {
  return (
    <View style={styles.screenHeader}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.screenHeaderTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

// ─── ENROLLMENT SCREEN ──────────────────────────────────────────────────────

function EnrollmentScreen({ onBack }) {
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
      <ScreenHeader title="Enrollment Trends" onBack={onBack} />
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

// ─── ACADEMIC PERFORMANCE SCREEN ────────────────────────────────────────────

function AcademicScreen({ onBack }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('grade');

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const topClass = [...classPerformanceData].sort((a, b) => b.percentage - a.percentage)[0];
  const avgScore = Math.round(classPerformanceData.reduce((s, c) => s + c.percentage, 0) / classPerformanceData.length);

  // Simple bar chart renderer
  const BarChart = ({ data, valueKey, labelKey, colorKey, unit = '%' }) => {
    const maxVal = Math.max(...data.map(d => d[valueKey]));
    const chartH = 160;

    return (
      <View style={styles.barChartWrap}>
        {data.map((d, i) => {
          const barH = (d[valueKey] / maxVal) * chartH;
          return (
            <View key={i} style={styles.barChartCol}>
              <Text style={styles.barChartVal}>{d[valueKey]}{unit}</Text>
              <View style={[styles.barChartBarBg, { height: chartH }]}>
                <Animated.View
                  style={[styles.barChartBar, {
                    height: barH,
                    backgroundColor: d[colorKey] || COLORS.primary,
                  }]}
                />
              </View>
              <Text style={styles.barChartLabel}>{d[labelKey]}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScreenHeader title="Academic Performance" onBack={onBack} />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* Top Summary */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightBlue }]}>
              <Text style={styles.summaryNum}>{avgScore}%</Text>
              <Text style={styles.summaryLbl}>School Avg</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightGreen }]}>
              <Text style={[styles.summaryNum, { color: COLORS.green }]}>{topClass.label}</Text>
              <Text style={styles.summaryLbl}>Top Grade</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.lightOrange }]}>
              <Text style={[styles.summaryNum, { color: COLORS.orange }]}>+2.3%</Text>
              <Text style={styles.summaryLbl}>Growth</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {['grade', 'subject'].map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, activeTab === t && styles.tabActive]}
                onPress={() => setActiveTab(t)}
              >
                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                  {t === 'grade' ? 'Grade-wise' : 'Subject-wise'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bar Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'grade' ? 'Performance by Grade' : 'Performance by Subject'}
            </Text>
            <View style={[styles.card, { paddingBottom: 8 }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={activeTab === 'grade' ? classPerformanceData : subjectPerformance}
                  valueKey={activeTab === 'grade' ? 'percentage' : 'score'}
                  labelKey={activeTab === 'grade' ? 'label' : 'subject'}
                  colorKey="color"
                />
              </ScrollView>
            </View>
          </View>

          {/* Grade Detail List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'grade' ? 'Grade Details' : 'Subject Breakdown'}
            </Text>
            <View style={styles.card}>
              {(activeTab === 'grade' ? classPerformanceData : subjectPerformance).map((item, i) => {
                const pct = activeTab === 'grade' ? item.percentage : item.score;
                const label = activeTab === 'grade' ? item.label : item.subject;
                return (
                  <View key={i} style={styles.performanceItem}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={styles.performanceLabel}>{label}</Text>
                      {activeTab === 'grade' && (
                        <Text style={[styles.performanceLabel, { color: COLORS.textMuted, fontSize: 11 }]}>
                          {item.students} students · Pass: {item.pass}%
                        </Text>
                      )}
                    </View>
                    <AnimatedBar percentage={pct} color={item.color} delay={i * 80} />
                    <Text style={styles.performanceValue}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Performance Legend */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Scale</Text>
            <View style={[styles.card, { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }]}>
              {[
                { label: 'Excellent (90-100%)', color: COLORS.green },
                { label: 'Good (75-89%)', color: COLORS.blue },
                { label: 'Average (60-74%)', color: COLORS.orange },
                { label: 'Below Avg (<60%)', color: COLORS.red },
              ].map((l, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── ATTENDANCE SCREEN ──────────────────────────────────────────────────────

function AttendanceScreen({ onBack }) {
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

  // Donut-style ring chart (simplified with arcs)
  const RingChart = ({ value, color, size = 80 }) => {
    const strokeW = 10;
    const r = (size - strokeW) / 2;
    const circumference = 2 * Math.PI * r;
    const dash = (value / 100) * circumference;

    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* background ring */}
        <View style={{
          width: size, height: size, borderRadius: size / 2,
          borderWidth: strokeW, borderColor: '#E8ECF5', position: 'absolute'
        }} />
        {/* filled arc – approximate with a colored overlay cropped to percentage */}
        <View style={{
          width: size, height: size, borderRadius: size / 2,
          borderWidth: strokeW, borderColor: color,
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScreenHeader title="Attendance Analytics" onBack={onBack} />
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

// ─── MAIN REPORT CARD ───────────────────────────────────────────────────────

function ReportCard({ icon, title, description, date, color, accent, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={[styles.reportCard, { borderLeftWidth: 4, borderLeftColor: accent }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.cardLeft, { backgroundColor: color, borderRadius: 12, padding: 10 }]}>
          <Text style={styles.reportIcon}>{icon}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.reportTitle}>{title}</Text>
          <Text style={styles.reportDescription}>{description}</Text>
          <Text style={styles.reportDate}>{date}</Text>
        </View>
        <Text style={[styles.cardArrow, { color: accent }]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── MAIN SCREEN ────────────────────────────────────────────────────────────

const performanceMetrics = [
  { label: 'Class A', percentage: 85, color: COLORS.green },
  { label: 'Class B', percentage: 78, color: COLORS.blue },
  { label: 'Class C', percentage: 92, color: COLORS.orange },
  { label: 'Class D', percentage: 88, color: COLORS.primary },
];

export default function PrincipalReports({ onToggleSidebar }) {
  const [activeScreen, setActiveScreen] = useState(null); // null | 'enrollment' | 'academic' | 'attendance'
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const handleReportPress = (reportId) => {
    if (reportId === 'enrollment') setActiveScreen('enrollment');
    else if (reportId === 'academic') setActiveScreen('academic');
    else if (reportId === 'attendance') setActiveScreen('attendance');
  };

  // Render sub-screens
  if (activeScreen === 'enrollment') return <EnrollmentScreen onBack={() => setActiveScreen(null)} />;
  if (activeScreen === 'academic') return <AcademicScreen onBack={() => setActiveScreen(null)} />;
  if (activeScreen === 'attendance') return <AttendanceScreen onBack={() => setActiveScreen(null)} />;

  const handleExportPDF = () => {
    if (!selectedClass || !selectedMonth) {
      Alert.alert('Select Filter', 'Please select both class and month before exporting.');
      return;
    }
    Alert.alert(
      'Export PDF',
      `Exporting report for ${selectedClass.label} - ${selectedMonth.label}...`,
      [
        { text: 'Download', onPress: () => Alert.alert('Success', 'PDF exported successfully!') },
        { text: 'Cancel' },
      ]
    );
  };

  const handleExportExcel = () => {
    if (!selectedClass || !selectedMonth) {
      Alert.alert('Select Filter', 'Please select both class and month before exporting.');
      return;
    }
    Alert.alert(
      'Export Excel',
      `Exporting report for ${selectedClass.label} - ${selectedMonth.label}...`,
      [
        { text: 'Download', onPress: () => Alert.alert('Success', 'Excel file exported successfully!') },
        { text: 'Cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburger} onPress={() => onToggleSidebar(true)} activeOpacity={0.7}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter by Class & Month</Text>
          <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Select Class</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => { setShowClassDropdown(!showClassDropdown); setShowMonthDropdown(false); }} activeOpacity={0.7}>
                <Text style={styles.dropdownText}>{selectedClass ? selectedClass.label : 'Choose Class...'}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showClassDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {classOptions.map(cls => (
                      <TouchableOpacity key={cls.id} style={styles.dropdownOption} onPress={() => { setSelectedClass(cls); setShowClassDropdown(false); }}>
                        <Text style={styles.dropdownOptionText}>{cls.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Select Month</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => { setShowMonthDropdown(!showMonthDropdown); setShowClassDropdown(false); }} activeOpacity={0.7}>
                <Text style={styles.dropdownText}>{selectedMonth ? selectedMonth.label : 'Choose Month...'}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showMonthDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {monthOptions.map(month => (
                      <TouchableOpacity key={month.id} style={styles.dropdownOption} onPress={() => { setSelectedMonth(month); setShowMonthDropdown(false); }}>
                        <Text style={styles.dropdownOptionText}>{month.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Performance Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Performance Overview</Text>
          <View style={styles.card}>
            {performanceMetrics.map((m, i) => (
              <View key={i} style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>{m.label}</Text>
                <AnimatedBar percentage={m.percentage} color={m.color} delay={i * 100} />
                <Text style={styles.performanceValue}>{m.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics Summary</Text>
          <View style={styles.metricsGrid}>
            {[
              { icon: '📚', label: 'Total Classes', value: '42' },
              { icon: '👨‍🎓', label: 'Average Score', value: '86.5' },
              { icon: '📈', label: 'Improvement', value: '+2.3%' },
              { icon: '⏰', label: 'On-time', value: '95.2%' },
            ].map((m, i) => (
              <View key={i} style={styles.metricBox}>
                <Text style={styles.metricIcon}>{m.icon}</Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={styles.metricValue}>{m.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          {reportData.map(r => (
            <ReportCard
              key={r.id}
              icon={r.icon}
              title={r.title}
              description={r.description}
              date={r.date}
              color={r.color}
              accent={r.accent}
              onPress={() => handleReportPress(r.id)}
            />
          ))}
        </View>

        {/* Export */}
        {selectedClass && selectedMonth && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Export Report</Text>
            <Text style={styles.exportSubtitle}>{selectedClass.label} — {selectedMonth.label}</Text>
            <View style={styles.exportOptions}>
              <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF} activeOpacity={0.7}>
                <Text style={styles.exportIcon}>📄</Text>
                <Text style={styles.exportLabel}>Export as PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportButton} onPress={handleExportExcel} activeOpacity={0.7}>
                <Text style={styles.exportIcon}>📊</Text>
                <Text style={styles.exportLabel}>Export as Excel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: '#E8ECF5' },
  screenHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: '#E8ECF5' },
  backBtn:          { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightBlue, alignItems: 'center', justifyContent: 'center' },
  backIcon:         { fontSize: 26, color: COLORS.primary, fontWeight: '700', lineHeight: 30 },
  screenHeaderTitle:{ fontSize: 17, fontWeight: '700', color: COLORS.textDark, flex: 1, textAlign: 'center' },
  hamburger:        { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  hamburgerIcon:    { fontSize: 24, color: COLORS.primary, fontWeight: 'bold' },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: COLORS.textDark, flex: 1, textAlign: 'center' },
  headerPlaceholder:{ width: 48 },
  content:          { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  section:          { marginBottom: 24 },
  sectionTitle:     { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 12 },
  card:             { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },

  // Progress bars
  progressBar:      { height: 8, backgroundColor: '#E8ECF5', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill:     { height: '100%', borderRadius: 4 },
  performanceItem:  { marginBottom: 16 },
  performanceLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textDark, marginBottom: 6 },
  performanceValue: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },

  // Stacked bar
  stackBar:         { height: 10, flexDirection: 'row', borderRadius: 5, overflow: 'hidden', backgroundColor: '#E8ECF5' },
  stackBarPresent:  { height: '100%' },
  stackBarAbsent:   { height: '100%', backgroundColor: COLORS.red + '55' },

  // Summary row
  summaryRow:       { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard:      { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  summaryNum:       { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  summaryLbl:       { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textAlign: 'center' },

  // Metrics
  metricsGrid:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricBox:        { width: '48%', backgroundColor: COLORS.white, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  metricIcon:       { fontSize: 24, marginBottom: 8 },
  metricLabel:      { fontSize: 12, color: COLORS.textMuted, marginBottom: 6, textAlign: 'center' },
  metricValue:      { fontSize: 20, fontWeight: '700', color: COLORS.textDark },

  // Report cards
  reportCard:       { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  cardLeft:         { marginRight: 12 },
  reportIcon:       { fontSize: 26 },
  cardContent:      { flex: 1 },
  reportTitle:      { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 3 },
  reportDescription:{ fontSize: 12, color: COLORS.textMuted, marginBottom: 3 },
  reportDate:       { fontSize: 11, color: '#999' },
  cardArrow:        { fontSize: 22, fontWeight: 'bold' },

  // Export
  exportOptions:    { flexDirection: 'row', justifyContent: 'space-between' },
  exportButton:     { width: '48%', backgroundColor: COLORS.white, borderRadius: 14, padding: 18, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  exportIcon:       { fontSize: 28, marginBottom: 8 },
  exportLabel:      { fontSize: 13, fontWeight: '600', color: COLORS.textDark, textAlign: 'center' },
  exportSubtitle:   { fontSize: 12, color: COLORS.textMuted, marginBottom: 14, fontWeight: '500' },

  // Filter
  filterContainer:  { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 4 },
  filterItem:       { flex: 1 },
  filterLabel:      { fontSize: 12, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
  dropdown:         { backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E8ECF5', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  dropdownText:     { fontSize: 13, color: COLORS.textDark, fontWeight: '500', flex: 1 },
  dropdownArrow:    { fontSize: 10, color: COLORS.primary, marginLeft: 8 },
  dropdownMenu:     { backgroundColor: COLORS.white, borderRadius: 10, marginTop: 4, borderWidth: 1, borderColor: '#E8ECF5', maxHeight: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5 },
  dropdownScroll:   { maxHeight: 200 },
  dropdownOption:   { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F4FF' },
  dropdownOptionText:{ fontSize: 13, color: COLORS.textDark, fontWeight: '500' },

  // Tabs
  tabRow:           { flexDirection: 'row', backgroundColor: '#E8ECF5', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab:              { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive:        { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText:          { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive:    { color: COLORS.primary },

  // Filter tabs (enrollment)
  filterTabsRow:    { marginBottom: 12 },
  filterTab:        { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E8ECF5', marginRight: 8 },
  filterTabActive:  { backgroundColor: COLORS.primary },
  filterTabText:    { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  filterTabTextActive:{ color: COLORS.white },

  // Student row
  studentRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  studentAvatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lightBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  studentName:      { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 3 },
  studentSub:       { fontSize: 12, color: COLORS.textMuted },
  statusBadge:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText:       { fontSize: 11, fontWeight: '700' },

  // Legend
  legendItem:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:        { width: 10, height: 10, borderRadius: 5 },
  legendText:       { fontSize: 12, color: COLORS.textSub },

  // Bar chart (vertical)
  barChartWrap:     { flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 8, gap: 10, paddingHorizontal: 4 },
  barChartCol:      { alignItems: 'center', width: 48 },
  barChartVal:      { fontSize: 10, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  barChartBarBg:    { width: 28, justifyContent: 'flex-end', backgroundColor: '#F0F4FF', borderRadius: 6 },
  barChartBar:      { width: 28, borderRadius: 6 },
  barChartLabel:    { fontSize: 10, color: COLORS.textMuted, marginTop: 6, textAlign: 'center', fontWeight: '600' },

  // Staff grid
  staffGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  staffCard:        { width: '48%', backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  staffCardName:    { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginTop: 10, textAlign: 'center' },
  staffCardSub:     { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
});