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

export default function NewAssignment({ onBack }) {
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleCreate = () => {
    if (!title.trim() || !className.trim() || !subject.trim() || !deadline.trim()) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    Alert.alert('Assignment Created', 'New assignment was created successfully.', [
      { text: 'OK', onPress: onBack },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.85}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Assignment</Text>
          <View style={{ width: 58 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Assignment Title *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="e.g., Calculus Worksheet"
            placeholderTextColor="#9AA3B2"
          />

          <Text style={styles.label}>Class *</Text>
          <TextInput
            value={className}
            onChangeText={setClassName}
            style={styles.input}
            placeholder="e.g., Grade 12-A"
            placeholderTextColor="#9AA3B2"
          />

          <Text style={styles.label}>Subject *</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
            placeholder="e.g., Mathematics"
            placeholderTextColor="#9AA3B2"
          />

          <Text style={styles.label}>Deadline *</Text>
          <TextInput
            value={deadline}
            onChangeText={setDeadline}
            style={styles.input}
            placeholder="e.g., Oct 30"
            placeholderTextColor="#9AA3B2"
          />

          <Text style={styles.label}>Instructions</Text>
          <TextInput
            value={instructions}
            onChangeText={setInstructions}
            style={[styles.input, styles.textArea]}
            placeholder="Add assignment instructions..."
            placeholderTextColor="#9AA3B2"
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.createBtn} onPress={handleCreate} activeOpacity={0.85}>
            <Text style={styles.createBtnText}>Create Assignment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
  content: { flex: 1, padding: 14 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: '#E7ECF6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backText: { color: '#1D5FD1', fontSize: 12, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    padding: 14,
  },
  label: { fontSize: 12, color: '#475569', fontWeight: '700', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: '#DFE5EE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
  },
  textArea: { minHeight: 90 },
  createBtn: {
    marginTop: 16,
    backgroundColor: '#1D5FD1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
