/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          ACADEMY FINANCE — ALL-IN-ONE App.js                ║
 * ║  Works with: Expo (iOS · Android · Web via react-native-web)║
 * ║                                                              ║
 * ║  SCREENS                                                     ║
 * ║   1. MainDashboard      — KPIs, P&L, Branch table           ║
 * ║   2. TrajectoryScreen   — Forecast, Risk, Director summary  ║
 * ║   3. RevenueScreen      — Monthly trends, Settlements       ║
 * ║   4. ExpenditureScreen  — Budget utilization, Transactions  ║
 * ║                                                              ║
 * ║  NAVIGATION                                                  ║
 * ║   Main → inner screens via TouchableOpacity module cards    ║
 * ║   Inner → Main via ← back button                           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Setup:
 *   npm install expo react react-native react-native-web react-dom @expo/webpack-config
 *   npx expo start --web   (browser)
 *   npx expo start --ios   (simulator)
 *   npx expo start --android
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// 1. DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:              '#F4F6FB',
  card:            '#FFFFFF',
  primary:         '#1A56DB',
  primaryLight:    '#DBEAFE',
  accent:          '#F59E0B',
  danger:          '#EF4444',
  success:         '#10B981',
  text:            '#111827',
  sub:             '#6B7280',
  border:          '#E5E7EB',
  blue2:           '#3B82F6',
  navy:            '#1E3A5F',
  navyLight:       '#2D4E7E',
  outperform:      '#D1FAE5',
  outperformText:  '#065F46',
  stable:          '#F3F4F6',
  stableText:      '#374151',
  purple:          '#7C3AED',
  purpleLight:     '#EDE9FE',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// 2. SHARED PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** White card with subtle shadow */
const Card = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[sh.card, sh.touchableCard, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[sh.card, style]}>{children}</View>;
};

/** Section heading + optional subtitle */
const SectionHeader = ({ title, subtitle }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={sh.sectionTitle}>{title}</Text>
    {!!subtitle && <Text style={sh.sectionSub}>{subtitle}</Text>}
  </View>
);

/** KPI metric tile — used in horizontal scroll rows */
const KPICard = ({ label, value, sub, subColor, icon, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[sh.kpiCard, sh.touchableCard]}>
    <Text style={sh.kpiLabel}>{label}</Text>
    <Text style={sh.kpiValue}>{value}</Text>
    {!!sub && (
      <Text style={[sh.kpiSub, { color: subColor ?? C.success }]}>{sub}</Text>
    )}
  </TouchableOpacity>
);

/** Colored pill / badge */
const Badge = ({ label, bg, color, style }) => (
  <View style={[sh.badge, { backgroundColor: bg }, style]}>
    <Text style={{ fontSize: 9, fontWeight: '800', color, letterSpacing: 0.3 }}>
      {label}
    </Text>
  </View>
);

