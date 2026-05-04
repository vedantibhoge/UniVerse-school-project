import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function TeacherSupport() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Teacher Support</Text>
      <Text style={styles.subtitle}>Need help? Use the options below.</Text>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => Alert.alert('Support', 'Help Center opened.')}
      >
        <Text style={styles.cardTitle}>Help Center</Text>
        <Text style={styles.cardText}>Guides for attendance, homework, marks and timetable.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => Alert.alert('Support', 'Ticket created successfully.')}
      >
        <Text style={styles.cardTitle}>Raise Ticket</Text>
        <Text style={styles.cardText}>Report issues to administration or IT support.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => Alert.alert('Support', 'Contact details shared.')}
      >
        <Text style={styles.cardTitle}>Contact Admin</Text>
        <Text style={styles.cardText}>Phone: +91-00000-00000 | Email: admin@universe.edu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 13,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardText: {
    marginTop: 6,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
});
