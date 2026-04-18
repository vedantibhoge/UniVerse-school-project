import React, { useState, useRef, useEffect } from 'react';
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
  cardBorder: '#E8ECF5',
  iconBlueBg: '#E8EEFF',
};

const keyMetrics = [
  { label: 'Institutions', value: '12', sub: 'Active', icon: '🏫', color: '#1B3FA0' },
  { label: 'Students', value: '8', sub: 'at risk', icon: '🎓', color: '#E53935' },
  { label: 'Attendance', value: '94%', sub: 'Target', icon: '✅', color: '#22C55E' },
  { label: 'Avg Rating', value: '4.2', sub: 'Teachers', icon: '⭐', color: '#F97316' },
  { label: 'Pending', value: '3', sub: 'Approvals', icon: '⏳', color: '#8B5CF6' },
  { label: 'Resolved', value: '42/45', sub: 'Issues', icon: '✔️', color: '#06B6D4' },
];

const studentRisks = [
  { name: 'Alex Johnson', class: '10A', risk: 'High', attendance: '65%', avatar: '👨‍🎓', status: 'Critical' },
  { name: 'Sarah Lee', class: '10B', risk: 'Medium', attendance: '78%', avatar: '👩‍🎓', status: 'Warning' },
  { name: 'Mike Brown', class: '10A', risk: 'High', attendance: '58%', avatar: '👨‍🎓', status: 'Critical' },
];

const approvalData = [
  { label: 'Pending Review', value: 3, color: '#FFB84D' },
  { label: 'Approved', value: 12, color: '#22C55E' },
  { label: 'Rejected', value: 2, color: '#E53935' },
];

const classPerformance = [
  { class: '10A', data: [5, 4, 3, 4, 5, 4, 3, 4, 5, 4] },
  { class: '10B', data: [4, 3, 4, 3, 4, 5, 3, 4, 3, 4] },
  { class: '10C', data: [3, 4, 5, 4, 3, 4, 5, 4, 3, 4] },
  { class: '10D', data: [4, 4, 4, 4, 4, 3, 4, 4, 4, 3] },
];

const teacherData = [
  { name: 'Q1', score: 78 },
  { name: 'Q2', score: 85 },
  { name: 'Q3', score: 92 },
  { name: 'Q4', score: 88 },
  { name: 'Q5', score: 95 },
];

