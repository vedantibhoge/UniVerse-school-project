import React, { useState } from 'react';
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
  bg: '#F5F7FB',
  white: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E6E9F2',
  primary: '#2563EB',
  primarySoft: '#93C5FD',
  primaryLight: '#EFF6FF',
  text: '#111827',
  textMid: '#4B5563',
  textLight: '#6B7280',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  accent: '#8B5CF6',
  accentLight: '#F3E8FF',
  border: '#D1D5DB',
};

// ─── Detail Screen ───────────────────────────────────────────────────────────
const DetailScreen = ({ detail, onBack }) => (
  <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
    <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.backButton}>
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>

    <View style={styles.detailHero}>
      <Text style={styles.detailTag}>{detail.tag}</Text>
      <Text style={styles.detailTitle}>{detail.title}</Text>
      <Text style={styles.detailBody}>{detail.body}</Text>
      <View style={styles.detailPills}>
        {detail.badges.map((badge) => (
          <View key={badge} style={styles.detailPill}>
            <Text style={styles.detailPillText}>{badge}</Text>
          </View>
        ))}
      </View>
    </View>

    <View style={styles.detailCard}>
      <Text style={styles.detailSectionTitle}>Details</Text>
      {detail.points.map((point) => (
        <View key={point} style={styles.detailRow}>
          <View style={styles.detailDot} />
          <Text style={styles.detailRowText}>{point}</Text>
        </View>
      ))}
    </View>

    {detail.cards ? (
      <View style={styles.detailCard}>
        <Text style={styles.detailSectionTitle}>Summary</Text>
        <View style={styles.detailGrid}>
          {detail.cards.map((card) => (
            <View key={card.label} style={styles.detailStatCard}>
              <Text style={styles.detailStatLabel}>{card.label}</Text>
              <Text style={styles.detailStatValue}>{card.value}</Text>
            </View>
          ))}
        </View>
      </View>
    ) : null}
  </ScrollView>
);

