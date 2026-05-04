import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;

const C = {
  blue: '#2563EB',
  blueDark: '#1D4ED8',
  blueLight: '#EFF6FF',
  blueMid: '#DBEAFE',
  green: '#16A34A',
  greenBg: '#DCFCE7',
  orange: '#EA580C',
  red: '#DC2626',
  bg: '#F1F5F9',
  white: '#FFFFFF',
  text: '#0F172A',
  textMid: '#475569',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  card: '#FFFFFF',
};

function StatCard({ label, value, sub, delta, deltaPositive, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.statCard}>
      <View style={styles.statTop}>
        <Text style={styles.statLabel}>{label}</Text>
        {delta ? (
          <View style={[styles.deltaPill, deltaPositive ? styles.deltaPillPositive : styles.deltaPillNegative]}>
            <Text style={[styles.deltaText, deltaPositive ? styles.deltaTextPositive : styles.deltaTextNegative]}>{delta}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </TouchableOpacity>
  );
}

function ProgressBar({ value }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(100, value)}%` }]} />
    </View>
  );
}

function BarChart() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const stemData = [60, 75, 55, 80, 70, 90];
  const humData = [40, 55, 70, 50, 65, 45];
  const max = Math.max(...stemData, ...humData);

  return (
    <View style={styles.chartWrap}>
      {months.map((m, index) => (
        <View key={m} style={styles.chartCol}>
          <View style={styles.barPair}>
            <View style={[styles.bar, { height: (stemData[index] / max) * 90, backgroundColor: C.blue }]} />
            <View style={[styles.bar, { height: (humData[index] / max) * 90, backgroundColor: '#8B5CF6' }]} />
          </View>
          <Text style={styles.chartLabel}>{m}</Text>
        </View>
      ))}
    </View>
  );
}

function FunnelRow({ label, count, pct }) {
  return (
    <View style={styles.funnelRow}>
      <View style={[styles.funnelBar, { width: `${pct}%` }]}>
        <Text style={styles.funnelLabel}>{label}</Text>
        <Text style={styles.funnelCount}>{count}</Text>
      </View>
    </View>
  );
}

const DETAIL_PAGES = {
  overview: {
    title: "Director's Student Analytics",
    subtitle: 'Institutional Performance & Enrollment Insights · Overview',
    summary: [
      { label: 'Growth', value: '34.2%' },
      { label: 'Enrollment', value: '8,420' },
      { label: 'Yield', value: '5%' },
    ],
    items: [
      'Enrollment trend is moving upward across core programs.',
      'Admissions momentum is strongest in the current cycle.',
      'Use the scrollable sections below to inspect the detail pages.',
    ],
  },
  enrollment: {
    title: 'Enrollment',
    subtitle: 'Enrollment movement and departmental growth patterns.',
    summary: [
      { label: 'Current Enrollment', value: '8,420' },
      { label: 'Growth Rate', value: '34.2%' },
      { label: 'Target', value: '10,000' },
    ],
    items: [
      'STEM enrollment is outperforming the previous term.',
      'Humanities growth remains steady across the last six months.',
      'Use the chart section for monthly comparison.',
    ],
  },
  admissions: {
    title: 'Admissions',
    subtitle: 'Applications, interviews, and acceptance pipeline.',
    summary: [
      { label: 'Applications', value: '15,302' },
      { label: 'Accepted', value: '2,890' },
      { label: 'Conversion', value: '18.5%' },
    ],
    items: [
      'Interview volume is highest in the current quarter.',
      'Acceptance rate is stable and within target range.',
      'This page can be used to track funnel changes over time.',
    ],
  },
  reports: {
    title: 'Reports',
    subtitle: 'Executive snapshots and recent transitions.',
    summary: [
      { label: 'Records', value: '3' },
      { label: 'Spotlight', value: '1' },
      { label: 'Status', value: 'Active' },
    ],
    items: [
      'Recent records are available for review on this page.',
      'International spotlight data supports board reporting.',
      'The transitions feed below remains scrollable and current.',
    ],
  },
  studentGrowth: {
    title: 'Student Growth',
    subtitle: 'Growth overview with month-by-month performance.',
    summary: [
      { label: 'Growth', value: '34.2%' },
      { label: 'Delta', value: '+12.4%' },
      { label: 'Health', value: 'Strong' },
    ],
    items: [
      'Student growth is up versus the previous period.',
      'Use the enrollment chart and funnel for deeper context.',
      'Scroll for additional admissions and transition details.',
    ],
  },
  currentEnrollment: {
    title: 'Current Enrollment',
    subtitle: 'Enrollment totals and target tracking.',
    summary: [
      { label: 'Enrollment', value: '8,420' },
      { label: 'Target', value: '10,000' },
      { label: 'Gap', value: '1,580' },
    ],
    items: [
      'Current enrollment is healthy and growing.',
      'The target gap can be tracked by department below.',
      'This is a scrollable detail page for enrollment data.',
    ],
  },
  dropoutRate: {
    title: 'Dropout Rate',
    subtitle: 'Retention health and dropout movement.',
    summary: [
      { label: 'Dropout Rate', value: '2.1%' },
      { label: 'Retention', value: '97.9%' },
      { label: 'Change', value: '-0.8%' },
    ],
    items: [
      'Retention is excellent across the current term.',
      'Dropout risk remains low in all major cohorts.',
      'Scroll for the recent transitions list.',
    ],
  },
  funnelConversion: {
    title: 'Funnel Conversion',
    subtitle: 'Inquiry-to-admission conversion detail.',
    summary: [
      { label: 'Conversion', value: '18.5%' },
      { label: 'Accepted', value: '2,890' },
      { label: 'Applications', value: '15,302' },
    ],
    items: [
      'Admissions conversion is consistent with the expected band.',
      'High-intent applicants are moving through the funnel faster.',
      'The funnel chart below is intended for deeper review.',
    ],
  },
  enrollmentDynamics: {
    title: 'Enrollment Dynamics',
    subtitle: 'Comparative growth analysis by department.',
    summary: [
      { label: 'STEM', value: '60%' },
      { label: 'Humanities', value: '40%' },
      { label: 'Status', value: 'Balanced' },
    ],
    items: [
      'STEM continues to lead growth trends.',
      'Humanities remains stable in conversion.',
      'Compare the monthly bars for deeper movement insight.',
    ],
  },
  admissionFunnel: {
    title: 'Admission Funnel',
    subtitle: 'Scrollable funnel breakdown from inquiry to accepted.',
    summary: [
      { label: 'Inquiries', value: '42,105' },
      { label: 'Applications', value: '15,302' },
      { label: 'Accepted', value: '2,890' },
    ],
    items: [
      'The funnel is strongest at the inquiry stage.',
      'Acceptance remains close to the expected range.',
      'Scroll to review yield and acceptance metrics.',
    ],
  },
  internationalSpotlight: {
    title: 'International Spotlight',
    subtitle: 'Regional application trends and key insight summary.',
    summary: [
      { label: 'Asia', value: '27%' },
      { label: 'North America', value: '45%' },
      { label: 'Europe', value: '28%' },
    ],
    items: [
      'Southeast Asia applications increased this quarter.',
      'North America remains the largest source region.',
      'Regional mix can be reviewed in the list below.',
    ],
  },
  recentTransitions: {
    title: 'Recent Transitions',
    subtitle: 'New admissions and withdrawal feed, scrollable.',
    summary: [
      { label: 'Records', value: '3' },
      { label: 'Admissions', value: '2' },
      { label: 'Withdrawals', value: '1' },
    ],
    items: [
      'Julianna Dorsey joined Computer Science today.',
      'Marcus Krensky withdrew from Economics yesterday.',
      'Elena Luminaire was admitted into Fine Arts.',
    ],
  },
};

function DetailPage({ page, onBack, children }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.detailCard}>
        <Text style={styles.detailOverline}>Director Analytics</Text>
        <Text style={styles.detailTitle}>{page.title}</Text>
        <Text style={styles.detailSubtitle}>{page.subtitle}</Text>
        <View style={styles.summaryGrid}>
          {page.summary.map((item) => (
            <View key={item.label} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {children}

      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}>Insights</Text>
        {page.items.map((item, index) => (
          <View key={`${page.title}-${index}`} style={styles.detailRow}>
            <View style={styles.detailDot} />
            <Text style={styles.detailText}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function DirectorAnalyticsContent() {
  const [activePage, setActivePage] = useState('overview');

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiRow}>
        <StatCard label="STUDENT GROWTH %" value="34.2%" sub="vs. previous period" delta="+12.4%" deltaPositive onPress={() => setActivePage('studentGrowth')} />
        <StatCard label="CURRENT ENROLLMENT" value="8,420" sub="Target: 10,000 students" onPress={() => setActivePage('currentEnrollment')} />
        <StatCard label="DROPOUT RATE" value="2.1%" sub="Retention Health: Excellent" delta="-0.8%" deltaPositive onPress={() => setActivePage('dropoutRate')} />
        <StatCard label="FUNNEL CONVERSION" value="18.5%" sub="Inquiries to Admissions" onPress={() => setActivePage('funnelConversion')} />
      </ScrollView>

      <TouchableOpacity activeOpacity={0.8} onPress={() => setActivePage('enrollmentDynamics')} style={styles.sectionTouchable}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Enrollment Dynamics</Text>
              <Text style={styles.sectionSub}>Comparative growth analysis by department</Text>
            </View>
            <View style={styles.legend}>
              <View style={[styles.legendDot, { backgroundColor: C.blue }]} />
              <Text style={styles.legendText}>STEM</Text>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendText}>Humanities</Text>
            </View>
          </View>
          <BarChart />
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} onPress={() => setActivePage('admissionFunnel')} style={styles.sectionTouchable}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admission Funnel</Text>
          <View style={{ marginTop: 12 }}>
            <FunnelRow label="Inquiries" count="42,105" pct={100} />
            <FunnelRow label="Applications" count="15,302" pct={72} />
            <FunnelRow label="Interviews" count="6,430" pct={50} />
            <FunnelRow label="Accepted" count="2,890" pct={34} />
          </View>
          <View style={styles.funnelFooter}>
            <View style={styles.funnelStat}>
              <Text style={styles.funnelStatValue}>5%</Text>
              <Text style={styles.funnelStatLabel}>OVERALL YIELD</Text>
            </View>
            <View style={styles.funnelStat}>
              <Text style={styles.funnelStatValue}>32%</Text>
              <Text style={styles.funnelStatLabel}>ACCEPTANCE</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} onPress={() => setActivePage('internationalSpotlight')} style={styles.sectionTouchable}>
        <View style={styles.section}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightTitle}>International Spotlight</Text>
            <Text style={styles.insightBadge}>KEY INSIGHT</Text>
          </View>
          <Text style={styles.insightBody}>
            12% increase in international applications from Southeast Asia this quarter.
          </Text>
          <View style={styles.regionRow}>
            <View style={styles.regionItem}><View style={[styles.regionDot, { backgroundColor: C.blue }]} /><Text style={styles.regionLabel}>North America</Text><Text style={[styles.regionPct, { color: C.blue }]}>45%</Text></View>
            <View style={styles.regionItem}><View style={[styles.regionDot, { backgroundColor: '#8B5CF6' }]} /><Text style={styles.regionLabel}>Europe</Text><Text style={[styles.regionPct, { color: '#8B5CF6' }]}>28%</Text></View>
            <View style={styles.regionItem}><View style={[styles.regionDot, { backgroundColor: C.green }]} /><Text style={styles.regionLabel}>Asia</Text><Text style={[styles.regionPct, { color: C.green }]}>27%</Text></View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} onPress={() => setActivePage('recentTransitions')} style={styles.sectionTouchable}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent Transitions</Text>
              <Text style={styles.sectionSub}>Real-time admission & withdrawal feed</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.viewAllBtn} onPress={() => setActivePage('recentTransitions')}>
              <Text style={styles.viewAllText}>View All Records</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>STUDENT</Text>
            <Text style={styles.tableHeaderText}>STATUS</Text>
            <Text style={styles.tableHeaderText}>PROGRAM</Text>
            <Text style={styles.tableHeaderText}>DATE</Text>
          </View>

          <View style={styles.transRow}><Text style={styles.transName}>Julianna Dorsey</Text><Text style={styles.transDate}>NEW ADMISSION</Text><Text style={styles.transProgram}>Comp. Science</Text><Text style={styles.transDate}>Today</Text></View>
          <View style={styles.transRow}><Text style={styles.transName}>Marcus Krensky</Text><Text style={styles.transDate}>WITHDRAWAL</Text><Text style={styles.transProgram}>Economics</Text><Text style={styles.transDate}>Yesterday</Text></View>
          <View style={styles.transRow}><Text style={styles.transName}>Elena Luminaire</Text><Text style={styles.transDate}>NEW ADMISSION</Text><Text style={styles.transProgram}>Fine Arts</Text><Text style={styles.transDate}>2d ago</Text></View>
        </View>
      </TouchableOpacity>

      <View style={styles.tip}>
        <Text style={styles.tipText}>💡  Tap any card, chart, or tab to drill into detailed analytics</Text>
      </View>
    </ScrollView>
  );

  if (DETAIL_PAGES[activePage] && activePage !== 'overview') {
    const page = DETAIL_PAGES[activePage];

    const pageChildren =
      activePage === 'enrollment' ? (
        <View style={styles.detailSection}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Enrollment Dynamics</Text>
                <Text style={styles.sectionSub}>Comparative growth analysis by department</Text>
              </View>
            </View>
            <BarChart />
          </View>
        </View>
      ) : activePage === 'admissions' ? (
        <View style={styles.detailSection}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admission Funnel</Text>
            <View style={{ marginTop: 12 }}>
              <FunnelRow label="Inquiries" count="42,105" pct={100} />
              <FunnelRow label="Applications" count="15,302" pct={72} />
              <FunnelRow label="Interviews" count="6,430" pct={50} />
              <FunnelRow label="Accepted" count="2,890" pct={34} />
            </View>
          </View>
        </View>
      ) : activePage === 'reports' ? (
        <View style={styles.detailSection}>
          <View style={styles.section}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightTitle}>International Spotlight</Text>
              <Text style={styles.insightBadge}>KEY INSIGHT</Text>
            </View>
            <Text style={styles.insightBody}>
              12% increase in international applications from Southeast Asia this quarter.
            </Text>
            <View style={styles.regionRow}>
              <View style={styles.regionItem}><View style={[styles.regionDot, { backgroundColor: C.blue }]} /><Text style={styles.regionLabel}>North America</Text><Text style={[styles.regionPct, { color: C.blue }]}>45%</Text></View>
              <View style={styles.regionItem}><View style={[styles.regionDot, { backgroundColor: '#8B5CF6' }]} /><Text style={styles.regionLabel}>Europe</Text><Text style={[styles.regionPct, { color: '#8B5CF6' }]}>28%</Text></View>
              <View style={styles.regionItem}><View style={[styles.regionDot, { backgroundColor: C.green }]} /><Text style={styles.regionLabel}>Asia</Text><Text style={[styles.regionPct, { color: C.green }]}>27%</Text></View>
            </View>
          </View>
        </View>
      ) : null;

    return <DetailPage page={page} onBack={() => setActivePage('overview')}>{pageChildren}</DetailPage>;
  }

  return renderOverview();
}

export default function Analytics() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={styles.root}>
        <View style={styles.main}>
          <DirectorAnalyticsContent />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  root: { flex: 1, flexDirection: 'row', backgroundColor: C.bg },
  main: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32, flexGrow: 1 },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.blueLight,
  },
  backButtonText: { color: C.blue, fontWeight: '800', fontSize: 12 },
  detailCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  detailOverline: { fontSize: 10, color: C.blue, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  detailTitle: { fontSize: 24, color: C.text, fontWeight: '900', marginTop: 4 },
  detailSubtitle: { fontSize: 12, color: C.textMid, marginTop: 4, lineHeight: 17 },
  detailSection: { marginBottom: 14 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  summaryCard: {
    flex: 1,
    minWidth: 110,
    backgroundColor: C.blueLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.blueMid,
  },
  summaryLabel: { fontSize: 10, color: C.textLight, fontWeight: '800', letterSpacing: 0.4 },
  summaryValue: { fontSize: 18, color: C.text, fontWeight: '900', marginTop: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  detailDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue, marginTop: 6 },
  detailText: { flex: 1, fontSize: 13, lineHeight: 19, color: C.textMid },
  sectionTouchable: { marginBottom: 14 },
  tabBar: { paddingBottom: 8, paddingRight: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.text },
  headerSub: { fontSize: 12, color: C.textMid, marginTop: 4 },
  periodBtn: {
    backgroundColor: C.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  periodText: { fontSize: 12, color: C.textMid },

  tabBar: { paddingBottom: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  tabActive: { backgroundColor: C.blue, borderColor: C.blue },
  tabText: { fontSize: 12, color: C.textMid, fontWeight: '600' },
  tabTextActive: { color: C.white },

  kpiRow: { paddingVertical: 8, marginBottom: 12 },
  statCard: {
    width: 180,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  statLabel: { fontSize: 9, color: C.textLight, fontWeight: '800', letterSpacing: 0.5, flex: 1, marginRight: 8 },
  statValue: { fontSize: 28, fontWeight: '800', color: C.text },
  statSub: { fontSize: 10, color: C.textMid, marginTop: 4 },
  deltaPill: { borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 },
  deltaPillPositive: { backgroundColor: C.greenBg },
  deltaPillNegative: { backgroundColor: '#FEF2F2' },
  deltaText: { fontSize: 10, fontWeight: '800' },
  deltaTextPositive: { color: C.green },
  deltaTextNegative: { color: C.red },

  section: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  sectionSub: { fontSize: 11, color: C.textMid, marginTop: 4 },

  legend: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 10, color: C.textMid, marginRight: 10 },

  chartWrap: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, alignItems: 'flex-end' },
  chartCol: { alignItems: 'center', flex: 1 },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 10, borderRadius: 3 },
  chartLabel: { fontSize: 9, color: C.textLight, marginTop: 6 },

  funnelRow: { marginBottom: 8 },
  funnelBar: {
    backgroundColor: C.blueMid,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 80,
  },
  funnelLabel: { fontSize: 12, color: C.white, fontWeight: '700' },
  funnelCount: { fontSize: 12, color: '#1E3A8A', fontWeight: '700' },
  funnelFooter: { flexDirection: 'row', marginTop: 16, gap: 24 },
  funnelStat: { alignItems: 'center' },
  funnelStatValue: { fontSize: 22, fontWeight: '800', color: C.text },
  funnelStatLabel: { fontSize: 9, color: C.textLight, fontWeight: '700', marginTop: 2 },

  insightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  insightTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  insightBadge: { fontSize: 9, color: C.orange, fontWeight: '800', letterSpacing: 0.5 },
  insightBody: { fontSize: 12, color: C.textMid, lineHeight: 18, marginBottom: 12 },
  regionRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  regionItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  regionDot: { width: 7, height: 7, borderRadius: 4 },
  regionLabel: { fontSize: 10, color: C.textMid },
  regionPct: { fontSize: 10, fontWeight: '800' },

  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginTop: 12,
    marginBottom: 4,
  },
  tableHeaderText: { fontSize: 9, color: C.textLight, fontWeight: '800', letterSpacing: 0.6, flex: 1 },
  transRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
  },
  transName: { flex: 1, fontSize: 12, color: C.text, fontWeight: '600' },
  transProgram: { flex: 1, fontSize: 11, color: C.textMid },
  transDate: { flex: 1, fontSize: 10, color: C.textLight },

  viewAllBtn: {
    backgroundColor: C.blueLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewAllText: { fontSize: 11, color: C.blue, fontWeight: '700' },

  tip: {
    padding: 12,
    backgroundColor: C.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 24,
  },
  tipText: { fontSize: 11, color: C.textMid, textAlign: 'center' },

  progressTrack: {
    height: 8,
    backgroundColor: C.blueLight,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.blue,
    borderRadius: 999,
  },
});
