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
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const timetableData = {
  'Grade 10-A': [
    { period: 1, startTime: '09:00', endTime: '09:50', subject: 'Mathematics', teacher: 'Mr. Arjun' },
    { period: 2, startTime: '09:50', endTime: '10:40', subject: 'English', teacher: 'Ms. Neha' },
    { period: 3, startTime: '10:40', endTime: '11:30', subject: 'Science', teacher: 'Mr. Rohan' },
    { period: 4, startTime: '11:30', endTime: '12:20', subject: 'History', teacher: 'Ms. Meera' },
  ],
};

function TimeSlot({ period, subject, teacher, onPress }) {
  return (
    <TouchableOpacity style={styles.timeSlot} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.periodInfo}>
        <Text style={styles.periodNumber}>Period {period}</Text>
        <Text style={styles.subjectName}>{subject}</Text>
        <Text style={styles.teacherName}>👨‍🏫 {teacher}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function AdminTimetable({ onBack }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');

  const handleEditPeriod = (period) => {
    Alert.alert(
      `Period ${period.period}`,
      `Subject: ${period.subject}\nTeacher: ${period.teacher}\nTime: ${period.startTime} - ${period.endTime}`,
      [
        { text: 'Edit', onPress: () => Alert.alert('Save', 'Period updated!') },
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
        <Text style={styles.headerTitle}>Timetable Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Class Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Class</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classScroll}>
            <TouchableOpacity
              style={[styles.classTag, selectedClass === 'Grade 10-A' && styles.classTagActive]}
              onPress={() => setSelectedClass('Grade 10-A')}
              activeOpacity={0.7}
            >
              <Text style={[styles.classTagText, selectedClass === 'Grade 10-A' && styles.classTagTextActive]}>
                Grade 10-A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.classTag, selectedClass === 'Grade 10-B' && styles.classTagActive]}
              onPress={() => setSelectedClass('Grade 10-B')}
              activeOpacity={0.7}
            >
              <Text style={[styles.classTagText, selectedClass === 'Grade 10-B' && styles.classTagTextActive]}>
                Grade 10-B
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Days Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Day</Text>
          <View style={styles.daysContainer}>
            {days.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.dayButton, selectedDay === idx && styles.dayButtonActive]}
                onPress={() => setSelectedDay(idx)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayButtonText, selectedDay === idx && styles.dayButtonTextActive]}>
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timetable */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{days[selectedDay]} - {selectedClass}</Text>
          {timetableData[selectedClass].map((slot, idx) => (
            <TimeSlot
              key={idx}
              period={slot.period}
              subject={slot.subject}
              teacher={slot.teacher}
              onPress={() => handleEditPeriod(slot)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Generate', 'Generating timetable...')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <Text style={styles.actionText}>Generate Full Timetable</Text>
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
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  classScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  classTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E8ECF5',
    marginRight: 8,
  },
  classTagActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  classTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  classTagTextActive: {
    color: COLORS.white,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E8ECF5',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  dayButtonTextActive: {
    color: COLORS.white,
  },
  timeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  periodInfo: {
    flex: 1,
  },
  periodNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
