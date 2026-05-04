import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const C = {
  primary: '#1A56DB',
  primaryLight: '#DBEAFE',
  primarySoft: '#EFF6FF',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSoft: '#64748B',
  border: '#E2E8F0',
};

const KPI = [
  { label: 'Total Students', value: '8,420', tone: C.primary },
  { label: 'New Admissions', value: '412', tone: C.accent },
  { label: 'Transfers', value: '37', tone: C.warning },
  { label: 'Withdrawals', value: '18', tone: C.danger },
];

const ACTIVITY = [
  { title: 'Admission review', meta: '24 pending applications', tone: C.primary },
  { title: 'Class placement', meta: '12 students awaiting allocation', tone: C.accent },
  { title: 'Attendance follow-up', meta: '8 students require action', tone: C.warning },
];

const QUICK_LINKS = [
  { label: 'Admissions', screen: 'admissions' },
  { label: 'Demographics', screen: 'demographics' },
  { label: 'Transitions', screen: 'transitions' },
];

const DETAIL_PAGES = {
  totalStudents: {
    title: 'Total Students',
    subtitle: 'Student population overview across the director dashboard.',
    summary: [
      { label: 'Total Students', value: '8,420' },
      { label: 'Active Classes', value: '214' },
      { label: 'Attendance Rate', value: '96.3%' },
    ],
    listTitle: 'Campus List',
    items: [
      { label: 'North campus', value: '3,120 students' },
      { label: 'Central campus', value: '2,880 students' },
      { label: 'South campus', value: '2,420 students' },
    ],
  },
  newAdmissions: {
    title: 'New Admissions',
    subtitle: 'Recent admissions and pending approvals.',
    summary: [
      { label: 'New Admissions', value: '412' },
      { label: 'Pending Review', value: '24' },
      { label: 'Conversion Rate', value: '78%' },
    ],
    listTitle: 'Admissions Queue',
    items: [
      { label: 'Grade 7 - Application', value: 'Pending verification' },
      { label: 'Grade 8 - Application', value: 'Interview scheduled' },
      { label: 'Grade 9 - Application', value: 'Fee confirmation pending' },
    ],
  },
  transfers: {
    title: 'Transfers',
    subtitle: 'Students moving between campuses or programs.',
    summary: [
      { label: 'Transfers', value: '37' },
      { label: 'Approved', value: '29' },
      { label: 'Under Review', value: '8' },
    ],
    listTitle: 'Transfer Requests',
    items: [
      { label: 'West Campus -> Central', value: 'Grade 10, pending counselor approval' },
      { label: 'South Campus -> North', value: 'Grade 8, approved' },
      { label: 'Central -> South', value: 'Grade 11, under review' },
    ],
  },
  withdrawals: {
    title: 'Withdrawals',
    subtitle: 'Students who have left or are in the exit process.',
    summary: [
      { label: 'Withdrawals', value: '18' },
      { label: 'Confirmed', value: '15' },
      { label: 'Exit Reviews', value: '3' },
    ],
    listTitle: 'Withdrawal List',
    items: [
      { label: 'A. Mensah', value: 'Confirmed withdrawal' },
      { label: 'J. Boateng', value: 'Exit interview pending' },
      { label: 'M. Owusu', value: 'Recovery outreach scheduled' },
    ],
  },
  admissions: {
    title: 'Admissions',
    subtitle: 'Admissions workflow, approvals, and capacity planning.',
    summary: [
      { label: 'Pending Applications', value: '24' },
      { label: 'Approved', value: '412' },
      { label: 'Waitlisted', value: '19' },
    ],
    listTitle: 'Admissions Workflow',
    items: [
      { label: 'Pending applications', value: '24 items' },
      { label: 'Approved candidates', value: '412 students' },
      { label: 'Waitlisted candidates', value: '19 students' },
    ],
  },
  demographics: {
    title: 'Demographics',
    subtitle: 'Breakdown of the student population by key segments.',
    summary: [
      { label: 'Male', value: '49%' },
      { label: 'Female', value: '51%' },
      { label: 'Scholarship Students', value: '12%' },
    ],
    items: [
      'Balanced enrollment across gender segments.',
      'Scholarship support remains stable this term.',
      'Regional diversity is improving year over year.',
    ],
  },
  transitions: {
    title: 'Transitions',
    subtitle: 'Student movement between classes, streams, and schools.',
    summary: [
      { label: 'Class Transfers', value: '37' },
      { label: 'Program Changes', value: '14' },
      { label: 'At Risk', value: '6' },
    ],
    items: [
      'Monitor students moving into senior streams.',
      'Program changes need counselor confirmation.',
      'A few transition cases need urgent follow-up.',
    ],
  },
  activityReview: {
    title: 'Recent Activity',
    subtitle: 'A working page for the latest student workflow updates.',
    summary: [
      { label: 'Items Logged', value: '3' },
      { label: 'Pending Action', value: '2' },
      { label: 'Priority', value: 'Medium' },
    ],
    items: [
      'Admission review has 24 pending applications.',
      'Class placement needs 12 students assigned.',
      'Attendance follow-up requires action on 8 students.',
    ],
  },
  insight: {
    title: 'Insight',
    subtitle: 'A detail page for the current student dashboard summary.',
    summary: [
      { label: 'Trend', value: 'Upward' },
      { label: 'Withdrawals', value: 'Low' },
      { label: 'Admissions', value: 'Growing' },
    ],
    listTitle: 'Insight Notes',
    items: [
      { label: 'Trend', value: 'Student admissions are trending upward' },
      { label: 'Risk', value: 'Withdrawals remain low and stable' },
      { label: 'Action', value: 'Use quick links for focused detail views' },
    ],
  },
};

