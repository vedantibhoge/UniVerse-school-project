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
import PrincipalAcademicPerformance from './PrincipalAcademicPerformance';
import PrincipalAttendanceAnalytics from './PrincipalAttendanceAnalytics';
import PrincipalEnrollmentTrends from './PrincipalEnrollmentTrends';

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
};

const reportData = [
  {
    id: 1,
    title: 'Academic Performance Report',
    description: 'Quarterly analysis of student grades',
    icon: '📊',
    date: 'Updated: Apr 15, 2024',
  },
  {
    id: 2,
    title: 'Attendance Analytics',
    description: 'Staff and student attendance trends',
    icon: '📈',
    date: 'Updated: Apr 16, 2024',
  },
 
  
  {
    id: 5,
    title: 'Enrollment Trends',
    description: 'Student admission and drop-out analysis',
    icon: '🎓',
    date: 'Updated: Apr 12, 2024',
  },
  
];

// Class options (Grades 1-10 with divisions)
const classOptions = [];
for (let grade = 1; grade <= 10; grade++) {
  for (const division of ['A', 'B', 'C']) {
    classOptions.push({
      id: `${grade}${division}`,
      label: `Grade ${grade}${division}`,
    });
  }
}

// Month options
const monthOptions = [
  { id: 'Jan', label: 'January' },
  { id: 'Feb', label: 'February' },
  { id: 'Mar', label: 'March' },
  { id: 'Apr', label: 'April' },
  { id: 'May', label: 'May' },
  { id: 'Jun', label: 'June' },
  { id: 'Jul', label: 'July' },
  { id: 'Aug', label: 'August' },
  { id: 'Sep', label: 'September' },
  { id: 'Oct', label: 'October' },
  { id: 'Nov', label: 'November' },
  { id: 'Dec', label: 'December' },
];

const performanceMetrics = [
  { label: 'Class A', percentage: 85, color: COLORS.green },
  { label: 'Class B', percentage: 78, color: COLORS.blue },
  { label: 'Class C', percentage: 92, color: COLORS.orange },
  { label: 'Class D', percentage: 88, color: COLORS.primary },
];

function PerformanceBar({ label, percentage, color }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View style={styles.performanceItem}>
      <Text style={styles.performanceLabel}>{label}</Text>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={styles.performanceValue}>{percentage}%</Text>
    </View>
  );
}

function ReportCard({ icon, title, description, date, onPress }) {
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
      <TouchableOpacity style={styles.reportCard} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardLeft}>
          <Text style={styles.reportIcon}>{icon}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.reportTitle}>{title}</Text>
          <Text style={styles.reportDescription}>{description}</Text>
          <Text style={styles.reportDate}>{date}</Text>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PrincipalReports({ onToggleSidebar }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [activeScreen, setActiveScreen] = useState(null);

  const handleExportPDF = () => {
    Alert.alert(
      'Export PDF',
      `Exporting Academic Performance Report for ${selectedClass?.label} - ${selectedMonth?.label}...`,
      [
        {
          text: 'Download',
          onPress: () => {
            Alert.alert('Success', 'PDF exported and ready for download!');
          },
        },
        { text: 'Cancel', onPress: () => {} },
      ]
    );
  };

  const handleExportExcel = () => {
    Alert.alert(
      'Export Excel',
      `Exporting Academic Performance Report for ${selectedClass?.label} - ${selectedMonth?.label}...`,
      [
        {
          text: 'Download',
          onPress: () => {
            Alert.alert('Success', 'Excel file exported and ready for download!');
          },
        },
        { text: 'Cancel', onPress: () => {} },
      ]
    );
  };

  return (
    <>
      {activeScreen === 'academic' && (
        <PrincipalAcademicPerformance
          onToggleSidebar={onToggleSidebar}
          onBack={() => setActiveScreen(null)}
        />
      )}
      {activeScreen === 'attendance' && (
        <PrincipalAttendanceAnalytics
          onToggleSidebar={onToggleSidebar}
          onBack={() => setActiveScreen(null)}
        />
      )}
      {activeScreen === 'enrollment' && (
        <PrincipalEnrollmentTrends
          onToggleSidebar={onToggleSidebar}
          onBack={() => setActiveScreen(null)}
        />
      )}
      {activeScreen === null && (
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
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Class and Month Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter by Class & Month</Text>
          <View style={styles.filterContainer}>
            {/* Class Dropdown */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Select Class</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowClassDropdown(!showClassDropdown)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>
                  {selectedClass ? selectedClass.label : 'Choose Class...'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showClassDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                    {classOptions.map((cls) => (
                      <TouchableOpacity
                        key={cls.id}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedClass(cls);
                          setShowClassDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownOptionText}>{cls.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Month Dropdown */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Select Month</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowMonthDropdown(!showMonthDropdown)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>
                  {selectedMonth ? selectedMonth.label : 'Choose Month...'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showMonthDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                    {monthOptions.map((month) => (
                      <TouchableOpacity
                        key={month.id}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedMonth(month);
                          setShowMonthDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownOptionText}>{month.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Performance Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Performance Overview</Text>
          <View style={styles.performanceCard}>
            {performanceMetrics.map((metric, index) => (
              <PerformanceBar
                key={index}
                label={metric.label}
                percentage={metric.percentage}
                color={metric.color}
              />
            ))}
          </View>
        </View>

        {/* Key Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics Summary</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>📚</Text>
              <Text style={styles.metricLabel}>Total Classes</Text>
              <Text style={styles.metricValue}>42</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>👨‍🎓</Text>
              <Text style={styles.metricLabel}>Average Score</Text>
              <Text style={styles.metricValue}>86.5</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>📈</Text>
              <Text style={styles.metricLabel}>Improvement</Text>
              <Text style={styles.metricValue}>+2.3%</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>⏰</Text>
              <Text style={styles.metricLabel}>On-time</Text>
              <Text style={styles.metricValue}>95.2%</Text>
            </View>
          </View>
        </View>

        {/* Reports Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          {reportData.map((report) => (
            <ReportCard
              key={report.id}
              icon={report.icon}
              title={report.title}
              description={report.description}
              date={report.date}
              onPress={() => {
                if (report.id === 1) {
                  setActiveScreen('academic');
                } else if (report.id === 2) {
                  setActiveScreen('attendance');
                } else if (report.id === 5) {
                  setActiveScreen('enrollment');
                }
              }}
            />
          ))}
        </View>

        {/* Export Section - Only show if both class and month are selected */}
        {selectedClass && selectedMonth && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Export Report</Text>
            <Text style={styles.exportSubtitle}>
              {selectedClass.label} - {selectedMonth.label}
            </Text>
            <View style={styles.exportOptions}>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={handleExportPDF}
                activeOpacity={0.7}
              >
                <Text style={styles.exportIcon}>📄</Text>
                <Text style={styles.exportLabel}>Export as PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={handleExportExcel}
                activeOpacity={0.7}
              >
                <Text style={styles.exportIcon}>📊</Text>
                <Text style={styles.exportLabel}>Export as Excel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  headerPlaceholder: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  performanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  performanceItem: {
    marginBottom: 18,
  },
  performanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8ECF5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricBox: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 6,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    marginRight: 12,
  },
  reportIcon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 11,
    color: '#999',
  },
  cardArrow: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  exportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportButton: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  exportIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  exportLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  // Filter Styles
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dropdownText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: COLORS.primary,
    marginLeft: 8,
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E8ECF5',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FF',
  },
  dropdownOptionText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  exportSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 14,
    fontWeight: '500',
  },
});