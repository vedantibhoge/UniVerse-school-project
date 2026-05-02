import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';

const C = {
  bg: '#F3F7FF',
  card: '#FFFFFF',
  text: '#172033',
  textSec: '#64748B',
  border: '#E5ECF6',
  blue: '#2563EB',
  blueLight: '#EAF2FF',
  green: '#16A34A',
  greenLight: '#ECFDF3',
  orange: '#EA580C',
  orangeLight: '#FFF7ED',
  red: '#DC2626',
  redLight: '#FEF2F2',
};

const SECTIONS = [
  {
    id: 'profile',
    title: 'School Profile',
    desc: 'Basic school information',
    accent: C.blueLight,
    items: [
      { label: 'School Name', value: 'Springfield High School', type: 'row' },
      { label: 'Address', value: '123, Main Road, City', type: 'row' },
      { label: 'Contact Number', value: '+91 98765 43210', type: 'row' },
      { label: 'Email ID', value: 'admin@school.edu', type: 'row' },
    ],
  },
  {
    id: 'academic',
    title: 'Academic Year',
    desc: 'Session & term configuration',
    accent: C.greenLight,
    items: [
      { label: 'Current Session', value: '2025–2026', type: 'badge', badge: 'Active', badgeColor: C.green },
      { label: 'Term Structure', value: 'Quarterly (4 Terms)', type: 'row' },
      { label: 'Auto Year Rollover', value: true, type: 'switch', key: 'autoRollover' },
    ],
  },
  {
    id: 'payments',
    title: 'Payment Methods',
    desc: 'Accepted payment modes',
    accent: C.orangeLight,
    items: [
      { label: 'Cash Payments', value: true, type: 'switch', key: 'cash' },
      { label: 'Bank Transfer / NEFT', value: true, type: 'switch', key: 'neft' },
      { label: 'UPI / QR Payments', value: true, type: 'switch', key: 'upi' },
      { label: 'Cheque Payments', value: false, type: 'switch', key: 'cheque' },
    ],
  },
  {
    id: 'receipts',
    title: 'Receipt Settings',
    desc: 'Receipt format & numbering',
    accent: C.blueLight,
    items: [
      { label: 'Receipt Prefix', value: 'RCP-2025-', type: 'row' },
      { label: 'Print Format', value: 'A4 / Thermal 80mm', type: 'row' },
      { label: 'School Stamp on Receipt', value: true, type: 'switch', key: 'stamp' },
      { label: 'Principal Signature', value: true, type: 'switch', key: 'signature' },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    desc: 'Account protection & privacy',
    accent: C.redLight,
    items: [
      { label: 'Two-Factor Auth (2FA)', value: false, type: 'switch', key: 'twofa' },
      { label: 'Login OTP Verification', value: true, type: 'switch', key: 'loginOtp' },
      { label: 'Auto Logout', value: 'After 30 minutes', type: 'row' },
    ],
  },
];

function SettingsRow({ label, value, badge, badgeColor }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: `${badgeColor}18` }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function Settings({ onBack }) {
  const [toggles, setToggles] = useState({
    autoRollover: true,
    cash: true,
    neft: true,
    upi: true,
    cheque: false,
    stamp: true,
    signature: true,
    twofa: false,
    loginOtp: true,
  });

  const statusSummary = useMemo(() => {
    const enabled = Object.values(toggles).filter(Boolean).length;
    return `${enabled} settings enabled`;
  }, [toggles]);

  const toggleKey = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleRowPress = (label) => {
    Alert.alert(label, 'This setting can be expanded later with an edit flow.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {typeof onBack === 'function' ? (
            <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
              <Text style={styles.backBtnText}>‹</Text>
            </TouchableOpacity>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Configure your school finance system</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryText}>{statusSummary}</Text>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.id} style={styles.card}>
            <View style={styles.cardHead}>
              <View style={[styles.cardAccent, { backgroundColor: section.accent }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardDesc}>{section.desc}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              {section.items.map((item) => {
                if (item.type === 'switch') {
                  return (
                    <View key={item.key} style={styles.settingItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <Text style={styles.itemValue}>{item.value ? 'Enabled' : 'Disabled'}</Text>
                      </View>
                      <Switch
                        value={toggles[item.key]}
                        onValueChange={() => toggleKey(item.key)}
                        trackColor={{ false: '#D8E1EE', true: C.blue }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                  );
                }

                if (item.type === 'badge') {
                  return <SettingsRow key={item.label} label={item.label} value={item.value} badge={item.badge} badgeColor={item.badgeColor} />;
                }

                return (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.8}
                    onPress={() => handleRowPress(item.label)}
                  >
                    <SettingsRow label={item.label} value={item.value} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 26,
    lineHeight: 26,
    color: C.text,
    marginTop: -2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: C.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: C.textSec,
  },
  summaryPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  summaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSec,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardAccent: {
    width: 10,
    height: 42,
    borderRadius: 999,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
  },
  cardDesc: {
    marginTop: 2,
    fontSize: 12,
    color: C.textSec,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F6FB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F6FB',
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
  },
  itemValue: {
    marginTop: 3,
    fontSize: 12,
    color: C.textSec,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
});