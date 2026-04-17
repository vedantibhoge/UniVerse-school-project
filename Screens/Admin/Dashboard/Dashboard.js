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
  primary: '#1A3CE8',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  textSub: '#6B7280',
  red: '#E53935',
  orange: '#F97316',
  green: '#22C55E',
  blue: '#1A3CE8',
  cardBorder: '#E8ECF5',
  attendanceBg: '#FFF1F0',
  attendanceBar: '#E53935',
  iconBlueBg: '#E8EEFF',
  iconRedBg: '#FFE8E8',
};

const monthlyData = [
  { month: 'JAN', value: 0.5 },
  { month: 'FEB', value: 0.65 },
  { month: 'MAR', value: 0.55 },
  { month: 'APR', value: 0.8 },
  { month: 'MAY', value: 0.95 },
  { month: 'JUN', value: 0.4 },
];

const activities = [
  {
    time: '10:45 AM',
    title: 'New Student Enrollment: Sarah Jenkins',
    subtitle: 'Grade 9, Arts Section',
    color: COLORS.blue,
  },
  {
    time: '09:15 AM',
    title: 'Staff Meeting Scheduled',
    subtitle: 'Academic Boardroom',
    color: COLORS.orange,
  },
  {
    time: 'Yesterday',
    title: 'Fee Receipt Generated: #FR-2024-90',
    subtitle: 'Student: Leo Marcus',
    color: COLORS.green,
  },
  {
    time: 'Yesterday',
    title: 'Absentee Alert',
    subtitle: '3 staff members on leave',
    color: COLORS.red,
  },
];

function StatCard({ icon, label, value, sub, badge, barColor }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
          <Text style={styles.iconText}>{icon.emoji}</Text>
        </View>
        {badge && <Text style={styles.badge}>{badge}</Text>}
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {sub && <Text style={styles.cardSub}>{sub}</Text>}
      {barColor && (
        <View style={styles.barContainer}>
          <View style={[styles.bar, { backgroundColor: barColor, width: '94.8%' }]} />
        </View>
      )}
    </Animated.View>
  );
}

function BarChart({ active }) {
  const maxHeight = 110;
  return (
    <View style={styles.chartWrapper}>
      <View style={styles.barsRow}>
        {monthlyData.map((d, i) => {
          const isActive = d.month === 'MAY';
          const barH = d.value * maxHeight;
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barH,
                      backgroundColor: isActive ? COLORS.primary : '#D1D9F0',
                      borderRadius: 5,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, isActive && { color: COLORS.primary, fontWeight: '700' }]}>
                {d.month}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function SchoolDashboard() {
  const [feeTab, setFeeTab] = useState('Monthly');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 16 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Dashboard Overview</Text>
        <TouchableOpacity style={styles.bellBtn}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat Cards */}
        <StatCard
          icon={{ emoji: '👤', bg: COLORS.iconBlueBg }}
          label="TOTAL STUDENTS"
          value="1,284"
          badge="+12%"
        />
        <StatCard
          icon={{ emoji: '🪪', bg: COLORS.iconBlueBg }}
          label="ACTIVE STAFF"
          value="92"
        />
        <StatCard
          icon={{ emoji: '📅', bg: COLORS.iconRedBg }}
          label="ATTENDANCE %"
          value="94.8%"
          barColor={COLORS.attendanceBar}
        />
        <StatCard
          icon={{ emoji: '💳', bg: COLORS.iconBlueBg }}
          label="FEES COLLECTED"
          value="$42,800"
          sub="This Term"
        />

        {/* Fee Chart Card */}
        <View style={[styles.card, { paddingBottom: 20 }]}>
          <Text style={styles.chartMeta}>FINANCIAL PERFORMANCE</Text>
          <View style={styles.chartTitleRow}>
            <Text style={styles.chartTitle}>Monthly{'\n'}Fee Collection</Text>
            <View style={styles.tabRow}>
              {['Yearly', 'Monthly'].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setFeeTab(t)}
                  style={[styles.tabBtn, feeTab === t && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabText, feeTab === t && styles.tabTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <BarChart active={feeTab} />
        </View>

        {/* Recent Activity */}
        <View style={[styles.card, { marginBottom: 4 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.map((a, i) => (
            <View key={i} style={[styles.activityRow, i < activities.length - 1 && styles.activityDivider]}>
              <View style={[styles.activityDot, { backgroundColor: a.color }]} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTime}>{a.time}</Text>
                <Text style={styles.activityTitle}>{a.title}</Text>
                <Text style={styles.activitySub}>{a.subtitle}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.logsBtn}>
            <Text style={styles.logsBtnText}>VIEW FULL LOGS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Home', active: true },
          { icon: '🔍', label: 'Search', active: false },
          { icon: '📄', label: 'Records', active: false },
          { icon: '👤', label: 'Profile', active: false },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && { color: COLORS.primary }]}>{item.label}</Text>
            {item.active && <View style={styles.navActiveBar} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
  },
  menuBtn: { padding: 4, gap: 4 },
  menuLine: { width: 22, height: 2, backgroundColor: COLORS.textDark, borderRadius: 2, marginVertical: 2 },
  topTitle: { fontSize: 17, fontWeight: '700', color: COLORS.primary, letterSpacing: -0.3 },
  bellBtn: { padding: 4 },
  bellIcon: { fontSize: 20 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 14 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#1A3CE8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.iconBlueBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  cardLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  barContainer: {
    marginTop: 14,
    height: 4,
    backgroundColor: '#F0E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: { height: 4, borderRadius: 4 },

  // Chart
  chartMeta: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 6,
  },
  chartTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  tabRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },

  chartWrapper: { paddingTop: 4 },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
  },
  barCol: { alignItems: 'center', flex: 1 },
  barTrack: {
    width: 26,
    height: 110,
    justifyContent: 'flex-end',
    borderRadius: 5,
    backgroundColor: '#F0F3FB',
  },
  barFill: { width: '100%' },
  barLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.5,
  },

  // Activity
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  activityDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  activityDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 5,
  },
  activityInfo: { flex: 1 },
  activityTime: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500', marginBottom: 2 },
  activityTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  activitySub: { fontSize: 12, color: COLORS.textSub },

  logsBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSub,
    letterSpacing: 1,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingVertical: 10,
    paddingBottom: 16,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 3, position: 'relative' },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted },
  navActiveBar: {
    position: 'absolute',
    bottom: -10,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});