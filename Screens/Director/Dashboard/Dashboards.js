import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// ─── THEME ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#F4F6FA',
  white: '#FFFFFF',
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  navy: '#1E3A5F',
  text: '#1A1D23',
  textMid: '#4B5563',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  success: '#10B981',
  successBg: '#D1FAE5',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  orange: '#F97316',
  orangeBg: '#FFEDD5',
  purple: '#8B5CF6',
  purpleBg: '#EDE9FE',
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
};

// ─── MINI BAR CHART ─────────────────────────────────────────────────────────
const MiniBarChart = ({ data = [], color = C.primary, height = 80 }) => {
  const max = Math.max(...data);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 4 }}>
      {data.map((v, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: (v / max) * height,
            backgroundColor: color,
            borderRadius: 3,
            opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </View>
  );
};

// ─── GROUPED BAR CHART ──────────────────────────────────────────────────────
const GroupedBarChart = ({ labels, group1, group2, height = 120 }) => {
  const max = Math.max(...group1, ...group2);
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 6 }}>
        {labels.map((label, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', flexDirection: 'row', gap: 2, justifyContent: 'center', alignSelf: 'flex-end' }}>
            <View style={{ width: 10, height: (group1[i] / max) * height, backgroundColor: C.primary, borderRadius: 2 }} />
            <View style={{ width: 10, height: (group2[i] / max) * height, backgroundColor: '#93C5FD', borderRadius: 2 }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {labels.map((l, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: C.textLight }}>{l}</Text>
        ))}
      </View>
    </View>
  );
};

// ─── HEATMAP CELL ───────────────────────────────────────────────────────────
const HeatCell = ({ val }) => {
  const n = parseInt(val);
  const bg = n >= 90 ? C.primary : n >= 80 ? '#60A5FA' : n >= 70 ? '#93C5FD' : '#BFDBFE';
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: 4, padding: 4, margin: 2, alignItems: 'center' }}>
      <Text style={{ fontSize: 10, color: C.white, fontWeight: '700' }}>{val}</Text>
    </View>
  );
};

// ─── STAT CARD ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, badge, badgeColor = C.primary, badgeBg = C.primaryLight }) => (
  <View style={[styles.card, { flex: 1, minWidth: 130 }]}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {badge && (
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
      </View>
    )}
  </View>
);

// ─── ALERT CARD ─────────────────────────────────────────────────────────────
const AlertCard = ({ type, title, subtitle, tag, tagColor, tagBg }) => (
  <View style={[styles.alertCard, { borderLeftColor: tagColor }]}>
    <Text style={[styles.alertType, { color: tagColor }]}>{type}</Text>
    <Text style={styles.alertTitle}>{title}</Text>
    <Text style={styles.alertSubtitle}>{subtitle}</Text>
    <View style={[styles.badge, { backgroundColor: tagBg, alignSelf: 'flex-start', marginTop: 4 }]}>
      <Text style={[styles.badgeText, { color: tagColor }]}>{tag}</Text>
    </View>
  </View>
);