function MetricCard({ label, value, sub, icon, color }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity style={styles.metricCard} activeOpacity={0.7}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricIcon}>{icon}</Text>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricSub}>{sub}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function StudentRiskCard({ student }) {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High':
        return '#E53935';
      case 'Medium':
        return '#F97316';
      case 'Low':
        return '#22C55E';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <TouchableOpacity style={styles.riskCard} activeOpacity={0.7}>
      <View style={styles.riskLeft}>
        <Text style={styles.riskAvatar}>{student.avatar}</Text>
        <View style={styles.riskInfo}>
          <Text style={styles.riskName}>{student.name}</Text>
          <Text style={styles.riskClass}>{student.class}</Text>
        </View>
      </View>
      <View style={styles.riskRight}>
        <View
          style={[
            styles.riskBadge,
            { backgroundColor: getRiskColor(student.risk) + '20', borderColor: getRiskColor(student.risk) },
          ]}
        >
          <Text style={[styles.riskText, { color: getRiskColor(student.risk) }]}>{student.risk}</Text>
        </View>
        <Text style={styles.attendanceText}>{student.attendance}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ApprovalCard({ item }) {
  return (
    <View style={styles.approvalCard}>
      <View style={[styles.approvalDot, { backgroundColor: item.color }]} />
      <View style={styles.approvalContent}>
        <Text style={styles.approvalLabel}>{item.label}</Text>
        <Text style={styles.approvalValue}>{item.value}</Text>
      </View>
    </View>
  );
}

function ClassHeatmap() {
  const getColorByScore = (score) => {
    const colors = ['#fee8c3', '#fdbb84', '#e34a33', '#b30000', '#7f0000'];
    if (score <= 1) return colors[0];
    if (score <= 2) return colors[1];
    if (score <= 3) return colors[2];
    if (score <= 4) return colors[3];
    return colors[4];
  };

  return (
    <View style={styles.heatmapContainer}>
      <View style={styles.heatmapRow}>
        <Text style={styles.heatmapHeader}>Class</Text>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <Text key={num} style={styles.heatmapHeader}>
            {num}
          </Text>
        ))}
      </View>
      {classPerformance.map((cls) => (
        <View key={cls.class} style={styles.heatmapRow}>
          <Text style={styles.heatmapLabel}>{cls.class}</Text>
          {cls.data.map((score, idx) => (
            <View
              key={idx}
              style={[styles.heatmapCell, { backgroundColor: getColorByScore(score) }]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function TeacherChart() {
  const maxScore = 100;
  const barHeight = 120;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartBars}>
        {teacherData.map((item, idx) => {
          const heightPercent = (item.score / maxScore) * barHeight;
          return (
            <View key={idx} style={styles.barWrapper}>
              <Text style={styles.barLabel}>{item.score}%</Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: heightPercent,
                    backgroundColor: item.score >= 90 ? '#22C55E' : item.score >= 80 ? '#3B82F6' : '#F97316',
                  },
                ]}
              />
              <Text style={styles.barName}>{item.name}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function CircularProgress({ percentage, label }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressCircleWrapper}>
        {/* Background circle */}
        <View style={styles.progressCircleBackground} />
        
        {/* Foreground arc - using multiple segments */}
        <View
          style={[
            styles.progressCircleForeground,
            {
              opacity: percentage / 100,
            },
          ]}
        />
        
        {/* Center content */}
        <View style={styles.progressCenter}>
          <Text style={styles.progressPercentage}>{percentage}%</Text>
          <Text style={styles.progressLabel}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

export default function PrincipalDashboard({ onToggleSidebar, onTabChange }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
        {/* Welcome Header with Hamburger */}
        <View style={styles.welcomeHeader}>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => onToggleSidebar(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome Principal!</Text>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            {keyMetrics.map((metric, idx) => (
              <View key={idx} style={styles.metricWrapper}>
                <MetricCard
                  label={metric.label}
                  value={metric.value}
                  sub={metric.sub}
                  icon={metric.icon}
                  color={metric.color}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.staffPerformanceCard}
            onPress={() => onTabChange('staff')}
            activeOpacity={0.7}
          >
            <View style={styles.staffCardLeft}>
              <Text style={styles.staffCardIcon}>👥</Text>
              <View style={styles.staffCardInfo}>
                <Text style={styles.staffCardTitle}>Staff Performance</Text>
                <Text style={styles.staffCardSubtitle}>View all teachers & analytics</Text>
              </View>
            </View>
            <Text style={styles.staffCardArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Student Risk Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Student Risk Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.viewMore}>View All →</Text>
            </TouchableOpacity>
          </View>
          {studentRisks.map((student, idx) => (
            <StudentRiskCard key={idx} student={student} />
          ))}
        </View>

        {/* Approval Outlook */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approval Outlook</Text>
          <View style={styles.approvalGrid}>
            {approvalData.map((item, idx) => (
              <ApprovalCard key={idx} item={item} />
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  hamburger: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  notificationBell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bellIcon: {
    fontSize: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  viewMore: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricWrapper: {
    width: '32%',
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metricIcon: {
    fontSize: 24,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 10,
    color: '#999',
  },
  riskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  riskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riskAvatar: {
    fontSize: 28,
    marginRight: 12,
  },
  riskInfo: {
    flex: 1,
  },
  riskName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  riskClass: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  riskRight: {
    alignItems: 'flex-end',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600',
  },
  attendanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  approvalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approvalCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  approvalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  approvalContent: {
    flex: 1,
  },
  approvalLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  approvalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  cardWithBg: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  heatmapContainer: {
    paddingHorizontal: 8,
  },
  heatmapRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  heatmapHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    width: '8%',
    textAlign: 'center',
  },
  heatmapLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textDark,
    width: '8%',
    textAlign: 'center',
  },
  heatmapCell: {
    width: '8%',
    height: 24,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  chartContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: 160,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  bar: {
    width: 28,
    borderRadius: 6,
    marginBottom: 8,
  },
  barName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  resolutionContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  progressWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressCircleBackground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: '#E8ECF5',
  },
  progressCircleForeground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: '#22C55E',
    borderTopColor: '#22C55E',
    borderRightColor: '#22C55E',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  resolutionStats: {
    flex: 1,
    marginLeft: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  staffPerformanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  staffCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  staffCardIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  staffCardInfo: {
    flex: 1,
  },
  staffCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  staffCardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  staffCardArrow: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
