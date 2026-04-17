import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  green: '#22C55E',
  orange: '#F97316',
  red: '#E53935',
  blue: '#3B82F6',
};

import { staffData } from './data/staffData';

function SelectedTeacherCard({ teacher, onClose }) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [teacher]);

  const getStarRating = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '✨' : '');
  };

  return (
    <Animated.View style={[styles.selectedCard, { opacity: slideAnim }]}>
      <View style={styles.selectedCardContent}>
        <View style={styles.selectedHeader}>
          <Text style={styles.selectedIcon}>{teacher.icon}</Text>
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedName}>{teacher.name}</Text>
            <Text style={styles.selectedBadge}>SELECTED TEACHER</Text>
            <Text style={styles.selectedDept}>{teacher.department} {teacher.classes.length > 1 ? `• Grade ${teacher.classes[0].split(' ')[1]}` : ''}</Text>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingStars}>{getStarRating(teacher.rating)}</Text>
          <Text style={styles.ratingScore}>{teacher.rating.toFixed(1)} Quality Score</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ATTENDANCE RATE</Text>
            <Text style={styles.metricValue}>{teacher.attendance}%</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>HOMEWORK CONSISTENCY</Text>
            <Text style={styles.metricValue}>{teacher.homework}%</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>STUDENT RESULT AVERAGE</Text>
            <Text style={styles.metricValue}>{teacher.studentAvg}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function PerformanceBar({ percentage, height = 6 }) {
  return (
    <View style={[styles.progressBarBg, { height }]}>
      <View style={[styles.progressBarFill, { width: `${percentage}%`, height }]} />
    </View>
  );
}

