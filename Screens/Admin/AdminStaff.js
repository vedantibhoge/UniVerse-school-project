import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  blue: '#3B82F6',
  orange: '#F97316',
};

const staffData = [
  { id: 1, name: 'Dr. Rajesh Kumar', role: 'Principal', dept: 'Administration', status: 'Active' },
  { id: 2, name: 'Ms. Priya Sharma', role: 'Vice Principal', dept: 'Administration', status: 'Active' },
  { id: 3, name: 'Mr. Arjun Singh', role: 'Math Teacher', dept: 'Science', status: 'Active' },
  { id: 4, name: 'Ms. Neha Verma', role: 'English Teacher', dept: 'Languages', status: 'Active' },
  { id: 5, name: 'Mr. Rohan Patel', role: 'Science Teacher', dept: 'Science', status: 'Active' },
  { id: 6, name: 'Ms. Meera Gupta', role: 'History Teacher', dept: 'Social Studies', status: 'On Leave' },
  { id: 7, name: 'Mr. Vikram Reddy', role: 'PE Teacher', dept: 'Sports', status: 'Active' },
  { id: 8, name: 'Ms. Divya Nair', role: 'Librarian', dept: 'Library', status: 'Active' },
];

function StaffCard({ staff, onPress }) {
  const getStatusColor = (status) => status === 'Active' ? '#22C55E' : '#F97316';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.staffHeader}>
        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{staff.name}</Text>
          <Text style={styles.staffRole}>{staff.role}</Text>
          <Text style={styles.staffDept}>📚 {staff.dept}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(staff.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(staff.status) }]}>
            {staff.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AdminStaff({ onBack }) {
  const activeStaff = staffData.filter(s => s.status === 'Active').length;
  const onLeaveStaff = staffData.filter(s => s.status === 'On Leave').length;

  const handleEditStaff = (staff) => {
    Alert.alert(
      `${staff.name}`,
      `Role: ${staff.role}\nDepartment: ${staff.dept}\nStatus: ${staff.status}`,
      [
        { text: 'Edit Details', onPress: () => Alert.alert('Saved', 'Staff details updated!') },
        { text: 'View Salary', onPress: () => Alert.alert('Salary', 'View salary information...') },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>{staffData.length}</Text>
            <Text style={styles.statLabel}>Total Staff</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#22C55E' + '20' }]}>
            <Text style={[styles.statValue, { color: '#22C55E' }]}>{activeStaff}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.orange + '20' }]}>
            <Text style={[styles.statValue, { color: COLORS.orange }]}>{onLeaveStaff}</Text>
            <Text style={styles.statLabel}>On Leave</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Staff Directory</Text>
        {staffData.map((staff) => (
          <StaffCard
            key={staff.id}
            staff={staff}
            onPress={() => handleEditStaff(staff)}
          />
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert('Add Staff', 'Opening new staff form...')}
          activeOpacity={0.7}
        >
          <Text style={styles.addIcon}>➕</Text>
          <Text style={styles.addText}>Add New Staff</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8ECF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  staffRole: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  staffDept: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  addIcon: {
    fontSize: 18,
  },
  addText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
