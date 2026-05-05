import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  Switch,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import ITSidebar from './ITSidebar';

const { width } = Dimensions.get('window');

const Settings = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [logActivity, setLogActivity] = useState(true);

  // Change Password State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Export Logs State
  const [exportVisible, setExportVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState('CSV');
  const [isExporting, setIsExporting] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  const handleToggleAutoBackup = (value) => {
    if (!value) {
      Alert.alert(
        'Disable Auto Backup',
        'This will disable scheduled backups. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm', style: 'destructive', onPress: () => setAutoBackup(false) }
        ]
      );
    } else {
      setAutoBackup(true);
    }
  };

  const handleToggleSecurityAlerts = (value) => {
    setSecurityAlerts(value);
    showToast(value ? 'Security Alerts Enabled' : 'Security Alerts Disabled');
  };

  const handleChangePasswordSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    Alert.alert('Success', 'Password changed successfully');
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExportLogs = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportVisible(false);
      setTimeout(() => {
        Alert.alert('Export Successful', `Logs have been exported as ${exportFormat}`);
      }, 500);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="Settings"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={toggleSidebar}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>System Configuration</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Security</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDesc}>Update admin credentials</Text>
              </View>
              <Text style={[styles.arrow, showPasswordForm && { transform: [{ rotate: '90deg' }] }]}>›</Text>
            </View>
            
            {!showPasswordForm ? (
              <TouchableOpacity
                style={styles.settingBtn}
                onPress={() => setShowPasswordForm(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.settingBtnText}>Change</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.passwordForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.btnCancel} onPress={() => setShowPasswordForm(false)}>
                    <Text style={styles.btnCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSubmit} onPress={handleChangePasswordSubmit}>
                    <Text style={styles.btnSubmitText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Security Alerts</Text>
                <Text style={styles.settingDesc}>Receive security notifications</Text>
              </View>
              <Switch value={securityAlerts} onValueChange={handleToggleSecurityAlerts} />
            </View>
          </View>
        </View>

        {/* Backup Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Backup</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto Backup</Text>
                <Text style={styles.settingDesc}>Enable automatic daily backups</Text>
              </View>
              <Switch value={autoBackup} onValueChange={handleToggleAutoBackup} />
            </View>
          </View>
        </View>

        {/* Log Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Logs & Activity</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Log Activity</Text>
                <Text style={styles.settingDesc}>Keep detailed activity logs</Text>
              </View>
              <Switch value={logActivity} onValueChange={setLogActivity} />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Export Logs</Text>
                <Text style={styles.settingDesc}>Download activity logs</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={() => setExportVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.settingBtnText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>System Version:</Text>
              <Text style={styles.aboutValue}>2.0 STABLE</Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>API Version:</Text>
              <Text style={styles.aboutValue}>v2.5.1</Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Last Updated:</Text>
              <Text style={styles.aboutValue}>2024-04-28</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Security Alerts Toast */}
      {toastVisible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Export Logs Modal */}
      <Modal visible={exportVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Export Format</Text>
            
            {isExporting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Generating {exportFormat} file...</Text>
              </View>
            ) : (
              <>
                <View style={styles.formatSelector}>
                  {['CSV', 'JSON', 'PDF'].map((fmt) => (
                    <TouchableOpacity
                      key={fmt}
                      style={[styles.formatOption, exportFormat === fmt && styles.formatOptionActive]}
                      onPress={() => setExportFormat(fmt)}
                    >
                      <Text style={[styles.formatText, exportFormat === fmt && styles.formatTextActive]}>{fmt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.btnCancel} onPress={() => setExportVisible(false)}>
                    <Text style={styles.btnCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSubmit} onPress={handleExportLogs}>
                    <Text style={styles.btnSubmitText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 25,
    paddingTop: StatusBar.currentHeight + 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
    elevation: 2,
  },
  hamburgerBtn: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 6 },
  hamburgerIcon: { fontSize: 24, color: '#1A1A2E', fontWeight: 'bold' },
  spacer: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: '#666880' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 12 },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  settingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingInfo: { flex: 1, marginRight: 12 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 4 },
  settingDesc: { fontSize: 12, color: '#888899' },
  arrow: { fontSize: 18, color: '#CCCCCC' },
  settingBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  settingBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  passwordForm: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 16,
  },
  input: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    marginBottom: 12,
    fontSize: 13,
    color: '#1A1A2E',
  },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    flex: 1,
    alignItems: 'center',
  },
  btnCancelText: { color: '#666880', fontWeight: '600', fontSize: 13 },
  btnSubmit: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1B3FA0',
    flex: 1,
    alignItems: 'center',
  },
  btnSubmitText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  aboutLabel: { fontSize: 13, color: '#888899', fontWeight: '500' },
  aboutValue: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#323232',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 6,
  },
  toastText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 20, textAlign: 'center' },
  formatSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  formatOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  formatOptionActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#EBF4FF',
  },
  formatText: { fontSize: 14, color: '#666880', fontWeight: '600' },
  formatTextActive: { color: '#4A90E2' },
  modalActions: { flexDirection: 'row', gap: 10 },
  loadingContainer: { alignItems: 'center', paddingVertical: 20 },
  loadingText: { marginTop: 12, color: '#666880', fontSize: 14 },
});

export default Settings;