function TeacherDetailsModal({ visible, teacher, onClose }) {
  if (!teacher) return null;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Teacher Details</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
          {/* Teacher Profile */}
          <View style={styles.detailsCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.detailsIcon}>{teacher.icon}</Text>
              <View style={styles.profileInfo}>
                <Text style={styles.detailsName}>{teacher.name}</Text>
                <Text style={styles.detailsPosition}>{teacher.department}</Text>
                <View style={styles.statusBadgeRow}>
                  <View style={[styles.statusBadge, teacher.status === 'Active' ? styles.statusActiveModal : styles.statusLeaveModal]}>
                    <Text style={styles.statusBadgeText}>{teacher.status}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.quickStatBox}>
                <Text style={styles.statLabel}>Rating</Text>
                <Text style={styles.statValue}>{teacher.rating.toFixed(1)}⭐</Text>
              </View>
              <View style={styles.quickStatBox}>
                <Text style={styles.statLabel}>Attendance</Text>
                <Text style={styles.statValue}>{teacher.attendance.toFixed(1)}%</Text>
              </View>
              <View style={styles.quickStatBox}>
                <Text style={styles.statLabel}>Student Avg</Text>
                <Text style={styles.statValue}>{teacher.studentAvg}</Text>
              </View>
            </View>
          </View>

          {/* Qualification */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Qualification</Text>
            <Text style={styles.detailsText}>{teacher.qualification}</Text>
          </View>

          {/* Classes Teaching */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Classes Teaching ({teacher.classes.length})</Text>
            <View style={styles.classesGrid}>
              {teacher.classes.map((cls, idx) => (
                <View key={idx} style={styles.classItem}>
                  <Text style={styles.classText}>{cls}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Monthly Leave Records */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Leave Records (Per Month)</Text>
            <View style={styles.leaveGrid}>
              {months.map((month, idx) => (
                <View key={idx} style={styles.leaveBox}>
                  <Text style={styles.leaveMonth}>{month}</Text>
                  <Text style={[styles.leaveCount, teacher.leavesPerMonth[month] > 0 ? styles.leaveCountActive : styles.leaveCountZero]}>
                    {teacher.leavesPerMonth[month]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* AI Performance Report */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>🤖 AI Performance Report</Text>
            <View style={styles.reportBox}>
              <Text style={styles.reportText}>{teacher.aiReport}</Text>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Attendance Rate</Text>
              <View style={styles.metricInfo}>
                <PerformanceBar percentage={teacher.attendance} height={6} />
                <Text style={styles.metricPercentage}>{teacher.attendance}%</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Homework Consistency</Text>
              <View style={styles.metricInfo}>
                <PerformanceBar percentage={teacher.homework} height={6} />
                <Text style={styles.metricPercentage}>{teacher.homework}%</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Rating</Text>
              <View style={styles.metricInfo}>
                <PerformanceBar percentage={(teacher.rating / 5) * 100} height={6} />
                <Text style={styles.metricPercentage}>{teacher.rating.toFixed(1)} / 5.0</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function TeacherCardMobile({ teacher, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.mobileCard, isSelected && styles.mobileCardSelected]}
      onPress={() => onSelect(teacher)}
      activeOpacity={0.7}
    >
      <View style={styles.mobileCardHeader}>
        <View style={styles.mobileProfileSection}>
          <Text style={styles.mobileIcon}>{teacher.icon}</Text>
          <View style={styles.mobileInfo}>
            <Text style={styles.mobileName}>{teacher.name}</Text>
            <Text style={styles.mobileDept}>{teacher.department}</Text>
          </View>
        </View>
        <Text style={[styles.mobileAvg, { color: teacher.studentAvg === 'A+' ? COLORS.green : teacher.studentAvg.includes('+') ? '#22C55E' : COLORS.textDark }]}>
          {teacher.studentAvg}
        </Text>
      </View>

      <View style={styles.mobileClassesRow}>
        {teacher.classes.slice(0, 2).map((cls, idx) => (
          <Text key={idx} style={styles.mobileClassBadge}>{cls.split(' ')[1]}</Text>
        ))}
        {teacher.classes.length > 2 && <Text style={styles.moreClasses}>+{teacher.classes.length - 2}</Text>}
      </View>

      <View style={styles.mobileMetricsRow}>
        <View style={styles.mobileMetric}>
          <Text style={styles.mobileMetricLabel}>Attend</Text>
          <PerformanceBar percentage={teacher.attendance} height={3} />
          <Text style={styles.mobileMetricValue}>{teacher.attendance}%</Text>
        </View>
        <View style={styles.mobileMetric}>
          <Text style={styles.mobileMetricLabel}>Home</Text>
          <PerformanceBar percentage={teacher.homework} height={3} />
          <Text style={styles.mobileMetricValue}>{teacher.homework}%</Text>
        </View>
        <View style={styles.mobileMetric}>
          <Text style={styles.mobileMetricLabel}>Trend</Text>
          <Text style={[styles.mobileTrendIcon, teacher.trend === '↑' ? styles.trendUp : teacher.trend === '↓' ? styles.trendDown : styles.trendFlat]}>
            {teacher.trend}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function TeacherRow({ teacher, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.teacherRow, isSelected && styles.teacherRowSelected]}
      onPress={() => onSelect(teacher)}
      activeOpacity={0.7}
    >
      <View style={styles.rowProfile}>
        <Text style={styles.rowIcon}>{teacher.icon}</Text>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName}>{teacher.name}</Text>
          <Text style={styles.rowDept}>{teacher.department}</Text>
        </View>
      </View>

      <View style={styles.rowClasses}>
        {teacher.classes.slice(0, 2).map((cls, idx) => (
          <Text key={idx} style={styles.classBadge}>
            {cls.split(' ')[1]}
          </Text>
        ))}
        {teacher.classes.length > 2 && <Text style={styles.moreClasses}>+{teacher.classes.length - 2}</Text>}
      </View>

      <View style={styles.rowMetric}>
        <PerformanceBar percentage={teacher.attendance} height={4} />
        <Text style={styles.metricText}>{teacher.attendance}%</Text>
      </View>

      <View style={styles.rowMetric}>
        <PerformanceBar percentage={teacher.homework} height={4} />
        <Text style={styles.metricText}>{teacher.homework}%</Text>
      </View>

      <View style={styles.rowMetric}>
        <Text style={styles.studentAvgText}>{teacher.studentAvg}</Text>
      </View>

      <View style={styles.rowTrend}>
        <Text style={[styles.trendIcon, teacher.trend === '↑' ? styles.trendUp : teacher.trend === '↓' ? styles.trendDown : styles.trendFlat]}>
          {teacher.trend}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PrincipalStaffManagement({ onToggleSidebar, navigation }) {
  const [selectedTeacher, setSelectedTeacher] = useState(staffData[0]);
  const [detailedTeacher, setDetailedTeacher] = useState(null);
  const [filterTab, setFilterTab] = useState('All Teachers');
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else if (onToggleSidebar) {
      onToggleSidebar(true);
    }
  };

  const filteredStaff = staffData.filter((teacher) => {
    if (filterTab === 'All Teachers') return true;
    if (filterTab === 'Top Tier') return teacher.performanceLevel === 'Top Tier';
    if (filterTab === 'Under performing') return teacher.performanceLevel === 'Under performing';
    return true;
  });

  const deptAvgAttendance = (staffData.reduce((sum, t) => sum + t.attendance, 0) / staffData.length).toFixed(1);

  const handleTeacherSelect = (teacher) => {
    setDetailedTeacher(teacher);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Management</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Teacher Performance</Text>
          <Text style={styles.pageSubtitle}>Holistic analysis of academic staff engagement and efficiency.</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {['All Teachers', 'Top Tier', 'Under performing'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, filterTab === tab && styles.filterTabActive]}
              onPress={() => setFilterTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, filterTab === tab && styles.filterTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Teacher Card */}
        {!isMobile && <SelectedTeacherCard teacher={selectedTeacher} />}

        {/* Summary Stats (Mobile Only) */}
        {isMobile && (
          <View style={styles.mobileSummaryStats}>
            <View style={styles.mobileStat}>
              <Text style={styles.mobileStatIcon}>📊</Text>
              <Text style={styles.mobileStatValue}>{deptAvgAttendance}%</Text>
              <Text style={styles.mobileStatLabel}>Avg Attendance</Text>
            </View>
            <View style={styles.mobileStat}>
              <Text style={styles.mobileStatIcon}>👥</Text>
              <Text style={styles.mobileStatValue}>{staffData.length}</Text>
              <Text style={styles.mobileStatLabel}>Teachers</Text>
            </View>
            <View style={styles.mobileStat}>
              <Text style={styles.mobileStatIcon}>⭐</Text>
              <Text style={styles.mobileStatValue}>{(staffData.reduce((sum, t) => sum + t.rating, 0) / staffData.length).toFixed(1)}</Text>
              <Text style={styles.mobileStatLabel}>Avg Rating</Text>
            </View>
          </View>
        )}

        {/* Desktop Performance Summary */}
        {!isMobile && (
          <View style={styles.performanceSummary}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>DEPT PERFORMANCE AVERAGE</Text>
              <Text style={styles.summaryTitle}>Overall Stability</Text>
              <View style={styles.circularProgress}>
                <Text style={styles.circularValue}>{deptAvgAttendance}%</Text>
                <Text style={styles.circularLabel}>Avg Attendance</Text>
              </View>
            </View>
          </View>
        )}

        {/* Staff Directory - Mobile or Desktop */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableTitle}>Staff Directory</Text>
          </View>

          {/* Mobile Card Layout */}
          {isMobile && (
            <View style={styles.mobileCardsList}>
              {filteredStaff.map((teacher) => (
                <TeacherCardMobile
                  key={teacher.id}
                  teacher={teacher}
                  isSelected={selectedTeacher.id === teacher.id}
                  onSelect={handleTeacherSelect}
                />
              ))}
            </View>
          )}

          {/* Desktop Table Layout */}
          {!isMobile && (
            <>
              <View style={styles.tableColumnHeaders}>
                <Text style={[styles.columnHeader, { flex: 2 }]}>TEACHER PROFILE</Text>
                <Text style={[styles.columnHeader, { flex: 1.2 }]}>ASSIGNED CLASSES</Text>
                <Text style={[styles.columnHeader, { flex: 1.3 }]}>ATTENDANCE COMPLETION</Text>
                <Text style={[styles.columnHeader, { flex: 1.3 }]}>HOMEWORK CONSISTENCY</Text>
                <Text style={[styles.columnHeader, { flex: 0.8 }]}>STUDENT AVG</Text>
                <Text style={[styles.columnHeader, { flex: 0.6 }]}>TREND</Text>
              </View>

              <View style={styles.tableRows}>
                {filteredStaff.map((teacher) => (
                  <TeacherRow
                    key={teacher.id}
                    teacher={teacher}
                    isSelected={selectedTeacher.id === teacher.id}
                    onSelect={handleTeacherSelect}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Teacher Details Modal */}
      <TeacherDetailsModal
        visible={detailedTeacher !== null}
        teacher={detailedTeacher}
        onClose={() => setDetailedTeacher(null)}
      />
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
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  hamburger: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 44,
  },
  titleSection: {
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  mobileSummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 18,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  mobileStat: {
    alignItems: 'center',
  },
  mobileStatIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  mobileStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  mobileStatLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  mobileCardsList: {
    gap: 10,
  },
  mobileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  mobileCardSelected: {
    backgroundColor: '#F0F4FF',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  mobileCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  mobileProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  mobileIcon: {
    fontSize: 28,
  },
  mobileInfo: {
    flex: 1,
  },
  mobileName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  mobileDept: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  mobileAvg: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  mobileClassesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  mobileClassBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moreClasses: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  mobileMetricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mobileMetric: {
    flex: 1,
  },
  mobileMetricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  mobileMetricValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 4,
  },
  mobileTrendIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
  trendUp: {
    color: COLORS.green,
  },
  trendDown: {
    color: COLORS.red,
  },
  trendFlat: {
    color: COLORS.textMuted,
  },
  progressBarBg: {
    backgroundColor: '#E8ECF5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: COLORS.blue,
    borderRadius: 2,
  },
  selectedCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  selectedCardContent: {
    gap: 14,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedIcon: {
    fontSize: 44,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    lineHeight: 56,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 3,
  },
  selectedBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  selectedDept: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingStars: {
    fontSize: 16,
  },
  ratingScore: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  performanceSummary: {
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  circularProgress: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: COLORS.primary,
  },
  circularValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  circularLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  summaryMetrics: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  summaryMetric: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  summaryMetricLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  summaryMetricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  tableSection: {
    marginBottom: 20,
  },
  tableHeader: {
    marginBottom: 12,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  tableColumnHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 2,
    borderBottomColor: '#E8ECF5',
    marginBottom: 6,
    borderRadius: 8,
    gap: 8,
  },
  columnHeader: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  tableRows: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  teacherRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
    gap: 8,
  },
  teacherRowSelected: {
    backgroundColor: '#F0F4FF',
  },
  rowProfile: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowIcon: {
    fontSize: 24,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  rowDept: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  rowClasses: {
    flex: 1.2,
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  classBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  rowMetric: {
    flex: 1.3,
    gap: 4,
  },
  metricText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  studentAvgText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  rowTrend: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  closeIcon: {
    fontSize: 24,
    color: COLORS.textDark,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 14,
  },
  detailsIcon: {
    fontSize: 48,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F4FF',
    textAlign: 'center',
    lineHeight: 60,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailsName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  detailsPosition: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusActiveModal: {
    backgroundColor: '#E8F5E9',
  },
  statusLeaveModal: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  quickStatBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  classesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  classItem: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  classText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  leaveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  leaveBox: {
    flex: 0.32,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  leaveMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  leaveCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveCountZero: {
    color: COLORS.green,
  },
  leaveCountActive: {
    color: COLORS.red,
  },
  reportBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.blue,
  },
  reportText: {
    fontSize: 12,
    color: COLORS.textDark,
    lineHeight: 18,
  },
  metricRow: {
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  metricInfo: {
    gap: 6,
  },
  metricPercentage: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
});
