import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const C = {
  bg: '#F5F7FA',
  white: '#FFFFFF',
  red: '#EF4444',
  redLight: '#FEE2E2',
  orange: '#F97316',
  orangeLight: '#FFF0E6',
  blue: '#1E5EFF',
  text: '#1A202C',
  textSec: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E9F0',
};

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#1E5EFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EXPENSE_ITEMS = [
  { id: 'EX-01', title: 'Salaries', amount: '₹60,000', note: 'Teaching and admin staff', type: 'Fixed' },
  { id: 'EX-02', title: 'Maintenance', amount: '₹11,400', note: 'Repairs and facility upkeep', type: 'Operational' },
  { id: 'EX-03', title: 'Transport', amount: '₹8,500', note: 'School bus operations', type: 'Operational' },
  { id: 'EX-04', title: 'Lab Equipment', amount: '₹5,200', note: 'Science and computer labs', type: 'Academic' },
];

export default function MonthlyExpensesList({ onBack }) {
  const totalExpense = EXPENSE_ITEMS.reduce((sum, item) => {
    const amount = parseInt(item.amount.replace(/[₹,]/g, ''), 10);
    return sum + amount;
  }, 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemTopRow}>
        <View>
          <Text style={styles.itemName}>{item.title}</Text>
          <Text style={styles.itemMeta}>{item.id} • {item.type}</Text>
        </View>
        <Text style={styles.itemAmount}>{item.amount}</Text>
      </View>
      <Text style={styles.itemNote}>{item.note}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Monthly Expenses</Text>
          <Text style={styles.headerSub}>Complete monthly expense list</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>₹{totalExpense.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View>
          <Text style={styles.summaryLabel}>Entries</Text>
          <Text style={styles.summaryAmount}>{EXPENSE_ITEMS.length}</Text>
        </View>
      </View>

      <FlatList
        data={EXPENSE_ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  itemCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemName: { fontSize: 14, fontWeight: '700', color: C.text },
  itemMeta: { fontSize: 12, color: C.textMuted, marginTop: 3 },
  itemAmount: { fontSize: 16, fontWeight: '800', color: C.red },
  itemNote: { fontSize: 12, color: C.textSec, marginTop: 8, lineHeight: 18 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: C.orangeLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: C.orange },
});
