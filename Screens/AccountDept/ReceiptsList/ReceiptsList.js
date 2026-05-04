import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const C = {
  bg: '#F5F7FA',
  white: '#FFFFFF',
  blue: '#1E5EFF',
  blueLight: '#EEF3FF',
  green: '#22C55E',
  greenLight: '#DCFCE7',
  text: '#1A202C',
  textSec: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E9F0',
  card: '#FFFFFF',
};

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#1E5EFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DownloadIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5m0 0l5-5M12 15V3" stroke="#1E5EFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RECEIPTS = [
  { id: 'RCP/001', name: 'Ishaan Gupta', date: '2024-10-20', amount: '₹3,200', status: 'Paid', method: 'Online Transfer', refNo: 'TXN12345678' },
  { id: 'RCP/002', name: 'Riya Patel', date: '2024-10-19', amount: '₹1,800', status: 'Paid', method: 'Credit Card', refNo: 'CC98765432' },
  { id: 'RCP/003', name: 'Amit Roy', date: '2024-10-18', amount: '₹2,500', status: 'Paid', method: 'Check', refNo: 'CHK555666' },
  { id: 'RCP/004', name: 'Preeti Nair', date: '2024-10-17', amount: '₹4,100', status: 'Paid', method: 'Online Transfer', refNo: 'TXN87654321' },
  { id: 'RCP/005', name: 'Raj Kumar', date: '2024-10-16', amount: '₹2,800', status: 'Paid', method: 'Debit Card', refNo: 'DBC11223344' },
  { id: 'RCP/006', name: 'Anjali Singh', date: '2024-10-15', amount: '₹3,500', status: 'Paid', method: 'Online Transfer', refNo: 'TXN44332211' },
  { id: 'RCP/007', name: 'Vivek Sharma', date: '2024-10-14', amount: '₹2,200', status: 'Paid', method: 'Check', refNo: 'CHK777888' },
  { id: 'RCP/008', name: 'Neha Verma', date: '2024-10-13', amount: '₹3,900', status: 'Paid', method: 'Online Transfer', refNo: 'TXN99887766' },
];

export default function ReceiptsList({ onBack }) {
  const downloadReceipt = (receipt) => {
    Alert.alert(
      'Receipt Downloaded',
      `Receipt ${receipt.id} for ${receipt.name}\nAmount: ${receipt.amount}\nReference: ${receipt.refNo}`
    );
  };

  const ReceiptItem = ({ item }) => (
    <View style={styles.receiptCard}>
      <View style={styles.receiptHeader}>
        <View>
          <Text style={styles.receiptId}>{item.id}</Text>
          <Text style={styles.receiptName}>{item.name}</Text>
        </View>
        <Text style={styles.receiptAmount}>{item.amount}</Text>
      </View>

      <View style={styles.receiptDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Method:</Text>
          <Text style={styles.detailValue}>{item.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ref No:</Text>
          <Text style={styles.detailValue}>{item.refNo}</Text>
        </View>
      </View>

      <View style={styles.receiptFooter}>
        <View style={[styles.statusBadge, { backgroundColor: C.greenLight }]}>
          <Text style={[styles.statusText, { color: C.green }]}>✓ {item.status}</Text>
        </View>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => downloadReceipt(item)}
          activeOpacity={0.7}
        >
          <DownloadIcon />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalAmount = RECEIPTS.reduce((sum, r) => {
    const amount = parseInt(r.amount.replace(/[₹,]/g, ''));
    return sum + amount;
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>All Receipts</Text>
          <Text style={styles.headerSub}>{RECEIPTS.length} verified payments</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Total Collection</Text>
          <Text style={styles.summaryAmount}>₹{(totalAmount / 100000).toFixed(1)}K</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View>
          <Text style={styles.summaryLabel}>Receipts Count</Text>
          <Text style={styles.summaryAmount}>{RECEIPTS.length}</Text>
        </View>
      </View>

      <FlatList
        data={RECEIPTS}
        renderItem={({ item }) => <ReceiptItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  backBtn: { padding: 8 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  headerSub: { fontSize: 12, color: C.textSec, marginTop: 2 },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: C.white,
    marginHorizontal: 12,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: { fontSize: 12, color: C.textMuted, fontWeight: '600' },
  summaryAmount: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 4 },
  summaryDivider: { width: 1, height: 50, backgroundColor: C.border },

  listContent: { padding: 12, paddingBottom: 20 },
  receiptCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  receiptId: { fontSize: 11, color: C.textMuted, fontWeight: '600' },
  receiptName: { fontSize: 14, fontWeight: '700', color: C.text, marginTop: 2 },
  receiptAmount: { fontSize: 16, fontWeight: '800', color: C.blue },

  receiptDetails: { gap: 6, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 12, color: C.textSec, fontWeight: '600' },
  detailValue: { fontSize: 12, color: C.text, fontWeight: '500' },

  receiptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  downloadBtn: {
    flexDirection: 'row',
    backgroundColor: C.blueLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  downloadText: { color: C.blue, fontWeight: '600', fontSize: 12 },
});
