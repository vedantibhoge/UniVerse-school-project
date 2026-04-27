import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const parseSchedule = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export default function NewClassForm({ onSubmit, onCancel }) {
  const [grade, setGrade] = useState('Grade 12-A');
  const [subject, setSubject] = useState('Computer Science');
  const [room, setRoom] = useState('Room 305');
  const [schedule, setSchedule] = useState('Mon, Wed');
  const [studentCount, setStudentCount] = useState('25');

  const handleSave = () => {
    if (!grade.trim() || !subject.trim() || !room.trim() || !schedule.trim()) {
      Alert.alert('Missing Details', 'Please fill all fields.');
      return;
    }

    const parsedCount = Number(studentCount);
    if (!Number.isFinite(parsedCount) || parsedCount <= 0) {
      Alert.alert('Invalid Student Count', 'Please enter a valid number of students.');
      return;
    }

    const days = parseSchedule(schedule);
    if (!days.length) {
      Alert.alert('Invalid Schedule', 'Please add schedule like Mon, Wed.');
      return;
    }

    const idBase = `${grade}-${subject}`.replace(/\s+/g, '').toUpperCase();
    const students = Array.from({ length: parsedCount }).map((_, index) => ({
      name: `Student ${index + 1}`,
      rollNo: `${grade.replace(/\s+/g, '').toUpperCase()}${String(index + 1).padStart(2, '0')}`,
      overall: 80,
    }));

    onSubmit({
      id: `${idBase}-${Date.now()}`,
      grade: grade.trim(),
      subject: subject.trim(),
      room: room.trim(),
      schedule: days,
      students,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>New Class Form</Text>
        <Text style={styles.subtitle}>Create and assign a new class</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Grade</Text>
          <TextInput style={styles.input} value={grade} onChangeText={setGrade} placeholder="Grade 10-A" />

          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Mathematics" />

          <Text style={styles.label}>Room</Text>
          <TextInput style={styles.input} value={room} onChangeText={setRoom} placeholder="Room 402" />

          <Text style={styles.label}>Schedule (comma separated)</Text>
          <TextInput style={styles.input} value={schedule} onChangeText={setSchedule} placeholder="Mon, Wed, Fri" />

          <Text style={styles.label}>Student Count</Text>
          <TextInput
            style={styles.input}
            value={studentCount}
            onChangeText={setStudentCount}
            keyboardType="numeric"
            placeholder="25"
          />

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} activeOpacity={0.9} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.saveBtn]} activeOpacity={0.9} onPress={handleSave}>
              <Text style={styles.saveText}>Create Class</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2F7' },
  content: { padding: 14, paddingBottom: 24 },
  title: { fontSize: 28, color: '#1A1A2E', fontWeight: '800' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 12 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DFE7F3',
  },
  label: { fontSize: 12, color: '#334155', fontWeight: '700', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D9E2EF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A2E',
  },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#EEF2F7' },
  saveBtn: { backgroundColor: '#1B3FA0' },
  cancelText: { color: '#334155', fontWeight: '700' },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
});
