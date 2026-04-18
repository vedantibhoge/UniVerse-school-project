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
  green: '#22C55E',
  red: '#E53935',
};

const allStudents = [
  { id: 1, name: 'Aarav Sharma', class: 'Grade 10-A', roll: '001' },
  { id: 2, name: 'Arjun Patel', class: 'Grade 10-A', roll: '002' },
  { id: 3, name: 'Priya Singh', class: 'Grade 10-A', roll: '003' },
  { id: 4, name: 'Nisha Kumar', class: 'Grade 10-A', roll: '004' },
  { id: 5, name: 'Rohan Desai', class: 'Grade 10-A', roll: '005' },
  { id: 6, name: 'Meera Gupta', class: 'Grade 10-A', roll: '006' },
  { id: 7, name: 'Vikram Reddy', class: 'Grade 10-A', roll: '007' },
  { id: 8, name: 'Divya Nair', class: 'Grade 10-A', roll: '008' },
  { id: 9, name: 'Karan Verma', class: 'Grade 10-A', roll: '009' },
  { id: 10, name: 'Ananya Joshi', class: 'Grade 10-A', roll: '010' },
  { id: 11, name: 'Sanjay Khan', class: 'Grade 10-A', roll: '011' },
  { id: 12, name: 'Riya Pillai', class: 'Grade 10-A', roll: '012' },
];

function StudentAttendanceItem({ student, isPresent, onToggle, onEdit }) {
  return (
    <View style={styles.attendanceItem}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentDetails}>Roll: {student.roll} • {student.class}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            isPresent ? styles.presentButton : styles.absentButton,
          ]}
          onPress={() => onToggle(student.id)}
        >
          <Text style={styles.statusIcon}>{isPresent ? '✓' : '✗'}</Text>
          <Text style={[
            styles.statusText,
            isPresent ? styles.presentText : styles.absentText,
          ]}>
            {isPresent ? 'Present' : 'Absent'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(student)}
          activeOpacity={0.7}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdminMarkAttendance({ onBack }) {
  const [attendance, setAttendance] = useState(
    allStudents.reduce((acc, student) => ({
      ...acc,
      [student.id]: Math.random() > 0.2, // 80% present by default
    }), {})
  );

  const handleToggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleEditStudent = (student) => {
    const currentStatus = attendance[student.id] ? 'Present' : 'Absent';
    Alert.alert(
      `Edit Attendance - ${student.name}`,
      `Current Status: ${currentStatus}\n\nChange to:`,
      [
        { text: 'Mark Present', onPress: () => setAttendance(prev => ({ ...prev, [student.id]: true })) },
        { text: 'Mark Absent', onPress: () => setAttendance(prev => ({ ...prev, [student.id]: false })) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalCount = allStudents.length;
    const percentage = Math.round((presentCount / totalCount) * 100);

    Alert.alert('Attendance Submitted', `Present: ${presentCount}/${totalCount} (${percentage}%)`, [
      { text: 'OK', onPress: onBack }
    ]);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = allStudents.length;
  const absentCount = totalCount - presentCount;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mark Attendance</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: COLORS.green + '20' }]}>
          <Text style={[styles.statValue, { color: COLORS.green }]}>{presentCount}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.red + '20' }]}>
          <Text style={[styles.statValue, { color: COLORS.red }]}>{absentCount}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.primary + '20' }]}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Students List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Grade 10-A - Class Attendance</Text>
        
        {allStudents.map((student) => (
          <StudentAttendanceItem
            key={student.id}
            student={student}
            isPresent={attendance[student.id]}
            onToggle={handleToggleAttendance}
            onEdit={handleEditStudent}
          />
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Submit Attendance</Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: COLORS.white,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  studentInfo: {
    flex: 1,
    marginRight: 12,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  studentDetails: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  presentButton: {
    backgroundColor: COLORS.green + '20',
  },
  absentButton: {
    backgroundColor: COLORS.red + '20',
  },
  statusIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  presentText: {
    color: COLORS.green,
  },
  absentText: {
    color: COLORS.red,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E8ECF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
