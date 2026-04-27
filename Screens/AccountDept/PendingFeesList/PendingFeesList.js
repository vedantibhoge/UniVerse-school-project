import React, { useMemo, useState } from 'react';
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
  orange: '#F97316',
  orangeLight: '#FFF0E6',
  red: '#EF4444',
  redLight: '#FEE2E2',
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

const PENDING_FEE_STUDENTS = [
  { id: 'S/01', name: 'Varun Mehta', className: 'Grade 8-D', amount: '₹41,000', due: 'Overdue by 12 days', priority: 'high' },
  { id: 'S/14', name: 'Sara Khan', className: 'Grade 11-A', amount: '₹15,500', due: 'Due this week', priority: 'medium' },
  { id: 'S/25', name: 'Amit Roy', className: 'Grade 9-B', amount: '₹28,500', due: 'Overdue by 5 days', priority: 'high' },
  { id: 'S/32', name: 'Priya Singh', className: 'Grade 10-C', amount: '₹12,300', due: 'Due tomorrow', priority: 'medium' },
];

export default function PendingFeesList({ onBack }) {
  const [selectedClassDivision, setSelectedClassDivision] = useState(null);

  const classDivisions = useMemo(() => {
    const map = new Map();
    PENDING_FEE_STUDENTS.forEach((student) => {
      const amount = parseInt(student.amount.replace(/[₹,]/g, ''), 10);
      const entry = map.get(student.className) || { className: student.className, count: 0, total: 0 };
      entry.count += 1;
      entry.total += amount;
      map.set(student.className, entry);
    });
    return Array.from(map.values());
  }, []);

  const filteredStudents = useMemo(() => {
    if (!selectedClassDivision) return [];
    return PENDING_FEE_STUDENTS.filter((student) => student.className === selectedClassDivision);
  }, [selectedClassDivision]);

  const totalPending = useMemo(() => {
    const source = selectedClassDivision ? filteredStudents : PENDING_FEE_STUDENTS;
    return source.reduce((sum, student) => {
      const amount = parseInt(student.amount.replace(/[₹,]/g, ''), 10);
      return sum + amount;
    }, 0);
  }, [filteredStudents, selectedClassDivision]);

  const renderItem = ({ item }) => {
    const highPriority = item.priority === 'high';
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemTopRow}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>{item.id} • {item.className}</Text>
          </View>
          <Text style={styles.itemAmount}>{item.amount}</Text>
        </View>

        <View style={[styles.dueBadge, highPriority ? styles.dueBadgeHigh : styles.dueBadgeMedium]}>
          <Text style={[styles.dueText, highPriority ? styles.dueTextHigh : styles.dueTextMedium]}>{item.due}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Pending Fees</Text>
          <Text style={styles.headerSub}>
            {selectedClassDivision
              ? `${selectedClassDivision} pending list`
              : 'Select class/division to view pending list'}
          </Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>{selectedClassDivision ? 'Class Pending' : 'Total Pending'}</Text>
          <Text style={styles.summaryAmount}>₹{totalPending.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View>
          <Text style={styles.summaryLabel}>{selectedClassDivision ? 'Students in class' : 'Students'}</Text>
          <Text style={styles.summaryAmount}>{selectedClassDivision ? filteredStudents.length : PENDING_FEE_STUDENTS.length}</Text>
        </View>
      </View>

      {!selectedClassDivision ? (
        <View style={styles.selectorWrap}>
          <Text style={styles.selectorTitle}>Choose Class / Division</Text>
          <View style={styles.selectorGrid}>
            {classDivisions.map((entry) => (
              <TouchableOpacity
                key={entry.className}
                style={styles.classCard}
                activeOpacity={0.8}
                onPress={() => setSelectedClassDivision(entry.className)}
              >
                <Text style={styles.className}>{entry.className}</Text>
                <Text style={styles.classMeta}>{entry.count} student(s) pending</Text>
                <Text style={styles.classAmount}>₹{entry.total.toLocaleString('en-IN')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.changeClassBtn} activeOpacity={0.8} onPress={() => setSelectedClassDivision(null)}>
              <Text style={styles.changeClassText}>Change Class / Division</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredStudents}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
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

  selectorWrap: { paddingHorizontal: 12 },
  selectorTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 },
  selectorGrid: { gap: 10 },
  classCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  className: { fontSize: 15, fontWeight: '700', color: C.text },
  classMeta: { fontSize: 12, color: C.textSec, marginTop: 4 },
  classAmount: { fontSize: 14, fontWeight: '800', color: C.orange, marginTop: 8 },

  actionsRow: { paddingHorizontal: 12, marginTop: -2 },
  changeClassBtn: {
    alignSelf: 'flex-start',
    backgroundColor: C.blueLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  changeClassText: { color: C.blue, fontSize: 12, fontWeight: '700' },

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
  itemAmount: { fontSize: 16, fontWeight: '800', color: C.orange },
  dueBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dueBadgeHigh: { backgroundColor: C.redLight },
  dueBadgeMedium: { backgroundColor: C.orangeLight },
  dueText: { fontSize: 11, fontWeight: '700' },
  dueTextHigh: { color: C.red },
  dueTextMedium: { color: C.orange },
});
