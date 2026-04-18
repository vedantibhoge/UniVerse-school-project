import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import AdminSidebar from '../AdminSidebar';
import AdminMarkAttendance from '../AdminMarkAttendance';
import AdminGenerateReport from '../AdminGenerateReport';
import AdminBroadcastAlert from '../AdminBroadcastAlert';
import AdminClasses from '../AdminClasses';
import AdminAttendance from '../AdminAttendance';
import AdminExams from '../AdminExams';
import AdminFees from '../AdminFees';
import AdminStaff from '../AdminStaff';
import AdminTimetable from '../AdminTimetable';
import AdminSettings from '../AdminSettings';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  textSub: '#6B7280',
  green: '#22C55E',
  red: '#E53935',
  orange: '#F97316',
  blue: '#3B82F6',
};

// Sample Data
const studentsData = [
  { id: 1, name: 'Aarav Sharma', class: 'Grade 10-A', status: 'Active', date: 'Oct 12, 2023' },
  { id: 2, name: 'Arjun Patel', class: 'Grade 9-B', status: 'Active', date: 'Oct 14, 2023' },
  { id: 3, name: 'Priya Singh', class: 'Grade 8-C', status: 'Active', date: 'Oct 15, 2023' },
  { id: 4, name: 'Nisha Kumar', class: 'Grade 7-A', status: 'Inactive', date: 'Oct 16, 2023' },
  { id: 5, name: 'Rohan Desai', class: 'Grade 6-B', status: 'Active', date: 'Oct 17, 2023' },
  { id: 6, name: 'Meera Gupta', class: 'Grade 5-C', status: 'Active', date: 'Oct 18, 2023' },
  { id: 7, name: 'Vikram Reddy', class: 'Grade 4-A', status: 'Active', date: 'Oct 19, 2023' },
  { id: 8, name: 'Divya Nair', class: 'Grade 3-B', status: 'Inactive', date: 'Oct 20, 2023' },
  { id: 9, name: 'Karan Verma', class: 'Grade 2-C', status: 'Active', date: 'Oct 21, 2023' },
  { id: 10, name: 'Ananya Joshi', class: 'Grade 1-A', status: 'Active', date: 'Oct 22, 2023' },
  { id: 11, name: 'Sanjay Khan', class: 'Grade 9-D', status: 'Active', date: 'Oct 23, 2023' },
  { id: 12, name: 'Riya Pillai', class: 'Grade 8-E', status: 'Active', date: 'Oct 24, 2023' },
];

const feeCollectionData = [
  { month: 'Jun', amount: '₹8.2L', percentage: 82 },
  { month: 'Jul', amount: '₹5.1L', percentage: 51 },
  { month: 'Aug', amount: '₹9.8L', percentage: 98 },
  { month: 'Sep', amount: '₹4.2L', percentage: 42 },
];

// Metric Card Component
function MetricCard({ icon, label, value, subtext, onPress, testID }) {
  return (
    <TouchableOpacity
      style={styles.metricCard}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {subtext && <Text style={styles.metricSubtext}>{subtext}</Text>}
    </TouchableOpacity>
  );
}

