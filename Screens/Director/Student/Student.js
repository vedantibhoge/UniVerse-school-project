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
  primary: '#1A56DB',
  primaryLight: '#DBEAFE',
  primarySoft: '#EFF6FF',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSoft: '#64748B',
  border: '#E2E8F0',
};

const KPI = [
  { label: 'Total Students', value: '8,420', tone: C.primary },
  { label: 'New Admissions', value: '412', tone: C.accent },
  { label: 'Transfers', value: '37', tone: C.warning },
  { label: 'Withdrawals', value: '18', tone: C.danger },
];

const ACTIVITY = [
  { title: 'Admission review', meta: '24 pending applications', tone: C.primary },
  { title: 'Class placement', meta: '12 students awaiting allocation', tone: C.accent },
  { title: 'Attendance follow-up', meta: '8 students require action', tone: C.warning },
];

const QUICK_LINKS = [
  { label: 'Admissions', screen: 'admissions' },
  { label: 'Demographics', screen: 'demographics' },
  { label: 'Transitions', screen: 'transitions' },
];

function Dot({ color }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

function KpiCard({ label, value, tone }) {
  return (
    <View style={styles.kpiCard}>
      <View style={styles.kpiTopRow}>
        <Text style={styles.kpiLabel}>{label}</Text>
        <Dot color={tone} />
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

function ActivityRow({ title, meta, tone }) {
  return (
    <View style={styles.activityRow}>
      <Dot color={tone} />
      <View style={{ flex: 1 }}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityMeta}>{meta}</Text>
      </View>
    </View>
  );
}

export default function Students({ navigation }) {
  const navigate = (screen) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.overline}>Director Console</Text>
          <Text style={styles.title}>Students</Text>
          <Text style={styles.subtitle}>A native-safe overview of student growth, admissions, and movement.</Text>
        </View>

        <View style={styles.grid}>
          {KPI.map((item) => (
            <KpiCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Quick Links</Text>
          <View style={styles.linkRow}>
            {QUICK_LINKS.map((link) => (
              <TouchableOpacity
                key={link.screen}
                style={styles.linkButton}
                onPress={() => navigate(link.screen)}
                activeOpacity={0.8}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Recent Activity</Text>
          {ACTIVITY.map((item) => (
            <ActivityRow key={item.title} title={item.title} meta={item.meta} tone={item.tone} />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Insight</Text>
          <Text style={styles.insightText}>
            Student admissions are trending upward while withdrawals remain low. Use the quick links to jump into detailed views.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 28 },
  header: { marginBottom: 16 },
  overline: { fontSize: 11, fontWeight: '800', color: C.primary, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 30, fontWeight: '900', color: C.text, marginTop: 4 },
  subtitle: { marginTop: 6, fontSize: 13, lineHeight: 19, color: C.textSoft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  kpiCard: {
    width: '48%',
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
  },
  kpiTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  kpiLabel: { fontSize: 12, color: C.textSoft, fontWeight: '700' },
  kpiValue: { fontSize: 24, color: C.text, fontWeight: '900' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 14,
  },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  linkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  linkButton: {
    backgroundColor: C.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.primaryLight,
  },
  linkText: { color: C.primary, fontWeight: '800', fontSize: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border },
  activityTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  activityMeta: { marginTop: 2, fontSize: 12, color: C.textSoft },
  insightText: { fontSize: 13, lineHeight: 20, color: C.textSoft },
});