import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Platform,
  Alert,
  FlatList,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

// ─── Data ────────────────────────────────────────────────────────────────────

const FEE_STRUCTURE_BY_CLASS = [
  {
    className: 'Grade 6',
    tuition: 5000,
    labResources: 900,
    extracurricular: 500,
    total: 6400,
  },
  {
    className: 'Grade 7',
    tuition: 5500,
    labResources: 1000,
    extracurricular: 550,
    total: 7050,
  },
  {
    className: 'Grade 8',
    tuition: 6000,
    labResources: 1100,
    extracurricular: 600,
    total: 7700,
  },
  {
    className: 'Grade 9',
    tuition: 6500,
    labResources: 1200,
    extracurricular: 650,
    total: 8350,
  },
  {
    className: 'Grade 10',
    tuition: 7000,
    labResources: 1300,
    extracurricular: 700,
    total: 9000,
  },
  {
    className: 'Grade 11 (Science)',
    tuition: 8000,
    labResources: 1600,
    extracurricular: 750,
    total: 10350,
  },
  {
    className: 'Grade 12 (Commerce)',
    tuition: 7500,
    labResources: 1400,
    extracurricular: 750,
    total: 9650,
  },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
  { id: 'emi', label: 'EMI / Installments', icon: '📅' },
];

const TRANSACTIONS = [
  {
    id: '1',
    date: 'Sep 12, 2023',
    txnId: '#TXN-882910',
    description: 'Annual Sports Membership',
    amount: '$250.00',
    status: 'SUCCESS',
  },
  {
    id: '2',
    date: 'Aug 15, 2023',
    txnId: '#TXN-882755',
    description: 'Term 1 Tuition Fee',
    amount: '$1,800.00',
    status: 'SUCCESS',
  },
  {
    id: '3',
    date: 'Aug 02, 2023',
    txnId: '#TXN-882612',
    description: 'Library Registration',
    amount: '$45.00',
    status: 'SUCCESS',
  },
  {
    id: '4',
    date: 'Jul 28, 2023',
    txnId: '#TXN-882500',
    description: 'Uniform & Kit (Junior)',
    amount: '$320.00',
    status: 'REFUNDED',
  },
  {
    id: '5',
    date: 'Oct 02, 2023',
    txnId: '#TXN-883102',
    description: 'Excursion Fee (National Museum)',
    amount: '$85.00',
    status: 'PENDING',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const colors = {
    SUCCESS: { bg: '#e8f5e9', text: '#2e7d32' },
    REFUNDED: { bg: '#e3f2fd', text: '#1565c0' },
    PENDING: { bg: '#f3f3f3', text: '#757575' },
  };
  const c = colors[status] || colors.PENDING;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{status}</Text>
    </View>
  );
};

// ─── Fee Structure Modal ──────────────────────────────────────────────────────

