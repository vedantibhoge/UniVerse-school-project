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
  Alert,
  Dimensions,
} from 'react-native';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  green: '#22C55E',
  red: '#E53935',
  orange: '#F97316',
  blue: '#3B82F6',
};

const { width } = Dimensions.get('window');

// Student Risk Data
const atRiskStudents = [
  {
    id: 1,
    name: 'Julian Verna',
    class: 'Grade 9 • Docking Grades (D)',
    avatar: '👨‍🎓',
    risk: 'High',
    attendance: '54%',
  },
  {
    id: 2,
    name: 'Liam Peterson',
    class: 'Grade 6 • Docking Grades (D)',
    avatar: '👨‍🎓',
    risk: 'Medium',
    attendance: '70%',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    class: 'Grade 3 • Multiple Missed Exams',
    avatar: '👩‍🎓',
    risk: 'High',
    attendance: '62%',
  },
];

// Attendance Alerts Data
const attendanceAlerts = [
  { class: 'Grade 1 (B History)', percentage: 82, severity: 'critical' },
  { class: 'Grade 9A (Maths)', percentage: 71, severity: 'warning' },
  { class: 'Grade 12C (Physics)', percentage: 76, severity: 'warning' },
];

// Pending Approvals Data
const pendingApprovals = [
  {
    id: 1,
    type: 'Student Admission',
    student: 'Marcus Reed',
    detail: 'Transfer Request • 1.0 Grade',
    status: 'pending',
  },
  {
    id: 2,
    type: 'Teacher Leave',
    student: 'Sarah Connor',
    detail: 'Medical Leave • 3 Days',
    status: 'pending',
  },
  {
    id: 3,
    type: 'Field Trip',
    student: 'Science Expo',
    detail: 'Interbatch Event • 50 Students',
    status: 'pending',
  },
];

// Generate all classes (1-10 with divisions A, B, C)
const allClasses = [];
for (let grade = 1; grade <= 10; grade++) {
  for (const division of ['A', 'B', 'C']) {
    allClasses.push({
      grade,
      division,
      label: `Grade ${grade}${division}`,
    });
  }
}

// Student database for all classes
const generateStudentData = (grade, division) => {
  const firstNames = ['Aarav', 'Aisha', 'Arjun', 'Ananya', 'Rohan', 'Riya', 'Priya', 'Pankaj', 'Nisha', 'Nikhil', 'Karan', 'Kavya', 'Viraj', 'Veda', 'Zara', 'Zain', 'Sara', 'Sanjay', 'Tara', 'Tarun'];
  const lastNames = ['Singh', 'Sharma', 'Patel', 'Kumar', 'Gupta', 'Verma', 'Reddy', 'Khan', 'Nair', 'Bhat'];
  
  const students = [];
  const baseRoll = (grade * 100) + (division.charCodeAt(0) - 64) * 30;
  
  for (let i = 0; i < 35; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gpa = (Math.random() * 2 + 2).toFixed(1); // 2.0 - 4.0
    const academicLevel = parseFloat(gpa) >= 3.5 ? 'Excellent' : parseFloat(gpa) >= 2.5 ? 'Average' : 'Weak';
    
    students.push({
      rollNo: baseRoll + i + 1,
      name: `${firstName} ${lastName}`,
      gpa: parseFloat(gpa),
      attendance: Math.floor(Math.random() * 40 + 60) + '%',
      academicLevel,
      avatar: academicLevel === 'Excellent' ? '⭐' : academicLevel === 'Weak' ? '⚠️' : '👤',
    });
  }
  
  return students.sort((a, b) => a.rollNo - b.rollNo);
};

