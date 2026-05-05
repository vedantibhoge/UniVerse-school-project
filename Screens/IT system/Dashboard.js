import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  Modal,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import ITSidebar from './ITSidebar';

const { width } = Dimensions.get('window');

const ITDashboard = ({ navigation }) => {
  const [showEventFeed, setShowEventFeed] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState([]);

  // Reset Password State
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Diagnostics State
  const [diagnosticsVisible, setDiagnosticsVisible] = useState(false);
  const cpuProgress = useRef(new Animated.Value(0)).current;
  const memProgress = useRef(new Animated.Value(0)).current;
  const diskProgress = useRef(new Animated.Value(0)).current;

  const handleBackup = () => {
    navigation.navigate('Backups', { autoStart: true });
  };

  const handleResetPassword = () => {
    setResetPasswordVisible(true);
    setResetSuccess(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const submitPasswordReset = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setResetSuccess(true);
    setTimeout(() => {
      setResetPasswordVisible(false);
    }, 1500);
  };

  const handleDiagnostics = () => {
    setDiagnosticsVisible(true);
    cpuProgress.setValue(0);
    memProgress.setValue(0);
    diskProgress.setValue(0);
    
    Animated.parallel([
      Animated.timing(cpuProgress, { toValue: 45, duration: 1500, useNativeDriver: false, easing: Easing.out(Easing.ease) }),
      Animated.timing(memProgress, { toValue: 68, duration: 1500, useNativeDriver: false, easing: Easing.out(Easing.ease) }),
      Animated.timing(diskProgress, { toValue: 32, duration: 1500, useNativeDriver: false, easing: Easing.out(Easing.ease) }),
    ]).start();
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleEventExpanded = (id) => {
    setExpandedEvents(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const events = [
    {
      id: 1,
      icon: '🔐',
      title: 'SSH Login Attempt',
      description: 'User admin_root authentication from 192.168.1.5',
      time: '5 mins ago',
      type: 'warning',
    },
    {
      id: 2,
      icon: '💾',
      title: 'Database Optimization',
      description: 'Completed routine vacuum completed. Reclaimed 650MB space',
      time: '9 mins ago',
      type: 'info',
    },
    {
      id: 3,
      icon: '⚠️',
      title: 'Memory Threshold Warning',
      description: 'Memory swap 1908 MB exceeded 50% utilization.',
      time: '16 mins ago',
      type: 'warning',
    },
    {
      id: 4,
      icon: '🗑️',
      title: 'CDN Cache Purge',
      description: 'Manual cache invalidation requested by system operator.',
      time: '1 hour ago',
      type: 'info',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />

      {/* Sidebar */}
      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="ITDashboard"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={toggleSidebar}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>IT System Dashboard</Text>
          <Text style={styles.headerSubtitle}>Monitor & Manage Systems</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Row 1 */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Active Users"
            value="12,842"
            change="+8.2% from last hour"
            color="#4A90E2"
            icon="👥"
          />
          <StatCard
            title="System Errors"
            value="03"
            change="2 resolved in last 30m"
            color="#E74C3C"
            icon="⚠️"
          />
        </View>

        {/* Stats Row 2 */}
        <View style={styles.statsContainer}>
          <StatCard
            title="System Health"
            value="98.4%"
            change="Accurately up from 2.47%"
            color="#2ECC71"
            icon="💚"
          />
          <StatCard
            title="Last Backup"
            value="14:02"
            change="Successfully on Feb 2,478"
            color="#9B59B6"
            icon="💾"
          />
        </View>

        {/* System Event Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>System Event Feed</Text>
            <TouchableOpacity onPress={() => setShowEventFeed(!showEventFeed)}>
              <Text style={styles.toggleBtn}>
                {showEventFeed ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>

          {showEventFeed && (
            <View style={styles.eventFeed}>
              {events.map((event) => {
                const isExpanded = expandedEvents.includes(event.id);
                return (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  activeOpacity={0.7}
                  onPress={() => toggleEventExpanded(event.id)}
                >
                  <View style={styles.eventIcon}>
                    <Text style={styles.eventIconText}>{event.icon}</Text>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription} numberOfLines={isExpanded ? undefined : 1}>
                      {event.description}
                    </Text>
                    {isExpanded && (
                      <View style={styles.eventExpandedDetails}>
                        <Text style={styles.eventDetailText}>Type: {event.type.toUpperCase()}</Text>
                        <Text style={styles.eventDetailText}>Action required: {event.type === 'warning' ? 'Yes' : 'No'}</Text>
                      </View>
                    )}
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                </TouchableOpacity>
              )})}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBackup}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>💾</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Run Backup</Text>
              <Text style={styles.actionDesc}>
                Create system backup now
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleResetPassword}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>🔑</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Reset Password</Text>
              <Text style={styles.actionDesc}>Reset admin credentials</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDiagnostics}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>🔧</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>System Diagnostics</Text>
              <Text style={styles.actionDesc}>Run diagnostic tests</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* API Health Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Health Status</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Analytics')} activeOpacity={0.8}>
            <HealthStatusItem
              label="Authentication v2"
              status="98.8%"
              color="#2ECC71"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Analytics')} activeOpacity={0.8}>
            <HealthStatusItem
              label="Search Indexer"
              status="99.3%"
              color="#2ECC71"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Analytics')} activeOpacity={0.8}>
            <HealthStatusItem
              label="Payment Engine"
              status="94.4%"
              color="#F39C12"
            />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Core Engine. System © V 2.0 STABLE
          </Text>
          <Text style={styles.footerLinks}>
            Privacy Policy • Security Audit • System Status
          </Text>
        </View>
      </ScrollView>

      {/* Reset Password Modal */}
      <Modal visible={resetPasswordVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reset Admin Password</Text>
            {resetSuccess ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successText}>Password Reset Successful!</Text>
              </View>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setResetPasswordVisible(false)}>
                    <Text style={styles.modalBtnCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalBtnSubmit} onPress={submitPasswordReset}>
                    <Text style={styles.modalBtnSubmitText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Diagnostics Modal */}
      <Modal visible={diagnosticsVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>System Diagnostics</Text>
            
            <View style={styles.diagItem}>
              <View style={styles.diagHeaderRow}>
                <Text style={styles.diagLabel}>CPU Utilization</Text>
                <Text style={styles.diagValue}>45%</Text>
              </View>
              <View style={styles.diagBarTrack}>
                <Animated.View style={[styles.diagBarFill, { backgroundColor: '#F39C12', width: cpuProgress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
              </View>
            </View>

            <View style={styles.diagItem}>
              <View style={styles.diagHeaderRow}>
                <Text style={styles.diagLabel}>Memory Usage</Text>
                <Text style={styles.diagValue}>68%</Text>
              </View>
              <View style={styles.diagBarTrack}>
                <Animated.View style={[styles.diagBarFill, { backgroundColor: '#E74C3C', width: memProgress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
              </View>
            </View>

            <View style={styles.diagItem}>
              <View style={styles.diagHeaderRow}>
                <Text style={styles.diagLabel}>Disk Space</Text>
                <Text style={styles.diagValue}>32%</Text>
              </View>
              <View style={styles.diagBarTrack}>
                <Animated.View style={[styles.diagBarFill, { backgroundColor: '#2ECC71', width: diskProgress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
              </View>
            </View>

            <TouchableOpacity style={styles.modalBtnCloseFull} onPress={() => setDiagnosticsVisible(false)}>
              <Text style={styles.modalBtnSubmitText}>Close Diagnostics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, color, icon }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statHeader}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statChange}>{change}</Text>
  </View>
);

// Health Status Item Component
const HealthStatusItem = ({ label, status, color }) => (
  <View style={styles.healthItem}>
    <Text style={styles.healthLabel}>{label}</Text>
    <View style={styles.healthStatus}>
      <View style={[styles.healthIndicator, { backgroundColor: color }]} />
      <Text style={styles.healthValue}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburgerBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: '#1A1A2E',
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666880',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statTitle: {
    color: '#888899',
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  statValue: {
    color: '#1A1A2E',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statChange: {
    color: '#999999',
    fontSize: 11,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  toggleBtn: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  eventFeed: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventIconText: {
    fontSize: 20,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    color: '#1A1A2E',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    color: '#888899',
    fontSize: 11,
    marginBottom: 6,
  },
  eventTime: {
    color: '#AAAAAA',
    fontSize: 10,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: '#1A1A2E',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDesc: {
    color: '#888899',
    fontSize: 12,
  },
  actionArrow: {
    color: '#4A90E2',
    fontSize: 24,
    fontWeight: '300',
  },
  healthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  healthLabel: {
    color: '#1A1A2E',
    fontSize: 13,
    fontWeight: '500',
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  healthValue: {
    color: '#2ECC71',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8EBF0',
    marginTop: 20,
  },
  footerText: {
    color: '#888899',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
  footerLinks: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
  },
  eventExpandedDetails: {
    backgroundColor: '#F7F9FC',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 11,
    color: '#666880',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    marginBottom: 16,
    fontSize: 14,
    color: '#1A1A2E',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalBtnCancel: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: '#666880',
    fontWeight: '600',
    fontSize: 14,
  },
  modalBtnSubmit: {
    flex: 1,
    backgroundColor: '#1B3FA0',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalBtnSubmitText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ECC71',
  },
  diagItem: {
    marginBottom: 16,
  },
  diagHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  diagLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  diagValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  diagBarTrack: {
    height: 8,
    backgroundColor: '#E8EBF0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  diagBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalBtnCloseFull: {
    backgroundColor: '#1B3FA0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ITDashboard;