// Student List Item
function StudentListItem({ student }) {
  return (
    <View style={styles.listItem}>
      <View style={styles.listLeft}>
        <Text style={styles.listName}>{student.name}</Text>
        <Text style={styles.listSubtext}>{student.class}</Text>
      </View>
      <View style={styles.listRight}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: student.status === 'Active' ? COLORS.green + '20' : COLORS.orange + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: student.status === 'Active' ? COLORS.green : COLORS.orange,
              },
            ]}
          >
            {student.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function Dashboard({ onToggleSidebar }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleToggleSidebar = (value) => {
    setSidebarVisible(value);
  };

  const handleSidebarNavigation = (screen) => {
    const screenList = ['dashboard', 'classes', 'attendance', 'exams', 'fees', 'staff', 'timetable', 'settings'];
    if (screenList.includes(screen)) {
      setActiveView(screen);
    } else {
      handleScreenNavigation(screen);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeView]);

  // Handler functions
  const handleAttendancePress = () => {
    Alert.alert('Today Attendance', 'Overall Attendance: 96%\n\nBreakdown:\n• Present: 1,152 students\n• Absent: 48 students');
  };

  const handleFeesPress = () => {
    Alert.alert('Pending Fees', 'Total Pending: ₹4,50,000\n\n• 85 students with overdue fees\n• Generate reminder letter?');
  };

  const handleStaffPress = () => {
    Alert.alert('Total Staff', 'Staff Distribution:\n\n• Teaching: 65\n• Admin: 12\n• Support: 8');
  };

  const handleClassesPress = () => {
    Alert.alert('Active Classes', 'Total Classes: 42\n\nGrades 1-10 with Divisions A, B, C\n\nView detailed class information?');
  };

  const handleMarkAttendancePress = () => {
    setActiveView('markAttendance');
  };

  const handleGenerateReportPress = () => {
    setActiveView('generateReport');
  };

  const handleBroadcastAlertPress = () => {
    setActiveView('broadcastAlert');
  };

  // Additional navigation handlers for other screens
  const handleScreenNavigation = (screenName) => {
    switch (screenName) {
      case 'classes':
        Alert.alert('Classes', 'Opening classes management...');
        break;
      case 'attendance':
        Alert.alert('Attendance', 'Opening attendance management...');
        break;
      case 'exams':
        Alert.alert('Exams', 'Opening exams management...');
        break;
      case 'fees':
        Alert.alert('Fees', 'Opening fee management...');
        break;
      case 'staff':
        Alert.alert('Staff', 'Opening staff management...');
        break;
      case 'timetable':
        Alert.alert('Timetable', 'Opening timetable management...');
        break;
      case 'reports':
        Alert.alert('Reports', 'Opening reports...');
        break;
      case 'settings':
        Alert.alert('Settings', 'Opening settings...');
        break;
      default:
        break;
    }
  };

  // Students List View
  if (activeView === 'students') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveView('dashboard')}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Students</Text>
          <View style={{ width: 40 }} />
        </View>

        <Animated.ScrollView
          style={[styles.content, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Total Students ({studentsData.length})</Text>
            <View style={styles.listContainer}>
              {studentsData.map((student) => (
                <StudentListItem key={student.id} student={student} />
              ))}
            </View>
          </View>
          <View style={{ height: 32 }} />
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  // Mark Attendance View
  if (activeView === 'markAttendance') {
    return (
      <AdminMarkAttendance onBack={() => setActiveView('dashboard')} />
    );
  }

  // Generate Report View
  if (activeView === 'generateReport') {
    return (
      <AdminGenerateReport onBack={() => setActiveView('dashboard')} />
    );
  }

  // Broadcast Alert View
  if (activeView === 'broadcastAlert') {
    return (
      <AdminBroadcastAlert onBack={() => setActiveView('dashboard')} />
    );
  }

  // Classes View
  if (activeView === 'classes') {
    return (
      <AdminClasses onBack={() => setActiveView('dashboard')} />
    );
  }

  // Attendance View
  if (activeView === 'attendance') {
    return (
      <AdminAttendance onBack={() => setActiveView('dashboard')} />
    );
  }

  // Exams View
  if (activeView === 'exams') {
    return (
      <AdminExams onBack={() => setActiveView('dashboard')} />
    );
  }

  // Fees View
  if (activeView === 'fees') {
    return (
      <AdminFees onBack={() => setActiveView('dashboard')} />
    );
  }

  // Staff View
  if (activeView === 'staff') {
    return (
      <AdminStaff onBack={() => setActiveView('dashboard')} />
    );
  }

  // Timetable View
  if (activeView === 'timetable') {
    return (
      <AdminTimetable onBack={() => setActiveView('dashboard')} />
    );
  }

  // Settings View
  if (activeView === 'settings') {
    return (
      <AdminSettings onBack={() => setActiveView('dashboard')} />
    );
  }

  // Dashboard View
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Sidebar */}
      <AdminSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeScreen={activeView}
        onScreenChange={handleSidebarNavigation}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => handleToggleSidebar(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleAttendancePress} activeOpacity={0.7}>
          <Text style={styles.headerIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="👥"
            label="Total Students"
            value="1,200"
            subtext="12% from last month"
            onPress={() => setActiveView('students')}
            testID="totalStudentsButton"
          />
          <MetricCard
            icon="📊"
            label="Today Attendance"
            value="96%"
            onPress={handleAttendancePress}
            testID="attendanceButton"
          />
          <MetricCard
            icon="💰"
            label="Pending Fees"
            value="₹4,50,000"
            subtext="85 students overdue"
            onPress={handleFeesPress}
            testID="feesButton"
          />
          <MetricCard
            icon="👨‍💼"
            label="Total Staff"
            value="85"
            onPress={handleStaffPress}
            testID="staffButton"
          />
          <MetricCard
            icon="📚"
            label="Active Classes"
            value="42"
            subtext="12 Divisions"
            onPress={handleClassesPress}
            testID="classesButton"
          />
        </View>

        {/* Attendance Trend Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attendance Trend</Text>
            <Text style={styles.sectionSubtext}>Average attendance over the last 30 days</Text>
          </View>
          <View style={[styles.card, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.placeholderText}>📈 Attendance Chart</Text>
          </View>
        </View>

        {/* Fee Collection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fee Collection</Text>
          <Text style={styles.sectionSubtext}>Monthly revenue summary</Text>
          <View style={styles.card}>
            {feeCollectionData.map((item, idx) => (
              <View key={idx} style={styles.feeItem}>
                <Text style={styles.feeMonth}>{item.month}</Text>
                <View style={styles.feeBar}>
                  <View
                    style={[
                      styles.feeProgress,
                      { width: `${item.percentage}%`, backgroundColor: COLORS.blue },
                    ]}
                  />
                </View>
                <Text style={styles.feeAmount}>{item.amount}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMarkAttendancePress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>✓</Text>
              <Text style={styles.actionLabel}>Mark Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleGenerateReportPress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📄</Text>
              <Text style={styles.actionLabel}>Generate Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleBroadcastAlertPress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📢</Text>
              <Text style={styles.actionLabel}>Broadcast Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </Animated.ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    fontSize: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  sectionSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  viewAllLink: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  feeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  feeMonth: {
    width: 40,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  feeBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8ECF5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  feeProgress: {
    height: '100%',
    borderRadius: 4,
  },
  feeAmount: {
    width: 50,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'right',
  },
  listSection: {
    marginBottom: 24,
  },
  listContainer: {
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  listLeft: {
    flex: 1,
  },
  listRight: {
    marginLeft: 12,
  },
  listName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  listSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
});
