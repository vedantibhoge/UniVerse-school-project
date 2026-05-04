import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E6E9F2',
  accent: '#2563EB',
  accentLight: '#60A5FA',
  green: '#10B981',
  gold: '#F59E0B',
  red: '#EF4444',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  white: '#FFFFFF',
};

const METRICS = [
  { label: 'Active Staff', value: '286', tone: C.accent },
  { label: 'On Leave', value: '14', tone: C.gold },
  { label: 'Open Roles', value: '9', tone: C.red },
  { label: 'Attendance', value: '97.8%', tone: C.green },
];

const TEAM = [
  { name: 'Julian Rivers', role: 'Head of Mathematics', status: 'Present', tone: C.green },
  { name: 'Amira Cole', role: 'Senior Biology Teacher', status: 'In Class', tone: C.accentLight },
  { name: 'Noah Bennett', role: 'Operations Lead', status: 'Meeting', tone: C.gold },
];

const DETAIL_PAGES = {
  activeStaff: {
    title: 'Active Staff',
    subtitle: 'Current active staff members and branch coverage.',
    summary: [
      { label: 'Active Staff', value: '286' },
      { label: 'Branches Covered', value: '12' },
      { label: 'Attendance', value: '97.8%' },
    ],
    items: [
      'Mathematics and science teams are fully staffed.',
      'Operations, support, and leadership remain fully active.',
      'Use this page to review active staff by department.',
    ],
  },
  onLeave: {
    title: 'On Leave',
    subtitle: 'Staff currently on leave and temporary coverage status.',
    summary: [
      { label: 'On Leave', value: '14' },
      { label: 'Temporary Coverage', value: '11' },
      { label: 'Urgent Gaps', value: '3' },
    ],
    items: [
      'Three leave requests still need replacement coverage.',
      'Most current absences are planned and approved.',
      'Temporary assignment list should be reviewed daily.',
    ],
  },
  openRoles: {
    title: 'Open Roles',
    subtitle: 'Vacancies currently open across departments.',
    summary: [
      { label: 'Open Roles', value: '9' },
      { label: 'Priority Roles', value: '4' },
      { label: 'Applications', value: '22' },
    ],
    items: [
      'Open roles are concentrated in teaching and support.',
      'Priority vacancies should be filled before the next term.',
      'Review applicant pipeline for final interviews.',
    ],
  },
  attendance: {
    title: 'Attendance',
    subtitle: 'Detailed attendance and presence information.',
    summary: [
      { label: 'Attendance', value: '97.8%' },
      { label: 'Present Today', value: '286' },
      { label: 'On Leave', value: '14' },
    ],
    items: [
      'Daily attendance remains above the operational target.',
      'Presence levels are strongest in academic departments.',
      'Open this page to review recent attendance movement.',
    ],
  },
  teamSnapshot: {
    title: 'Team Snapshot',
    subtitle: 'A list view of the current staff snapshot.',
    summary: [
      { label: 'Members', value: '3' },
      { label: 'Present', value: '2' },
      { label: 'In Meetings', value: '1' },
    ],
    items: [
      'Julian Rivers - Head of Mathematics',
      'Amira Cole - Senior Biology Teacher',
      'Noah Bennett - Operations Lead',
    ],
  },
  attendanceReview: {
    title: 'Attendance Review',
    subtitle: 'Detailed daily attendance logs for director review.',
    summary: [
      { label: 'Present Today', value: '286' },
      { label: 'On Leave', value: '14' },
      { label: 'Attendance Rate', value: '97.8%' },
    ],
    items: [
      'Review daily presence logs from this page.',
      'Any attendance exceptions can be tracked here.',
      'Temporary coverage and absence notes should be updated.',
    ],
  },
  staffDirectory: {
    title: 'Staff Directory',
    subtitle: 'Contact and role details for staff members.',
    summary: [
      { label: 'Faculty Members', value: '3' },
      { label: 'Departments', value: '2' },
      { label: 'Contacts', value: '3' },
    ],
    items: [
      'Julian Rivers - (555) 123-4567',
      'Amira Cole - (555) 234-5678',
      'Noah Bennett - (555) 345-6789',
    ],
  },
  payrollManagement: {
    title: 'Payroll Management',
    subtitle: 'Compensation and department payroll overview.',
    summary: [
      { label: 'Monthly Payroll', value: '$2.4M' },
      { label: 'Processed', value: '100%' },
      { label: 'Departments', value: '3' },
    ],
    items: [
      'Payroll is processed on schedule each month.',
      'Department budgets remain within planned limits.',
      'Review compensation allocation by department here.',
    ],
  },
  professionalDevelopment: {
    title: 'Professional Development',
    subtitle: 'Training programs and staff development activity.',
    summary: [
      { label: 'Programs', value: '12' },
      { label: 'Enrolled', value: '156' },
      { label: 'Upcoming Sessions', value: '3' },
    ],
    items: [
      'Leadership development remains a top priority.',
      'Digital literacy and pedagogy workshops are upcoming.',
      'Training progress can be tracked from this page.',
    ],
  },
};