// ─── TOP NAV ────────────────────────────────────────────────────────────────
const TopNav = ({ activeTab, onTabPress }) => {
  const tabs = [
    { label: 'Dashboard', screen: 'Dashboard' },
    { label: 'Performance', screen: 'StaffEfficiency' },
    { label: 'Strategic View', screen: 'FinancialHealth' },
  ];
  return (
    <View style={styles.topNav}>
      <Text style={styles.navBrand}>Academic Curator</Text>
      <View style={styles.navTabs}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.label}
            activeOpacity={0.7}
            onPress={() => onTabPress(t.screen)}
            style={[styles.navTab, activeTab === t.screen && styles.navTabActive]}
          >
            <Text style={[styles.navTabText, activeTab === t.screen && styles.navTabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ─── INNER NAV (for screens 2,3,4) ──────────────────────────────────────────
const InnerNav = ({ active, onBack, onNavigate }) => {
  const tabs = ['Institutional Oversight', 'Global Reports', 'Audit Logs'];
  return (
    <View style={styles.innerNav}>
      <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Dashboard</Text>
      </TouchableOpacity>
      <View style={styles.navTabs}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            activeOpacity={0.7}
            onPress={() => onNavigate?.(t === 'Institutional Oversight' ? 'StaffEfficiency' : t === 'Global Reports' ? 'FinancialHealth' : 'PerformanceDeepDive')}
            style={[styles.navTab, active === t && styles.navTabActive]}
          >
            <Text style={[styles.navTabText, active === t && styles.navTabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
const DashboardScreen = ({ onNavigate }) => (
  <ScrollView style={styles.screenContent} showsVerticalScrollIndicator={false}>
    {/* KPI Row */}
    <View style={styles.row}>
      <StatCard label="TOTAL STUDENTS" value="12,842" badge="+15.4%" />
      <StatCard label="GROSS REVENUE" value="$4.2M" badge="+6.3%" />
      <StatCard label="ADMISSIONS GROWTH" value="1,240" badge="Target Met" badgeColor={C.success} badgeBg={C.successBg} />
      <StatCard label="ACTIVE ALERTS" value="04" badge="Urgent" badgeColor={C.danger} badgeBg={C.dangerBg} />
    </View>

    {/* Main content row */}
    <View style={[styles.row, { alignItems: 'flex-start' }]}>
      {/* School Health Monitor */}
      <View style={[styles.card, { flex: 2 }]}>
        <Text style={styles.sectionTitle}>School Health Monitor</Text>
        <Text style={styles.sectionSubtitle}>Cross-institutional academic and financial stability tracking.</Text>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <MiniBarChart data={[60, 75, 85, 70, 90, 80, 95, 88, 100, 92]} color={C.primary} height={100} />
          </View>
          <View style={{ flex: 1 }}>
            <MiniBarChart data={[50, 65, 72, 68, 80, 75, 85, 78, 88, 82]} color="#60A5FA" height={100} />
          </View>
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <View style={styles.legendDot(C.primary)} /><Text style={styles.legendText}>Academic</Text>
          <View style={[styles.legendDot(C.primary), { backgroundColor: '#60A5FA', marginLeft: 12 }]} />
          <Text style={styles.legendText}>Financial</Text>
        </View>
      </View>

      {/* Critical Alerts */}
      <View style={[styles.card, { flex: 1 }]}>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 8 }]}>
          <Text style={styles.sectionTitle}>Critical Alerts</Text>
          <Text style={{ fontSize: 16 }}>▽</Text>
        </View>
        <AlertCard type="FINANCIAL" title="Northside Fee Delinquency" subtitle="16% of student accounts past due for Q3." tag="URGENT" tagColor={C.danger} tagBg={C.dangerBg} />
        <AlertCard type="ACADEMICS" title="Teacher Shortage: West Lake" subtitle="Maths/Humanities department requires 2 temporary staff leads." tag="ACTION REQUIRED" tagColor={C.warning} tagBg={C.warningBg} />
        <AlertCard type="SAFETY" title="Downtown Campus Inspection" subtitle="Municipal safety audit scheduled for Friday, 11 AM." tag="SCHEDULED" tagColor={C.primary} tagBg={C.primaryLight} />
      </View>
    </View>

    {/* Management Pulse */}
    <View style={styles.card}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <View>
          <Text style={styles.sectionTitle}>Management Pulse</Text>
          <Text style={styles.sectionSubtitle}>Institutional comparison across core operational dimensions.</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Download Board Report</Text>
        </TouchableOpacity>
      </View>
      {/* Table Header */}
      <View style={[styles.row, styles.tableHeader]}>
        {['BRANCH LOCATION', 'EFFICIENCY', 'ENROLLMENT', 'STAFF RETENTION', 'NPS SCORE', 'STATUS'].map((h) => (
          <Text key={h} style={[styles.tableHeaderText, { flex: h === 'BRANCH LOCATION' ? 2 : 1 }]}>{h}</Text>
        ))}
      </View>
      {[
        { name: 'Northside Academy', sub: 'Central District', eff: '82%', effColor: C.success, enroll: '4,120', enrollBadge: '+4%', ret: '94%', nps: 4, status: 'OPTIMAL', statusColor: C.success, statusBg: C.successBg },
        { name: 'Downtown International', sub: 'Urban Core', eff: '56%', effColor: C.orange, enroll: '5,883', enrollBadge: '+3%', ret: '98%', nps: 5, status: 'STRAINED', statusColor: C.orange, statusBg: C.orangeBg },
        { name: 'West Lake Campus', sub: 'Suburban Green', eff: '66%', effColor: C.danger, enroll: '2,839', enrollBadge: '-2%', ret: '96%', nps: 3, status: 'STRESS', statusColor: C.danger, statusBg: C.dangerBg },
      ].map((row, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.75}
          onPress={() => onNavigate('StaffEfficiency')}
          style={[styles.row, styles.tableRow, i % 2 === 0 && { backgroundColor: '#F9FAFB' }]}
        >
          <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.branchIcon, { backgroundColor: C.primary }]}>
              <Text style={{ color: C.white, fontSize: 10, fontWeight: '700' }}>{row.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</Text>
            </View>
            <View>
              <Text style={styles.tableCellBold}>{row.name}</Text>
              <Text style={styles.tableCellSub}>{row.sub}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: row.eff, backgroundColor: row.effColor }]} />
            </View>
            <Text style={[styles.tableCellSub, { color: row.effColor }]}>{row.eff}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tableCellBold}>{row.enroll}</Text>
            <Text style={{ fontSize: 10, color: row.enrollBadge.startsWith('+') ? C.success : C.danger }}>{row.enrollBadge}</Text>
          </View>
          <Text style={[styles.tableCell, { flex: 1 }]}>{row.ret}</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {[...Array(5)].map((_, s) => <Text key={s} style={{ fontSize: 10, color: s < row.nps ? C.warning : C.border }}>★</Text>)}
          </View>
          <View style={[styles.badge, { backgroundColor: row.statusBg, flex: 1, alignSelf: 'center' }]}>
            <Text style={[styles.badgeText, { color: row.statusColor }]}>{row.status}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>

    {/* Quick Nav Tiles */}
    <View style={styles.row}>
      {[
        { label: 'Staff Efficiency\n& Faculty Analytics', screen: 'StaffEfficiency', icon: '👥', color: C.primary },
        { label: 'Financial Health\n& Disbursement', screen: 'FinancialHealth', icon: '💰', color: C.success },
        { label: 'Performance\nDeep-Dive', screen: 'PerformanceDeepDive', icon: '📊', color: C.purple },
      ].map(({ label, screen, icon, color }) => (
        <TouchableOpacity
          key={screen}
          activeOpacity={0.75}
          onPress={() => onNavigate(screen)}
          style={[styles.card, { flex: 1, alignItems: 'center', paddingVertical: 20 }]}
        >
          <Text style={{ fontSize: 28, marginBottom: 8 }}>{icon}</Text>
          <Text style={[styles.tableCellBold, { textAlign: 'center', color }]}>{label}</Text>
          <Text style={[styles.badgeText, { color, marginTop: 4 }]}>Tap to Open →</Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={{ height: 32 }} />
  </ScrollView>
);

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — STAFF EFFICIENCY & FACULTY ANALYTICS
// ════════════════════════════════════════════════════════════════════════════
const StaffEfficiencyScreen = () => (
  <ScrollView style={styles.screenContent} showsVerticalScrollIndicator={false}>
    <Text style={styles.pageTitle}>Staff Efficiency & Faculty Analytics</Text>
    <Text style={styles.pageSubtitle}>Curated oversight of department-wide performance metrics.</Text>

    <View style={[styles.row, { alignItems: 'flex-start' }]}>
      {/* Attendance Card */}
      <View style={[styles.card, { flex: 2 }]}>
        <Text style={styles.sectionTitle}>Faculty Attendance & Punctuality</Text>
        <Text style={styles.sectionSubtitle}>Biometric-linked tracking across all 12 departments.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <View style={styles.bigPercentCircle}>
            <Text style={styles.bigPercentText}>94.2%</Text>
            <Text style={{ fontSize: 8, color: C.textLight, textAlign: 'center' }}>INSTITUTIONAL{'\n'}AVERAGE</Text>
          </View>
          <MiniBarChart data={[88, 91, 93, 90, 94, 92, 95, 94, 97, 94]} color={C.primary} height={80} />
        </View>
      </View>

      {/* Resource Allocation */}
      <View style={[styles.card, { flex: 1 }]}>
        <Text style={styles.sectionTitle}>Resource Allocation</Text>
        {[
          { label: 'Faculty Tech Kits', val: '38/70', pct: 54, color: C.primary },
          { label: 'Sports Equipment', val: '12%', pct: 12, color: C.orange },
          { label: 'Lab Consumables', val: '8.1%', pct: 8, color: C.success },
        ].map((r, i) => (
          <View key={i} style={{ marginTop: 10 }}>
            <View style={styles.row}>
              <Text style={styles.tableCellSub}>{r.label}</Text>
              <Text style={styles.tableCellBold}>{r.val}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${r.pct}%`, backgroundColor: r.color }]} />
            </View>
          </View>
        ))}
        <TouchableOpacity activeOpacity={0.7} style={[styles.primaryBtn, { marginTop: 12, alignSelf: 'center' }]}>
          <Text style={styles.primaryBtnText}>Reallocate Resources →</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Syllabus Progress */}
    <View style={styles.card}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>Syllabus Progress by Department</Text>
        <View style={[styles.badge, { backgroundColor: C.primaryLight }]}>
          <Text style={[styles.badgeText, { color: C.primary }]}>Current Term (Fall 2023) ▽</Text>
        </View>
      </View>
      <View style={styles.row}>
        {[
          { dept: 'DEPT. OF MATHEMATICS', pct: 82, color: C.primary, change: '+3.4%', status: 'On Track' },
          { dept: 'DEPT. OF HISTORY', pct: 68, color: C.orange, change: '-20%', status: 'Delayed' },
          { dept: 'ENGINEERING LAB', pct: 91, color: C.success, change: '+5%', status: 'Ahead' },
          { dept: 'GENERAL ADMIN', pct: 74, color: C.primary, change: '-5%', status: 'On Track' },
        ].map((d, i) => (
          <View key={i} style={[styles.card, { flex: 1, alignItems: 'center', paddingVertical: 14, margin: 4 }]}>
            <View style={styles.progressCircle(d.pct, d.color)}>
              <Text style={[styles.tableCellBold, { color: d.color }]}>{d.pct}%</Text>
            </View>
            <Text style={[styles.tableCellSub, { textAlign: 'center', marginTop: 6, fontSize: 9 }]}>{d.dept}</Text>
            <Text style={{ fontSize: 9, color: d.change.startsWith('+') ? C.success : C.danger }}>{d.change}</Text>
            <Text style={{ fontSize: 9, color: C.textLight }}>{d.status}</Text>
          </View>
        ))}
      </View>
    </View>

    {/* Staff Performance Ratings */}
    <View style={[styles.row, { alignItems: 'flex-start' }]}>
      <View style={[styles.card, { flex: 2 }]}>
        <Text style={styles.sectionTitle}>Staff Performance Ratings</Text>
        <Text style={styles.sectionSubtitle}>Correlates Between Research Output (Y) and Teaching Quality (X).</Text>
        {/* Bubble chart simulation */}
        <View style={{ height: 120, position: 'relative', marginTop: 12 }}>
          {[
            { x: 20, y: 70, size: 32, color: C.primary },
            { x: 45, y: 40, size: 24, color: '#60A5FA' },
            { x: 65, y: 60, size: 40, color: C.purple },
            { x: 80, y: 25, size: 20, color: '#93C5FD' },
            { x: 35, y: 80, size: 16, color: C.primary },
            { x: 55, y: 20, size: 28, color: '#60A5FA' },
          ].map((b, i) => (
            <View key={i} style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y - b.size / 2}%`,
              width: b.size,
              height: b.size,
              borderRadius: b.size / 2,
              backgroundColor: b.color,
              opacity: 0.7,
            }} />
          ))}
        </View>
        <View style={styles.row}>
          <View style={styles.legendDot(C.primary)} /><Text style={styles.legendText}>Senior</Text>
          <View style={[styles.legendDot(C.primary), { backgroundColor: '#93C5FD', marginLeft: 12 }]} />
          <Text style={styles.legendText}>Junior</Text>
        </View>
      </View>

      <View style={[styles.card, { flex: 1, backgroundColor: C.primary }]}>
        <Text style={[styles.sectionTitle, { color: C.white }]}>Perspective Insight</Text>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 16, marginTop: 6 }}>
          Staff attendance has increased by 16% since the implementation of the flexible module validation program. Department morale is at an all-time high.
        </Text>
        <View style={{ marginTop: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 8 }}>
          <Text style={{ color: C.white, fontSize: 10 }}>📈 Attendance trend improving</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: C.white, marginTop: 12 }]}>Upcoming Reviews</Text>
        {['Daniel Richardson', 'Elena Lyons'].map((n, i) => (
          <View key={i} style={[styles.row, { marginTop: 8, gap: 8 }]}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <Text style={{ color: C.white, fontSize: 10 }}>{n.split(' ').map(w => w[0]).join('')}</Text>
            </View>
            <Text style={{ color: C.white, fontSize: 11, flex: 1 }}>{n}</Text>
          </View>
        ))}
      </View>
    </View>

    {/* Department Head Efficiency Matrix */}
    <View style={styles.card}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>Department Head Efficiency Matrix</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.badgeText, { color: C.primary }]}>View All Staff →</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, styles.tableHeader]}>
        {['FACULTY MEMBER', 'ACTIVE ROLE', 'ACHIEVEMENT', 'CONTRIBUTION', 'ACTION'].map((h) => (
          <Text key={h} style={[styles.tableHeaderText, { flex: h === 'FACULTY MEMBER' ? 2 : 1 }]}>{h}</Text>
        ))}
      </View>
      {[
        { name: 'Dr. Sarah Jenkins', role: 'Applied Physics', ach: 88, contrib: 'HIGH', contribColor: C.success, contribBg: C.successBg },
        { name: 'Marcus Aurelius', role: 'Humanities', ach: 22, contrib: 'ON REVIEW', contribColor: C.danger, contribBg: C.dangerBg },
      ].map((f, i) => (
        <View key={i} style={[styles.row, styles.tableRow]}>
          <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.branchIcon, { backgroundColor: C.primaryLight }]}>
              <Text style={{ color: C.primary, fontSize: 10, fontWeight: '700' }}>{f.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</Text>
            </View>
            <View>
              <Text style={styles.tableCellBold}>{f.name}</Text>
              <Text style={styles.tableCellSub}>{f.role}</Text>
            </View>
          </View>
          <Text style={[styles.tableCell, { flex: 1 }]}> </Text>
          <View style={{ flex: 1 }}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${f.ach}%`, backgroundColor: f.ach > 50 ? C.primary : C.danger }]} />
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: f.contribBg, flex: 1, alignSelf: 'center' }]}>
            <Text style={[styles.badgeText, { color: f.contribColor }]}>{f.contrib}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: C.textLight }}>⋮</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
    <View style={{ height: 32 }} />
  </ScrollView>
);

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — FINANCIAL HEALTH
// ════════════════════════════════════════════════════════════════════════════
const FinancialHealthScreen = () => (
  <ScrollView style={styles.screenContent} showsVerticalScrollIndicator={false}>
    <Text style={styles.pageTitle}>Financial Health</Text>
    <Text style={styles.pageSubtitle}>Real-time fiscal oversight and resource-allocation management for the current academic cycle.{'\n'}Use these insights for strategic resource allocation.</Text>

    <View style={[styles.row, { alignItems: 'flex-start' }]}>
      {/* Revenue vs Target */}
      <View style={[styles.card, { flex: 2 }]}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <Text style={styles.sectionTitle}>Revenue vs. Target</Text>
          <View style={[styles.badge, { backgroundColor: C.primaryLight }]}>
            <Text style={[styles.badgeText, { color: C.primary }]}>On Track</Text>
          </View>
        </View>
        <Text style={styles.bigPercentText}>92.4%</Text>
        <Text style={styles.sectionSubtitle}>RUNNING TO DATE</Text>
        <MiniBarChart data={[70, 78, 82, 88, 85, 91, 87, 92, 94, 92]} color={C.primary} height={80} />
        <View style={[styles.row, { marginTop: 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.tableCellSub}>Student YTD</Text>
            <Text style={styles.tableCellBold}>$11.9M</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tableCellSub}>Target Goal</Text>
            <Text style={styles.tableCellBold}>$13.9M</Text>
          </View>
        </View>
      </View>

      {/* Strategic Savings */}
      <View style={[styles.card, { flex: 1 }]}>
        <Text style={styles.sectionTitle}>Strategic Savings Insights</Text>
        {[
          { icon: '🖥️', title: 'Infrastructure Optimization', desc: 'Transitioning to the new cloud-based AWS has reduced data center renewal maintenance costs to 14.2% this quarter.' },
          { icon: '📦', title: 'Procurement Consolidation', desc: 'Merging agreements with procurement partners from saved the Academic approximately $64,200 annually.' },
        ].map((s, i) => (
          <View key={i} style={[styles.row, { marginTop: 12, gap: 10, alignItems: 'flex-start' }]}>
            <Text style={{ fontSize: 20 }}>{s.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.tableCellBold}>{s.title}</Text>
              <Text style={{ fontSize: 10, color: C.textMid, lineHeight: 14, marginTop: 2 }}>{s.desc}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity activeOpacity={0.7} style={[styles.card, { backgroundColor: C.bg, marginTop: 12, padding: 8 }]}>
          <Text style={{ fontSize: 10, color: C.primary, fontWeight: '600' }}>View Full Ledger →</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Departmental Disbursement */}
    <View style={styles.card}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <View>
          <Text style={styles.sectionTitle}>Departmental Disbursement</Text>
          <Text style={styles.sectionSubtitle}>Slot management.</Text>
        </View>
        <View>
          <Text style={styles.tableCellSub}>Total Monthly Revised</Text>
          <Text style={[styles.tableCellBold, { color: C.primary }]}>$2.84M</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={[styles.badge, { backgroundColor: C.primaryLight }]}>
          <Text style={[styles.badgeText, { color: C.primary }]}>Filter Loan ▽</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        {[
          { label: 'FACULTY', amount: '$1,120,400', color: C.primary, bg: C.primaryLight },
          { label: 'ADMIN & MGMT', amount: '$845,200', color: C.orange, bg: C.orangeBg },
          { label: 'INFRA & ASSETS', amount: '$512,000', color: C.warning, bg: C.warningBg },
          { label: 'STRATEGIC', amount: '$562,800', color: C.danger, bg: C.dangerBg },
        ].map((d, i) => (
          <View key={i} style={[styles.card, { flex: 1, margin: 4, alignItems: 'flex-start' }]}>
            <View style={[styles.badge, { backgroundColor: d.bg, marginBottom: 8 }]}>
              <Text style={[styles.badgeText, { color: d.color }]}>{d.label}</Text>
            </View>
            <Text style={[styles.statValue, { color: d.color, fontSize: 18 }]}>{d.amount}</Text>
          </View>
        ))}
      </View>
    </View>

    {/* Large Expenditures Ledger */}
    <View style={styles.card}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>Large Expenditures Ledger</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.badgeText, { color: C.primary }]}>View Full Ledger →</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, styles.tableHeader]}>
        {['MERCHANT / VENDOR', 'CATEGORY', 'DATE', 'STATUS', 'AMOUNT'].map((h) => (
          <Text key={h} style={[styles.tableHeaderText, { flex: h === 'MERCHANT / VENDOR' ? 2 : 1 }]}>{h}</Text>
        ))}
      </View>
      {[
        { vendor: 'Thermo Fisher Scientific', cat: 'Lab Equipment', date: 'Oct 30, 2023', status: 'LOCKED', statusColor: C.primary, statusBg: C.primaryLight, amount: '$142,800.00' },
        { vendor: 'Microsoft Azure Corp.', cat: 'Cloud Infrastructure', date: 'Oct 08, 2023', status: 'UPDATE', statusColor: C.orange, statusBg: C.orangeBg, amount: '$38,210.48' },
        { vendor: 'Modern Build Consortia', cat: 'Facilities Renewal', date: 'Oct 06, 2023', status: 'LOCKED', statusColor: C.primary, statusBg: C.primaryLight, amount: '$213,300.00' },
        { vendor: 'Oxford Press Licensing', cat: 'Digital Library', date: 'Sep 28, 2023', status: 'LOCKED', statusColor: C.primary, statusBg: C.primaryLight, amount: '$96,800.00' },
      ].map((row, i) => (
        <TouchableOpacity key={i} activeOpacity={0.7} style={[styles.row, styles.tableRow, i % 2 === 0 && { backgroundColor: '#F9FAFB' }]}>
          <View style={{ flex: 2, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={[styles.branchIcon, { backgroundColor: C.primaryLight }]}>
              <Text style={{ fontSize: 12 }}>🏢</Text>
            </View>
            <Text style={styles.tableCellBold}>{row.vendor}</Text>
          </View>
          <Text style={[styles.tableCell, { flex: 1 }]}>{row.cat}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{row.date}</Text>
          <View style={[styles.badge, { backgroundColor: row.statusBg, flex: 1, alignSelf: 'center' }]}>
            <Text style={[styles.badgeText, { color: row.statusColor }]}>{row.status}</Text>
          </View>
          <Text style={[styles.tableCellBold, { flex: 1 }]}>{row.amount}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={{ height: 32 }} />
  </ScrollView>
);

// ════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — PERFORMANCE DEEP-DIVE
// ════════════════════════════════════════════════════════════════════════════
const PerformanceDeepDiveScreen = () => (
  <ScrollView style={styles.screenContent} showsVerticalScrollIndicator={false}>
    <View style={[styles.row, { justifyContent: 'space-between' }]}>
      <View>
        <Text style={styles.pageLabel}>INTERNAL REPORT</Text>
        <Text style={styles.pageTitle}>Performance Deep-Dive</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: C.primaryLight, marginRight: 8 }]}>
          <Text style={[styles.badgeText, { color: C.primary }]}>📅 AY 2023-2024</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={[styles.primaryBtn]}>
          <Text style={styles.primaryBtnText}>🏫 All Departments</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={[styles.row, { alignItems: 'flex-start' }]}>
      {/* Comparative Grade Analysis */}
      <View style={[styles.card, { flex: 2 }]}>
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
          <Text style={styles.sectionTitle}>Comparative Grade Analysis</Text>
          <View style={styles.row}>
            <View style={styles.legendDot(C.primary)} /><Text style={styles.legendText}>Current Year</Text>
            <View style={[styles.legendDot(C.primary), { backgroundColor: '#93C5FD', marginLeft: 10 }]} />
            <Text style={styles.legendText}>Last Year</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>Year-over-year proficiency distribution by core faculty.</Text>
        <GroupedBarChart
          labels={['MATH', 'SCIENCE', 'HUMANITIES', 'LANGUAGES', 'ARTS', 'COMP SCI']}
          group1={[85, 78, 72, 88, 65, 91]}
          group2={[80, 82, 75, 84, 70, 85]}
          height={100}
        />
      </View>

      {/* Critical Risks */}
      <View style={[styles.card, { flex: 1 }]}>
        <Text style={[styles.sectionTitle, { color: C.danger, marginBottom: 8 }]}>⚠ Critical Risks</Text>
        {[
          { icon: '⚠️', title: 'Advanced Physics II', desc: 'Proficiency dropped 32% in the last assessment cycle.', color: C.danger, bg: C.dangerBg },
          { icon: '📉', title: 'Attendance Correlation', desc: 'Grade 11 students showing impaired trend in attendance.', color: C.warning, bg: C.warningBg },
          { icon: '📋', title: 'Staff Audit Pending', desc: '3 senior sections have not finalized Q3 grade entries.', color: C.textMid, bg: C.border },
        ].map((r, i) => (
          <View key={i} style={[styles.alertCard, { borderLeftColor: r.color, marginBottom: 8 }]}>
            <Text style={{ fontSize: 14 }}>{r.icon}</Text>
            <Text style={styles.alertTitle}>{r.title}</Text>
            <Text style={styles.alertSubtitle}>{r.desc}</Text>
          </View>
        ))}
        <TouchableOpacity activeOpacity={0.7} style={[styles.primaryBtn, { backgroundColor: C.danger, alignSelf: 'center', marginTop: 4 }]}>
          <Text style={styles.primaryBtnText}>View Intervention Plan →</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Subject Mastery Heatmap */}
    <View style={styles.card}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>Subject Mastery Heatmap</Text>
        <View style={styles.row}>
          {[{ label: 'MASTERED', color: C.primary }, { label: 'NOT MASTERED', color: '#60A5FA' }, { label: 'STRUGGLING', color: '#BFDBFE' }].map((l) => (
            <View key={l.label} style={[styles.row, { marginLeft: 8 }]}>
              <View style={[styles.legendDot(l.color), { width: 8, height: 8, borderRadius: 2 }]} />
              <Text style={[styles.legendText, { fontSize: 8 }]}>{l.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Heatmap table */}
      <View style={[styles.row, { marginBottom: 4 }]}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>SUBJECT FIELD</Text>
        {['GRADE 9', 'GRADE 10', 'GRADE 11', 'GRADE 12'].map(g => (
          <Text key={g} style={[styles.tableHeaderText, { flex: 1 }]}>{g}</Text>
        ))}
      </View>
      {[
        { subject: 'Calculus & Logic', vals: ['89%', '84%', '80%', '91%'] },
        { subject: 'Organic Chemistry', vals: ['82%', '84%', '78%', '88%'] },
        { subject: 'Western Literature', vals: ['86%', '81%', '84%', '85%'] },
      ].map((row, i) => (
        <View key={i} style={[styles.row, { marginBottom: 4 }]}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{row.subject}</Text>
          {row.vals.map((v, j) => <HeatCell key={j} val={v} />)}
        </View>
      ))}
    </View>

    {/* Bottom Row */}
    <View style={styles.row}>
      {/* Distinguished Students */}
      <View style={[styles.card, { flex: 1 }]}>
        <View style={[styles.row, { gap: 8, marginBottom: 2 }]}>
          <Text style={{ fontSize: 16 }}>🎓</Text>
          <Text style={styles.sectionTitle}>Distinguished Students</Text>
        </View>
        {[
          { name: 'Elena Rodriguez', role: 'SPK-401 | Mathematics as Major', pct: '97TH PERCENTILE' },
          { name: 'Marcus Chen', role: 'SPK-2.40 | Physics 6.8H', pct: '84TH PERCENTILE' },
        ].map((s, i) => (
          <TouchableOpacity key={i} activeOpacity={0.75} style={[styles.row, { marginTop: 10, gap: 8 }]}>
            <View style={[styles.avatar, { backgroundColor: C.primaryLight }]}>
              <Text style={{ color: C.primary, fontSize: 11, fontWeight: '700' }}>{s.name.split(' ').map(w => w[0]).join('')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tableCellBold}>{s.name}</Text>
              <Text style={styles.tableCellSub}>{s.role}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: C.successBg }]}>
              <Text style={[styles.badgeText, { color: C.success }]}>{s.pct}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top Faculty Efficiency */}
      <View style={[styles.card, { flex: 1 }]}>
        <View style={[styles.row, { gap: 8, marginBottom: 2 }]}>
          <Text style={{ fontSize: 16 }}>🏆</Text>
          <Text style={styles.sectionTitle}>Top Faculty Efficiency</Text>
        </View>
        {[
          { name: 'Dr. Alastair Vaughn', role: 'Dept. Head of Classical Literature', pct: '100% COMPLETION' },
          { name: 'Prof. Sarah Jenkins', role: 'Dept. Head of Classical Literature', pct: '98% COMPLETION' },
        ].map((f, i) => (
          <TouchableOpacity key={i} activeOpacity={0.75} style={[styles.row, { marginTop: 10, gap: 8 }]}>
            <View style={[styles.avatar, { backgroundColor: C.purpleBg }]}>
              <Text style={{ color: C.purple, fontSize: 11, fontWeight: '700' }}>{f.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tableCellBold}>{f.name}</Text>
              <Text style={styles.tableCellSub}>{f.role}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: C.primaryLight }]}>
              <Text style={[styles.badgeText, { color: C.primary }]}>{f.pct}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    <View style={{ height: 32 }} />
  </ScrollView>
);

// ════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [activeScreen, setActiveScreen] = useState('Dashboard');

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      {activeScreen !== 'Dashboard' && (
        <InnerNav
          active={
            activeScreen === 'StaffEfficiency' ? 'Institutional Oversight'
            : activeScreen === 'FinancialHealth' ? 'Global Reports'
            : 'Audit Logs'
          }
          onBack={() => setActiveScreen('Dashboard')}
          onNavigate={setActiveScreen}
        />
      )}

      {activeScreen === 'Dashboard' && <DashboardScreen onNavigate={setActiveScreen} />}
      {activeScreen === 'StaffEfficiency' && <StaffEfficiencyScreen />}
      {activeScreen === 'FinancialHealth' && <FinancialHealthScreen />}
      {activeScreen === 'PerformanceDeepDive' && <PerformanceDeepDiveScreen />}

      {/* FAB */}
      {activeScreen !== 'Dashboard' && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveScreen('Dashboard')}
          style={styles.fab}
        >
          <Text style={{ color: C.white, fontSize: 22 }}>+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Nav
  topNav: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.white,
    paddingHorizontal: 20, paddingVertical: 10, gap: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  innerNav: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.white,
    paddingHorizontal: 20, paddingVertical: 8, gap: 12,
    borderBottomWidth: 1, borderBottomColor: C.border, flexWrap: 'wrap',
  },
  navBrand: { fontSize: 15, fontWeight: '800', color: C.navy, letterSpacing: -0.3 },
  navTabs: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  navTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  navTabActive: { backgroundColor: C.primaryLight },
  navTabText: { fontSize: 12, color: C.textMid, fontWeight: '500' },
  navTabTextActive: { color: C.primary, fontWeight: '700' },
  backBtn: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: C.primaryLight, borderRadius: 6 },
  backBtnText: { fontSize: 12, color: C.primary, fontWeight: '700' },

  // Screen
  screenContent: { flex: 1, padding: 16 },
  pageLabel: { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 1.5, marginBottom: 2 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: C.navy, letterSpacing: -0.5, marginBottom: 2 },
  pageSubtitle: { fontSize: 12, color: C.textMid, marginBottom: 16, lineHeight: 17 },

  // Cards
  card: {
    backgroundColor: C.white, borderRadius: 12, padding: 14, marginBottom: 14,
    ...C.cardShadow,
  },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },

  // Stats
  statLabel: { fontSize: 9, color: C.textLight, fontWeight: '700', letterSpacing: 0.8, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '900', color: C.text, letterSpacing: -1 },
  bigPercentText: { fontSize: 36, fontWeight: '900', color: C.primary, letterSpacing: -1 },

  // Badge
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },

  // Alert card
  alertCard: {
    borderLeftWidth: 3, paddingLeft: 8, marginBottom: 10,
    backgroundColor: '#FAFAFA', borderRadius: 6, padding: 8,
  },
  alertType: { fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  alertTitle: { fontSize: 11, fontWeight: '700', color: C.text, marginTop: 1 },
  alertSubtitle: { fontSize: 10, color: C.textMid, lineHeight: 13, marginTop: 1 },

  // Table
  tableHeader: {
    backgroundColor: C.bg, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 8, marginBottom: 4,
  },
  tableHeaderText: { fontSize: 9, fontWeight: '700', color: C.textLight, letterSpacing: 0.5 },
  tableRow: {
    paddingVertical: 10, paddingHorizontal: 8, borderRadius: 6, marginBottom: 2,
  },
  tableCell: { fontSize: 11, color: C.textMid },
  tableCellBold: { fontSize: 11, fontWeight: '700', color: C.text },
  tableCellSub: { fontSize: 10, color: C.textLight, marginTop: 1 },

  // Progress bar
  progressBarBg: { height: 5, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden', marginTop: 2, flex: 1 },
  progressBarFill: { height: 5, borderRadius: 3 },

  // Branch icon
  branchIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  // Legend
  legendText: { fontSize: 10, color: C.textLight, marginLeft: 3 },

  // Big percent circle
  bigPercentCircle: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 6, borderColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  bigPercentText: { fontSize: 18, fontWeight: '900', color: C.primary },

  // Buttons
  primaryBtn: {
    backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7,
  },
  primaryBtnText: { color: C.white, fontSize: 11, fontWeight: '700' },

  // FAB
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    ...C.cardShadow, shadowOpacity: 0.2, shadowRadius: 12,
  },

  // Syllabus progress circle (fake)
  progressCircle: (pct, color) => ({
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 5, borderColor: color,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.white,
  }),

  // Dot
  legendDot: (color) => ({
    width: 8, height: 8, borderRadius: 4, backgroundColor: color,
  }),
});