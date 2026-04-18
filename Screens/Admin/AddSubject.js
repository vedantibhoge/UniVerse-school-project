import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AddSubject({ onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Subject</Text>
      <Text style={styles.subtitle}>Subject creation form will appear here.</Text>

      {typeof onBack === 'function' && (
        <TouchableOpacity style={styles.button} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
