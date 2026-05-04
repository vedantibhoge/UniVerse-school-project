import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// NOTE: Drawer/overlay now provided by central DirectorDrawer in Dashboard/Sidebar.js

// ─────────────────────────────────────────────────────────────
// TOP NAV BAR
// ─────────────────────────────────────────────────────────────
const TopBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'term',  label: 'TERM\nOVERVIEW' },
    { id: 'staff', label: 'STAFF\nDIRECTORY' },
    { id: 'fin',   label: 'FINANCIALS' },
  ];

  return (
    <View style={styles.topBar}>
      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.75}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.topTab, isActive && styles.topTabActive]}
            >
              <Text style={[styles.topTabText, isActive && styles.topTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// SEARCH BAR
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, badge, badgeUp, sub, accentColor }) => (
  <View style={[styles.statCard, { borderBottomColor: accentColor, borderBottomWidth: 3 }]}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.statValueRow}>
      <Text style={styles.statValue}>{value}</Text>
      {badge ? (
        <View style={[styles.statBadge, { backgroundColor: badgeUp ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.statBadgeText, { color: badgeUp ? '#16a34a' : '#dc2626' }]}>
            {badgeUp ? '↑' : '↓'} {badge}
          </Text>
        </View>
      ) : null}
    </View>
    <Text style={styles.statSub}>{sub}</Text>
  </View>
);

