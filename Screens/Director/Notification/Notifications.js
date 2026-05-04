import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// ─── Color Palette ───────────────────────────────────────────────────────────
const C = {
  bg: '#F4F6FA',
  white: '#FFFFFF',
  navy: '#1A2340',
  navyLight: '#2B3A5A',
  accent: '#3B6BF5',
  accentLight: '#EBF0FF',
  red: '#E5342A',
  redLight: '#FFF0EF',
  orange: '#F5820A',
  orangeLight: '#FFF5E8',
  green: '#1CA86A',
  greenLight: '#E6F9F1',
  purple: '#7B5CF5',
  purpleLight: '#F0EDFF',
  gold: '#F0BC0E',
  goldLight: '#FFFAE6',
  text: '#1A2340',
  textMid: '#4A5568',
  textLight: '#8A94A6',
  border: '#E4E9F2',
  badgeBg: '#EDF0F7',
};

// ─── Helper Components ────────────────────────────────────────────────────────
const Badge = ({ label, color = C.textLight, bg = C.badgeBg }) => (
  <View style={[styles.badge, { backgroundColor: bg }]}>
    <Text style={[styles.badgeText, { color }]}>{label.toUpperCase()}</Text>
  </View>
);

const UrgencyChip = ({ type }) => {
  const map = {
    URGENT: { label: '⚠ URGENT', color: C.red, bg: C.redLight },
    'ACTION REQUIRED': { label: '✔ ACTION REQUIRED', color: C.orange, bg: C.orangeLight },
    RESOLVED: { label: '✓ RESOLVED', color: C.green, bg: C.greenLight },
    POLICY: { label: '● POLICY UPDATE', color: C.purple, bg: C.purpleLight },
    INSTITUTIONAL: { label: '◆ INSTITUTIONAL', color: C.accent, bg: C.accentLight },
    ACADEMIC: { label: 'ACADEMIC', color: C.accent, bg: C.accentLight },
    FINANCE: { label: 'FINANCE', color: C.orange, bg: C.orangeLight },
    HR: { label: 'HUMAN RESOURCES', color: C.purple, bg: C.purpleLight },
  };
  const cfg = map[type] || { label: type, color: C.textLight, bg: C.badgeBg };
  return <Badge label={cfg.label} color={cfg.color} bg={cfg.bg} />;
};

const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// ─── Nav Bar ─────────────────────────────────────────────────────────────────
const NavBar = ({ activeTab, onTab }) => {
  const tabs = ['Analytics', 'Priority Ledger', 'Global Alerts'];
  return (
    <View style={styles.navBar}>
      <Text style={styles.navBrand}>Executive Oversight</Text>
      <View style={styles.navTabs}>
        {tabs.map(t => (
          <TouchableOpacity key={t} onPress={() => onTab(t)} activeOpacity={0.7}>
            <Text style={[styles.navTab, activeTab === t && styles.navTabActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.8}>
        <Text style={styles.emergencyText}>⚡ EMERGENCY BROADCAST</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Priority Alert Card ──────────────────────────────────────────────────────
const PriorityCard = ({ chip, title, body, time, icon }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.priorityCard, pressed && styles.cardPressed]}
      activeOpacity={0.85}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <UrgencyChip type={chip} />
      <Text style={styles.priorityTitle}>{title}</Text>
      <Text style={styles.priorityBody}>{body}</Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeIcon}>{icon}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Announcement Row ─────────────────────────────────────────────────────────
const AnnouncementRow = ({ emoji, title, date, body, chip }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.announcementRow, pressed && styles.cardPressed]}
      activeOpacity={0.85}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View style={styles.announcementIconWrap}>
        <Text style={styles.announcementEmoji}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.announcementTopRow}>
          <Text style={styles.announcementTitle}>{title}</Text>
          <Text style={styles.announcementDate}>{date}</Text>
        </View>
        <Text style={styles.announcementBody} numberOfLines={2}>{body}</Text>
        <UrgencyChip type={chip} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Departmental Update Row ──────────────────────────────────────────────────
const DeptRow = ({ chip, text }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.deptRow, pressed && styles.cardPressed]}
      activeOpacity={0.85}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <UrgencyChip type={chip} />
      <Text style={styles.deptText}>{text}</Text>
    </TouchableOpacity>
  );
};

