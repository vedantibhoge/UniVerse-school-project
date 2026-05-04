import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
  red: '#EF4444',
  redLight: '#FEE2E2',
  orange: '#F97316',
  orangeLight: '#FFF0E6',
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

const DEFAULTERS = [
  { id: 'S/01', name: 'Varun Mehta', class: 'Grade 8-D', amount: '₹41,000', status: 'Overdue', reminder: 'Today, 10:00 AM', statusColor: C.red, email: 'varun@school.edu', phone: '9876543210' },
  { id: 'S/14', name: 'Sara Khan', class: 'Grade 11-A', amount: '₹15,500', status: 'Pending', reminder: 'Sent Oct 1st', statusColor: C.orange, email: 'sara@school.edu', phone: '9876543211' },
  { id: 'S/25', name: 'Amit Roy', class: 'Grade 9-B', amount: '₹28,500', status: 'Overdue', reminder: 'Today, 2:00 PM', statusColor: C.red, email: 'amit@school.edu', phone: '9876543212' },
  { id: 'S/32', name: 'Priya Singh', class: 'Grade 10-C', amount: '₹12,300', status: 'Pending', reminder: 'Sent Oct 5th', statusColor: C.orange, email: 'priya@school.edu', phone: '9876543213' },
  { id: 'S/41', name: 'Rohit Patel', class: 'Grade 12-A', amount: '₹35,700', status: 'Overdue', reminder: 'Today, 11:00 AM', statusColor: C.red, email: 'rohit@school.edu', phone: '9876543214' },
];

export default function DefaultersList({ onBack }) {
  const [selectedDefaulters, setSelectedDefaulters] = useState([]);

  const toggleSelect = (id) => {
    setSelectedDefaulters(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const sendReminders = () => {
    if (selectedDefaulters.length === 0) {
      Alert.alert('No Selection', 'Please select at least one defaulter');
      return;
    }
    Alert.alert(
      'Reminders Sent',
      `SMS/Email sent to ${selectedDefaulters.length} defaulter(s)`
    );
    setSelectedDefaulters([]);
  };

  const DefaulterItem = ({ item }) => {
    const isSelected = selectedDefaulters.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.listItem, isSelected && styles.listItemSelected]}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>

        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={[styles.itemAmount, { color: item.statusColor }]}>{item.amount}</Text>
          </View>
          <Text style={styles.itemSub}>{item.id} • {item.class}</Text>
          <View style={styles.itemFooter}>
            <Text style={styles.itemEmail}>{item.email}</Text>
            <Text style={styles.itemPhone}>{item.phone}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '22' }]}>
            <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Defaulters List</Text>
          <Text style={styles.headerSub}>{DEFAULTERS.length} students with outstanding fees</Text>
        </View>
      </View>

      <FlatList
        data={DEFAULTERS}
        renderItem={({ item }) => <DefaulterItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
      />

      {selectedDefaulters.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.selectedCount}>
            {selectedDefaulters.length} selected
          </Text>
          <TouchableOpacity style={styles.sendBtn} onPress={sendReminders} activeOpacity={0.8}>
            <Text style={styles.sendBtnText}>Send SMS/Email</Text>
          </TouchableOpacity>
        </View>
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

  listContent: { padding: 12 },
  listItem: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'flex-start',
  },
  listItemSelected: { borderColor: C.blue, backgroundColor: C.blueLight },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxSelected: { backgroundColor: C.blue, borderColor: C.blue },
  checkMark: { color: C.white, fontWeight: '700', fontSize: 14 },

  itemContent: { flex: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { fontSize: 14, fontWeight: '700', color: C.text },
  itemAmount: { fontWeight: '700', fontSize: 14 },
  itemSub: { fontSize: 12, color: C.textMuted, marginBottom: 6 },
  itemFooter: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  itemEmail: { fontSize: 11, color: C.textSec },
  itemPhone: { fontSize: 11, color: C.textSec },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: 12,
  },
  selectedCount: { fontSize: 14, fontWeight: '600', color: C.text },
  sendBtn: {
    flex: 1,
    backgroundColor: C.blue,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: { color: C.white, fontWeight: '700', fontSize: 14 },
});