// ─────────────────────────────────────────────────────────────
// FUNNEL BAR
// ─────────────────────────────────────────────────────────────
const FunnelBar = ({ topLabel, bottomLabel, pct, count, color }) => {
  const maxWidth = SCREEN_WIDTH - 100;
  const barWidth = maxWidth * (pct / 100);
  return (
    <View style={styles.funnelRow}>
      <View style={[styles.funnelBg, { width: maxWidth }]}>
        <View style={[styles.funnelFill, { width: barWidth, backgroundColor: color }]}>
          <Text style={styles.funnelTopLabel}>{topLabel}</Text>
          {bottomLabel ? <Text style={styles.funnelBotLabel}>{bottomLabel}</Text> : null}
        </View>
      </View>
      {count ? <Text style={styles.funnelCount}>{count}</Text> : null}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// GEO STATS
// ─────────────────────────────────────────────────────────────
const GeoStat = ({ label, value }) => (
  <View style={styles.geoStat}>
    <Text style={styles.geoStatLabel}>{label}</Text>
    <Text style={styles.geoStatValue}>{value}</Text>
  </View>
);

const SECTION_COPY = {
  term: {
    title: 'Term Overview',
    text: 'Track enrollment growth, academic movement, and branch-wide student performance for the current term.',
  },
  staff: {
    title: 'Staff Directory',
    text: 'Review staffing coverage, assignments, and support capacity across the branch.',
  },
  fin: {
    title: 'Financials',
    text: 'Monitor revenue, collections, and operational cost trends for this branch.',
  },
};

const SectionCard = ({ title, value, tone }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionCardTitle}>{title}</Text>
    <Text style={[styles.sectionCardValue, { color: tone }]}>{value}</Text>
  </View>
);

// ─────────────────────────────────────────────────────────────
// STUDENT ROW
// ─────────────────────────────────────────────────────────────
const TAG_COLORS = {
  'HIGH-PERFORMING NEW ADMIT': { bg: '#dbeafe', text: '#1d4ed8' },
  'TRANSFER OUT (RELOCATION)': { bg: '#fed7aa', text: '#c2410c' },
};

const StudentRow = ({ initials, avatarBg, name, course, tags, status, statusDot, score }) => (
  <View style={styles.studentRow}>
    <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>

    <View style={styles.studentInfo}>
      <Text style={styles.studentName}>{name}</Text>
      <Text style={styles.studentCourse}>{course}</Text>
    </View>

    <View style={styles.tagsWrap}>
      {tags.map((tag, i) => {
        const c = TAG_COLORS[tag] || { bg: '#f1f5f9', text: '#475569' };
        return (
          <View key={i} style={[styles.tag, { backgroundColor: c.bg }]}>
            <Text style={[styles.tagText, { color: c.text }]}>{tag}</Text>
          </View>
        );
      })}
    </View>

    <View style={styles.statusWrap}>
      <Text style={{ color: statusDot, fontSize: 10, marginRight: 4 }}>●</Text>
      <Text style={[styles.statusText, !score && { color: '#94a3b8' }]}>{status}</Text>
    </View>

    <Text style={[styles.scoreText, !score && { color: '#94a3b8' }]}>
      {score || 'N/A'}
    </Text>

    <TouchableOpacity activeOpacity={0.7} style={styles.moreBtn}>
      <Text style={styles.moreBtnText}>···</Text>
    </TouchableOpacity>
  </View>
);

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function Branch() {
  const [activeNav, setActiveNav] = useState('students');
  const [activeTab, setActiveTab] = useState('term');
  const section = SECTION_COPY[activeTab] || SECTION_COPY.term;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHero}>
          <Text style={styles.sectionHeroLabel}>{section.title}</Text>
          <Text style={styles.sectionHeroText}>{section.text}</Text>

          {activeTab === 'term' && (
            <View style={styles.sectionHeroGrid}>
              <SectionCard title="Active Intake" value="4,829" tone="#2563eb" />
              <SectionCard title="Retention" value="97.8%" tone="#10b981" />
            </View>
          )}

          {activeTab === 'staff' && (
            <View style={styles.sectionHeroGrid}>
              <SectionCard title="Assigned Staff" value="286" tone="#7c3aed" />
              <SectionCard title="Coverage" value="93%" tone="#2563eb" />
            </View>
          )}

          {activeTab === 'fin' && (
            <View style={styles.sectionHeroGrid}>
              <SectionCard title="Term Revenue" value="$1.48M" tone="#10b981" />
              <SectionCard title="Collections" value="92%" tone="#f59e0b" />
            </View>
          )}
        </View>

        {activeTab === 'staff' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Staff Snapshot</Text>
            <Text style={styles.cardDesc}>
              The branch currently has active teaching and admin support across core programs.
            </Text>
            <View style={styles.miniList}>
              <Text style={styles.miniItem}>• 14 teaching staff on duty</Text>
              <Text style={styles.miniItem}>• 3 staff members on leave</Text>
              <Text style={styles.miniItem}>• 96% timetable coverage</Text>
            </View>
          </View>
        )}

        {activeTab === 'fin' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Financial Snapshot</Text>
            <Text style={styles.cardDesc}>
              Branch cashflow and fee collection are trending upward against last term.
            </Text>
            <View style={styles.miniList}>
              <Text style={styles.miniItem}>• Outstanding balances reduced by 12%</Text>
              <Text style={styles.miniItem}>• 4 major expense categories tracked</Text>
              <Text style={styles.miniItem}>• No overdue vendor payouts</Text>
            </View>
          </View>
        )}

        {/* ── Stat Cards ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statCards}
        >
          <StatCard
            label="STUDENT GROWTH %"
            value="+12.4%"
            badge="2.1%"
            badgeUp
            sub="Surpassing target by 150 students"
            accentColor="#2563eb"
          />
          <StatCard
            label="DROPOUT RATE"
            value="3.2%"
            badge="0.5%"
            badgeUp={false}
            sub="Lowest in 4 academic cycles"
            accentColor="#ef4444"
          />
          <StatCard
            label="CURRENT ENROLLMENT"
            value="4,829"
            badge="Target: 5k"
            badgeUp
            sub="96% of total campus capacity"
            accentColor="#7c3aed"
          />
        </ScrollView>

        {/* ── Admission Funnel ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Admission Funnel</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE SESSION</Text>
            </View>
          </View>

          <FunnelBar topLabel="100% Reach" pct={100} color="#2563eb" />
          <FunnelBar topLabel="Applications" bottomLabel="33.2% Conversion" pct={33} count="4,120" color="#2563eb" />
          <FunnelBar topLabel="Final Admissions" bottomLabel="14.8% Yield" pct={15} count="1,840" color="#3b82f6" />

          <View style={styles.funnelFooter}>
            <Text style={styles.funnelUpdated}>Updated 12 mins ago</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.funnelLink}>View Detailed Funnel Analysis →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Geographic Reach ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Geographic Reach</Text>
          <Text style={styles.cardDesc}>Distribution of newly admitted students by region.</Text>

          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.mapText}>World Map – Geographic Distribution</Text>
          </View>

          <View style={styles.geoStatsRow}>
            <GeoStat label="TOP REGION"      value="Metropolitan Area" />
            <GeoStat label="DIVERSITY INDEX" value="0.78 (High)" />
          </View>
        </View>

        {/* ── Recent Significant Changes ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Significant Changes</Text>
          <View style={styles.sectionActions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.exportBtn}>
              <Text style={styles.exportBtnText}>Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} style={styles.filterBtn}>
              <Text style={styles.filterBtnText}>Filter View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>STUDENT PROFILE</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>CLASSIFICATION</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>STATUS</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>IMPACT{'\n'}SCORE</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>ACTION</Text>
        </View>

        {/* Table Body */}
        <View style={styles.tableBody}>
          <StudentRow
            initials="EM"
            avatarBg="#dbeafe"
            name="Elena Martinez"
            course="MSc Data Architecture"
            tags={['HIGH-PERFORMING NEW ADMIT']}
            status="Fully Enrolled"
            statusDot="#22c55e"
            score="9.8/10"
          />
          <View style={styles.divider} />
          <StudentRow
            initials="JW"
            avatarBg="#fed7aa"
            name="Julian Wright"
            course="BArch Sustainable Design"
            tags={['TRANSFER OUT (RELOCATION)']}
            status="Withdrawal Processed"
            statusDot="#94a3b8"
            score={null}
          />
          <View style={styles.divider} />
          <StudentRow
            initials="SK"
            avatarBg="#dbeafe"
            name="Siddharth Kumar"
            course="PhD Quantum Physics"
            tags={['HIGH-PERFORMING NEW ADMIT']}
            status="Fully Enrolled"
            statusDot="#22c55e"
            score="9.9/10"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // ── Sidebar ─────────────────────────────
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  sidebar: {
    width: 234,
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBoxText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },
  logoName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  logoSub: {
    fontSize: 9,
    color: '#94a3b8',
    letterSpacing: 1,
    fontWeight: '600',
    marginTop: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 9,
    marginBottom: 2,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
  },
  navIcon: {
    fontSize: 15,
    width: 24,
    marginRight: 8,
  },
  navLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  navLabelActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  navActivePill: {
    position: 'absolute',
    left: 0,
    top: 9,
    bottom: 9,
    width: 3,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  generateBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 20,
  },
  generateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Top Bar ─────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tabsScroll: {
    flex: 1,
  },
  topTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  topTabActive: {
    borderBottomColor: '#2563eb',
  },
  topTabText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.4,
    textAlign: 'center',
    lineHeight: 14,
  },
  topTabTextActive: {
    color: '#2563eb',
  },
  // ── Layout ──────────────────────────────
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // ── Page Header ─────────────────────────
  pageHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 4,
  },
  pageTag: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 28,
  },
  pageDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
  },
  sectionHero: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeroLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionHeroText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748b',
  },
  sectionHeroGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  sectionCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionCardValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '900',
  },

  // ── Stat Cards ──────────────────────────
  statCards: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  statBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statSub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },

  // ── Card ────────────────────────────────
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 14,
    marginTop: 2,
    lineHeight: 17,
  },
  miniList: {
    gap: 8,
  },
  miniItem: {
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
    fontWeight: '500',
  },

  // ── Live Badge ──────────────────────────
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.4,
  },

  // ── Funnel ──────────────────────────────
  funnelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  funnelBg: {
    height: 54,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  funnelFill: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    minWidth: 90,
  },
  funnelTopLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  funnelBotLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  funnelCount: {
    width: 48,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 8,
  },
  funnelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  funnelUpdated: {
    fontSize: 11,
    color: '#94a3b8',
  },
  funnelLink: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },

  // ── Map ─────────────────────────────────
  mapPlaceholder: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  mapEmoji: { fontSize: 44 },
  mapText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
  },
  geoStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  geoStat: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  geoStatLabel: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  geoStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  // ── Section Header ──────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  exportBtn: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  exportBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  filterBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },

  // ── Table ───────────────────────────────
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.4,
    lineHeight: 13,
  },
  tableBody: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 14,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  studentInfo: {
    flex: 2,
  },
  studentName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  studentCourse: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 14,
  },
  tagsWrap: {
    flex: 2,
    gap: 4,
  },
  tag: {
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusWrap: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '500',
    flexShrink: 1,
    lineHeight: 14,
  },
  scoreText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
    textAlign: 'center',
  },
  moreBtn: {
    flex: 0.6,
    alignItems: 'center',
    paddingVertical: 4,
  },
  moreBtnText: {
    fontSize: 16,
    color: '#94a3b8',
    letterSpacing: 2,
  },
});