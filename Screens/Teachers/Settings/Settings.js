import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Switch, Alert, Platform, TextInput,
} from 'react-native';

// ─── Change Password Screen ───────────────────────────────────────────────────
function ChangePasswordScreen({ onBack, isDark, theme }) {
  const [current, setCurrent]   = useState('');
  const [newPass, setNewPass]   = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]     = useState({});
  const [saved, setSaved]       = useState(false);

  const validate = () => {
    const e = {};
    if (!current)              e.current = 'Current password is required.';
    if (!newPass)              e.newPass = 'New password is required.';
    else if (newPass.length < 6) e.newPass = 'Password must be at least 6 characters.';
    if (!confirm)              e.confirm = 'Please confirm your new password.';
    else if (newPass !== confirm) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 1800);
  };

  const t = theme;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: t.bg }]}>
      <View style={[s.screenHeader, { backgroundColor: t.card, borderBottomColor: t.border }]}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={[s.backArrow, { color: t.accent }]}>←</Text>
        </TouchableOpacity>
        <Text style={[s.screenTitle, { color: t.text }]}>Change Password</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        {saved ? (
          <View style={[s.successBox, { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
            <Text style={s.successIcon}>✅</Text>
            <Text style={s.successText}>Password changed successfully!</Text>
          </View>
        ) : null}

        {/* Info banner */}
        <View style={[s.infoBanner, { backgroundColor: t.accent + '14', borderColor: t.accent + '44' }]}>
          <Text style={[s.infoBannerText, { color: t.accent }]}>
            Use at least 6 characters with a mix of letters and numbers.
          </Text>
        </View>

        {/* Fields */}
        {[
          { label: 'Current Password',  value: current,  setter: setCurrent,  show: showCurrent,  toggleShow: () => setShowCurrent(p => !p),  err: errors.current, key: 'current' },
          { label: 'New Password',      value: newPass,  setter: setNewPass,  show: showNew,      toggleShow: () => setShowNew(p => !p),      err: errors.newPass, key: 'newPass' },
          { label: 'Confirm Password',  value: confirm,  setter: setConfirm,  show: showConfirm,  toggleShow: () => setShowConfirm(p => !p),  err: errors.confirm, key: 'confirm' },
        ].map(field => (
          <View key={field.key} style={s.fieldWrap}>
            <Text style={[s.fieldLabel, { color: t.subtext }]}>{field.label}</Text>
            <View style={[
              s.inputRow,
              { backgroundColor: t.inputBg, borderColor: field.err ? '#E53935' : t.border },
            ]}>
              <TextInput
                style={[s.textInput, { color: t.text }]}
                value={field.value}
                onChangeText={(v) => { field.setter(v); setErrors(p => ({ ...p, [field.key]: '' })); }}
                secureTextEntry={!field.show}
                placeholder="••••••••"
                placeholderTextColor={t.placeholder}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={field.toggleShow} style={s.eyeBtn}>
                <Text style={[s.eyeIcon, { color: t.subtext }]}>{field.show ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
            {field.err ? <Text style={s.fieldErr}>{field.err}</Text> : null}
          </View>
        ))}

        {/* Strength indicator for new password */}
        {newPass.length > 0 && (
          <View style={s.strengthWrap}>
            <Text style={[s.strengthLabel, { color: t.subtext }]}>Strength:</Text>
            {['Weak','Fair','Good','Strong'].map((lvl, i) => {
              const filled = newPass.length >= [1, 4, 7, 10][i];
              return (
                <View key={lvl} style={[s.strengthBar, {
                  backgroundColor: filled
                    ? ['#E53935','#FB8C00','#FDD835','#43A047'][i]
                    : t.border,
                }]} />
              );
            })}
            <Text style={[s.strengthLevel, {
              color: newPass.length >= 10 ? '#43A047' : newPass.length >= 7 ? '#FDD835' : newPass.length >= 4 ? '#FB8C00' : '#E53935',
            }]}>
              {newPass.length >= 10 ? 'Strong' : newPass.length >= 7 ? 'Good' : newPass.length >= 4 ? 'Fair' : 'Weak'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[s.savePwBtn, { backgroundColor: t.accent }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={s.savePwBtnText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.cancelPwBtn, { borderColor: t.border }]}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Text style={[s.cancelPwBtnText, { color: t.subtext }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Logged Out Screen ────────────────────────────────────────────────────────
function LoggedOutScreen({ onLogin }) {
  return (
    <SafeAreaView style={[s.container, { backgroundColor: '#F5F8FF', alignItems: 'center', justifyContent: 'center' }]}>
      <View style={s.logoutCard}>
        <View style={s.logoutIconCircle}>
          <Text style={s.logoutIcon}>👋</Text>
        </View>
        <Text style={s.logoutTitle}>You've been logged out</Text>
        <Text style={s.logoutSub}>Thank you for using EduCurator Teacher Portal.</Text>
        <TouchableOpacity
          style={s.loginAgainBtn}
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <Text style={s.loginAgainText}>Log In Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Edit Profile Screen ─────────────────────────────────────────────────────
function EditProfileScreen({ profile, onBack, onSave, theme }) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);

  const handleSave = () => {
    if (!name.trim() || !role.trim()) {
      Alert.alert('Missing Details', 'Please fill all profile fields.');
      return;
    }
    onSave({ name: name.trim(), role: role.trim() });
    Alert.alert('Profile Updated', 'Your profile has been updated.');
    onBack();
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: theme.bg }]}>
      <View style={[s.screenHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={[s.backArrow, { color: theme.accent }]}>←</Text>
        </TouchableOpacity>
        <Text style={[s.screenTitle, { color: theme.text }]}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border, padding: 16 }]}> 
          <Text style={[s.fieldLabel, { color: theme.subtext }]}>Full Name</Text>
          <TextInput
            style={[s.editInput, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            placeholderTextColor={theme.placeholder}
          />

          <Text style={[s.fieldLabel, { color: theme.subtext, marginTop: 12 }]}>Role / Description</Text>
          <TextInput
            style={[s.editInput, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.border }]}
            value={role}
            onChangeText={setRole}
            placeholder="e.g. Physics Teacher · Class 10-A, 10-B"
            placeholderTextColor={theme.placeholder}
          />

          <TouchableOpacity style={[s.savePwBtn, { backgroundColor: theme.accent, marginTop: 16 }]} onPress={handleSave}>
            <Text style={s.savePwBtnText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Notification Destination Screen ─────────────────────────────────────────
function NotificationDestinationScreen({ notification, onBack, theme }) {
  if (!notification) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: theme.bg }]}>
        <View style={[s.screenHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onBack} style={s.backBtn}>
            <Text style={[s.backArrow, { color: theme.accent }]}>←</Text>
          </TouchableOpacity>
          <Text style={[s.screenTitle, { color: theme.text }]}>Notification</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: theme.bg }]}>
      <View style={[s.screenHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={[s.backArrow, { color: theme.accent }]}>←</Text>
        </TouchableOpacity>
        <Text style={[s.screenTitle, { color: theme.text }]}>{notification.page}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border, padding: 16 }]}> 
          <Text style={[s.destTitle, { color: theme.text }]}>{notification.title}</Text>
          <Text style={[s.destMsg, { color: theme.subtext }]}>{notification.msg}</Text>
          <Text style={[s.destPage, { color: theme.accent }]}>Opened Page: {notification.page}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Main Settings Screen ─────────────────────────────────────────────────────
export default function TeacherSettings() {
  const [screen, setScreen]             = useState('settings'); // 'settings' | 'changePassword' | 'loggedOut'
  const [notifications, setNotifications] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(false);
  const [examReminders, setExamReminders]       = useState(true);
  const [darkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rahul Singh',
    role: 'Physics Teacher · Class 10-A, 10-B',
  });
  const [inAppNotifications, setInAppNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // ── Theme tokens ──
  const theme = darkMode ? {
    bg: '#0F172A', card: '#1E293B', border: '#334155',
    text: '#F1F5F9', subtext: '#94A3B8', accent: '#60A5FA',
    inputBg: '#0F172A', placeholder: '#475569',
    sectionLabel: '#475569', danger: '#FCA5A5',
    dangerBg: '#3B1C1C', dangerText: '#FCA5A5',
    rowBg: '#1E293B', mutedBg: '#273549',
  } : {
    bg: '#F5F8FF', card: '#FFFFFF', border: '#E8EAED',
    text: '#1A1A2E', subtext: '#666', accent: '#1B3FA0',
    inputBg: '#F8F9FF', placeholder: '#BBB',
    sectionLabel: '#999', danger: '#D32F2F',
    dangerBg: '#FFE8E8', dangerText: '#D32F2F',
    rowBg: '#FFFFFF', mutedBg: '#F5F8FF',
  };

  // ── Notification trigger ──
  const triggerNotification = (type) => {
    const messages = {
      assignment: { title: '📚 Assignment Alert', msg: 'Kinematics Problems due tomorrow for Class 10-A.', page: 'Homework' },
      attendance:  { title: '📋 Attendance Reminder', msg: 'You have not marked attendance for Class 11-A today.', page: 'Attendance' },
      exam:        { title: '📝 Exam Reminder', msg: 'Science Midterm is scheduled for next Tuesday.', page: 'Exam Reminders' },
    };
    const n = { ...messages[type], id: `${Date.now()}-${type}` };
    setInAppNotifications((prev) => [n, ...prev].slice(0, 8));
    Alert.alert(n.title, n.msg, [
      { text: 'Dismiss' },
      {
        text: 'Open',
        onPress: () => {
          setSelectedNotification(n);
          setScreen('notificationDestination');
        },
      },
    ]);
  };

  const handleNotificationToggle = (val) => {
    setNotifications(val);
    if (val) Alert.alert('🔔 Notifications Enabled', 'You will now receive all enabled alerts.', [{ text: 'OK' }]);
    else Alert.alert('🔕 Notifications Disabled', 'You will no longer receive any alerts.', [{ text: 'OK' }]);
  };

  if (screen === 'changePassword') {
    return <ChangePasswordScreen onBack={() => setScreen('settings')} isDark={darkMode} theme={theme} />;
  }
  if (screen === 'editProfile') {
    return (
      <EditProfileScreen
        profile={profile}
        onBack={() => setScreen('settings')}
        onSave={setProfile}
        theme={theme}
      />
    );
  }
  if (screen === 'notificationDestination') {
    return (
      <NotificationDestinationScreen
        notification={selectedNotification}
        onBack={() => setScreen('settings')}
        theme={theme}
      />
    );
  }
  if (screen === 'loggedOut') {
    return <LoggedOutScreen onLogin={() => setScreen('settings')} />;
  }

  // ─── Settings home ──────────────────────────────────────────────────────────
  const SectionLabel = ({ label }) => (
    <Text style={[s.sectionLabel, { color: theme.sectionLabel }]}>{label}</Text>
  );

  const SettingRow = ({ icon, label, desc, right, onPress, noBorder }) => (
    <TouchableOpacity
      style={[s.settingRow, { borderBottomColor: theme.border }, noBorder && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[s.settingIconBox, { backgroundColor: theme.mutedBg }]}>
        <Text style={s.settingIconText}>{icon}</Text>
      </View>
      <View style={s.settingTextWrap}>
        <Text style={[s.settingLabel2, { color: theme.text }]}>{label}</Text>
        {desc ? <Text style={[s.settingDesc, { color: theme.subtext }]}>{desc}</Text> : null}
      </View>
      <View style={s.settingRight}>{right}</View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: theme.bg }]}>
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={[s.title, { color: theme.text }]}>Settings</Text>
          <Text style={[s.subtitle, { color: theme.subtext }]}>Manage your preferences</Text>
        </View>

        {/* ── Profile Card ── */}
        <View style={[s.profileCard, { backgroundColor: theme.accent }]}>
          <View style={s.profileAvatar}>
            <Text style={s.profileAvatarText}>RS</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>{profile.name}</Text>
            <Text style={s.profileRole}>{profile.role}</Text>
          </View>
          <TouchableOpacity
            style={s.editProfileBtn}
            onPress={() => setScreen('editProfile')}
            activeOpacity={0.8}
          >
            <Text style={s.editProfileBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Notifications ── */}
        <SectionLabel label="NOTIFICATIONS" />
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <SettingRow
            icon="🔔"
            label="Enable Notifications"
            desc="Master toggle for all alerts"
            right={
              <Switch
                value={notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#E0E0E0', true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="📚"
            label="Assignment Alerts"
            desc="Notify when students submit homework"
            right={
              <Switch
                value={notifications && assignmentAlerts}
                onValueChange={(v) => {
                  if (!notifications) { Alert.alert('Enable Notifications', 'Please enable the master notifications toggle first.'); return; }
                  setAssignmentAlerts(v);
                  if (v) triggerNotification('assignment');
                }}
                trackColor={{ false: '#E0E0E0', true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="📋"
            label="Attendance Reminders"
            desc="Daily reminder to mark attendance"
            right={
              <Switch
                value={notifications && attendanceAlerts}
                onValueChange={(v) => {
                  if (!notifications) { Alert.alert('Enable Notifications', 'Please enable the master notifications toggle first.'); return; }
                  setAttendanceAlerts(v);
                  if (v) triggerNotification('attendance');
                }}
                trackColor={{ false: '#E0E0E0', true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="📝"
            label="Exam Reminders"
            desc="Alerts before scheduled exams"
            noBorder
            right={
              <Switch
                value={notifications && examReminders}
                onValueChange={(v) => {
                  if (!notifications) { Alert.alert('Enable Notifications', 'Please enable the master notifications toggle first.'); return; }
                  setExamReminders(v);
                  if (v) triggerNotification('exam');
                }}
                trackColor={{ false: '#E0E0E0', true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* ── Test notification button ── */}
        {notifications && (
          <>
            <TouchableOpacity
              style={[s.testNotifBtn, { backgroundColor: theme.accent + '18', borderColor: theme.accent + '44' }]}
              activeOpacity={0.8}
              onPress={() => {
                const types = [];
                if (assignmentAlerts) types.push('assignment');
                if (attendanceAlerts)  types.push('attendance');
                if (examReminders)     types.push('exam');
                if (types.length === 0) { Alert.alert('No Alerts Enabled', 'Enable at least one alert type above.'); return; }
                triggerNotification(types[Math.floor(Math.random() * types.length)]);
              }}
            >
              <Text style={[s.testNotifText, { color: theme.accent }]}>🔔  Send Test Notification</Text>
            </TouchableOpacity>

            {inAppNotifications.length > 0 && (
              <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
                {inAppNotifications.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[s.notificationRow, { borderBottomColor: theme.border }, index === inAppNotifications.length - 1 && { borderBottomWidth: 0 }]}
                    onPress={() => {
                      setSelectedNotification(item);
                      setScreen('notificationDestination');
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={[s.notificationDot, { backgroundColor: theme.accent }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[s.notificationTitle, { color: theme.text }]}>{item.title}</Text>
                      <Text style={[s.notificationMsg, { color: theme.subtext }]} numberOfLines={2}>{item.msg}</Text>
                      <Text style={[s.notificationPage, { color: theme.accent }]}>Open {item.page}</Text>
                    </View>
                    <Text style={[s.chevron, { color: theme.subtext }]}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* ── Account ── */}
        <SectionLabel label="ACCOUNT" />
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <SettingRow
            icon="🔑"
            label="Change Password"
            desc="Update your account password"
            onPress={() => setScreen('changePassword')}
            right={<Text style={[s.chevron, { color: theme.subtext }]}>›</Text>}
          />
          <SettingRow
            icon="🔒"
            label="Two-Factor Auth"
            desc="Add extra security to your account"
            onPress={() => Alert.alert('Two-Factor Auth', '2FA setup coming soon!', [{ text: 'OK' }])}
            right={<Text style={[s.chevron, { color: theme.subtext }]}>›</Text>}
          />
          <SettingRow
            icon="📱"
            label="Linked Devices"
            desc="3 devices currently active"
            onPress={() => Alert.alert('Linked Devices', 'Device management coming soon!', [{ text: 'OK' }])}
            noBorder
            right={<Text style={[s.chevron, { color: theme.subtext }]}>›</Text>}
          />
        </View>

        <Text style={[s.footerNote, { color: theme.sectionLabel }]}>
          EduCurator · Teacher Portal · v1.0.0{'\n'}© 2025 EduCurator Team. All rights reserved.
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  content:   { flex: 1, padding: 16 },

  header:   { marginBottom: 20, marginTop: 8 },
  title:    { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },

  // Screen header
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    ...Platform.select({ web: { boxShadow: '0 1px 4px rgba(0,0,0,0.07)' } }),
    elevation: 2,
  },
  backBtn:    { padding: 4 },
  backArrow:  { fontSize: 22, fontWeight: '600' },
  screenTitle:{ fontSize: 17, fontWeight: 'bold' },

  // Profile
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  profileRole: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  editProfileBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editProfileBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },

  // Card
  card: {
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    }),
  },

  // Setting row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconText: { fontSize: 18 },
  settingTextWrap: { flex: 1 },
  settingLabel2:   { fontSize: 14, fontWeight: '600' },
  settingDesc:     { fontSize: 12, marginTop: 2 },
  settingRight:    { alignItems: 'flex-end' },
  chevron:         { fontSize: 22, fontWeight: '300' },

  // Test notif button
  testNotifBtn: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  testNotifText: { fontWeight: '700', fontSize: 14 },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  notificationMsg: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  notificationPage: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '700',
  },

  // Edit / destination screens
  editInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
  },
  destTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  destMsg: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  destPage: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Theme preview
  themePreview: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  themePreviewLabel: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
  themePreviewRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  themeColorDot:     { width: 16, height: 16, borderRadius: 8 },
  themePreviewMode:  { fontSize: 12, fontWeight: '700', marginLeft: 4 },

  // About
  aboutRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  appIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText:  { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  aboutText:    { flex: 1 },
  aboutAppName: { fontSize: 16, fontWeight: 'bold' },
  aboutVersion: { fontSize: 12, marginTop: 2 },
  aboutTeam:    { fontSize: 11, marginTop: 2 },
  checkUpdateBtn: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
  },
  checkUpdateText: { fontSize: 14, fontWeight: '600' },

  // Logout button
  logoutBtn: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  logoutBtnIcon: { fontSize: 18 },
  logoutBtnText: { fontSize: 16, fontWeight: 'bold' },

  footerNote: { fontSize: 11, textAlign: 'center', lineHeight: 18 },

  // ── Change Password ──
  fieldWrap:  { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  textInput: { flex: 1, paddingVertical: 12, fontSize: 14 },
  eyeBtn:    { padding: 6 },
  eyeIcon:   { fontSize: 16 },
  fieldErr:  { fontSize: 11, color: '#E53935', marginTop: 4 },

  strengthWrap:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  strengthLabel: { fontSize: 12, fontWeight: '600' },
  strengthBar:   { height: 5, flex: 1, borderRadius: 3 },
  strengthLevel: { fontSize: 11, fontWeight: '700' },

  infoBanner: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  infoBannerText: { fontSize: 13, fontWeight: '500', lineHeight: 18 },

  savePwBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  savePwBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  cancelPwBtn: {
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 32,
  },
  cancelPwBtnText: { fontSize: 14, fontWeight: '600' },

  successBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  successIcon: { fontSize: 20 },
  successText: { fontSize: 14, fontWeight: '600', color: '#2E7D32' },

  // ── Logged out ──
  logoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    margin: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 4 },
      web:     { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
    }),
  },
  logoutIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoutIcon:  { fontSize: 32 },
  logoutTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E', textAlign: 'center' },
  logoutSub:   { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
  loginAgainBtn: {
    backgroundColor: '#1B3FA0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
    alignItems: 'center',
  },
  loginAgainText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});