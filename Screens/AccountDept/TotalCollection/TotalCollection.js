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
  blue: '#1E5EFF',
  blueLight: '#EEF3FF',
  green: '#22C55E',
  greenLight: '#DCFCE7',
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

const COLLECTION_STUDENTS = [
  { id: 'S/08', name: 'Ishaan Gupta', className: 'Grade 12-A', amount: '₹3,200', mode: 'Online Transfer' },
  { id: 'S/11', name: 'Riya Patel', className: 'Grade 10-B', amount: '₹1,800', mode: 'Credit Card' },
  { id: 'S/19', name: 'Amit Roy', className: 'Grade 9-C', amount: '₹2,500', mode: 'Cheque' },
  { id: 'S/24', name: 'Preeti Nair', className: 'Grade 11-A', amount: '₹4,100', mode: 'UPI' },
  { id: 'S/31', name: 'Raj Kumar', className: 'Grade 8-B', amount: '₹2,800', mode: 'Debit Card' },
];

export default function TotalCollection({ onBack }) {
  const totalAmount = COLLECTION_STUDENTS.reduce((sum, student) => {
    const amount = parseInt(student.amount.replace(/[₹,]/g, ''), 10);
    return sum + amount;
  }, 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemTopRow}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>{item.id} • {item.className}</Text>
        </View>
        <Text style={styles.itemAmount}>{item.amount}</Text>
      </View>

      <View style={styles.methodBadge}>
        <Text style={styles.methodText}>{item.mode}</Text>
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
          <Text style={styles.headerTitle}>Total Collection</Text>
          <Text style={styles.headerSub}>{COLLECTION_STUDENTS.length} students in collected list</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Collected Amount</Text>
          <Text style={styles.summaryAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View>
          <Text style={styles.summaryLabel}>Students</Text>
          <Text style={styles.summaryAmount}>{COLLECTION_STUDENTS.length}</Text>
        </View>
      </View>

      <FlatList
        data={COLLECTION_STUDENTS}
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
  itemAmount: { fontSize: 16, fontWeight: '800', color: C.blue },
  methodBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: C.greenLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  methodText: { fontSize: 11, fontWeight: '700', color: C.green },
});
