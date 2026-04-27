import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import DefaultersList from '../DefaultersList/DefaultersList';
import ReceiptsList from "../ReceiptsList/ReceiptsList";
import TotalCollection from "../TotalCollection/TotalCollection";
import PendingFeesList from "../PendingFeesList/PendingFeesList";
import MonthlyExpensesList from "../MonthlyExpensesList/MonthlyExpensesList";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_TABLET = SCREEN_WIDTH >= 768;
const SIDEBAR_WIDTH = 220;

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#F5F7FA",
  sidebar: "#1B2559",
  sidebarActive: "#2D3A6B",
  sidebarAccent: "#4F8EF7",
  white: "#FFFFFF",
  blue: "#1E5EFF",
  blueLight: "#EEF3FF",
  green: "#22C55E",
  greenLight: "#DCFCE7",
  red: "#EF4444",
  redLight: "#FEE2E2",
  orange: "#F97316",
  orangeLight: "#FFF0E6",
  purple: "#8B5CF6",
  purpleLight: "#EDE9FE",
  text: "#1A202C",
  textSec: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#E5E9F0",
  card: "#FFFFFF",
  chartBlue: "#3B82F6",
  chartLightBlue: "#BAD7F5",
};

// ─── SIDEBAR MENU ─────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { icon: "◉", label: "Dashboard", key: "dashboard" },
  { icon: "💳", label: "Payments", key: "payments" },
  { icon: "📊", label: "Analytics", key: "analytics" },
  { icon: "👤", label: "Students", key: "students" },
  { icon: "⚙️", label: "Settings", key: "settings" },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const STATS = [
  { label: "TOTAL COLLECTION", value: "₹4,28,500", sub: "+18% this yr", icon: "💰", color: C.blue, bg: C.blueLight },
  { label: "PENDING FEES", value: "₹52,140", sub: "104 Students outstanding", icon: "⏳", color: C.orange, bg: C.orangeLight },
  { label: "MONTH'S EXPENSES", value: "₹85,400", sub: "9% over budget", icon: "📉", color: C.red, bg: C.redLight },
];

const CHART_DATA = [
  { month: "APR", revenue: 60, expense: 40 },
  { month: "MAY", revenue: 75, expense: 50 },
  { month: "JUN", revenue: 55, expense: 35 },
  { month: "JUL", revenue: 90, expense: 60 },
  { month: "AUG", revenue: 85, expense: 55 },
  { month: "SEP", revenue: 70, expense: 45 },
];

const DEFAULTERS = [
  { id: "S/01", name: "Varun Mehta", class: "Grade 8-D", amount: "₹41,000", status: "Overdue", reminder: "Today, 10:00 AM", statusColor: C.red },
  { id: "S/14", name: "Sara Khan", class: "Grade 11-A", amount: "₹15,500", status: "Pending", reminder: "Sent Oct 1st", statusColor: C.orange },
];

