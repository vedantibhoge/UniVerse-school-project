import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
  Platform,
  StatusBar,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// ─── Color Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: '#F4F6FA',
  surface: '#FFFFFF',
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  primaryDark: '#1D4ED8',
  text: '#111827',
  textSub: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderFocus: '#2563EB',
  success: '#10B981',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  tagBg: '#F3F4F6',
  platinum: '#FFF7ED',
  platinumText: '#92400E',
  activeGreen: '#D1FAE5',
  activeGreenText: '#065F46',
  shadow: '#00000012',
  toggleOff: '#D1D5DB',
  toggleOn: '#2563EB',
};

// ─── Expandable Section Hook ─────────────────────────────────────────────────
function useExpand(initial = false) {
  const [open, setOpen] = useState(initial);
  const anim = useRef(new Animated.Value(initial ? 1 : 0)).current;
  const toggle = () => {
    const next = !open;
    setOpen(next);
    Animated.spring(anim, {
      toValue: next ? 1 : 0,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  };
  return { open, toggle, anim };
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const handle = () => {
    const next = !value;
    Animated.timing(anim, { toValue: next ? 1 : 0, duration: 180, useNativeDriver: false }).start();
    onChange(next);
  };
  const bg = anim.interpolate({ inputRange: [0, 1], outputRange: [C.toggleOff, C.toggleOn] });
  const tx = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handle} accessibilityRole="switch">
      <Animated.View style={[styles.toggleTrack, { backgroundColor: bg }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: tx }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionTitle({ label }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <Text style={styles.infoIcon}>{icon}</Text>
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Edit Field ───────────────────────────────────────────────────────────────
function EditField({ label, value, onChange, secureTextEntry, keyboardType }) {
  return (
    <View style={styles.editField}>
      <Text style={styles.editLabel}>{label}</Text>
      <TextInput
        style={styles.editInput}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        placeholderTextColor={C.textMuted}
        autoCapitalize="none"
      />
    </View>
  );
}

const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // navigate to login screen
          navigation.replace('Login'); 
        },
      },
    ]
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ParentPortalProfile({ navigation }) {
  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    email: 'alex.thompson@example.com',
    phone: '+1 (555) 012-3456',
    address: '742 Evergreen Terrace, Springfield, OR',
  });
  const [editInfo, setEditInfo] = useState({ ...personalInfo });
  const personalExpand = useExpand(false);

  // Password state
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const passwordExpand = useExpand(false);

  // Notifications state
  const [notifs, setNotifs] = useState({
    attendance: true,
    homework: true,
    feeReminders: false,
  });

  // Students state
  const students = [
    { id: 'AZ-2023-902', name: 'Leo Miller', grade: '5-B', status: 'ACTIVE', avatar: '👦', dob: 'Mar 12, 2013', bloodGroup: 'B+', teacher: 'Ms. Hernandez', section: 'Section B', roll: '14' },
    { id: 'AZ-2023-441', name: 'Maya Miller', grade: '2-A', status: 'ACTIVE', avatar: '👧', dob: 'Jul 5, 2016', bloodGroup: 'O+', teacher: 'Mr. Patel', section: 'Section A', roll: '07' },
  ];
  const [expandedStudent, setExpandedStudent] = useState(null);

  const toggleStudent = (id) => setExpandedStudent(prev => (prev === id ? null : id));

  // Handlers
  const handleSavePersonal = () => {
    setPersonalInfo({ ...editInfo });
    personalExpand.toggle();
    Alert.alert('Saved', 'Personal information updated successfully.');
  };

  const handleDiscardPersonal = () => {
    setEditInfo({ ...personalInfo });
    personalExpand.toggle();
  };

  const handleUpdatePassword = () => {
    if (!passwords.current) return Alert.alert('Error', 'Please enter your current password.');
    if (passwords.next.length < 6) return Alert.alert('Error', 'New password must be at least 6 characters.');
    if (passwords.next !== passwords.confirm) return Alert.alert('Error', 'Passwords do not match.');
    setPasswords({ current: '', next: '', confirm: '' });
    passwordExpand.toggle();
    Alert.alert('Success', 'Password updated successfully.');
  };
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page Title ── */}
        <Text style={styles.pageTitle}>Parent Portal</Text>

        {/* ── Hero Card ── */}
        <Card style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeText}>✏️</Text>
              </View>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>Alex Thompson</Text>
              <Text style={styles.heroRole}>✅ Primary Guardian</Text>
              <View style={styles.heroTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>MEMBER SINCE 2021</Text>
                </View>
                <View style={[styles.tag, styles.tagPlatinum]}>
                  <Text style={[styles.tagText, styles.tagPlatinumText]}>FAMILY TIER: PLATINUM</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* ── Upcoming Events Banner ── */}
        <View style={styles.eventBanner}>
          <Text style={styles.eventSub}>Upcoming Events</Text>
          <Text style={styles.eventTitle}>Parent-Teacher Meeting</Text>
          <View style={styles.eventDateRow}>
            <Text style={styles.eventIcon}>📅</Text>
            <Text style={styles.eventDate}>Oct 14, 2023 • 04:30 PM</Text>
          </View>
        </View>

        {/* ── Personal Information ── */}
        <Card>
          <View style={styles.cardHeader}>
            <SectionTitle label="Personal Information" />
            <TouchableOpacity
              onPress={() => { setEditInfo({ ...personalInfo }); personalExpand.toggle(); }}
              style={styles.editBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.editBtnText}>{personalExpand.open ? 'Cancel' : 'Edit ›'}</Text>
            </TouchableOpacity>
          </View>

          {!personalExpand.open && (
            <>
              <InfoRow icon="✉️" label="EMAIL ADDRESS" value={personalInfo.email} />
              <InfoRow icon="📞" label="PHONE NUMBER" value={personalInfo.phone} />
              <InfoRow icon="📍" label="HOME ADDRESS" value={personalInfo.address} />
            </>
          )}

          {personalExpand.open && (
            <View style={styles.expandBody}>
              <EditField label="Email Address" value={editInfo.email} onChange={v => setEditInfo(p => ({ ...p, email: v }))} keyboardType="email-address" />
              <EditField label="Phone Number" value={editInfo.phone} onChange={v => setEditInfo(p => ({ ...p, phone: v }))} keyboardType="phone-pad" />
              <EditField label="Home Address" value={editInfo.address} onChange={v => setEditInfo(p => ({ ...p, address: v }))} />
              <View style={styles.expandActions}>
                <TouchableOpacity style={styles.btnDiscard} onPress={handleDiscardPersonal} activeOpacity={0.7}>
                  <Text style={styles.btnDiscardText}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSave} onPress={handleSavePersonal} activeOpacity={0.7}>
                  <Text style={styles.btnSaveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>

        {/* ── Account Settings ── */}
        <Card>
          <SectionTitle label="Account Settings" />

          {/* Password */}
          <View style={styles.passwordRow}>
            <View>
              <Text style={styles.settingLabel}>Password</Text>
              <Text style={styles.settingMeta}>Last changed 3 months ago</Text>
            </View>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={passwordExpand.toggle}
              activeOpacity={0.7}
            >
              <Text style={styles.updateBtnText}>{passwordExpand.open ? 'Cancel' : 'Update'}</Text>
            </TouchableOpacity>
          </View>

          {passwordExpand.open && (
            <View style={styles.expandBody}>
              <EditField label="Current Password" value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current: v }))} secureTextEntry />
              <EditField label="New Password" value={passwords.next} onChange={v => setPasswords(p => ({ ...p, next: v }))} secureTextEntry />
              <EditField label="Confirm New Password" value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} secureTextEntry />
              <View style={styles.expandActions}>
                <TouchableOpacity style={styles.btnDiscard} onPress={() => { setPasswords({ current: '', next: '', confirm: '' }); passwordExpand.toggle(); }} activeOpacity={0.7}>
                  <Text style={styles.btnDiscardText}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSave} onPress={handleUpdatePassword} activeOpacity={0.7}>
                  <Text style={styles.btnSaveText}>Update Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Notification Preferences */}
          <View style={styles.notifSection}>
            <Text style={styles.notifHeading}>NOTIFICATION PREFERENCES</Text>
            {[
              { key: 'attendance', icon: '🔔', label: 'Attendance Alerts' },
              { key: 'homework', icon: '✉️', label: 'Homework Summaries' },
              { key: 'feeReminders', icon: '💬', label: 'Fee Reminders (SMS)' },
            ].map(item => (
              <View key={item.key} style={styles.notifRow}>
                <View style={styles.notifLeft}>
                  <Text style={styles.notifIcon}>{item.icon}</Text>
                  <Text style={styles.notifLabel}>{item.label}</Text>
                </View>
                <Toggle
                  value={notifs[item.key]}
                  onChange={v => setNotifs(p => ({ ...p, [item.key]: v }))}
                />
              </View>
            ))}
          </View>
        </Card>

        {/* ── Associated Students ── */}
        <Card>
          <SectionTitle label="Associated Students" />
          {students.map(student => (
            <View key={student.id} style={styles.studentCard}>
              <TouchableOpacity
                style={styles.studentRow}
                onPress={() => toggleStudent(student.id)}
                activeOpacity={0.75}
              >
                <View style={styles.studentAvatarCircle}>
                  <Text style={styles.studentAvatarEmoji}>{student.avatar}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <View style={styles.studentNameRow}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>{student.status}</Text>
                    </View>
                  </View>
                  <View style={styles.studentMeta}>
                    <Text style={styles.studentMetaText}>🎓 Grade {student.grade}</Text>
                    <Text style={styles.studentMetaText}>  🪪 ID: {student.id}</Text>
                  </View>
                </View>
                <Text style={styles.studentChevron}>{expandedStudent === student.id ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {expandedStudent === student.id && (
                <View style={styles.studentDetails}>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailGrid}>
                    {[
                      { label: 'Full Name', value: student.name },
                      { label: 'Student ID', value: student.id },
                      { label: 'Grade & Section', value: `Grade ${student.grade} • ${student.section}` },
                      { label: 'Roll Number', value: student.roll },
                      { label: 'Date of Birth', value: student.dob },
                      { label: 'Blood Group', value: student.bloodGroup },
                      { label: 'Class Teacher', value: student.teacher },
                      { label: 'Status', value: student.status },
                    ].map(item => (
                      <View key={item.label} style={styles.detailItem}>
                        <Text style={styles.detailLabel}>{item.label}</Text>
                        <Text style={styles.detailValue}>{item.value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </Card>

        {/* ── Logout ── */}
        

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: isTablet ? 32 : 16,
    paddingBottom: 24,
    gap: 16,
  },
  pageTitle: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: '700',
    color: C.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },

  // Card
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: isTablet ? 24 : 18,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -0.2,
  },

  // Hero
  heroCard: { flexDirection: 'column', gap: 0 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrap: { position: 'relative' },
  avatarCircle: {
    width: isTablet ? 88 : 72,
    height: isTablet ? 88 : 72,
    borderRadius: isTablet ? 44 : 36,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: isTablet ? 40 : 34 },
  avatarBadge: {
    position: 'absolute',
    bottom: 0, right: 0,
    backgroundColor: C.primary,
    borderRadius: 12,
    width: 24, height: 24,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.surface,
  },
  avatarBadgeText: { fontSize: 11 },
  heroInfo: { flex: 1, gap: 4 },
  heroName: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.4,
  },
  heroRole: { fontSize: 13, color: C.primary, fontWeight: '600' },
  heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag: {
    backgroundColor: C.tagBg,
    borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  tagText: { fontSize: 10, fontWeight: '700', color: C.textSub, letterSpacing: 0.5 },
  tagPlatinum: { backgroundColor: C.platinum },
  tagPlatinumText: { color: C.platinumText },

  // Event Banner
  eventBanner: {
    backgroundColor: C.primary,
    borderRadius: 16,
    padding: isTablet ? 22 : 18,
    gap: 6,
  },
  eventSub: { fontSize: 12, color: '#93C5FD', fontWeight: '600', letterSpacing: 0.5 },
  eventTitle: { fontSize: isTablet ? 22 : 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.4 },
  eventDateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  eventIcon: { fontSize: 14 },
  eventDate: { fontSize: 14, color: '#BFDBFE', fontWeight: '500' },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  infoIconBox: {
    width: 42, height: 42,
    borderRadius: 12,
    backgroundColor: C.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 10, color: C.textMuted, fontWeight: '700', letterSpacing: 0.8 },
  infoValue: { fontSize: 14, color: C.text, fontWeight: '500', marginTop: 1 },

  // Edit
  editBtn: {
    paddingVertical: 5, paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: C.primaryLight,
  },
  editBtnText: { fontSize: 13, color: C.primary, fontWeight: '700' },
  expandBody: { gap: 12, marginTop: 4 },
  editField: { gap: 5 },
  editLabel: { fontSize: 11, color: C.textSub, fontWeight: '700', letterSpacing: 0.5 },
  editInput: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.surface,
  },
  expandActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  btnDiscard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
  },
  btnDiscardText: { fontSize: 14, color: C.textSub, fontWeight: '700' },
  btnSave: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: C.primary,
    alignItems: 'center',
  },
  btnSaveText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },

  // Password row
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: { fontSize: 15, fontWeight: '700', color: C.text },
  settingMeta: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  updateBtn: {
    paddingVertical: 7, paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: C.primaryLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  updateBtnText: { fontSize: 13, color: C.primary, fontWeight: '700' },

  // Notifications
  notifSection: { gap: 4, marginTop: 4 },
  notifHeading: {
    fontSize: 10, color: C.textMuted,
    fontWeight: '700', letterSpacing: 1,
    marginBottom: 8,
  },
  notifRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  notifLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifIcon: { fontSize: 18 },
  notifLabel: { fontSize: 14, color: C.text, fontWeight: '500' },
  toggleTrack: {
    width: 48, height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  // Students
  studentCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    overflow: 'hidden',
    backgroundColor: C.surface,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  studentAvatarCircle: {
    width: 46, height: 46,
    borderRadius: 23,
    backgroundColor: '#E0E7FF',
    alignItems: 'center', justifyContent: 'center',
  },
  studentAvatarEmoji: { fontSize: 24 },
  studentInfo: { flex: 1 },
  studentNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  studentName: { fontSize: 15, fontWeight: '700', color: C.text },
  activeTag: {
    backgroundColor: C.activeGreen,
    borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2,
  },
  activeTagText: { fontSize: 9, fontWeight: '800', color: C.activeGreenText, letterSpacing: 0.5 },
  studentMeta: { flexDirection: 'row', marginTop: 3 },
  studentMetaText: { fontSize: 12, color: C.textSub },
  studentChevron: { fontSize: 11, color: C.textMuted, paddingLeft: 4 },
  studentDetails: { paddingHorizontal: 14, paddingBottom: 14 },
  detailDivider: { height: 1, backgroundColor: C.border, marginBottom: 14 },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: { width: isTablet ? '22%' : '46%' },
  detailLabel: { fontSize: 10, color: C.textMuted, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  detailValue: { fontSize: 13, color: C.text, fontWeight: '600' },

  // Logout
  logoutCard: { borderWidth: 1.5, borderColor: '#FECACA' },
  logoutTitle: { fontSize: 16, fontWeight: '800', color: C.danger },
  logoutSub: { fontSize: 13, color: C.textSub, marginTop: -6 },
  logoutBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.danger,
    alignItems: 'center',
    marginTop: 2,
  },
  logoutBtnText: { fontSize: 15, fontWeight: '700', color: C.danger },
});