// Metrics Card Component
function MetricCard({ icon, label, value, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.metricCard, { borderTopColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.metricCardContent}>
        <Text style={styles.metricIcon}>{icon}</Text>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Class Selection Card
function ClassCard({ classData, onPress }) {
  return (
    <TouchableOpacity
      style={styles.classCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.classLabel}>{classData.label}</Text>
      <Text style={styles.classStudents}>35 Students</Text>
    </TouchableOpacity>
  );
}

// Student List Item
function StudentListItem({ student }) {
  const getAcademicColor = (level) => {
    switch (level) {
      case 'Excellent':
        return COLORS.green;
      case 'Weak':
        return COLORS.red;
      default:
        return COLORS.blue;
    }
  };

  return (
    <View style={styles.studentListItem}>
      <View style={styles.studentListLeft}>
        <Text style={styles.studentAvatar}>{student.avatar}</Text>
        <View style={styles.studentListInfo}>
          <Text style={styles.studentListName}>{student.name}</Text>
          <Text style={styles.studentListRoll}>Roll: {student.rollNo}</Text>
        </View>
      </View>
      <View style={styles.studentListRight}>
        <View
          style={[
            styles.academicBadge,
            {
              backgroundColor: getAcademicColor(student.academicLevel) + '20',
              borderColor: getAcademicColor(student.academicLevel),
            },
          ]}
        >
          <Text
            style={[
              styles.academicText,
              { color: getAcademicColor(student.academicLevel) },
            ]}
          >
            {student.academicLevel === 'Excellent' ? '⭐ Excellent' : student.academicLevel === 'Weak' ? '⚠️ Weak' : 'Average'}
          </Text>
        </View>
        <View style={styles.studentMetrics}>
          <Text style={styles.metricSmall}>GPA: {student.gpa}</Text>
          <Text style={styles.metricSmall}>{student.attendance}</Text>
        </View>
      </View>
    </View>
  );
}

// Performance Chart Component
function PerformanceChart() {
  const maxHeight = 80;
  const data = [
    { label: 'Q1', performance: 75, attendance: 92 },
    { label: 'Q2', performance: 82, attendance: 88 },
    { label: 'Q3', performance: 78, attendance: 85 },
    { label: 'Q4', performance: 88, attendance: 94 },
  ];

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Academic Performance vs Attendance</Text>
        <Text style={styles.chartSubtitle}>Correlation analysis across all grades</Text>
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.blue }]} />
          <Text style={styles.legendText}>Performance</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.green }]} />
          <Text style={styles.legendText}>Attendance</Text>
        </View>
      </View>
      <View style={styles.barsContainer}>
        {data.map((item, idx) => (
          <View key={idx} style={styles.barGroup}>
            <View style={styles.barsWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.performance / 100) * maxHeight,
                    backgroundColor: COLORS.blue,
                  },
                ]}
              />
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.attendance / 100) * maxHeight,
                    backgroundColor: COLORS.green,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Attendance Alert Card
function AttendanceAlertCard({ alert, onPress }) {
  const getColor = (severity) => {
    switch (severity) {
      case 'critical':
        return COLORS.red;
      case 'warning':
        return COLORS.orange;
      default:
        return COLORS.green;
    }
  };

  return (
    <TouchableOpacity
      style={styles.alertCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.alertContent}>
        <Text style={styles.alertClass}>{alert.class}</Text>
        <View style={styles.alertBar}>
          <View
            style={[
              styles.alertProgress,
              {
                width: `${alert.percentage}%`,
                backgroundColor: getColor(alert.severity),
              },
            ]}
          />
        </View>
      </View>
      <View
        style={[
          styles.alertBadge,
          { backgroundColor: getColor(alert.severity) },
        ]}
      >
        <Text style={styles.alertBadgeText}>{alert.percentage}%</Text>
      </View>
    </TouchableOpacity>
  );
}