// ─── Operational Reminder Row ─────────────────────────────────────────────────
const ReminderRow = ({ month, day, title, subtitle }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.reminderRow, pressed && styles.cardPressed]}
      activeOpacity={0.85}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View style={styles.reminderDate}>
        <Text style={styles.reminderMonth}>{month}</Text>
        <Text style={styles.reminderDay}>{day}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Notifications() {
  const [activeTab, setActiveTab] = useState('Priority Ledger');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />
      <NavBar activeTab={activeTab} onTab={setActiveTab} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Page Header ── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Institutional Alerts & Notifications</Text>
          <Text style={styles.pageSubtitle}>
            Executive summary of high-priority strategic indicators, system-wide announcements, and operational department updates for the academic quarter.
          </Text>
        </View>

        {/* ── High-Priority Strategic Alerts ── */}
        <View style={styles.section}>
          <View style={styles.prioritySectionHeader}>
            <View style={styles.redBar} />
            <Text style={styles.prioritySectionTitle}>High-Priority Strategic Alerts</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priorityScroll}>
            <PriorityCard
              chip="URGENT"
              title="Low Attendance Warning for Grade 12"
              body="Current aggregate is 14% below the institutional minimum threshold for the board exams prep cycle."
              time="7 HOURS AGO"
              icon="🕐"
            />
            <PriorityCard
              chip="ACTION REQUIRED"
              title="Pending Budget Approval"
              body="Q3 Science Lab refurbishment budget requires final digital signature from the Director's Office."
              time="3 HOURS AGO"
              icon="🕐"
            />
            <PriorityCard
              chip="URGENT"
              title="Critical Infrastructure Maintenance"
              body="HVAC failure reported in Block C. Technicians on-site. Estimated downtime: 8 hours."
              time="13 MIN AGO"
              icon="⚡"
            />
          </ScrollView>
        </View>

        {/* ── System-Wide Announcements ── */}
        <View style={styles.section}>
          <SectionHeader icon="📢" title="System-Wide Announcements" />
          <View style={styles.card}>
            <AnnouncementRow
              emoji="🎉"
              title="Annual Founder's Day Gala Schedule"
              date="OCT 24, 2023"
              body="The final itinerary for the gala has been published. All faculty members are requested to review their assigned station duties by Friday afternoon."
              chip="INSTITUTIONAL"
            />
            <View style={styles.divider} />
            <AnnouncementRow
              emoji="📋"
              title="Revised Grading Policy Phase-In"
              date="OCT 22, 2023"
              body="The new competency-based assessment framework will begin its pilot phase in the Humanities department starting next week. Training manuals are attached."
              chip="POLICY"
            />
            <View style={styles.divider} />
            <AnnouncementRow
              emoji="🌐"
              title="Internet Connectivity Restored"
              date="OCT 20, 2023"
              body="Service interruption reported on Oct 19th has been resolved. Full high-speed bandwidth is now available across all campus WiFi zones."
              chip="RESOLVED"
            />
          </View>
        </View>

        {/* ── Departmental + Operational side by side on wider screens ── */}
        <View style={styles.twoColRow}>

          {/* ── Departmental Updates ── */}
          <View style={[styles.section, styles.twoColLeft]}>
            <SectionHeader icon="🏛" title="Departmental Updates" />
            <View style={styles.card}>
              <DeptRow chip="ACADEMIC" text="Curriculum alignment for 2024 finalized by the Board of Trustees." />
              <View style={styles.divider} />
              <DeptRow chip="FINANCE" text="Audited financial statements for H1 now available in the ledger portal." />
              <View style={styles.divider} />
              <DeptRow chip="HR" text="Three new faculty members onboarded for the STEM department." />
            </View>
          </View>

          {/* ── Operational Reminders ── */}
          <View style={[styles.section, styles.twoColRight]}>
            <SectionHeader icon="📅" title="Operational Reminders" />
            <View style={styles.card}>
              <ReminderRow month="OCT" day="28" title="Parent-Teacher Meeting" subtitle="Main Auditorium • 09:00 AM" />
              <View style={styles.divider} />
              <ReminderRow month="NOV" day="02" title="Board Governance Meeting" subtitle="Conference Room 1A • 12:00 PM" />
              <View style={styles.divider} />
              <ReminderRow month="NOV" day="10" title="National Educational Holiday" subtitle="Campus Closed" />
            </View>
          </View>
        </View>

        {/* ── Compliance Pulse ── */}
        <TouchableOpacity style={styles.complianceCard} activeOpacity={0.88}>
          <View>
            <View style={styles.compliancePulseRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.compliancePulseLabel}>INSTITUTIONAL PULSE</Text>
            </View>
            <Text style={styles.complianceHeading}>Overall Safety &{'\n'}Compliance Status</Text>
            <View style={styles.complianceScoreRow}>
              <Text style={styles.complianceScore}>98.4%</Text>
              <Text style={styles.complianceDelta}> +0.2%</Text>
            </View>
            <Text style={styles.complianceBody}>
              All security protocols, health inspections, and fire safety audits are currently up to date. The institution maintains a 'Gold Standard' executive rating for operational safety.
            </Text>
          </View>
          <View style={styles.complianceBadge}>
            <Text style={styles.complianceBadgeLabel}>COMPLIANCE RATING</Text>
            <Text style={styles.complianceBadgeValue}>OPTIMAL</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.navy,
  },

  // ── NavBar
  navBar: {
    backgroundColor: C.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: 'wrap',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.navyLight,
  },
  navBrand: {
    color: C.white,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.3,
    marginRight: 12,
  },
  navTabs: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    flexWrap: 'wrap',
  },
  navTab: {
    color: '#8A9CC8',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    fontWeight: '500',
  },
  navTabActive: {
    backgroundColor: '#2B3A5A',
    color: C.white,
  },
  emergencyBtn: {
    backgroundColor: C.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  emergencyText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Scroll
  scroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // ── Page Header
  pageHeader: {
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: C.textMid,
    lineHeight: 19,
  },

  // ── Sections
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
    letterSpacing: 0.2,
  },

  // ── Priority Alerts
  prioritySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  redBar: {
    width: 4,
    height: 18,
    backgroundColor: C.red,
    borderRadius: 2,
  },
  prioritySectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
  },
  priorityScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  priorityCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 14,
    width: 220,
    marginRight: 12,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  priorityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginTop: 8,
    marginBottom: 6,
  },
  priorityBody: {
    fontSize: 12,
    color: C.textMid,
    lineHeight: 17,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeIcon: {
    fontSize: 11,
  },
  timeText: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: '500',
  },

  // ── Card wrapper
  card: {
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.992 }],
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },

  // ── Badge
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // ── Announcements
  announcementRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  announcementIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementEmoji: {
    fontSize: 18,
  },
  announcementTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  announcementTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    flex: 1,
    marginRight: 8,
  },
  announcementDate: {
    fontSize: 10,
    color: C.textLight,
    fontWeight: '500',
  },
  announcementBody: {
    fontSize: 12,
    color: C.textMid,
    lineHeight: 17,
    marginBottom: 2,
  },

  // ── Two column layout
  twoColRow: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 0,
  },
  twoColLeft: {
    flex: isWeb ? 1 : undefined,
  },
  twoColRight: {
    flex: isWeb ? 1 : undefined,
  },

  // ── Departmental
  deptRow: {
    padding: 14,
    gap: 6,
  },
  deptText: {
    fontSize: 12,
    color: C.textMid,
    lineHeight: 17,
    marginTop: 4,
  },

  // ── Reminders
  reminderRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    alignItems: 'center',
  },
  reminderDate: {
    width: 42,
    height: 42,
    backgroundColor: C.accentLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: C.accent,
    letterSpacing: 0.5,
  },
  reminderDay: {
    fontSize: 18,
    fontWeight: '800',
    color: C.accent,
    lineHeight: 22,
  },
  reminderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
  },
  reminderSubtitle: {
    fontSize: 11,
    color: C.textLight,
    marginTop: 2,
  },

  // ── Compliance Card
  complianceCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: C.navy,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  compliancePulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green,
  },
  compliancePulseLabel: {
    fontSize: 10,
    color: '#8A9CC8',
    fontWeight: '700',
    letterSpacing: 1,
  },
  complianceHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: C.white,
    lineHeight: 24,
    marginBottom: 8,
  },
  complianceScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  complianceScore: {
    fontSize: 36,
    fontWeight: '900',
    color: C.white,
  },
  complianceDelta: {
    fontSize: 14,
    fontWeight: '700',
    color: C.green,
    marginLeft: 4,
  },
  complianceBody: {
    fontSize: 11,
    color: '#8A9CC8',
    lineHeight: 16,
    maxWidth: 220,
  },
  complianceBadge: {
    backgroundColor: C.green,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  complianceBadgeLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 0.5,
    opacity: 0.85,
  },
  complianceBadgeValue: {
    fontSize: 11,
    fontWeight: '800',
    color: C.white,
    marginTop: 2,
  },
});