function DetailScreen({ title, subtitle, summary, items, listTitle, onBack }) {
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
          <Text style={styles.sectionLabel}>Details</Text>
          {listTitle ? <Text style={styles.listTitle}>{listTitle}</Text> : null}
          {items.map((item, index) => (
            <View key={`${listTitle || title}-${index}`} style={styles.detailRow}>
              <Dot color={C.primary} />
              <Text style={styles.detailText}>{typeof item === 'string' ? item : `${item.label}: ${item.value}`}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Dot({ color }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

function KpiCard({ label, value, tone, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.kpiCard}>
      <View style={styles.kpiTopRow}>
        <Text style={styles.kpiLabel}>{label}</Text>
        <Dot color={tone} />
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
    </TouchableOpacity>
  );
}

function ActivityRow({ title, meta, tone, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.activityRow}>
      <Dot color={tone} />
      <View style={{ flex: 1 }}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityMeta}>{meta}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Students({ navigation }) {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const openDetail = (screen) => setActiveScreen(screen);
  const goBack = () => setActiveScreen('dashboard');

  const getPage = (screen) => {
    if (screen === 'dashboard') {
      return null;
    }

    const page = DETAIL_PAGES[screen] || DETAIL_PAGES.insight;
    return <DetailScreen {...page} onBack={goBack} />;
  };

  if (activeScreen !== 'dashboard') {
    return getPage(activeScreen);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.overline}>Director Console</Text>
          <Text style={styles.title}>Students</Text>
          <Text style={styles.subtitle}>A native-safe overview of student growth, admissions, and movement.</Text>
        </View>

        <View style={styles.grid}>
          {KPI.map((item) => (
            <KpiCard
              key={item.label}
              label={item.label}
              value={item.value}
              tone={item.tone}
              onPress={() =>
                openDetail(
                  item.label === 'Total Students'
                    ? 'totalStudents'
                    : item.label === 'New Admissions'
                      ? 'newAdmissions'
                      : item.label === 'Transfers'
                        ? 'transfers'
                        : 'withdrawals'
                )
              }
            />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Quick Links</Text>
          <View style={styles.linkRow}>
            {QUICK_LINKS.map((link) => (
              <TouchableOpacity
                key={link.screen}
                style={styles.linkButton}
                onPress={() => openDetail(link.screen)}
                activeOpacity={0.8}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Recent Activity</Text>
          {ACTIVITY.map((item) => (
            <ActivityRow key={item.title} title={item.title} meta={item.meta} tone={item.tone} onPress={() => openDetail('activityReview')} />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={() => openDetail('insight')} style={styles.card}>
          <Text style={styles.sectionLabel}>Insight</Text>
          <Text style={styles.insightText}>
            Student admissions are trending upward while withdrawals remain low. Use the quick links to jump into detailed views.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 28 },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: C.primarySoft,
    borderWidth: 1,
    borderColor: C.primaryLight,
    marginBottom: 14,
  },
  backButtonText: { color: C.primary, fontWeight: '800', fontSize: 12 },
  header: { marginBottom: 16 },
  overline: { fontSize: 11, fontWeight: '800', color: C.primary, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 30, fontWeight: '900', color: C.text, marginTop: 4 },
  subtitle: { marginTop: 6, fontSize: 13, lineHeight: 19, color: C.textSoft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  kpiCard: {
    width: '48%',
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
  },
  kpiTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  kpiLabel: { fontSize: 12, color: C.textSoft, fontWeight: '700' },
  kpiValue: { fontSize: 24, color: C.text, fontWeight: '900' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 14,
  },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  summaryCard: {
    flex: 1,
    minWidth: 110,
    padding: 12,
    backgroundColor: C.primarySoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.primaryLight,
  },
  summaryLabel: { fontSize: 11, color: C.textSoft, fontWeight: '700', marginBottom: 4 },
  summaryValue: { fontSize: 20, color: C.text, fontWeight: '900' },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  detailText: { flex: 1, fontSize: 13, lineHeight: 19, color: C.textSoft },
  listTitle: { fontSize: 13, fontWeight: '800', color: C.text, marginBottom: 10 },
  linkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  linkButton: {
    backgroundColor: C.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.primaryLight,
  },
  linkText: { color: C.primary, fontWeight: '800', fontSize: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border },
  activityTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  activityMeta: { marginTop: 2, fontSize: 12, color: C.textSoft },
  insightText: { fontSize: 13, lineHeight: 20, color: C.textSoft },
});