function DetailScreen({ title, subtitle, summary, items, onBack }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.overline}>Director Console</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.summaryGrid}>
            {summary.map((entry) => (
              <View key={entry.label} style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{entry.label}</Text>
                <Text style={styles.summaryValue}>{entry.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>
          {items.map((item, index) => (
            <View key={`${title}-${index}`} style={styles.detailRow}>
              <View style={styles.detailDot} />
              <Text style={styles.detailText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function Staff() {
  const [activeSection, setActiveSection] = useState('overview');
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const isMobile = screenWidth < 768;
  const openPage = (pageKey) => setActiveSection(pageKey);

  if (DETAIL_PAGES[activeSection]) {
    return <DetailScreen {...DETAIL_PAGES[activeSection]} onBack={() => setActiveSection('overview')} />;
  }

  // ─── Overview Section ──────────────────────────────────────────────────────
  const OverviewSection = () => (
    <>
      <View style={styles.grid}>
        {METRICS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.metricCard}
            activeOpacity={0.8}
            onPress={() => openPage(
              item.label === 'Active Staff'
                ? 'activeStaff'
                : item.label === 'On Leave'
                  ? 'onLeave'
                  : item.label === 'Open Roles'
                    ? 'openRoles'
                    : 'attendance'
            )}
          >
            <View style={[styles.metricDot, { backgroundColor: item.tone }]} />
            <Text style={styles.metricValue}>{item.value}</Text>
            <Text style={styles.metricLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Team Snapshot</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => openPage('teamSnapshot')}>
          <Text style={styles.linkHint}>Open team snapshot list →</Text>
        </TouchableOpacity>
        {TEAM.map((member) => (
          <TouchableOpacity key={member.name} style={styles.row} activeOpacity={0.8} onPress={() => openPage('teamSnapshot')}>
            <View style={[styles.avatar, { backgroundColor: member.tone }]}>
              <Text style={styles.avatarText}>{member.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{member.name}</Text>
              <Text style={styles.rowMeta}>{member.role}</Text>
            </View>
            <Text style={styles.rowStatus}>{member.status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Navigation</Text>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => openPage('attendanceReview')}>
          <Text style={styles.actionText}>📋 Attendance Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => openPage('staffDirectory')}>
          <Text style={styles.actionText}>👥 Staff Directory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => openPage('payrollManagement')}>
          <Text style={styles.actionText}>💰 Payroll Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnSecondary} activeOpacity={0.8} onPress={() => openPage('professionalDevelopment')}>
          <Text style={styles.actionTextSecondary}>🎓 Professional Development</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // ─── Attendance Section ────────────────────────────────────────────────────
  const AttendanceSection = () => (
    <>
      <Text style={styles.overline}>Staff Management</Text>
      <Text style={styles.title}>Attendance Review</Text>
      <Text style={styles.subtitle}>Track daily attendance and presence status.</Text>

      <View style={styles.grid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricDot, { backgroundColor: C.green }]} />
          <Text style={styles.metricValue}>286</Text>
          <Text style={styles.metricLabel}>Present Today</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={[styles.metricDot, { backgroundColor: C.gold }]} />
          <Text style={styles.metricValue}>14</Text>
          <Text style={styles.metricLabel}>On Leave</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Attendance Logs</Text>
        {TEAM.map((member) => (
          <View key={member.name} style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: member.tone }]}>
              <Text style={styles.avatarText}>{member.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{member.name}</Text>
              <Text style={styles.rowMeta}>{member.role}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: member.tone + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: member.tone }]}>{member.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  // ─── Directory Section ─────────────────────────────────────────────────────
  const DirectorySection = () => (
    <>
      <Text style={styles.overline}>Staff Management</Text>
      <Text style={styles.title}>Staff Directory</Text>
      <Text style={styles.subtitle}>Complete staff contact and role information.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Faculty Members</Text>
        {[
          { name: 'Julian Rivers', role: 'Head of Mathematics', dept: 'STEM', contact: '(555) 123-4567' },
          { name: 'Amira Cole', role: 'Senior Biology Teacher', dept: 'STEM', contact: '(555) 234-5678' },
          { name: 'Noah Bennett', role: 'Operations Lead', dept: 'Admin', contact: '(555) 345-6789' },
        ].map((member) => (
          <View key={member.name} style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: C.accentLight }]}>
              <Text style={styles.avatarText}>{member.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{member.name}</Text>
              <Text style={styles.rowMeta}>{member.role}</Text>
              <Text style={styles.rowMetaSmall}>{member.contact}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  // ─── Payroll Section ──────────────────────────────────────────────────────
  const PayrollSection = () => (
    <>
      <Text style={styles.overline}>Staff Management</Text>
      <Text style={styles.title}>Payroll Management</Text>
      <Text style={styles.subtitle}>Compensation and benefits overview.</Text>

      <View style={styles.grid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricDot, { backgroundColor: C.accent }]} />
          <Text style={styles.metricValue}>$2.4M</Text>
          <Text style={styles.metricLabel}>Monthly Payroll</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={[styles.metricDot, { backgroundColor: C.green }]} />
          <Text style={styles.metricValue}>100%</Text>
          <Text style={styles.metricLabel}>Processed</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Department Summary</Text>
        {[
          { dept: 'STEM', count: 85, budget: '$850K' },
          { dept: 'Humanities', count: 62, budget: '$620K' },
          { dept: 'Arts & Sports', count: 48, budget: '$480K' },
        ].map((item) => (
          <View key={item.dept} style={styles.row}>
            <View style={styles.deptBadge}>
              <Text style={styles.deptBadgeText}>{item.dept.slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.dept}</Text>
              <Text style={styles.rowMeta}>{item.count} Staff Members</Text>
            </View>
            <Text style={styles.rowMeta}>{item.budget}</Text>
          </View>
        ))}
      </View>
    </>
  );

  // ─── Professional Development Section ──────────────────────────────────────
  const DevelopmentSection = () => (
    <>
      <Text style={styles.overline}>Staff Management</Text>
      <Text style={styles.title}>Professional Development</Text>
      <Text style={styles.subtitle}>Training programs and career advancement.</Text>

      <View style={styles.grid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricDot, { backgroundColor: C.gold }]} />
          <Text style={styles.metricValue}>12</Text>
          <Text style={styles.metricLabel}>Active Programs</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={[styles.metricDot, { backgroundColor: C.accent }]} />
          <Text style={styles.metricValue}>156</Text>
          <Text style={styles.metricLabel}>Enrolled Staff</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Training Sessions</Text>
        {[
          { title: 'Advanced STEM Pedagogy', date: 'May 15-20', level: 'Advanced', status: 'In Progress' },
          { title: 'Digital Literacy Workshop', date: 'June 1-5', level: 'Beginner', status: 'Upcoming' },
          { title: 'Leadership Development', date: 'May 20-25', level: 'Advanced', status: 'In Progress' },
        ].map((session, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.sessionBadge}>
              <Text style={styles.sessionBadgeText}>📚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{session.title}</Text>
              <Text style={styles.rowMeta}>{session.date} • {session.level}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: session.status === 'In Progress' ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={[styles.statusBadgeText, { color: session.status === 'In Progress' ? C.green : C.gold }]}>{session.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'overview' && <OverviewSection />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  tabsContainer: { flexDirection: 'row', backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.cardBorder, paddingHorizontal: 8 },
  tab: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: C.accent },
  tabIcon: { fontSize: 18, marginBottom: 4 },
  tabIconActive: { fontSize: 20 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: C.textMuted, textAlign: 'center' },
  tabLabelActive: { color: C.accent, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 28 },
  overline: { color: C.accentLight, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11, fontWeight: '800' },
  title: { color: C.textPrimary, fontSize: 30, fontWeight: '900', marginTop: 4 },
  subtitle: { color: C.textSecondary, marginTop: 6, fontSize: 13, lineHeight: 19, marginBottom: 14 },
  backButton: { alignSelf: 'flex-start', marginBottom: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#EFF6FF' },
  backButtonText: { color: C.accent, fontWeight: '800', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: '48%', backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.cardBorder, padding: 14, marginBottom: 12 },
  metricDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 12 },
  metricValue: { color: C.textPrimary, fontSize: 24, fontWeight: '900' },
  metricLabel: { color: C.textSecondary, fontSize: 12, marginTop: 4, fontWeight: '700' },
  card: { backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.cardBorder, padding: 16, marginBottom: 14 },
  sectionTitle: { color: C.textPrimary, fontSize: 12, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  summaryCard: { flex: 1, minWidth: 110, backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: C.cardBorder, padding: 12 },
  summaryLabel: { fontSize: 10, color: C.textMuted, fontWeight: '800' },
  summaryValue: { fontSize: 18, color: C.textPrimary, fontWeight: '900', marginTop: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  detailDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: C.accent },
  detailText: { flex: 1, color: C.textSecondary, fontSize: 13, lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.cardBorder },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { color: C.white, fontWeight: '900', fontSize: 12 },
  rowTitle: { color: C.textPrimary, fontWeight: '800', fontSize: 14 },
  rowMeta: { color: C.textSecondary, fontSize: 12, marginTop: 2 },
  rowMetaSmall: { color: C.textMuted, fontSize: 11, marginTop: 2 },
  rowStatus: { color: C.textMuted, fontSize: 11, fontWeight: '700' },
  actionBtn: { backgroundColor: C.accent, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  actionBtnSecondary: { borderWidth: 1, borderColor: C.cardBorder, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  actionText: { color: C.white, fontWeight: '800', fontSize: 13 },
  actionTextSecondary: { color: C.textPrimary, fontWeight: '800', fontSize: 13 },
  linkHint: { color: C.accent, fontWeight: '800', fontSize: 12, marginBottom: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  deptBadge: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  deptBadgeText: { color: C.white, fontWeight: '800', fontSize: 12 },
  sessionBadge: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#EBF0FF', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sessionBadgeText: { fontSize: 18 },
});