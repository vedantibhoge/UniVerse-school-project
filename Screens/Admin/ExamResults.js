import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const CLASSES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
];

const ExamPerformanceDashboard = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleQuickAction = (action) => {
    Alert.alert(action, `You tapped: ${action}`, [{ text: 'OK' }]);
  };

  const handleViewSubjectBreakdown = () => {
    Alert.alert('Subject Breakdown', 'Science & Mathematics lead with 15% surge in high-distinction scores.\n\nStrategic intervention in Humanities recommended for Grade 10.', [{ text: 'Close' }]);
  };

  const handleDismissInsight = () => {
    Alert.alert('Insight Dismissed', 'The predictive insight has been dismissed.', [{ text: 'OK' }]);
  };

  const handleStatPress = (label, value) => {
    Alert.alert(label, `Current value: ${value}`, [{ text: 'OK' }]);
  };

  const handleExamTrendPress = () => {
    Alert.alert('Exam Trend', 'Comparison across last 3 terms shows consistent improvement.\nAvg Improvement: +12.4%\nPass/Continuity: 98.2%', [{ text: 'Close' }]);
  };

  const MiniBarChart = () => {
    const bars = [40, 55, 60, 45, 70, 65, 80, 75, 85, 72, 90, 88];
    return (
      <View style={styles.chartContainer}>
        {bars.map((h, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => Alert.alert(`Grade ${i + 1}`, `Average Score: ${h}%`)}
            style={styles.barWrapper}
          >
            <View style={[styles.bar, { height: h * 0.9, backgroundColor: h > 75 ? '#3B82F6' : '#CBD5E1' }]} />
            <Text style={styles.barLabel}>{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const MiniLineChart = () => {
    return (
      <TouchableOpacity onPress={handleExamTrendPress} activeOpacity={0.8}>
        <View style={styles.trendBox}>
          <View style={styles.trendLine}>
            {[20, 35, 28, 50, 45, 65, 60, 75].map((y, i) => (
              <View key={i} style={[styles.trendDot, { marginBottom: y * 0.5, opacity: 0.7 + i * 0.04 }]} />
            ))}
          </View>
          <View style={styles.trendStats}>
            <Text style={styles.trendStatLabel}>Avg Improvement</Text>
            <Text style={styles.trendStatValue}>+12.4%</Text>
            <Text style={styles.trendStatLabel}>Pass/Continuity</Text>
            <Text style={styles.trendStatValue}>98.2%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>ANALYSIS</Text>
          <Text style={styles.headerTitle}>Exam Performance</Text>
          <Text style={styles.headerTerm}>2023–2024 · Spring Term</Text>
        </View>
        <View style={styles.headerTabs}>
          {['overview', 'analytics'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stat Cards */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total Students', value: '1,248', change: '+8%', up: true },
            { label: 'Avg Score', value: '78.5%', change: 'Optimal', up: true },
            { label: 'Highest Score', value: '94.2%', change: 'Grade 12', up: true },
            { label: 'Pass Rate', value: '99.1%', change: '-0.3%', up: false },
          ].map((stat, i) => (
            <TouchableOpacity
              key={i}
              style={styles.statCard}
              onPress={() => handleStatPress(stat.label, stat.value)}
              activeOpacity={0.75}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={[styles.statChange, { color: stat.up ? '#10B981' : '#EF4444' }]}>
                {stat.change}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Charts Row */}
        <View style={styles.chartsRow}>
          {/* Bar Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Average Score by Class</Text>
            <Text style={styles.cardSub}>Comparative performance across grades 1–12</Text>
            <MiniBarChart />
          </View>

          {/* Trend */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Exam Trend</Text>
            <Text style={styles.cardSub}>Comparison: Last 3 Terms</Text>
            <MiniLineChart />
          </View>
        </View>

        {/* SELECT CLASS BUTTON */}
        <View style={styles.selectClassRow}>
          <TouchableOpacity
            style={styles.selectClassBtn}
            onPress={() => setClassModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.selectClassIcon}>🎓</Text>
            <Text style={styles.selectClassText}>
              {selectedClass ? `Class: ${selectedClass}` : 'Select Class'}
            </Text>
            <Text style={styles.selectClassArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {[
            { icon: '📊', label: 'Export Analytics', sub: 'Download full performance report' },
            { icon: '🔔', label: 'Notify Parents', sub: 'Send SMS/Email to parents' },
            { icon: '📅', label: 'Schedule Review', sub: 'Schedule academic review session' },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionCard}
              onPress={() => handleQuickAction(action.label)}
              activeOpacity={0.75}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionSub}>{action.sub}</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Predictive Insight Banner */}
        <View style={styles.insightBanner}>
          <View style={styles.insightBadge}>
            <Text style={styles.insightBadgeText}>PREDICTIVE INSIGHT</Text>
          </View>
          <Text style={styles.insightTitle}>
            Science & Mathematics lead in overall performance with a 15% surge in high-distinction scores.
          </Text>
          <Text style={styles.insightBody}>
            Strategic intervention in Humanities recommended for Grade 10 to maintain institutional benchmarking targets for the 2024 final boards.
          </Text>
          <View style={styles.insightActions}>
            <TouchableOpacity style={styles.insightPrimary} onPress={handleViewSubjectBreakdown} activeOpacity={0.8}>
              <Text style={styles.insightPrimaryText}>View Subject Breakdown</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.insightSecondary} onPress={handleDismissInsight} activeOpacity={0.8}>
              <Text style={styles.insightSecondaryText}>Dismiss Insight</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Class Selector Modal */}
      <Modal
        visible={classModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClassModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setClassModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Class</Text>
            <ScrollView>
              {CLASSES.map((cls) => (
                <TouchableOpacity
                  key={cls}
                  style={[styles.classItem, selectedClass === cls && styles.classItemActive]}
                  onPress={() => {
                    setSelectedClass(cls);
                    setClassModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.classItemText, selectedClass === cls && styles.classItemTextActive]}>
                    {cls}
                  </Text>
                  {selectedClass === cls && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setClassModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerSub: { fontSize: 10, color: '#94A3B8', letterSpacing: 1.5, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginTop: 2 },
  headerTerm: { fontSize: 11, color: '#64748B', marginTop: 2 },
  headerTabs: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: '#F1F5F9' },
  tabActive: { backgroundColor: '#3B82F6' },
  tabText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF' },

  // Stats
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', letterSpacing: 0.5 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginTop: 4 },
  statChange: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  // Charts
  chartsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  chartCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  cardSub: { fontSize: 9, color: '#94A3B8', marginTop: 2, marginBottom: 8 },

  // Mini Bar Chart
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 2 },
  barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 2, minHeight: 4 },
  barLabel: { fontSize: 7, color: '#94A3B8', marginTop: 2 },

  // Trend
  trendBox: { height: 80 },
  trendLine: { flexDirection: 'row', alignItems: 'flex-end', height: 55, gap: 4, marginBottom: 4 },
  trendDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6' },
  trendStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  trendStatLabel: { fontSize: 9, color: '#94A3B8' },
  trendStatValue: { fontSize: 10, fontWeight: '700', color: '#10B981' },

  // Select Class Button
  selectClassRow: { paddingHorizontal: 12, marginBottom: 8 },
  selectClassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  selectClassIcon: { fontSize: 18, marginRight: 10 },
  selectClassText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  selectClassArrow: { fontSize: 12, color: '#BFDBFE', fontWeight: '700' },

  // Quick Actions
  section: { paddingHorizontal: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  actionIcon: { fontSize: 22, marginRight: 12 },
  actionText: { flex: 1 },
  actionLabel: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  actionSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  actionArrow: { fontSize: 20, color: '#CBD5E1', fontWeight: '300' },

  // Insight Banner
  insightBanner: {
    marginHorizontal: 12,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
  },
  insightBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1D4ED8',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  insightBadgeText: { fontSize: 9, fontWeight: '800', color: '#93C5FD', letterSpacing: 1 },
  insightTitle: { fontSize: 14, fontWeight: '800', color: '#F8FAFC', lineHeight: 20, marginBottom: 8 },
  insightBody: { fontSize: 11, color: '#94A3B8', lineHeight: 16, marginBottom: 16 },
  insightActions: { flexDirection: 'row', gap: 10 },
  insightPrimary: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  insightPrimaryText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  insightSecondary: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  insightSecondaryText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: '#F8FAFC',
  },
  classItemActive: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#3B82F6' },
  classItemText: { flex: 1, fontSize: 15, color: '#334155', fontWeight: '500' },
  classItemTextActive: { color: '#1D4ED8', fontWeight: '700' },
  checkmark: { fontSize: 16, color: '#3B82F6', fontWeight: '800' },
  modalClose: {
    marginTop: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
});

export default ExamPerformanceDashboard;