const FeeStructureModal = ({ visible, onClose }) => {
  const [expandedClass, setExpandedClass] = useState(null);
  const animRefs = useRef({});

  const toggleClass = (className) => {
    if (!animRefs.current[className]) {
      animRefs.current[className] = new Animated.Value(0);
    }
    const isExpanding = expandedClass !== className;
    if (expandedClass && expandedClass !== className) {
      if (!animRefs.current[expandedClass]) {
        animRefs.current[expandedClass] = new Animated.Value(1);
      }
      Animated.timing(animRefs.current[expandedClass], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    setExpandedClass(isExpanding ? className : null);
    Animated.timing(animRefs.current[className], {
      toValue: isExpanding ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Fee Structure 2023–24</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {FEE_STRUCTURE_BY_CLASS.map((cls) => {
              if (!animRefs.current[cls.className]) {
                animRefs.current[cls.className] = new Animated.Value(0);
              }
              const anim = animRefs.current[cls.className];
              const isOpen = expandedClass === cls.className;

              const maxHeight = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 160],
              });
              const rotate = anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              });

              return (
                <View key={cls.className} style={styles.classCard}>
                  <TouchableOpacity
                    style={styles.classHeader}
                    onPress={() => toggleClass(cls.className)}
                    activeOpacity={0.75}
                  >
                    <View>
                      <Text style={styles.className}>{cls.className}</Text>
                      <Text style={styles.classTotal}>Total: ${cls.total.toLocaleString()}</Text>
                    </View>
                    <Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>
                      ▾
                    </Animated.Text>
                  </TouchableOpacity>
                  <Animated.View style={{ maxHeight, overflow: 'hidden' }}>
                    <View style={styles.feeDetails}>
                      {[
                        { label: 'Tuition Fees', value: cls.tuition },
                        { label: 'Lab & Resources', value: cls.labResources },
                        { label: 'Extracurricular', value: cls.extracurricular },
                      ].map((item) => (
                        <View key={item.label} style={styles.feeRow}>
                          <Text style={styles.feeLabel}>{item.label}</Text>
                          <Text style={styles.feeValue}>${item.value.toLocaleString()}</Text>
                        </View>
                      ))}
                      <View style={[styles.feeRow, styles.feeTotalRow]}>
                        <Text style={styles.feeTotalLabel}>Annual Total</Text>
                        <Text style={styles.feeTotalValue}>${cls.total.toLocaleString()}</Text>
                      </View>
                    </View>
                  </Animated.View>
                </View>
              );
            })}
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ─── Pay Fees Modal ───────────────────────────────────────────────────────────

const PayFeesModal = ({ visible, onClose, amount }) => {
  const [selected, setSelected] = useState(null);

  const handlePay = () => {
    if (!selected) {
      Alert.alert('Select Payment Method', 'Please choose a payment method to proceed.');
      return;
    }
    Alert.alert(
      'Payment Initiated',
      `Proceeding to pay ${amount} via ${PAYMENT_METHODS.find((m) => m.id === selected)?.label}.`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pay Pending Fees</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.payAmountBox}>
            <Text style={styles.payAmountLabel}>Amount Due</Text>
            <Text style={styles.payAmountValue}>{amount}</Text>
            <Text style={styles.payDueDate}>Due: Oct 15, 2023</Text>
          </View>

          <Text style={styles.sectionSubtitle}>Select Payment Method</Text>

          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.payMethodCard,
                selected === method.id && styles.payMethodCardSelected,
              ]}
              onPress={() => setSelected(method.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.payMethodIcon}>{method.icon}</Text>
              <Text style={styles.payMethodLabel}>{method.label}</Text>
              {selected === method.id && (
                <View style={styles.selectedDot} />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.payNowBtn} onPress={handlePay} activeOpacity={0.85}>
            <Text style={styles.payNowBtnText}>Pay {amount} Now</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </View>
      </View>
    </Modal>
  );
};

// ─── Receipt Download ─────────────────────────────────────────────────────────

const downloadReceipt = (txn) => {
  Alert.alert(
    'Receipt Downloaded',
    `Receipt for ${txn.description} (${txn.txnId}) has been saved as PDF.`,
    [{ text: 'OK' }]
  );
};

// ─── Transaction Row ──────────────────────────────────────────────────────────

const TransactionRow = ({ item }) => (
  <View style={styles.txnRow}>
    <View style={styles.txnLeft}>
      <Text style={styles.txnDate}>{item.date}</Text>
      <Text style={styles.txnId}>{item.txnId}</Text>
      <Text style={styles.txnDesc}>{item.description}</Text>
    </View>
    <View style={styles.txnRight}>
      <Text style={styles.txnAmount}>{item.amount}</Text>
      <StatusBadge status={item.status} />
      {item.status !== 'PENDING' && (
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => downloadReceipt(item)}
          activeOpacity={0.75}
        >
          <Text style={styles.downloadBtnText}>⬇ Receipt</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function Fees() {
  const [feeStructureVisible, setFeeStructureVisible] = useState(false);
  const [payFeesVisible, setPayFeesVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const feeComponents = [
    { label: 'Tuition Fees', pct: 75, color: '#1a56db' },
    { label: 'Lab & Resources', pct: 15, color: '#e57c13' },
    { label: 'Extracurricular', pct: 8, color: '#0ea5e9' },
  ];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarLabel}>FINANCE MANAGEMENT</Text>
        <Text style={styles.topBarYear}>Academic Year 2023–24</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + Fee Structure button */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Financial Overview</Text>
            <Text style={styles.pageSubtitle}>
              Manage and track your ward's educational investment.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.feeStructureBtn}
            onPress={() => setFeeStructureVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.feeStructureBtnIcon}>🏫</Text>
            <Text style={styles.feeStructureBtnText}>Fee Structure</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { flex: 1 }]}>
            <Text style={styles.summaryLabel}>TOTAL FEES</Text>
            <Text style={styles.summaryValue}>$12,500.00</Text>
            <Text style={styles.summaryNote}>Annual commitment</Text>
          </View>
          <View style={[styles.summaryCard, { flex: 1 }]}>
            <Text style={[styles.summaryLabel, { color: '#16a34a' }]}>TOTAL PAID</Text>
            <Text style={[styles.summaryValue, { color: '#16a34a' }]}>$10,050.00</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
          </View>
        </View>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { flex: 1 }]}>
            <Text style={styles.summaryLabel}>UPCOMING DUE</Text>
            <Text style={styles.summaryValue}>$1,800.00</Text>
            <Text style={styles.summaryNote}>Due: Oct 15, 2023</Text>
          </View>
          {/* Pending Fees – highlighted */}
          <View style={[styles.summaryCard, styles.pendingCard, { flex: 1 }]}>
            <Text style={[styles.summaryLabel, { color: '#1a56db' }]}>PENDING FEES</Text>
            <Text style={[styles.summaryValue, { color: '#1a56db' }]}>$2,450.00</Text>
            <TouchableOpacity
              style={styles.payPendingBtn}
              onPress={() => setPayFeesVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.payPendingBtnText}>💳  PAY PENDING FEES</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fee Components */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FEE COMPONENTS</Text>
          {feeComponents.map((item) => (
            <View key={item.label} style={styles.feeComponentRow}>
              <View style={styles.feeComponentLabelRow}>
                <Text style={styles.feeComponentLabel}>{item.label}</Text>
                <Text style={styles.feeComponentPct}>{item.pct}%</Text>
              </View>
              <View style={styles.feeComponentTrack}>
                <View
                  style={[
                    styles.feeComponentFill,
                    { width: `${item.pct}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.viewScheduleBtn}
            onPress={() => setFeeStructureVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.viewScheduleBtnText}>VIEW FULL SCHEDULE</Text>
          </TouchableOpacity>

          {/* Saved Card */}
          <View style={styles.savedCardBox}>
            <Text style={styles.savedCardLabel}>SAVED CARDS</Text>
            <View style={styles.savedCardRow}>
              <View style={styles.cardChip}>
                <View style={styles.chipDot} />
                <View style={[styles.chipDot, { backgroundColor: '#f59e0b' }]} />
              </View>
              <Text style={styles.savedCardNumber}>•••• 4421</Text>
            </View>
          </View>
        </View>

        {/* Payment History */}
        <View style={styles.card}>
          <View style={styles.payHistoryHeader}>
            <Text style={styles.cardTitle}>Payment History</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.filterIcon}>⋮</Text>
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            {['DATE', 'TXN ID', 'DESCRIPTION', 'AMOUNT', 'STATUS'].map((h) => (
              <Text key={h} style={[styles.tableHeaderCell, h === 'AMOUNT' && { textAlign: 'right' }]}>
                {h}
              </Text>
            ))}
          </View>

          {TRANSACTIONS.map((item) => (
            <TransactionRow key={item.id} item={item} />
          ))}

          {/* Pagination */}
          <View style={styles.pagination}>
            <Text style={styles.paginationInfo}>Showing 5 of 24 transactions</Text>
            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={styles.pageBtn}
                onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                activeOpacity={0.7}
              >
                <Text style={styles.pageBtnText}>‹</Text>
              </TouchableOpacity>
              {[1, 2].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.pageBtn, currentPage === p && styles.pageBtnActive]}
                  onPress={() => setCurrentPage(p)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pageBtnText, currentPage === p && styles.pageBtnTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.pageBtn}
                onPress={() => setCurrentPage(Math.min(2, currentPage + 1))}
                activeOpacity={0.7}
              >
                <Text style={styles.pageBtnText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTitle}>
            Plan for the future with Azure Academy's Flexible Payment Schemes.
          </Text>
          <TouchableOpacity
            style={styles.bannerBtn}
            onPress={() => Alert.alert('Installments', 'Installment plans coming soon!')}
            activeOpacity={0.85}
          >
            <Text style={styles.bannerBtnText}>LEARN ABOUT INSTALLMENTS</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <FeeStructureModal
        visible={feeStructureVisible}
        onClose={() => setFeeStructureVisible(false)}
      />
      <PayFeesModal
        visible={payFeesVisible}
        onClose={() => setPayFeesVisible(false)}
        amount="$2,450.00"
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const BASE = isTablet ? 1.35 : 1;
const s = (n) => Math.round(n * BASE);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: s(20),
    paddingTop: Platform.OS === 'ios' ? 52 : 20,
    paddingBottom: s(14),
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaf0',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  topBarLabel: {
    fontSize: s(11),
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1.2,
  },
  topBarYear: {
    fontSize: s(12),
    color: '#6b7280',
    fontWeight: '500',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: s(16),
    maxWidth: isTablet ? 900 : undefined,
    alignSelf: isTablet ? 'center' : undefined,
    width: isTablet ? '100%' : undefined,
  },

  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: s(16),
    gap: s(12),
  },
  pageTitle: {
    fontSize: s(24),
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: s(13),
    color: '#6b7280',
    marginTop: 4,
  },
  feeStructureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: s(10),
    paddingHorizontal: s(14),
    paddingVertical: s(10),
    borderWidth: 1,
    borderColor: '#c7d7f8',
    gap: s(6),
    marginTop: 4,
  },
  feeStructureBtnIcon: { fontSize: s(15) },
  feeStructureBtnText: {
    fontSize: s(13),
    fontWeight: '600',
    color: '#1a56db',
  },

  // Summary
  summaryGrid: {
    flexDirection: 'row',
    gap: s(12),
    marginBottom: s(12),
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: s(14),
    padding: s(16),
    borderWidth: 1,
    borderColor: '#e8eaf0',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  pendingCard: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d7f8',
  },
  summaryLabel: {
    fontSize: s(10),
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.8,
    marginBottom: s(6),
  },
  summaryValue: {
    fontSize: s(20),
    fontWeight: '800',
    color: '#111827',
    marginBottom: s(4),
  },
  summaryNote: {
    fontSize: s(11),
    color: '#9ca3af',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#d1fae5',
    borderRadius: 10,
    marginTop: s(8),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 10,
  },
  payPendingBtn: {
    backgroundColor: '#1a56db',
    borderRadius: s(8),
    paddingVertical: s(9),
    paddingHorizontal: s(10),
    marginTop: s(10),
    alignItems: 'center',
  },
  payPendingBtnText: {
    color: '#fff',
    fontSize: s(11),
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // Cards
  card: {
    backgroundColor: '#ffffff',
    borderRadius: s(16),
    padding: s(18),
    marginBottom: s(14),
    borderWidth: 1,
    borderColor: '#e8eaf0',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardTitle: {
    fontSize: s(12),
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 1,
    marginBottom: s(14),
  },

  // Fee Components
  feeComponentRow: { marginBottom: s(14) },
  feeComponentLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(5),
  },
  feeComponentLabel: { fontSize: s(13), color: '#374151', fontWeight: '600' },
  feeComponentPct: { fontSize: s(13), color: '#1a56db', fontWeight: '700' },
  feeComponentTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
  },
  feeComponentFill: {
    height: '100%',
    borderRadius: 10,
  },
  viewScheduleBtn: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: s(8),
    paddingVertical: s(10),
    alignItems: 'center',
    marginTop: s(6),
  },
  viewScheduleBtnText: {
    fontSize: s(12),
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
  savedCardBox: {
    backgroundColor: '#fff5eb',
    borderRadius: s(12),
    padding: s(14),
    marginTop: s(16),
    borderWidth: 1,
    borderColor: '#fde8c8',
  },
  savedCardLabel: {
    fontSize: s(10),
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.8,
    marginBottom: s(8),
  },
  savedCardRow: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  cardChip: { flexDirection: 'row', gap: 3 },
  chipDot: {
    width: s(16),
    height: s(16),
    borderRadius: s(8),
    backgroundColor: '#6b7280',
  },
  savedCardNumber: { fontSize: s(14), fontWeight: '600', color: '#374151' },

  // Payment History
  payHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(10),
  },
  filterIcon: { fontSize: s(20), color: '#9ca3af' },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: s(8),
    marginBottom: s(4),
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: s(9),
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.6,
  },

  // Transaction Row
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  txnLeft: { flex: 1.8, gap: s(3) },
  txnRight: { flex: 1.2, alignItems: 'flex-end', gap: s(4) },
  txnDate: { fontSize: s(11), color: '#6b7280', fontWeight: '500' },
  txnId: { fontSize: s(10), color: '#9ca3af' },
  txnDesc: { fontSize: s(12), color: '#111827', fontWeight: '600' },
  txnAmount: { fontSize: s(13), fontWeight: '700', color: '#111827' },
  badge: {
    borderRadius: s(5),
    paddingHorizontal: s(8),
    paddingVertical: s(3),
  },
  badgeText: { fontSize: s(10), fontWeight: '700', letterSpacing: 0.4 },
  downloadBtn: {
    backgroundColor: '#f0f4ff',
    borderRadius: s(6),
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    marginTop: s(2),
    borderWidth: 1,
    borderColor: '#c7d7f8',
  },
  downloadBtnText: { fontSize: s(10), color: '#1a56db', fontWeight: '600' },

  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: s(14),
  },
  paginationInfo: { fontSize: s(11), color: '#9ca3af' },
  paginationControls: { flexDirection: 'row', gap: s(6) },
  pageBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(8),
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageBtnActive: { backgroundColor: '#1a56db' },
  pageBtnText: { fontSize: s(14), color: '#374151', fontWeight: '600' },
  pageBtnTextActive: { color: '#fff' },

  // Banner
  bannerCard: {
    backgroundColor: '#1e2a3a',
    borderRadius: s(16),
    padding: s(24),
    marginBottom: s(4),
    gap: s(14),
  },
  bannerTitle: {
    fontSize: s(17),
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: s(26),
  },
  bannerBtn: {
    backgroundColor: '#ffffff',
    borderRadius: s(10),
    paddingVertical: s(12),
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: s(20),
  },
  bannerBtnText: {
    fontSize: s(12),
    fontWeight: '800',
    color: '#1e2a3a',
    letterSpacing: 0.6,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    paddingHorizontal: s(20),
    paddingTop: s(20),
    maxHeight: '85%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: -4 }, shadowRadius: 12 },
      android: { elevation: 10 },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(16),
  },
  modalTitle: {
    fontSize: s(18),
    fontWeight: '800',
    color: '#111827',
  },
  closeBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { fontSize: s(14), color: '#374151', fontWeight: '700' },

  // Fee Structure Modal
  classCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: s(12),
    marginBottom: s(10),
    overflow: 'hidden',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(14),
    backgroundColor: '#f9fafb',
  },
  className: { fontSize: s(14), fontWeight: '700', color: '#111827' },
  classTotal: { fontSize: s(12), color: '#6b7280', marginTop: 2 },
  chevron: { fontSize: s(18), color: '#1a56db', fontWeight: '700' },
  feeDetails: {
    paddingHorizontal: s(14),
    paddingBottom: s(14),
    paddingTop: s(4),
    gap: s(8),
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(6),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  feeLabel: { fontSize: s(13), color: '#374151' },
  feeValue: { fontSize: s(13), color: '#374151', fontWeight: '600' },
  feeTotalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    marginTop: s(4),
    paddingTop: s(8),
  },
  feeTotalLabel: { fontSize: s(13), fontWeight: '800', color: '#111827' },
  feeTotalValue: { fontSize: s(13), fontWeight: '800', color: '#1a56db' },

  // Pay Fees Modal
  payAmountBox: {
    backgroundColor: '#eef2ff',
    borderRadius: s(14),
    padding: s(18),
    alignItems: 'center',
    marginBottom: s(20),
    borderWidth: 1,
    borderColor: '#c7d7f8',
  },
  payAmountLabel: {
    fontSize: s(11),
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.8,
    marginBottom: s(4),
  },
  payAmountValue: {
    fontSize: s(32),
    fontWeight: '900',
    color: '#1a56db',
  },
  payDueDate: {
    fontSize: s(12),
    color: '#9ca3af',
    marginTop: s(4),
  },
  sectionSubtitle: {
    fontSize: s(13),
    fontWeight: '700',
    color: '#374151',
    marginBottom: s(10),
  },
  payMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: s(12),
    padding: s(14),
    marginBottom: s(10),
    gap: s(12),
    backgroundColor: '#fafafa',
  },
  payMethodCardSelected: {
    borderColor: '#1a56db',
    backgroundColor: '#f0f4ff',
  },
  payMethodIcon: { fontSize: s(22) },
  payMethodLabel: { flex: 1, fontSize: s(14), fontWeight: '600', color: '#111827' },
  selectedDot: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    backgroundColor: '#1a56db',
  },
  payNowBtn: {
    backgroundColor: '#1a56db',
    borderRadius: s(14),
    paddingVertical: s(16),
    alignItems: 'center',
    marginTop: s(8),
  },
  payNowBtnText: {
    color: '#ffffff',
    fontSize: s(16),
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});