// Approval Request Card
function ApprovalCard({ approval, onApprove, onReject }) {
  return (
    <TouchableOpacity
      style={styles.approvalItem}
      activeOpacity={0.7}
    >
      <View style={styles.approvalIcon}>
        <Text style={styles.approvalIconText}>
          {approval.type === 'Student Admission'
            ? '👤'
            : approval.type === 'Teacher Leave'
            ? '🎓'
            : '✈️'}
        </Text>
      </View>
      <View style={styles.approvalContent}>
        <Text style={styles.approvalType}>{approval.type}</Text>
        <Text style={styles.approvalStudent}>{approval.student}</Text>
        <Text style={styles.approvalDetail}>{approval.detail}</Text>
      </View>
      <View style={styles.approvalActions}>
        <TouchableOpacity
          style={[styles.approvalBtn, styles.rejectBtn]}
          onPress={onReject}
          activeOpacity={0.7}
        >
          <Text style={styles.approvalBtnText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.approvalBtn, styles.approveBtn]}
          onPress={onApprove}
          activeOpacity={0.7}
        >
          <Text style={styles.approvalBtnText}>✓</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// At-Risk Student Card
function AtRiskCard({ student, onPress }) {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High':
        return COLORS.red;
      case 'Medium':
        return COLORS.orange;
      case 'Low':
        return COLORS.green;
      default:
        return COLORS.blue;
    }
  };

  return (
    <TouchableOpacity
      style={styles.riskCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.riskHeader}>
        <Text style={styles.riskAvatar}>{student.avatar}</Text>
        <View style={styles.riskInfo}>
          <Text style={styles.riskName}>{student.name}</Text>
          <Text style={styles.riskClass}>{student.class}</Text>
        </View>
      </View>
      <View style={styles.riskFooter}>
        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor: getRiskColor(student.risk) + '20',
              borderColor: getRiskColor(student.risk),
            },
          ]}
        >
          <Text
            style={[
              styles.riskBadgeText,
              { color: getRiskColor(student.risk) },
            ]}
          >
            {student.risk}
          </Text>
        </View>
        <Text style={styles.attendanceValue}>{student.attendance}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PrincipalStudentOverview({ onToggleSidebar }) {
  const [alerts, setAlerts] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  const handleMetricPress = (metric) => {
    if (metric === 'Urgent' || metric === 'High Risk' || metric === 'Stable' || metric === 'New') {
      // Show all classes view
      setSelectedClass('all');
    } else {
      Alert.alert(`${metric} Metric`, `Viewing ${metric} details...`);
    }
  };

  const handleClassSelect = (classData) => {
    const classStudents = generateStudentData(classData.grade, classData.division);
    setStudents(classStudents);
    setSelectedClass(classData);
  };

  const handleBackToDashboard = () => {
    setSelectedClass(null);
    setStudents([]);
  };

  const handleApprove = (approval) => {
    Alert.alert('Approved', `${approval.type} approved successfully!`);
  };

  const handleReject = (approval) => {
    Alert.alert('Rejected', `${approval.type} has been rejected.`);
  };

  const handleRiskPress = (student) => {
    Alert.alert(
      `${student.name} - At Risk`,
      `Class: ${student.class}\nAttendance: ${student.attendance}\n\nTake action to support this student's progress.`
    );
  };

  const handleAlertPress = (alert) => {
    Alert.alert(
      'Attendance Alert',
      `${alert.class}\nCurrent Attendance: ${alert.percentage}%\n\nPlease monitor and take necessary action.`
    );
  };

  // Class List View
  if (selectedClass === 'all') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => onToggleSidebar(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Class</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={handleBackToDashboard}
          >
            <Text style={styles.headerIconText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>All Classes</Text>
          </View>

          <View style={styles.classesGrid}>
            {allClasses.map((classData, idx) => (
              <ClassCard
                key={idx}
                classData={classData}
                onPress={() => handleClassSelect(classData)}
              />
            ))}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Student List View
  if (selectedClass && selectedClass !== 'all') {
    const excellentCount = students.filter(s => s.academicLevel === 'Excellent').length;
    const weakCount = students.filter(s => s.academicLevel === 'Weak').length;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => onToggleSidebar(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedClass.label}</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {
              setSelectedClass('all');
            }}
          >
            <Text style={styles.headerIconText}>←</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>Student List - {selectedClass.label}</Text>
          </View>

          {/* Stats */}
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { borderTopColor: COLORS.green }]}>
              <View style={styles.metricCardContent}>
                <Text style={styles.metricIcon}>⭐</Text>
                <Text style={styles.metricValue}>{excellentCount}</Text>
                <Text style={styles.metricLabel}>Excellent</Text>
              </View>
            </View>
            <View style={[styles.metricCard, { borderTopColor: COLORS.red }]}>
              <View style={styles.metricCardContent}>
                <Text style={styles.metricIcon}>⚠️</Text>
                <Text style={styles.metricValue}>{weakCount}</Text>
                <Text style={styles.metricLabel}>Weak</Text>
              </View>
            </View>
            <View style={[styles.metricCard, { borderTopColor: COLORS.blue }]}>
              <View style={styles.metricCardContent}>
                <Text style={styles.metricIcon}>👥</Text>
                <Text style={styles.metricValue}>{students.length}</Text>
                <Text style={styles.metricLabel}>Total</Text>
              </View>
            </View>
          </View>

          {/* Student List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Students</Text>
            <View style={styles.studentsList}>
              {students.map((student) => (
                <StudentListItem key={student.rollNo} student={student} />
              ))}
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Dashboard View
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => onToggleSidebar(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Academic Curator</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => Alert.alert('Notifications', 'No new notifications')}
        >
          <Text style={styles.headerIconText}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dashboard Overview Title */}
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardTitle}>Dashboard Overview</Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="🎯"
            label="Urgent"
            value="12"
            color={COLORS.red}
            onPress={() => handleMetricPress('Urgent')}
          />
          <MetricCard
            icon="⚠️"
            label="High Risk"
            value="8"
            color={COLORS.orange}
            onPress={() => handleMetricPress('High Risk')}
          />
          <MetricCard
            icon="✅"
            label="Avg Attendance"
            value="94%"
            color={COLORS.green}
            onPress={() => handleMetricPress('Attendance')}
          />
          <MetricCard
            icon="⭐"
            label="Avg Score"
            value="4.2"
            color={COLORS.blue}
            onPress={() => handleMetricPress('Score')}
          />
          <MetricCard
            icon="📈"
            label="Stable"
            value="3"
            color={COLORS.green}
            onPress={() => handleMetricPress('Stable')}
          />
          <MetricCard
            icon="🆕"
            label="New"
            value="2"
            color={COLORS.primary}
            onPress={() => handleMetricPress('New')}
          />
        </View>

        {/* Performance Chart */}
        <View style={styles.section}>
          <PerformanceChart />
        </View>

        {/* Attendance Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚨 Attendance Alerts</Text>
            <Text style={styles.sectionSubtitle}>
              4 classes are currently reporting sub-80% attendance today.
            </Text>
          </View>
          <View style={styles.alertsContainer}>
            {attendanceAlerts.map((alert, idx) => (
              <AttendanceAlertCard
                key={idx}
                alert={alert}
                onPress={() => handleAlertPress(alert)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.issueStaffBtn}
            onPress={() =>
              Alert.alert('Staff Warning', 'Warning issued to staff members')
            }
            activeOpacity={0.7}
          >
            <Text style={styles.issueStaffBtnText}>Issue Staff Warning</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Approvals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Approvals Queue</Text>
            <TouchableOpacity
              onPress={() => Alert.alert('View All', 'Showing all pending approvals')}
            >
              <Text style={styles.viewAllLink}>View All →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.approvalsContainer}>
            {pendingApprovals.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onApprove={() => handleApprove(approval)}
                onReject={() => handleReject(approval)}
              />
            ))}
          </View>
        </View>

        {/* At-Risk Watchlist */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>At-Risk Watchlist</Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Full Report', 'Opening full risk analysis report')}
            >
              <Text style={styles.viewAllLink}>Full Risk Analysis Report</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.riskContainer}>
            {atRiskStudents.map((student) => (
              <AtRiskCard
                key={student.id}
                student={student}
                onPress={() => handleRiskPress(student)}
              />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  hamburger: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  dashboardHeader: {
    marginBottom: 26,
  },
  dashboardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 14,
  },
  metricCard: {
    width: '32%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    borderTopWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 160,
  },
  metricCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  metricIconWrapper: {
    fontSize: 32,
    marginRight: 8,
  },
  metricIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  metricContentWrapper: {
    flex: 1,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
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
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  viewAllLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Performance Chart Styles
  chartContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  chartLegend: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 100,
    alignItems: 'flex-end',
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    height: 80,
    marginBottom: 10,
  },
  bar: {
    width: 16,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  // Attendance Alerts Styles
  alertsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertClass: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  alertBar: {
    height: 8,
    backgroundColor: '#E8ECF5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  alertProgress: {
    height: '100%',
    borderRadius: 4,
  },
  alertBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  alertBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  issueStaffBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  issueStaffBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  // Pending Approvals Styles
  approvalsContainer: {
    gap: 12,
  },
  approvalItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  approvalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvalIconText: {
    fontSize: 22,
  },
  approvalContent: {
    flex: 1,
  },
  approvalType: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  approvalStudent: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  approvalDetail: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  approvalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approvalBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  rejectBtn: {
    backgroundColor: '#FFE8E8',
    borderColor: COLORS.red,
  },
  approveBtn: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.green,
  },
  approvalBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  // At-Risk Styles
  riskContainer: {
    gap: 12,
  },
  riskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  riskAvatar: {
    fontSize: 32,
  },
  riskInfo: {
    flex: 1,
  },
  riskName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  riskClass: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  riskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  attendanceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  // Class Selection View Styles
  classesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  classCard: {
    width: '31.5%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: COLORS.primary,
    minHeight: 100,
  },
  classLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  classStudents: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  // Student List Styles
  studentsList: {
    gap: 10,
  },
  studentListItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  studentListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  studentAvatar: {
    fontSize: 28,
  },
  studentListInfo: {
    flex: 1,
  },
  studentListName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  studentListRoll: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  studentListRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  academicBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
  },
  academicText: {
    fontSize: 11,
    fontWeight: '600',
  },
  studentMetrics: {
    alignItems: 'flex-end',
  },
  metricSmall: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
