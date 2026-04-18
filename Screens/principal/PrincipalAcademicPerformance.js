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

export default function PrincipalAcademicPerformance({ onToggleSidebar, onBack }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('grade');

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const topClass = [...classPerformanceData].sort((a, b) => b.percentage - a.percentage)[0];
  const avgScore = Math.round(classPerformanceData.reduce((s, c) => s + c.percentage, 0) / classPerformanceData.length);

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
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Academic Performance</Text>
        <View style={{ width: 40 }} />
      </View>

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
  tabRow: { flexDirection: 'row', backgroundColor: '#E8ECF5', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary },
  barChartWrap: { flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 8, gap: 10, paddingHorizontal: 4 },
  barChartCol: { alignItems: 'center', width: 48 },
  barChartVal: { fontSize: 10, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  barChartBarBg: { width: 28, justifyContent: 'flex-end', backgroundColor: '#F0F4FF', borderRadius: 6 },
  barChartBar: { width: 28, borderRadius: 6 },
  barChartLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 6, textAlign: 'center', fontWeight: '600' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: COLORS.textSub },
});
