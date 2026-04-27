import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const COLORS = {
  primary: '#1A56DB',
  primaryLight: '#EBF2FF',
  primaryDark: '#1340A8',
  white: '#FFFFFF',
  background: '#F8FAFF',
  cardBg: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  success: '#10B981',
  successBg: '#D1FAE5',
  warning: '#F59E0B',
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  bar1: '#BFDBFE',
  bar2: '#93C5FD',
  bar3: '#60A5FA',
  bar4: '#3B82F6',
};

const MONTHS = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];
const BAR_HEIGHTS = [55, 60, 67, 63, 75, 85];
const MAX_H = isTablet ? 160 : 120;

const HOMEWORK_TASKS = [
  {
    title: 'Literature Essay',
    desc: 'Analysis of "The Great Gatsby" themes�',
    badge: 'DUE TODAY',
    badgeColor: COLORS.danger,
    badgeBg: COLORS.dangerBg,
  },
  {
    title: 'Biology Lab Report',
    desc: 'Microscopic observation of plant cells.',
    badge: 'OCT 25',
    badgeColor: COLORS.textSecondary,
    badgeBg: COLORS.border,
  },
  {
    title: 'History Timeline',
    desc: '',
    badge: 'SUBMITTED',
    badgeColor: COLORS.success,
    badgeBg: COLORS.successBg,
    muted: true,
  },
  {
    title: 'Mathematics Worksheet 8',
    desc: 'Complete integration problems from chapter 4.',
    badge: 'OCT 27',
    badgeColor: COLORS.textSecondary,
    badgeBg: COLORS.border,
  },
  {
    title: 'Chemistry Viva Preparation',
    desc: 'Prepare short notes for oral assessment topics.',
    badge: 'OCT 29',
    badgeColor: COLORS.warning,
    badgeBg: COLORS.blue100,
  },
];

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Text style={styles.headerLogo}>UniVerse</Text>
      <Text style={styles.headerSub}>PARENT PORTAL</Text>
    </View>
    <View style={styles.headerRight}>
      {isTablet && (
        <View style={styles.headerTabs}>
          {['Dashboard', 'Academics'].map((tab) => (
            <TouchableOpacity key={tab} activeOpacity={0.7}>
              <Text style={[styles.headerTab, tab === 'Dashboard' && styles.headerTabActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  </View>
);

const WelcomeBanner = () => (
  <View style={styles.welcomeRow}>
    <View style={styles.welcomeLeft}>
      <Text style={styles.welcomeDate}>MONDAY, OCTOBER 23, 2023</Text>
      <Text style={styles.welcomeTitle}>Welcome back, Mr. Miller</Text>
      <Text style={styles.welcomeSubtitle}>
        Your son, Leo, has 2 pending homework tasks and an upcoming Math quiz today.
      </Text>
    </View>
  </View>
);

const AttendanceChart = () => (
  <View style={styles.card}>
    <View style={styles.chartHeader}>
      <View>
        <Text style={styles.cardTitle}>Attendance Trend</Text>
        <Text style={styles.cardSubtitle}>Average attendance over the last 6 months</Text>
      </View>
      <View style={styles.trendBadge}>
        <Text style={styles.trendText}>+2.4% this month</Text>
      </View>
    </View>
    <View style={styles.chartBars}>
      {MONTHS.map((m, i) => (
        <View key={m} style={styles.barCol}>
          <View
            style={[
              styles.bar,
              {
                height: (BAR_HEIGHTS[i] / 100) * MAX_H,
                backgroundColor: i === MONTHS.length - 1 ? COLORS.blue400 : COLORS.blue200,
              },
            ]}
          />
          <Text style={styles.barLabel}>{m}</Text>
        </View>
      ))}
    </View>
  </View>
);

const ScoreRing = () => (
  <View style={styles.scoreCard}>
    <Text style={styles.scoreCardTitle}>Overall Academic Score</Text>
    <View style={styles.ringWrapper}>
      <View style={styles.ringOuter}>
        <View style={styles.ringInner}>
          <Text style={styles.ringPercent}>85%</Text>
          <Text style={styles.ringLabel}>DISTINCTION</Text>
        </View>
      </View>
    </View>
    <Text style={styles.scoreDesc}>
      Leo is performing better than 88% of his peers this semester.
    </Text>
  </View>
);

const UpNext = () => (
  <View style={[styles.card, styles.upNextCard]}>
    <View style={styles.upNextTop}>
      <View style={styles.clockBadge}>
        <Text style={styles.clockIcon}>Time</Text>
      </View>
      <Text style={styles.inMinutes}>IN 15 MINUTES</Text>
    </View>
    <Text style={styles.upNextLabel}>UP NEXT</Text>
    <Text style={styles.upNextSubject}>Mathematics</Text>
    <Text style={styles.upNextMeta}>Room 302 � Dr. Aris Thorne</Text>
    <View style={styles.divider} />
    <View style={styles.topicRow}>
      <View style={styles.teacherAvatar}>
        <Text style={styles.teacherAvatarText}>AT</Text>
      </View>
      <View>
        <Text style={styles.topicName}>Topic: Calculus II</Text>
        <Text style={styles.topicTime}>9:00 AM - 10:30 AM</Text>
      </View>
    </View>
  </View>
);

const HomeworkCard = ({ onViewAll }) => (
  <View style={styles.card}>
    <View style={styles.hwHeader}>
      <Text style={styles.cardTitle}>Homework</Text>
      <View style={styles.actionBadge}>
        <Text style={styles.actionBadgeText}>2 Action Required</Text>
      </View>
    </View>
    {HOMEWORK_TASKS.slice(0, 3).map((t, i) => (
      <View key={`${t.title}-${i}`} style={[styles.taskRow, i < 2 && styles.taskBorder]}>
        <View style={styles.taskLeft}>
          <Text style={[styles.taskTitle, t.muted && styles.taskMuted]}>{t.title}</Text>
          {t.desc ? <Text style={styles.taskDesc}>{t.desc}</Text> : null}
        </View>
        <View style={[styles.taskBadge, { backgroundColor: t.badgeBg }]}>
          <Text style={[styles.taskBadgeText, { color: t.badgeColor }]}>{t.badge}</Text>
        </View>
      </View>
    ))}
    <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7} onPress={onViewAll}>
      <Text style={styles.viewAllText}>View All Tasks ?</Text>
    </TouchableOpacity>
  </View>
);

const AllTasksScreen = ({ onBack }) => (
  <ScrollView
    style={styles.scroll}
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
  >
    <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7} onPress={onBack}>
      <Text style={styles.viewAllText}>? Back to Dashboard</Text>
    </TouchableOpacity>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>All Homework Tasks</Text>
      <Text style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 12 }]}>Complete task list for Leo</Text>

      {HOMEWORK_TASKS.map((t, i) => (
        <View key={`${t.title}-all-${i}`} style={[styles.taskRow, i < HOMEWORK_TASKS.length - 1 && styles.taskBorder]}>
          <View style={styles.taskLeft}>
            <Text style={[styles.taskTitle, t.muted && styles.taskMuted]}>{t.title}</Text>
            {t.desc ? <Text style={styles.taskDesc}>{t.desc}</Text> : null}
          </View>
          <View style={[styles.taskBadge, { backgroundColor: t.badgeBg }]}>
            <Text style={[styles.taskBadgeText, { color: t.badgeColor }]}>{t.badge}</Text>
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
);

export default function ParentsDashboard({ navigation }) {
  const [screen, setScreen] = useState('dashboard');

  const handleLogout = () => {
    navigation.replace('Login');
  };

  if (screen === 'tasks') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <Header onLogout={handleLogout} />
        <AllTasksScreen onBack={() => setScreen('dashboard')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header onLogout={handleLogout} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeBanner />

        {isTablet ? (
          <View style={styles.row}>
            <View style={styles.colWide}>
              <AttendanceChart />
            </View>
            <View style={styles.colNarrow}>
              <ScoreRing />
            </View>
          </View>
        ) : (
          <>
            <AttendanceChart />
            <ScoreRing />
          </>
        )}

        {isTablet ? (
          <View style={styles.row}>
            <View style={styles.col3}>
              <HomeworkCard onViewAll={() => setScreen('tasks')} />
            </View>
          </View>
        ) : (
          <>
            <HomeworkCard onViewAll={() => setScreen('tasks')} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: isTablet ? 28 : 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: {},
  headerLogo: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTabs: {
    flexDirection: 'row',
    marginRight: 16,
    gap: 24,
  },
  headerTab: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  headerTabActive: {
    color: COLORS.primary,
    fontWeight: '700',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 2,
  },
  scroll: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    padding: isTablet ? 24 : 14,
    paddingBottom: 32,
    gap: 14,
  },
  welcomeRow: {
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isTablet ? 'center' : 'flex-start',
    marginBottom: 4,
    gap: 10,
  },
  welcomeLeft: { flex: 1 },
  welcomeDate: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: isTablet ? 30 : 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: isTablet ? 22 : 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  trendBadge: {
    backgroundColor: COLORS.blue50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_H + 24,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingHorizontal: 4,
  },
  bar: {
    width: '80%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  scoreCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: isTablet ? 22 : 18,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  scoreCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  ringWrapper: { marginVertical: 8 },
  ringOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: COLORS.white,
    borderLeftColor: COLORS.white,
    borderRightColor: COLORS.white,
    transform: [{ rotate: '-30deg' }],
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '30deg' }],
  },
  ringPercent: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 32,
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
  },
  scoreDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 19,
  },
  upNextCard: {},
  upNextTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  clockBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockIcon: { fontSize: 12 },
  inMinutes: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  upNextLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  upNextSubject: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  upNextMeta: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teacherAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.blue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  topicName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  topicTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  hwHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionBadge: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  taskBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  taskLeft: { flex: 1, marginRight: 10 },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  taskMuted: { color: COLORS.textMuted },
  taskDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  taskBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  viewAllBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  feedbackIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackIcon: { fontSize: 12 },
  quoteBox: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  quoteText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  teacherInitials: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherInitialsText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  teacherName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  teacherDept: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  receivedText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  colWide: { flex: 2 },
  colNarrow: { flex: 1 },
  col3: { flex: 1 },
});
