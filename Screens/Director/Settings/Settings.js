import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E6E9F2',
  primary: '#2563EB',
  primarySoft: '#93C5FD',
  text: '#111827',
  textMuted: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
};

const SETTINGS = [
  { label: 'Profile & Identity', value: 'Configured', tone: C.success },
  { label: 'Notifications', value: 'Enabled', tone: C.primarySoft },
  { label: 'Permission Matrix', value: 'Updated 2d ago', tone: C.warning },
  { label: 'Security Policy', value: 'Strong', tone: C.success },
];

export default function Setting() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.overline}>Director Controls</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage institution-wide configuration from one place.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>System Preferences</Text>
          {SETTINGS.map((item) => (
            <View key={item.label} style={styles.row}>
              <View style={[styles.dot, { backgroundColor: item.tone }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.label}</Text>
                <Text style={styles.rowMeta}>{item.value}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Save Configuration</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.85}>
            <Text style={styles.secondaryBtnText}>Export Settings Snapshot</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 28 },
  overline: {
    color: C.primarySoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
    fontWeight: '800',
  },
  title: { color: C.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  subtitle: { color: C.textMuted, marginTop: 6, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: C.cardBorder,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowTitle: { color: C.text, fontWeight: '800', fontSize: 14 },
  rowMeta: { color: C.textMuted, fontSize: 12, marginTop: 2 },
  chevron: { color: C.textMuted, fontSize: 18, fontWeight: '300' },
  primaryBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: { color: C.text, fontWeight: '800', fontSize: 13 },
});
// end of Settings file - clean EOF