/** Thin horizontal progress bar */
const ProgressBar = ({ pct, color = C.primary, height = 6 }) => (
  <View style={{ height, backgroundColor: C.border, borderRadius: height / 2, overflow: 'hidden' }}>
    <View
      style={{
        width: `${Math.min(pct, 100)}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: height / 2,
      }}
    />
  </View>
);

/** Simple bar chart — no third-party dependency */
const BarChart = ({ data, maxVal, height = 90 }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height }}>
    {data.map((d, i) => (
      <View key={i} style={{ flex: 1, alignItems: 'center', gap: 3 }}>
        <View
          style={{
            width: '100%',
            height: Math.max(4, ((d.val / maxVal) * (height - 18))),
            borderRadius: 4,
            backgroundColor: d.highlight ? C.primary : C.primaryLight,
          }}
        />
        <Text style={{ fontSize: 8, color: C.sub }}>{d.label}</Text>
      </View>
    ))}
  </View>
);

/**
 * Donut chart approximation — built from nested Views with border tricks.
 * No SVG or canvas needed; works on iOS, Android, and Web.
 */
const DonutChart = ({ centerLabel, centerSub, segments = [], size = 110 }) => {
  const bw = size * 0.13; // border (ring) width
  const r  = size / 2;
  // We stack 3 coloured quarter-arc overlays to fake a pie ring
  const overlayAngles = [160, 250, 320];
  const overlayColors = segments.map((s) => s.color);

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Ring */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: r,
          borderWidth: bw,
          borderColor: C.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Accent arc */}
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: r,
            borderWidth: bw,
            borderColor: 'transparent',
            borderTopColor: overlayColors[1] ?? C.accent,
            borderRightColor: overlayColors[1] ?? C.accent,
            transform: [{ rotate: `${overlayAngles[0]}deg` }],
          }}
        />
        {/* Third arc */}
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: r,
            borderWidth: bw,
            borderColor: 'transparent',
            borderTopColor: overlayColors[2] ?? '#E5E7EB',
            transform: [{ rotate: `${overlayAngles[1]}deg` }],
          }}
        />
        {/* Centre label */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '900', fontSize: 13, color: C.text }}>
            {centerLabel}
          </Text>
          {!!centerSub && (
            <Text style={{ fontSize: 8, color: C.sub, marginTop: 1 }}>{centerSub}</Text>
          )}
        </View>
      </View>

      {/* Legend */}
      <View style={{ marginTop: 10, gap: 5, width: '100%' }}>
        {segments.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: s.color }} />
            <Text style={{ fontSize: 11, color: C.sub, flex: 1 }}>{s.label}</Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.text }}>{s.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/** Coloured left-border alert / risk row */
const AlertRow = ({ emoji, title, desc, bg, borderColor, style }) => (
  <View
    style={[
      {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: bg,
        borderLeftWidth: 3,
        borderLeftColor: borderColor,
        borderRadius: 10,
        padding: 12,
      },
      style,
    ]}
  >
    <Text style={{ fontSize: 18, marginTop: 1 }}>{emoji}</Text>
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={{ fontWeight: '700', fontSize: 13, color: C.text }}>{title}</Text>
      <Text style={{ fontSize: 11, color: C.sub, marginTop: 3, lineHeight: 16 }}>{desc}</Text>
    </View>
  </View>
);

const DETAIL_PAGES = {
  netProfit: {
    title: 'Net Profit',
    subtitle: 'Net profit overview with drivers and branch context.',
    summary: [
      { label: 'Net Profit', value: '$1,420,800' },
      { label: 'Growth', value: '+12.4%' },
      { label: 'Health', value: 'Strong' },
    ],
    listTitle: 'Profit Drivers',
    items: [
      'Tuition collections are the primary contributor to net profit.',
      'Operating cost control is keeping margins stable.',
      'East Valley Heights is currently the best-performing branch.',
    ],
  },
  totalRevenue: {
    title: 'Total Revenue',
    subtitle: 'Revenue collections and income sources across the fiscal year.',
    summary: [
      { label: 'Total Revenue', value: '$4,850,200' },
      { label: 'Growth', value: '+8.1%' },
      { label: 'Collection Rate', value: '94.2%' },
    ],
    listTitle: 'Revenue List',
    items: [
      'Tuition fees remain the largest source of income.',
      'Ancillary revenue continues to support cash flow.',
      'Monthly collections are tracking above the prior term.',
    ],
  },
  operatingExpenses: {
    title: 'Operating Expenses',
    subtitle: 'Expense control and spending pressure review.',
    summary: [
      { label: 'Operating Expenses', value: '$3,429,400' },
      { label: 'Increase', value: '+4.2%' },
      { label: 'Status', value: 'Monitor' },
    ],
    listTitle: 'Expense List',
    items: [
      'Payroll remains the highest cost category.',
      'Infrastructure and maintenance are rising this quarter.',
      'Expense allocation should be reviewed branch by branch.',
    ],
  },
  pendingCollections: {
    title: 'Pending Collections',
    subtitle: 'Outstanding balances and overdue collection follow-up.',
    summary: [
      { label: 'Pending Collections', value: '$215,600' },
      { label: 'Overdue Cases', value: '18' },
      { label: 'Priority', value: 'High' },
    ],
    listTitle: 'Pending List',
    items: [
      '18 accounts are flagged for overdue follow-up.',
      'Late payment reminders should be sent today.',
      'Collection recovery is required for all aged balances.',
    ],
  },
  profitLoss: {
    title: 'Profit & Loss Performance',
    subtitle: 'Scrollable P&L trend view for income vs expenses.',
    summary: [
      { label: 'Income', value: '$4.85M' },
      { label: 'Expenses', value: '$3.43M' },
      { label: 'Net', value: '$1.42M' },
    ],
    listTitle: 'P&L Notes',
    items: [
      'Income trend is stronger than the previous fiscal period.',
      'Expenses are rising but remain within management range.',
      'Scroll further for branch-by-branch impact views.',
    ],
  },
  expenseAllocation: {
    title: 'Expense Allocation',
    subtitle: 'Quarterly breakdown of spending categories.',
    summary: [
      { label: 'Staff Salaries', value: '60%' },
      { label: 'Infrastructure', value: '25%' },
      { label: 'Academic Materials', value: '15%' },
    ],
    listTitle: 'Allocation Breakdown',
    items: [
      'Staff salaries represent the largest share of spend.',
      'Infrastructure allocation remains under quarterly watch.',
      'Academic materials are stable and predictable.',
    ],
  },
  branchRevenueComparison: {
    title: 'Branch Revenue Comparison',
    subtitle: 'Detailed branch-by-branch revenue performance.',
    summary: [
      { label: 'Branches', value: '3' },
      { label: 'Top Margin', value: '38.9%' },
      { label: 'Status', value: 'Comparative' },
    ],
    listTitle: 'Branch List',
    items: [
      'Central Academy – Metropolis: highest tuition base.',
      'Southside Regional – Harbor View: stable operating margin.',
      'East Valley Heights – Foothills: best margin performance.',
    ],
  },
  trajectory: {
    title: 'Financial Trajectory',
    subtitle: 'Long-term projection and risk outlook.',
    summary: [
      { label: 'Projected Revenue', value: '$12.48M' },
      { label: 'EBITDA Margin', value: '22.4%' },
      { label: 'Liquidity', value: '$3.15M' },
    ],
    listTitle: 'Trajectory Notes',
    items: [
      'Forecast indicates stable compounding growth.',
      'Margin improvement is the priority for next quarter.',
      'Liquidity remains at a healthy level for operations.',
    ],
  },
  revenue: {
    title: 'Revenue Analytics',
    subtitle: 'Income sources, collections, and ledger activity.',
    summary: [
      { label: 'Annual Revenue', value: '$4.82M' },
      { label: 'Collection Rate', value: '94.2%' },
      { label: 'Pending Tuition', value: '$284.1K' },
    ],
    listTitle: 'Revenue Activity',
    items: [
      'Tuition remains the dominant source of revenue.',
      'Monthly trends show a strong recovery pattern.',
      'High-value settlements are available below.',
    ],
  },
  expenditure: {
    title: 'Expenditure Overview',
    subtitle: 'Annual spending, utilization, and audit-ready records.',
    summary: [
      { label: 'Annual Expenditure', value: '$2.48M' },
      { label: 'Change', value: '+1.2%' },
      { label: 'Audit', value: 'Ready' },
    ],
    listTitle: 'Expenditure Notes',
    items: [
      'Salaries account for the largest expense line.',
      'Infrastructure spend is slightly above forecast.',
      'Historical ledger records remain available.',
    ],
  },
  branches: {
    title: 'All Branches',
    subtitle: 'Extended branch list with revenue and margin context.',
    summary: [
      { label: 'Branches', value: '12' },
      { label: 'Top Tier', value: 'Tier 1' },
      { label: 'Coverage', value: 'All Campuses' },
    ],
    listTitle: 'Branch List',
    items: [
      'Central Academy – Metropolis',
      'Southside Regional – Harbor View',
      'East Valley Heights – Foothills',
      'North Campus Annex',
      'West District Preparatory',
    ],
  },
  transactions: {
    title: 'All Transactions',
    subtitle: 'Scrollable transaction ledger for revenue receipts.',
    summary: [
      { label: 'Transactions', value: '3' },
      { label: 'Verified', value: '3' },
      { label: 'Amount', value: '$33.1K' },
    ],
    listTitle: 'Transaction List',
    items: [
      'TXN-90283 · James Anderson · $12,450.00',
      'TXN-90244 · Sophia Martinez · $8,200.00',
      'TXN-90198 · Liam Nguyen · $12,450.00',
    ],
  },
  historicalLedger: {
    title: 'Historical Ledger',
    subtitle: 'Archived high-value records for audit review.',
    summary: [
      { label: 'Ledger Records', value: '3' },
      { label: 'Audit Status', value: 'Ready' },
      { label: 'Threshold', value: '$5K+' },
    ],
    listTitle: 'Ledger List',
    items: [
      'Recent high-value settlements are captured here.',
      'Ledger items are ready for export or review.',
      'Use this page for scrollable history inspection.',
    ],
  },
};

const DetailPage = ({ page, onBack, children }) => (
  <ScrollView style={sh.screen} showsVerticalScrollIndicator={false}>
    <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={sh.backBtn}>
      <Text style={sh.backBtnText}>‹ Back</Text>
    </TouchableOpacity>
    <Card style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 10, color: C.sub, fontWeight: '800', letterSpacing: 0.8 }}>ACADEMY FINANCE</Text>
      <Text style={{ fontSize: 24, fontWeight: '900', color: C.text, marginTop: 4 }}>{page.title}</Text>
      <Text style={{ fontSize: 12, color: C.sub, marginTop: 3, lineHeight: 17 }}>{page.subtitle}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
        {page.summary.map((item) => (
          <View key={item.label} style={sh.detailTile}>
            <Text style={sh.detailTileLabel}>{item.label}</Text>
            <Text style={sh.detailTileValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </Card>
    {children}
    <Card style={{ marginBottom: 24 }}>
      <Text style={sh.sectionTitle}>{page.listTitle || 'Details'}</Text>
      <View style={{ marginTop: 10, gap: 10 }}>
        {page.items.map((item, index) => (
          <View key={`${page.title}-${index}`} style={sh.detailRow}>
            <View style={sh.detailDot} />
            <Text style={sh.detailText}>{item}</Text>
          </View>
        ))}
      </View>
    </Card>
  </ScrollView>
);

/** Shared top header bar (back button optional) */
const HeaderBar = ({ title, subtitle, onBack, rightSlot }) => (
  <View style={sh.headerBar}>
    {onBack && (
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={{ fontSize: 26, color: C.primary, lineHeight: 30 }}>‹</Text>
      </TouchableOpacity>
    )}
    <View style={{ flex: 1 }}>
      <Text style={sh.appTitle}>{title}</Text>
      {!!subtitle && <Text style={sh.appSub}>{subtitle}</Text>}
    </View>
    {rightSlot}
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. SCREEN 1 — MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const MainDashboard = ({ onNavigate }) => {
  const kpis = [
    { label: 'NET PROFIT',          value: '$1,420,800', sub: '+12.4% vs Last Term' },
    { label: 'TOTAL REVENUE',       value: '$4,850,200', sub: '+8.1% vs Last Term' },
    { label: 'OPERATING EXPENSES',  value: '$3,429,400', sub: '+4.2% Cost Increase',       subColor: C.danger },
    { label: 'PENDING COLLECTIONS', value: '$215,600',   sub: '18 Pending · Overdue alerts', subColor: C.accent },
  ];

  const months      = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const incomeData  = [40,50,45,60,55,70,65,75,80,70,85,90];
  const expenseData = [35,40,38,50,45,55,52,60,65,58,70,72];

  const branches = [
    {
      name: 'Central Academy – Metropolis',
      tier: 'Tier 1 Urban Campus',
      tuition: '$2,450,000',
      ancillary: '$420,000',
      margin: '32.4%',
      status: 'OUTPERFORMING',
      dot: C.primary,
    },
    {
      name: 'Southside Regional – Harbor View',
      tier: 'Tier 2 Residential Campus',
      tuition: '$1,120,500',
      ancillary: '$115,000',
      margin: '24.1%',
      status: 'STABLE',
      dot: C.sub,
    },
    {
      name: 'East Valley Heights – Foothills',
      tier: 'Tier 1 Elite Private',
      tuition: '$1,279,700',
      ancillary: '$310,000',
      margin: '38.9%',
      status: 'OUTPERFORMING',
      dot: C.primary,
    },
  ];

  const modules = [
    { label: 'Financial\nTrajectory',  icon: '📈', screen: 'trajectory', bg: '#EEF2FF' },
    { label: 'Revenue\nAnalytics',     icon: '💰', screen: 'revenue',    bg: '#ECFDF5' },
    { label: 'Expenditure\nOverview',  icon: '📊', screen: 'expenditure',bg: '#FEF3C7' },
  ];

  return (
    <ScrollView style={sh.screen} showsVerticalScrollIndicator={false}>
      {/* ── KPI Row ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {kpis.map((k, i) => (
          <KPICard
            key={i}
            {...k}
            onPress={() => onNavigate(
              k.label === 'NET PROFIT' ? 'netProfit'
                : k.label === 'TOTAL REVENUE' ? 'totalRevenue'
                : k.label === 'OPERATING EXPENSES' ? 'operatingExpenses'
                : 'pendingCollections'
            )}
          />
        ))}
      </ScrollView>

      {/* ── P&L + Expense Allocation ── */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        {/* P&L chart */}
        <Card style={{ flex: 2 }} onPress={() => onNavigate('profitLoss')}>
          <SectionHeader
            title="Profit & Loss Performance"
            subtitle="Fiscal Year: Income vs Expenses"
          />
          <View style={{ height: 80, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
            {months.map((m, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 1 }}>
                <View style={{ width: 4, height: (incomeData[i]  / 100) * 65, backgroundColor: C.primary,      borderRadius: 2 }} />
                <View style={{ width: 4, height: (expenseData[i] / 100) * 65, backgroundColor: C.primaryLight, borderRadius: 2 }} />
                <Text style={{ fontSize: 6, color: C.sub }}>{m}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
            {[['Income', C.primary], ['Expenses', C.primaryLight]].map(([l, c]) => (
              <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
                <Text style={{ fontSize: 10, color: C.sub }}>{l}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Expense donut */}
        <Card style={{ flex: 1.3 }} onPress={() => onNavigate('expenseAllocation')}>
          <SectionHeader title="Expense Allocation" subtitle="Quarterly Breakdown" />
          <DonutChart
            centerLabel="$3.4M"
            centerSub="TOTAL OPS"
            size={100}
            segments={[
              { color: C.primary, label: 'Staff Salaries',     pct: 60 },
              { color: C.blue2,   label: 'Infrastructure',      pct: 25 },
              { color: C.accent,  label: 'Academic Materials',  pct: 15 },
            ]}
          />
        </Card>
      </View>

      {/* ── Branch Revenue Comparison ── */}
      <Card style={{ marginBottom: 16 }} onPress={() => onNavigate('branchRevenueComparison')}>
        <SectionHeader
          title="Branch Revenue Comparison"
          subtitle="Performance metrics across major campuses"
        />

        {/* Table header */}
        <View style={[sh.tableRow, { borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 8, marginBottom: 2 }]}>
          {['CAMPUS', 'TUITION', 'ANCILLARY', 'MARGIN', 'STATUS'].map((h, i) => (
            <Text key={h} style={[sh.tableHead, i === 0 && { flex: 2 }]}>{h}</Text>
          ))}
        </View>

        {branches.map((b, i) => (
          <View key={i} style={[sh.tableRow, { paddingVertical: 12 }]}>
            <View style={{ flex: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: b.dot }} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.text, flex: 1 }} numberOfLines={2}>
                  {b.name}
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: C.sub, marginTop: 2, marginLeft: 14 }}>{b.tier}</Text>
            </View>
            <Text style={sh.tableCell}>{b.tuition}</Text>
            <Text style={sh.tableCell}>{b.ancillary}</Text>
            <Text style={[sh.tableCell, { color: C.primary, fontWeight: '700' }]}>{b.margin}</Text>
            <Badge
              label={b.status}
              bg={b.status === 'OUTPERFORMING' ? C.outperform : C.stable}
              color={b.status === 'OUTPERFORMING' ? C.outperformText : C.stableText}
            />
          </View>
        ))}

        <TouchableOpacity style={sh.viewAllBtn} onPress={() => onNavigate('branches')} activeOpacity={0.8}>
          <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>VIEW ALL 12 BRANCHES</Text>
        </TouchableOpacity>
      </Card>

      {/* ── Module Navigation Cards ── */}
      <Text style={[sh.sectionTitle, { marginBottom: 12 }]}>Financial Modules</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 36 }}>
        {modules.map((m) => (
          <TouchableOpacity
            key={m.screen}
            style={[sh.moduleCard, { backgroundColor: m.bg }]}
            onPress={() => onNavigate(m.screen)}
            activeOpacity={0.72}
          >
            <Text style={{ fontSize: 30 }}>{m.icon}</Text>
            <Text style={{ marginTop: 8, fontWeight: '800', fontSize: 13, color: C.text }}>
              {m.label}
            </Text>
            <Text style={{ fontSize: 11, color: C.sub, marginTop: 3 }}>Tap to open →</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. SCREEN 2 — FINANCIAL TRAJECTORY
// ─────────────────────────────────────────────────────────────────────────────
const TrajectoryScreen = ({ onBack }) => {
  const kpis = [
    { label: 'PROJECTED ANNUAL REVENUE', value: '$12,482,000', sub: '+8.4% vs LY' },
    { label: 'EBITDA MARGIN',            value: '22.4%',       sub: 'Target: 24.0%',   subColor: C.danger },
    { label: 'OPERATIONAL LIQUIDITY',   value: '$3,150,000',  sub: '✓ Optimal Health' },
    { label: 'DEBT-TO-EQUITY RATIO',     value: '0.34',        sub: 'Low Leverage' },
  ];

  const barData = [
    { label: 'MAY', val: 55 },
    { label: 'JUN', val: 62 },
    { label: 'JUL', val: 58 },
    { label: 'AUG', val: 74 },
    { label: 'SEP', val: 85, highlight: true },
    { label: 'OCT', val: 92, highlight: true },
  ];

  const margins = [
    { label: 'North Campus',    pct: 28.4, color: C.primary },
    { label: 'South Academy',   pct: 24.1, color: C.blue2 },
    { label: 'East Preparatory',pct: 16.8, color: C.accent },
  ];

  const risks = [
    {
      emoji: '⚠️',
      title: 'Salary Inflation Exposure',
      desc: 'Forecasted 5.2% increase in staff costs may compress margins in Q3.',
      bg: '#FEF2F2',
      borderColor: C.danger,
    },
    {
      emoji: '🛡️',
      title: 'Tuition Collection Velocity',
      desc: 'Days Sales Outstanding (DSO) reduced by 12 days since last audit.',
      bg: '#EFF6FF',
      borderColor: C.primary,
    },
    {
      emoji: '🔧',
      title: 'Maintenance Reserve',
      desc: 'Infrastructure aging at East Preparatory requires a $1.2M allocation.',
      bg: '#FFFBEB',
      borderColor: C.accent,
    },
  ];

  return (
    <ScrollView style={sh.screen} showsVerticalScrollIndicator={false}>
      <HeaderBar title="Financial Trajectory" subtitle="Long-term Projections · 2024" onBack={onBack} />

      {/* KPIs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {kpis.map((k, i) => <KPICard key={i} {...k} />)}
      </ScrollView>

      {/* Long-term chart */}
      <Card style={{ marginBottom: 16 }}>
        <SectionHeader
          title="Long-term Financial Trajectory"
          subtitle="Past 2 Years Revenue Actuals & 1-Year Forecast"
        />
        <BarChart data={barData} maxVal={100} height={100} />
        <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
          {[['Actuals', C.primary], ['Forecast', C.accent]].map(([l, c]) => (
            <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
              <Text style={{ fontSize: 10, color: C.sub }}>{l}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* CAPEX + Margin analysis */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <Card style={{ flex: 1 }}>
          <Text style={sh.sectionTitle}>CAPEX UTILIZATION</Text>
          <Text style={{ fontSize: 34, fontWeight: '900', color: C.primary, marginVertical: 8 }}>
            62%
          </Text>
          <ProgressBar pct={62} />
          <Text style={{ fontSize: 11, color: C.sub, marginTop: 8 }}>
            Optimal reinvestment for next fiscal year
          </Text>
        </Card>

        <Card style={{ flex: 1.5 }}>
          <Text style={sh.sectionTitle}>MARGIN ANALYSIS BY BRANCH</Text>
          <View style={{ gap: 12, marginTop: 10 }}>
            {margins.map((m, i) => (
              <View key={i}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: C.text }}>{m.label}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: m.color }}>{m.pct}%</Text>
                </View>
                <ProgressBar pct={m.pct * 3.2} color={m.color} />
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Risk assessment */}
      <Card style={{ marginBottom: 16 }}>
        <SectionHeader title="Executive Risk Assessment" />
        <View style={{ gap: 10 }}>
          {risks.map((r, i) => <AlertRow key={i} {...r} />)}
        </View>
      </Card>

      {/* Director's Summary */}
      <Card style={{ backgroundColor: C.navy, marginBottom: 36 }}>
        <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFFFFF', marginBottom: 10 }}>
          Director's Strategic Summary
        </Text>
        <Text style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 20 }}>
          The current 3-year trajectory indicates a healthy compounding growth of 6.2% CAGR.
          While operational expenses remain stable, we recommend focusing on East Preparatory's
          margin improvement to align with group standards of 20%+.
        </Text>
        <Badge
          label="⭐  AAA+ Institutional Credit Rating"
          bg="#FCD34D"
          color="#78350F"
          style={{ alignSelf: 'flex-start', marginTop: 14, paddingHorizontal: 12, paddingVertical: 6 }}
        />
      </Card>
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SCREEN 3 — REVENUE ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────
const RevenueScreen = ({ onBack }) => {
  const kpis = [
    { label: 'TOTAL ANNUAL REVENUE',    value: '$4,822,500', sub: '+12.4% vs LY' },
    { label: 'COLLECTION RATE',         value: '94.2%',      sub: '✓ On Track' },
    { label: 'PENDING TUITION',         value: '$284,100',   sub: 'Due in 15 days', subColor: C.accent },
    { label: 'AVG REVENUE / STUDENT',   value: '$8,450',     sub: 'Target: $8,200' },
  ];

  const barData = [
    { label: 'SEPT', val: 68 },
    { label: 'OCT',  val: 52 },
    { label: 'NOV',  val: 72 },
    { label: 'DEC',  val: 44 },
    { label: 'JAN',  val: 78, highlight: true },
    { label: 'FEB',  val: 84, highlight: true },
  ];

  const transactions = [
    {
      id: 'TXN-90283',
      name: 'James Anderson',
      cat: 'ANNUAL TUITION',
      catBg: C.primaryLight,
      catColor: C.primary,
      date: 'Oct 12, 2023',
      method: 'Bank Transfer',
      amount: '$12,450.00',
    },
    {
      id: 'TXN-90244',
      name: 'Sophia Martinez',
      cat: 'QUARTERLY FEE',
      catBg: '#F3E8FF',
      catColor: C.purple,
      date: 'Oct 11, 2023',
      method: 'Cheque',
      amount: '$8,200.00',
    },
    {
      id: 'TXN-90198',
      name: 'Liam Nguyen',
      cat: 'ANNUAL TUITION',
      catBg: C.primaryLight,
      catColor: C.primary,
      date: 'Oct 10, 2023',
      method: 'Bank Transfer',
      amount: '$12,450.00',
    },
  ];

  return (
    <ScrollView style={sh.screen} showsVerticalScrollIndicator={false}>
      <HeaderBar title="Revenue Analytics" subtitle="Collections & Income Breakdown" onBack={onBack} />

      {/* KPIs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {kpis.map((k, i) => <KPICard key={i} {...k} />)}
      </ScrollView>

      {/* Monthly trends + Source distribution */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <Card style={{ flex: 1.6 }}>
          <SectionHeader title="Monthly Revenue Trends" subtitle="Comparative analysis across fiscal year quarters" />
          <BarChart data={barData} maxVal={100} height={100} />
        </Card>

        <Card style={{ flex: 1.2 }}>
          <SectionHeader title="Source Distribution" subtitle="By income category" />
          <DonutChart
            centerLabel="100%"
            centerSub="ALLOCATED"
            size={95}
            segments={[
              { color: C.primary,  label: 'Tuition Fees', pct: 75 },
              { color: C.accent,   label: 'Transport',    pct: 15 },
              { color: C.purple,   label: 'Lab & Misc',   pct: 10 },
            ]}
          />
        </Card>
      </View>

      {/* High-value settlements table */}
      <Card style={{ marginBottom: 36 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <SectionHeader title="Recent High-Value Settlements" subtitle="" />
          <TouchableOpacity onPress={() => setScreen('transactions')}>
            <Text style={{ color: C.primary, fontSize: 12, fontWeight: '700' }}>Download Ledger ↓</Text>
          </TouchableOpacity>
        </View>

        {/* Table head */}
        <View style={[sh.tableRow, { borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 8 }]}>
          {['TXN ID', 'STUDENT', 'CATEGORY', 'DATE', 'METHOD', 'AMOUNT'].map((h, i) => (
            <Text key={h} style={[sh.tableHead, (i === 1) && { flex: 1.5 }]}>{h}</Text>
          ))}
        </View>

        {transactions.map((t, i) => (
          <View key={i} style={[sh.tableRow, { paddingVertical: 11 }]}>
            <Text style={[sh.tableCell, { fontSize: 10, color: C.sub }]}>{t.id}</Text>
            <Text style={[sh.tableCell, { flex: 1.5, fontWeight: '700', fontSize: 12 }]}>{t.name}</Text>
            <Badge label={t.cat} bg={t.catBg} color={t.catColor} style={{ flex: 1 }} />
            <Text style={[sh.tableCell, { fontSize: 10 }]}>{t.date}</Text>
            <Text style={[sh.tableCell, { fontSize: 10 }]}>{t.method}</Text>
            <Text style={[sh.tableCell, { color: C.primary, fontWeight: '800', fontSize: 12 }]}>{t.amount}</Text>
          </View>
        ))}

        <TouchableOpacity style={sh.viewAllBtn} onPress={() => setScreen('transactions')} activeOpacity={0.8}>
          <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>VIEW ALL TRANSACTIONS</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. SCREEN 4 — EXPENDITURE OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
const ExpenditureScreen = ({ onBack }) => {
  const depts = [
    { label: 'Academics & Research',        pct: 82, color: C.primary },
    { label: 'Facilities & Campus Security', pct: 64, color: C.blue2 },
    { label: 'Information Technology',       pct: 91, color: C.danger },
    { label: 'Administration & HR',          pct: 45, color: C.success },
  ];

  const barData = [
    { label: 'MAY', val: 48 },
    { label: 'JUN', val: 58 },
    { label: 'JUL', val: 54 },
    { label: 'AUG', val: 72 },
    { label: 'SEP', val: 84, highlight: true },
    { label: 'OCT', val: 93, highlight: true },
  ];

  const txns = [
    {
      id: 'TXN-94822-A',
      cat: 'STAFFING',
      catBg: '#E0F2FE',
      catColor: '#0369A1',
      desc: 'Monthly Faculty Payroll (Q3)',
      date: 'Oct 01, 2023',
      beneficiary: 'Direct Deposit / Personnel',
      amount: '$124,500.00',
    },
    {
      id: 'TXN-88304-B',
      cat: 'INFRASTRUCTURE',
      catBg: '#FEF3C7',
      catColor: '#92400E',
      desc: 'Science Lab HVAC Retrofit',
      date: 'Sep 24, 2023',
      beneficiary: 'AeroSystems Industrial',
      amount: '$42,380.00',
    },
    {
      id: 'TXN-44219-C',
      cat: 'IT SERVICES',
      catBg: C.purpleLight,
      catColor: C.purple,
      desc: 'Fiber Optic Infrastructure Upgrade',
      date: 'Sep 15, 2023',
      beneficiary: 'NetGrid Connect Corp',
      amount: '$18,900.00',
    },
    {
      id: 'TXN-13002-K',
      cat: 'MATERIALS',
      catBg: '#ECFDF5',
      catColor: '#065F46',
      desc: 'Annual Textbook Procurement',
      date: 'Sep 08, 2023',
      beneficiary: 'Academic Press Global',
      amount: '$64,000.00',
    },
  ];

  const insights = [
    { icon: '🏗️', title: 'Planned Capital Outlay',  desc: 'Expansion phase for West Wing scheduled for Q1 next year. Estimated $305k.' },
    { icon: '🔬', title: 'Lab Supply Inventory',     desc: 'Inventory audit completed. Procurement cycle optimized for 8% cost savings.' },
    { icon: '👥', title: 'Personnel Optimization',   desc: 'Staff efficiency reports indicate optimal allocation of teaching resources.' },
  ];

  return (
    <ScrollView style={sh.screen} showsVerticalScrollIndicator={false}>
      <HeaderBar title="Expenditure Overview" subtitle="Annual Spending Breakdown · 2023" onBack={onBack} />

      {/* Dark summary banner */}
      <Card style={{ backgroundColor: C.navy, marginBottom: 16 }}>
        <Text style={{ fontSize: 10, color: '#94A3B8', letterSpacing: 1, marginBottom: 4 }}>
          ANNUAL EXPENDITURE OVERVIEW
        </Text>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#FFFFFF' }}>$2,481,200.00</Text>
        <Text style={{ color: C.success, fontSize: 12, marginTop: 4 }}>+1.2% vs Last Year</Text>

        <View style={{ flexDirection: 'row', gap: 24, marginTop: 14 }}>
          {[['SALARIES', '$1.6M'], ['MATERIALS', '$420k'], ['INFRASTRUCTURE', '$381k']].map(([l, v]) => (
            <View key={l}>
              <Text style={{ color: '#94A3B8', fontSize: 9, letterSpacing: 0.5 }}>{l}</Text>
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 15, marginTop: 2 }}>{v}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Budget utilization + Audit + Trend */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        {/* Budget utilization */}
        <Card style={{ flex: 1.6 }}>
          <SectionHeader title="Budget Utilization per Department" />
          <View style={{ gap: 12 }}>
            {depts.map((d, i) => (
              <View key={i}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 11, color: C.text, flex: 1 }} numberOfLines={1}>{d.label}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: d.color }}>{d.pct}%</Text>
                </View>
                <ProgressBar pct={d.pct} color={d.color} />
              </View>
            ))}
          </View>
        </Card>

        {/* Right column: Audit + Monthly Trend */}
        <View style={{ flex: 1, gap: 12 }}>
          <Card style={{ backgroundColor: '#F0FDF4' }}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: C.success }}>✓ AUDIT READY</Text>
            <Text style={{ fontSize: 11, color: C.text, marginTop: 6, lineHeight: 16 }}>
              Last compliance sweep Oct 14, 2023.{'\n'}No discrepancies found.
            </Text>
            <TouchableOpacity
              style={[sh.badge, { backgroundColor: C.success, marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6 }]}
              activeOpacity={0.8}
              onPress={() => setScreen('historicalLedger')}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>VIEW CERTIFICATE</Text>
            </TouchableOpacity>
          </Card>

          <Card>
            <Text style={sh.sectionTitle}>MONTHLY TREND</Text>
            <Text style={{ fontSize: 9, color: C.sub, marginBottom: 6 }}>LAST 6 MONTHS</Text>
            <BarChart data={barData} maxVal={100} height={70} />
          </Card>
        </View>
      </View>

      {/* Infrastructure Alert */}
      <AlertRow
        emoji="⚠️"
        title="Infrastructure Alert"
        desc="Facility repairs exceeded projected budget by 14% this quarter."
        bg="#FEF3C7"
        borderColor={C.accent}
        style={{ marginBottom: 16 }}
      />

      {/* Expenditure transactions table */}
      <Card style={{ marginBottom: 16 }}>
        <SectionHeader
          title="Recent Significant Expenditures"
          subtitle="Audit-ready records exceeding $5,000.00 threshold"
        />

        <View style={[sh.tableRow, { borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 8 }]}>
          {['TXN ID', 'CATEGORY', 'DESCRIPTION', 'DATE', 'BENEFICIARY', 'AMOUNT'].map((h, i) => (
            <Text key={h} style={[sh.tableHead, [2, 4].includes(i) && { flex: 1.5 }]}>{h}</Text>
          ))}
        </View>

        {txns.map((t, i) => (
          <View key={i} style={[sh.tableRow, { paddingVertical: 10 }]}>
            <Text style={[sh.tableCell, { fontSize: 9, color: C.sub }]}>{t.id}</Text>
            <Badge label={t.cat} bg={t.catBg} color={t.catColor} style={{ flex: 1 }} />
            <Text style={[sh.tableCell, { flex: 1.5, fontSize: 11 }]} numberOfLines={2}>{t.desc}</Text>
            <Text style={[sh.tableCell, { fontSize: 10 }]}>{t.date}</Text>
            <Text style={[sh.tableCell, { flex: 1.5, fontSize: 10 }]} numberOfLines={2}>{t.beneficiary}</Text>
            <Text style={[sh.tableCell, { color: C.danger, fontWeight: '800', fontSize: 11 }]}>{t.amount}</Text>
          </View>
        ))}
 onPress={() => setScreen('historicalLedger')} activeOpacity={0.8}
        <TouchableOpacity style={sh.viewAllBtn}>
          <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>
            VIEW ALL HISTORICAL LEDGER RECORDS
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Bottom insight tiles */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 40 }}>
        {insights.map((item, i) => (
          <Card key={i} style={{ flex: 1 }}>
            <Text style={{ fontSize: 24 }}>{item.icon}</Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: C.text, marginTop: 8 }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 10, color: C.sub, marginTop: 4, lineHeight: 14 }}>
              {item.desc}
            </Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. ROOT APP — navigation state machine
// ─────────────────────────────────────────────────────────────────────────────
export default function Finance() {
  const [screen, setScreen] = useState('main');

  const goTo = (nextScreen) => setScreen(nextScreen);
  const goBack = () => setScreen('main');

  const renderScreen = () => {
    if (screen === 'main') return <MainDashboard onNavigate={goTo} />;
    if (screen === 'trajectory') return <TrajectoryScreen onBack={goBack} />;
    if (screen === 'revenue') return <RevenueScreen onBack={goBack} />;
    if (screen === 'expenditure') return <ExpenditureScreen onBack={goBack} />;
    if (screen === 'netProfit') return <DetailPage page={DETAIL_PAGES.netProfit} onBack={goBack} />;
    if (screen === 'totalRevenue') return <DetailPage page={DETAIL_PAGES.totalRevenue} onBack={goBack} />;
    if (screen === 'operatingExpenses') return <DetailPage page={DETAIL_PAGES.operatingExpenses} onBack={goBack} />;
    if (screen === 'pendingCollections') return <DetailPage page={DETAIL_PAGES.pendingCollections} onBack={goBack} />;
    if (screen === 'profitLoss') {
      return (
        <DetailPage page={DETAIL_PAGES.profitLoss} onBack={goBack}>
          <Card style={{ marginBottom: 16 }}>
            <SectionHeader title="Profit & Loss Performance" subtitle="Fiscal Year: Income vs Expenses" />
            <View style={{ height: 80, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
              {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 1 }}>
                  <View style={{ width: 4, height: [40,50,45,60,55,70,65,75,80,70,85,90][i] * 0.65, backgroundColor: C.primary, borderRadius: 2 }} />
                  <View style={{ width: 4, height: [35,40,38,50,45,55,52,60,65,58,70,72][i] * 0.65, backgroundColor: C.primaryLight, borderRadius: 2 }} />
                  <Text style={{ fontSize: 6, color: C.sub }}>{m}</Text>
                </View>
              ))}
            </View>
          </Card>
        </DetailPage>
      );
    }
    if (screen === 'expenseAllocation') {
      return (
        <DetailPage page={DETAIL_PAGES.expenseAllocation} onBack={goBack}>
          <Card style={{ marginBottom: 16 }}>
            <SectionHeader title="Expense Allocation" subtitle="Quarterly Breakdown" />
            <DonutChart
              centerLabel="$3.4M"
              centerSub="TOTAL OPS"
              size={120}
              segments={[
                { color: C.primary, label: 'Staff Salaries', pct: 60 },
                { color: C.blue2, label: 'Infrastructure', pct: 25 },
                { color: C.accent, label: 'Academic Materials', pct: 15 },
              ]}
            />
          </Card>
        </DetailPage>
      );
    }
    if (screen === 'branchRevenueComparison') return <DetailPage page={DETAIL_PAGES.branchRevenueComparison} onBack={goBack} />;
    if (screen === 'branches') return <DetailPage page={DETAIL_PAGES.branches} onBack={goBack} />;
    if (screen === 'transactions') return <DetailPage page={DETAIL_PAGES.transactions} onBack={goBack} />;
    if (screen === 'historicalLedger') return <DetailPage page={DETAIL_PAGES.historicalLedger} onBack={goBack} />;
    return <MainDashboard onNavigate={goTo} />;
  };

  return (
    <SafeAreaView style={sh.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.bg}
        translucent={false}
      />
      {renderScreen()}
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. STYLESHEET  (all in one place at the bottom)
// ─────────────────────────────────────────────────────────────────────────────
const sh = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 10,
  },

  // ── Header bar ──────────────────────────────────────────────────────────
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.3,
  },
  appSub: {
    fontSize: 11,
    color: C.sub,
    marginTop: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── KPI card ─────────────────────────────────────────────────────────────
  kpiCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    minWidth: 155,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    }),
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: C.sub,
    letterSpacing: 0.6,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    marginTop: 5,
  },
  kpiSub: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },

  // ── White card ───────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 7, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
    }),
  },

  // ── Typography ────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: C.text,
    letterSpacing: 0.2,
  },
  sectionSub: {
    fontSize: 11,
    color: C.sub,
    marginTop: 2,
  },

  // ── Table ─────────────────────────────────────────────────────────────────
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  tableHead: {
    flex: 1,
    fontSize: 9,
    fontWeight: '800',
    color: C.sub,
    letterSpacing: 0.4,
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: C.text,
  },

  // ── Badge / pill ──────────────────────────────────────────────────────────
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── CTA row ───────────────────────────────────────────────────────────────
  viewAllBtn: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 2,
  },

  // ── Module nav card ───────────────────────────────────────────────────────
  moduleCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 110,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
      android: { elevation: 1 },
      web:     { boxShadow: '0 1px 5px rgba(0,0,0,0.05)' },
    }),
  },
});