const PAYMENTS = [
  { name: "Ishaan Gupta", amount: "₹3,200", status: "Paid" },
  { name: "Riya Patel", amount: "₹1,800", status: "Paid" },
];

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
function BarChart() {
  const maxVal = 100;
  const chartH = 90;
  return (
    <View style={styles.chartArea}>
      <View style={styles.chartBars}>
        {CHART_DATA.map((d, i) => (
          <View key={i} style={styles.barGroup}>
            <View style={styles.barsRow}>
              <View style={[styles.bar, { height: (d.revenue / maxVal) * chartH, backgroundColor: C.chartBlue }]} />
              <View style={[styles.bar, { height: (d.expense / maxVal) * chartH, backgroundColor: C.chartLightBlue }]} />
            </View>
            <Text style={styles.barLabel}>{d.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
function DonutChart({ percent = 82 }) {
  return (
    <View style={styles.donutWrap}>
      <View style={styles.donutOuter}>
        <View style={styles.donutInner}>
          <Text style={styles.donutPct}>{percent}%</Text>
        </View>
      </View>
    </View>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ item, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  return (
    <TouchableOpacity
      onPressIn={onIn}
      onPressOut={onOut}
      onPress={onPress}
      activeOpacity={1}
    >
      <Animated.View style={[styles.statCard, { transform: [{ scale }] }]}>
        <View style={[styles.statIconBox, { backgroundColor: item.bg }]}>
          <Text style={styles.statIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.statLabel}>{item.label}</Text>
        <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
        <Text style={styles.statSub}>{item.sub}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FinanceWorkflow({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [reportModal, setReportModal] = useState(false);
  const [autoModal, setAutoModal] = useState(false);
  const [reminderModal, setReminderModal] = useState(false);
  const [allReceiptsModal, setAllReceiptsModal] = useState(false);
  const [selectedDefaulter, setSelectedDefaulter] = useState(null);

  const btn = (label, onPress, color = C.blue, text = C.white, small = false) => (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: color }, small && styles.btnSm]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Text style={[styles.btnText, { color: text }, small && styles.btnSmText]}>{label}</Text>
    </TouchableOpacity>
  );

  // ─── MODALS ──────────────────────────────────────────────────────────────────
  const SimpleModal = ({ visible, title, body, onClose }) => (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalBody}>{body}</Text>
          {btn("Close", onClose, C.blue, C.white)}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Show different pages based on currentPage state */}
      {currentPage === "defaulters" && (
        <DefaultersList onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "receipts" && (
        <ReceiptsList onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "total-collection" && (
        <TotalCollection onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "pending-fees" && (
        <PendingFeesList onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "monthly-expenses" && (
        <MonthlyExpensesList onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "dashboard" && (
        <>
      {/* Modals */}
      <SimpleModal visible={reportModal} title="Export Reports" body="Choose export format: PDF, Excel, or CSV. Reports will include all transactions for the current financial year." onClose={() => setReportModal(false)} />
      <SimpleModal visible={autoModal} title="Run Automations" body="Automation will send fee reminders, generate finance reports, and flag overdue accounts. Proceed?" onClose={() => setAutoModal(false)} />
      <SimpleModal visible={reminderModal} title="Send Bulk SMS/Email" body="Reminder messages will be sent to all 104 students with outstanding fees." onClose={() => setReminderModal(false)} />
      <SimpleModal visible={allReceiptsModal} title="All Receipts" body="Ishaan Gupta – ₹3,200 ✅\nRiya Patel – ₹1,800 ✅\nAmit Roy – ₹2,500 ✅\nPreeti Nair – ₹4,100 ✅" onClose={() => setAllReceiptsModal(false)} />
      <SimpleModal
        visible={!!selectedDefaulter}
        title={selectedDefaulter ? `Remove ${selectedDefaulter.name}?` : ""}
        body="This will archive the student's defaulter record and pause auto-reminders."
        onClose={() => setSelectedDefaulter(null)}
      />

      <View style={styles.layout}>
        {/* Main Content */}
        <View style={styles.main}>
         
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            {/* STAT CARDS */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
              {STATS.map((s, i) => {
                return (
                  <StatCard
                    key={i}
                    item={s}
                    onPress={() => {
                      if (i === 0) {
                        setCurrentPage("total-collection");
                        return;
                      }
                      if (i === 1) {
                        setCurrentPage("pending-fees");
                        return;
                      }
                      setCurrentPage("monthly-expenses");
                    }}
                  />
                );
              })}
            </ScrollView>

            {/* ANALYTICS + COLLECTION */}
            <View style={styles.row}>
              {/* Chart Card */}
              <View style={[styles.card, { flex: IS_TABLET ? 1.6 : undefined, width: IS_TABLET ? undefined : SCREEN_WIDTH - 48 }]}>
                <Text style={styles.cardTitle}>Monthly Payment Analytics</Text>
                <Text style={styles.cardSub}>Revenue vs Expenses trend for FY 23-24</Text>
                <View style={styles.legendRow}>
                  <View style={styles.legendDot} />
                  <Text style={styles.legendText}>Revenue</Text>
                  <View style={[styles.legendDot, { backgroundColor: C.chartLightBlue }]} />
                  <Text style={styles.legendText}>Expenses</Text>
                </View>
                <BarChart />
              </View>

              {/* Collection + Expense */}
              <View style={{ flex: IS_TABLET ? 1 : undefined, gap: 12 }}>
                <View style={[styles.card, { minWidth: IS_TABLET ? undefined : SCREEN_WIDTH - 48 }]}>
                  <Text style={styles.cardTitle}>Collection Ratio</Text>
                  <DonutChart percent={82} />
                  <View style={styles.collectionStats}>
                    <View style={styles.collStatRow}>
                      <View style={[styles.dot, { backgroundColor: C.blue }]} />
                      <Text style={styles.collStatLabel}>Paid</Text>
                      <Text style={styles.collStatVal}>₹3.5M</Text>
                    </View>
                    <View style={styles.collStatRow}>
                      <View style={[styles.dot, { backgroundColor: C.red }]} />
                      <Text style={styles.collStatLabel}>Pending</Text>
                      <Text style={styles.collStatVal}>₹0.5M</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* DEFAULTER LIST */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.alertIcon}>⚠️</Text>
                    <Text style={styles.sectionTitle}>Defaulter List & Automated Reminders</Text>
                  </View>
                  <Text style={styles.cardSub}>Track payments with next scheduled reminders</Text>
                </View>
                {btn("✉ Send Bulk SMS/Email", () => setCurrentPage("defaulters"), C.redLight, C.red, true)}
              </View>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                {["STUDENT", "CLASS", "DUE AMOUNT", "STATUS", "AUTO REMINDER", "ACTION"].map((h, i) => (
                  <Text key={i} style={[styles.tableHead, i === 0 && { flex: 1.4 }]}>{h}</Text>
                ))}
              </View>

              {DEFAULTERS.map((d, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 0 && { backgroundColor: "#FAFBFF" }]}>
                  <View style={{ flex: 1.4 }}>
                    <Text style={styles.studentId}>{d.id}</Text>
                    <Text style={styles.studentName}>{d.name}</Text>
                  </View>
                  <Text style={styles.tableCell}>{d.class}</Text>
                  <Text style={[styles.tableCell, { fontWeight: "700" }]}>{d.amount}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: d.statusColor + "22" }]}>
                    <Text style={[styles.statusText, { color: d.statusColor }]}>{d.status}</Text>
                  </View>
                  <Text style={[styles.tableCell, { color: C.blue, fontSize: 11 }]}>{d.reminder}</Text>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnSm, { backgroundColor: C.blueLight }]}
                    onPress={() => setSelectedDefaulter(d)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.btnSmText, { color: C.blue }]}>Remove Now</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* VERIFIED PAYMENTS */}
            <View style={styles.row}>
              <View style={[styles.card, { flex: IS_TABLET ? 1 : undefined, width: IS_TABLET ? undefined : SCREEN_WIDTH - 48 }]}>
                <Text style={styles.sectionTitle}>Verified Payments</Text>
                {PAYMENTS.map((p, i) => (
                  <View key={i} style={styles.paymentRow}>
                    <View style={styles.payAvatar}>
                      <Text style={styles.payAvatarText}>{p.name[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentName}>{p.name}</Text>
                      <Text style={styles.payAmount}>{p.amount}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: C.greenLight }]}>
                      <Text style={[styles.statusText, { color: C.green }]}>Paid</Text>
                    </View>
                  </View>
                ))}
                {btn("View All Receipts", () => setCurrentPage("receipts"), C.blueLight, C.blue)}
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                if (typeof onLogout === 'function') {
                  onLogout();
                } else {
                  Alert.alert('Logout', 'Logout action is not configured.');
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
        </>
      )}
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  layout: { flex: 1 },

  // Main
  main: { flex: 1, overflow: "hidden" },
  header: {
    flexDirection: IS_TABLET ? "row" : "column",
    alignItems: IS_TABLET ? "center" : "flex-start",
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: C.white,
    borderBottomWidth: 1, borderBottomColor: C.border,
    gap: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  hamburger: { padding: 4 },
  hamburgerText: { fontSize: 24, color: C.text },
  headerTitleBox: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: C.text, letterSpacing: 0.3 },
  headerSub: { fontSize: 12, color: C.textSec, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 10, flexWrap: "wrap" },

  // Content
  content: { padding: 16, gap: 16 },
  row: { flexDirection: IS_TABLET ? "row" : "column", gap: 14 },

  // Stats
  statsRow: { flexGrow: 0 },
  statCard: {
    backgroundColor: C.card, borderRadius: 14, padding: 16,
    marginRight: 12, width: IS_TABLET ? 180 : 160,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: C.border,
  },
  statIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  statIcon: { fontSize: 18 },
  statLabel: { fontSize: 10, color: C.textMuted, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  statValue: { fontSize: 22, fontWeight: "800", marginTop: 4 },
  statSub: { fontSize: 11, color: C.textSec, marginTop: 3 },

  // Card
  card: {
    backgroundColor: C.card, borderRadius: 14, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: C.border,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: C.text },
  cardSub: { fontSize: 11, color: C.textSec, marginTop: 2, marginBottom: 8 },

  detailModalBox: { maxHeight: '86%' },
  detailList: { width: '100%', marginVertical: 10 },
  detailItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  detailItemHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  detailName: { fontSize: 14, fontWeight: '700', color: C.text, flex: 1 },
  detailAmount: { fontSize: 14, fontWeight: '800' },
  detailMeta: { fontSize: 12, color: C.textMuted, marginTop: 4 },
  detailNote: { fontSize: 12, color: C.textSec, marginTop: 6, lineHeight: 18 },

  // Chart
  chartArea: { marginTop: 8 },
  chartBars: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 110, paddingTop: 10 },
  barGroup: { alignItems: "center", flex: 1 },
  barsRow: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  bar: { width: IS_TABLET ? 14 : 10, borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 9, color: C.textMuted, marginTop: 4 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 3, backgroundColor: C.chartBlue },
  legendText: { fontSize: 11, color: C.textSec },

  // Donut
  donutWrap: { alignItems: "center", paddingVertical: 12 },
  donutOuter: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 14, borderColor: C.blue,
    alignItems: "center", justifyContent: "center",
    borderTopColor: C.red,
  },
  donutInner: { alignItems: "center" },
  donutPct: { fontSize: 22, fontWeight: "800", color: C.text },
  collectionStats: { gap: 8, marginTop: 8 },
  collStatRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  collStatLabel: { fontSize: 12, color: C.textSec, flex: 1 },
  collStatVal: { fontSize: 13, fontWeight: "700", color: C.text },

  // Expense
  expenseRow: { marginBottom: 10 },
  expenseLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  expenseLabel: { fontSize: 12, color: C.text, fontWeight: "600" },
  expenseVal: { fontSize: 12, color: C.text, fontWeight: "700" },
  progressBg: { height: 7, backgroundColor: C.border, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },

  // Section
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  alertIcon: { fontSize: 15 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: C.text },

  // Table
  tableHeader: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 4 },
  tableHead: { flex: 1, fontSize: 10, color: C.textMuted, fontWeight: "700", letterSpacing: 0.3, textTransform: "uppercase" },
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderRadius: 8, paddingHorizontal: 4, gap: 4 },
  tableCell: { flex: 1, fontSize: 12, color: C.text },
  studentId: { fontSize: 10, color: C.textMuted, fontWeight: "600" },
  studentName: { fontSize: 13, fontWeight: "600", color: C.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: "center" },
  statusText: { fontSize: 11, fontWeight: "700" },

  // Buttons
  btn: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  btnText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.2 },
  btnSm: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, shadowOpacity: 0, elevation: 0 },
  btnSmText: { fontSize: 11, fontWeight: "700" },
  linkText: { fontSize: 13, fontWeight: "600" },

  // Payments
  paymentRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  payAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.blueLight, alignItems: "center", justifyContent: "center" },
  payAvatarText: { fontSize: 16, fontWeight: "700", color: C.blue },
  payAmount: { fontSize: 12, color: C.textSec, marginTop: 2 },

  // Logout
  logoutBtn: {
    marginTop: 8,
    backgroundColor: C.red,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});