// ─── Setting Row (Pressable) ──────────────────────────────────────────────────
const SettingRow = ({ label, value, tone, onPress }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.row, pressed && styles.rowPressed]}
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View style={[styles.dot, { backgroundColor: tone }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{label}</Text>
        <Text style={styles.rowMeta}>{value}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

// ─── Action Button (Pressable) ────────────────────────────────────────────────
const ActionButton = ({ title, variant, onPress }) => {
  const [pressed, setPressed] = useState(false);
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[
        isPrimary ? styles.primaryBtn : styles.secondaryBtn,
        pressed && styles.buttonPressed,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Text style={isPrimary ? styles.primaryBtnText : styles.secondaryBtnText}>{title}</Text>
    </TouchableOpacity>
  );
};

// ─── Main Settings Screen ─────────────────────────────────────────────────────
export default function Setting() {
  const [activeDetail, setActiveDetail] = useState(null);

  const details = {
    profile: {
      tag: 'System',
      title: 'Profile & Identity',
      body: 'Manage director profile information, credentials, and institutional identity settings.',
      badges: ['Profile', 'Identity', 'Status: Configured'],
      points: [
        'Review your director profile and credentials.',
        'Update institutional identity information.',
        'Manage authentication and access roles.',
      ],
      cards: [
        { label: 'Status', value: 'Configured' },
        { label: 'Role', value: 'Director' },
        { label: 'Access Level', value: 'Full' },
      ],
    },
    notifications: {
      tag: 'System',
      title: 'Notification Settings',
      body: 'Control notification preferences, delivery channels, and alert frequency.',
      badges: ['Notifications', 'Preferences', 'Status: Enabled'],
      points: [
        'Enable or disable notification categories.',
        'Set delivery preferences (email, in-app, SMS).',
        'Configure alert frequency and quiet hours.',
      ],
      cards: [
        { label: 'Status', value: 'Enabled' },
        { label: 'Channels', value: '3 Active' },
        { label: 'Frequency', value: 'Normal' },
      ],
    },
    permissions: {
      tag: 'System',
      title: 'Permission Matrix',
      body: 'Review and manage role-based permissions and access control policies.',
      badges: ['Permissions', 'Security', 'Updated 2d ago'],
      points: [
        'Review permission matrix for all roles.',
        'Update access control policies.',
        'Monitor recent permission changes and audit log.',
      ],
      cards: [
        { label: 'Roles', value: '8' },
        { label: 'Last Updated', value: '2 Days' },
        { label: 'Policy Version', value: 'v3.2' },
      ],
    },
    security: {
      tag: 'System',
      title: 'Security Policy',
      body: 'Configure security settings, data protection, and compliance requirements.',
      badges: ['Security', 'Compliance', 'Status: Strong'],
      points: [
        'Review security policy and protocols.',
        'Configure encryption and data protection settings.',
        'Check compliance status and audit records.',
      ],
      cards: [
        { label: 'Strength', value: 'Strong' },
        { label: 'Encryption', value: 'AES-256' },
        { label: 'Compliance', value: '100%' },
      ],
    },
    save: {
      tag: 'Action',
      title: 'Save Configuration',
      body: 'Persist all changes to system settings and write updated configuration.',
      badges: ['Configuration', 'Save', 'Quick Action'],
      points: [
        'Save all pending changes to the system.',
        'Verify configuration consistency.',
        'Backup previous settings automatically.',
      ],
      cards: [
        { label: 'Status', value: 'Ready' },
        { label: 'Last Save', value: 'Today' },
        { label: 'Changes', value: '0' },
      ],
    },
    export: {
      tag: 'Action',
      title: 'Export Settings Snapshot',
      body: 'Generate and download a snapshot of all current settings for backup or transfer.',
      badges: ['Export', 'Backup', 'Quick Action'],
      points: [
        'Generate a complete settings snapshot.',
        'Download as JSON or CSV format.',
        'Use for backup, audit, or system migration.',
      ],
      cards: [
        { label: 'Format', value: 'JSON' },
        { label: 'Size', value: '~240 KB' },
        { label: 'Last Export', value: 'Never' },
      ],
    },
  };

  if (activeDetail) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={C.white} />
        <View style={styles.detailWrapper}>
          <DetailScreen detail={activeDetail} onBack={() => setActiveDetail(null)} />
        </View>
      </SafeAreaView>
    );
  }

  const openDetail = (key) => setActiveDetail(details[key]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerStack}>
          <Text style={styles.overline}>Director Controls</Text>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage institution-wide configuration from one place.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>System Preferences</Text>
          <SettingRow label="Profile & Identity" value="Configured" tone={C.success} onPress={() => openDetail('profile')} />
          <SettingRow label="Notifications" value="Enabled" tone={C.primarySoft} onPress={() => openDetail('notifications')} />
          <SettingRow label="Permission Matrix" value="Updated 2d ago" tone={C.warning} onPress={() => openDetail('permissions')} />
          <SettingRow label="Security Policy" value="Strong" tone={C.success} onPress={() => openDetail('security')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ActionButton title="Save Configuration" variant="primary" onPress={() => openDetail('save')} />
          <ActionButton title="Export Settings Snapshot" variant="secondary" onPress={() => openDetail('export')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 28 },
  headerStack: {
    marginBottom: 20,
  },
  overline: {
    color: C.primarySoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
    fontWeight: '800',
  },
  title: { color: C.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  subtitle: { color: C.textLight, marginTop: 6, fontSize: 13, lineHeight: 20 },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
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
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: C.cardBorder,
    borderRadius: 8,
  },
  rowPressed: {
    backgroundColor: '#F0F4FF',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowTitle: { color: C.text, fontWeight: '800', fontSize: 14 },
  rowMeta: { color: C.textLight, fontSize: 12, marginTop: 2 },
  chevron: { color: C.textLight, fontSize: 18, fontWeight: '300' },
  primaryBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: { color: C.white, fontWeight: '800', fontSize: 13 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  secondaryBtnText: { color: C.text, fontWeight: '800', fontSize: 13 },
  buttonPressed: {
    opacity: 0.7,
  },

  // Detail Screen Styles
  detailWrapper: {
    flex: 1,
    backgroundColor: C.bg,
  },
  detailScroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  detailContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  backButtonText: {
    color: C.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  detailHero: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: C.cardBorder,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  detailTag: {
    fontSize: 10,
    color: C.primary,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    marginBottom: 6,
  },
  detailBody: {
    fontSize: 13,
    color: C.textMid,
    lineHeight: 19,
  },
  detailPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  detailPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: C.primaryLight,
  },
  detailPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.primary,
  },
  detailCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.cardBorder,
    marginBottom: 14,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  detailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
    marginTop: 6,
  },
  detailRowText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: C.textMid,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailStatCard: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 90,
    backgroundColor: C.bg,
    borderRadius: 12,
    padding: 12,
  },
  detailStatLabel: {
    fontSize: 10,
    color: C.textLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailStatValue: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
  },
});

