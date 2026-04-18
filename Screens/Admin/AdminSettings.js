import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  green: '#22C55E',
};

function SettingItem({ icon, title, subtitle, action, value, onPress }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingContent}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {value !== undefined ? (
        <Switch value={value} onValueChange={onPress} />
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
  );
}

export default function AdminSettings({ onBack }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dataBackup, setDataBackup] = useState(false);

  const handleGeneral = (setting) => {
    Alert.alert(
      setting,
      `Current setting: ${setting}`,
      [
        { text: 'Change', onPress: () => Alert.alert('Updated', `${setting} updated!`) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Enter current and new password', [
      { text: 'Change', onPress: () => Alert.alert('Success', 'Password changed!') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleBackup = () => {
    Alert.alert(
      'Database Backup',
      'Backup all school data to cloud?',
      [
        { text: 'Backup Now', onPress: () => Alert.alert('Success', 'Backup completed!') },
        { text: 'Schedule', onPress: () => Alert.alert('Scheduled', 'Backup scheduled for daily!') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Academix',
      'Academix School Management System\nVersion: 2.1.0\nBuild: 2026.04.17\n\n© 2026 Academix Inc.\nAll rights reserved.'
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => Alert.alert('Logged Out', 'You have been logged out successfully'),
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileIcon}>👨‍💼</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Admin Dashboard</Text>
              <Text style={styles.profileEmail}>admin@academix.edu</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleGeneral('Profile')}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="🏫"
            title="School Name"
            subtitle="UniVerse School"
            onPress={() => handleGeneral('School Name')}
          />
          <SettingItem
            icon="📍"
            title="Location"
            subtitle="Delhi, India"
            onPress={() => handleGeneral('Location')}
          />
          <SettingItem
            icon="🗓️"
            title="Academic Year"
            subtitle="2025-2026"
            onPress={() => handleGeneral('Academic Year')}
          />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="🔔"
            title="Notifications"
            subtitle="Receive system notifications"
            value={notificationsEnabled}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <SettingItem
            icon="📧"
            title="Email Alerts"
            subtitle="Receive alerts via email"
            value={emailAlerts}
            onPress={() => setEmailAlerts(!emailAlerts)}
          />
        </View>

        {/* Security */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="🔐"
            title="Change Password"
            subtitle="Update your password"
            onPress={handleChangePassword}
          />
          <SettingItem
            icon="🔒"
            title="Two-Factor Auth"
            subtitle="Enhance security"
            onPress={() => handleGeneral('Two-Factor Authentication')}
          />
        </View>

        {/* Data & Privacy */}
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="☁️"
            title="Auto Backup"
            subtitle="Automatically backup data"
            value={dataBackup}
            onPress={() => setDataBackup(!dataBackup)}
          />
          <SettingItem
            icon="💾"
            title="Database Backup"
            subtitle="Backup all school data"
            onPress={handleBackup}
          />
          <SettingItem
            icon="🗂️"
            title="Data Export"
            subtitle="Export reports and data"
            onPress={() => Alert.alert('Export', 'Exporting data...')}
          />
        </View>

        {/* System */}
        <Text style={styles.sectionTitle}>System</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="ℹ️"
            title="About"
            subtitle="Academix v2.1.0"
            onPress={handleAbout}
          />
          <SettingItem
            icon="📞"
            title="Support"
            subtitle="Contact support team"
            onPress={() => Alert.alert('Support', 'support@academix.edu')}
          />
          <SettingItem
            icon="📝"
            title="Terms & Conditions"
            onPress={() => Alert.alert('Terms', 'Opening terms and conditions...')}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8ECF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileSection: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 10,
  },
  settingsGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  settingArrow: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53935' + '20',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
  },
});
