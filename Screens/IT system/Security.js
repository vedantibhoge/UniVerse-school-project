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
  Animated,
  Easing,
} from 'react-native';
import ITSidebar from './ITSidebar';

const { width } = Dimensions.get('window');

const Security = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [loginActivity, setLoginActivity] = useState([
    { id: 1, user: 'jane.doe@example.com', name: 'Jane Doe', time: '2026-05-01 09:12', status: 'Successful', ip: '192.168.1.12', device: 'MacBook Pro 14" - macOS' },
    { id: 2, user: 'john.smith@example.com', name: 'John Smith', time: '2026-05-01 08:43', status: 'Failed', ip: '192.168.1.33', device: 'Windows PC - Chrome' },
    { id: 3, user: 'parent1@example.com', name: 'Parent One', time: '2026-04-30 18:05', status: 'Successful', ip: '203.0.113.5', device: 'iPhone 13 - iOS App' },
  ]);

  // Undo Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const undoTimeoutRef = useRef(null);
  const deletedActivityRef = useRef([]);

  // Scan State
  const [scanVisible, setScanVisible] = useState(false);
  const scanProgress = useRef(new Animated.Value(0)).current;
  const [scanComplete, setScanComplete] = useState(false);

  // Logs Modal
  const [logsVisible, setLogsVisible] = useState(false);
  const [logFilter, setLogFilter] = useState('All');

  // Details Modal
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleClearLoginActivity = () => {
    Alert.alert(
      'Clear Login Activity',
      'Are you sure you want to clear login activity logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            deletedActivityRef.current = [...loginActivity];
            setLoginActivity([]);
            setToastVisible(true);
            
            if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
            undoTimeoutRef.current = setTimeout(() => {
              setToastVisible(false);
            }, 3000);
          } 
        },
      ]
    );
  };

  const handleUndoClear = () => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setLoginActivity(deletedActivityRef.current);
    setToastVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const securityItems = [
    { id: 1, title: 'Firewall Status', status: 'Active', icon: '🔥', color: '#2ECC71' },
    { id: 2, title: 'SSL Certificate', status: 'Valid', icon: '🔒', color: '#2ECC71' },
    { id: 3, title: 'DDoS Protection', status: 'Enabled', icon: '🛡️', color: '#2ECC71' },
    { id: 4, title: 'Malware Scan', status: 'Clean', icon: '✓', color: '#2ECC71' },
  ];

  const handleRunScan = () => {
    setScanVisible(true);
    setScanComplete(false);
    scanProgress.setValue(0);
    Animated.timing(scanProgress, {
      toValue: 100,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setScanComplete(true);
    });
  };

  const handleViewLogs = () => {
    setLogsVisible(true);
    setLogFilter('All');
  };

  const openDetails = (activity) => {
    setSelectedActivity(activity);
    setDetailsVisible(true);
  };

  const filteredLogs = loginActivity.filter(log => logFilter === 'All' || log.status === logFilter);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="Security"
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
          <Text style={styles.headerTitle}>Security</Text>
          <Text style={styles.headerSubtitle}>System Protection Status</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.alertCard}>
          <Text style={styles.alertIcon}>✓</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>All Systems Secure</Text>
            <Text style={styles.alertText}>No security threats detected</Text>
          </View>
        </View>

        {/* Login Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Login Activity</Text>
          {loginActivity.length === 0 ? (
            <Text style={{ color: '#666880', marginTop: 8 }}>No recent login activity.</Text>
          ) : (
            loginActivity.slice(0, 3).map((entry) => (
              <TouchableOpacity key={entry.id} style={styles.activityRow} onPress={() => openDetails(entry)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityUser}>{entry.name} · {entry.user}</Text>
                  <Text style={styles.activityTime}>{entry.time} · {entry.ip}</Text>
                </View>
                <Text style={[styles.activityStatus, entry.status === 'Successful' ? { color: '#2ECC71' } : { color: '#FF6B6B' }]}>{entry.status}</Text>
              </TouchableOpacity>
            ))
          )}
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity style={[styles.actionBtn, { flex: 1, marginRight: 8 }]} onPress={handleViewLogs} activeOpacity={0.8}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>View Security Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: '#FF6B6B', marginLeft: 8 }]} onPress={handleClearLoginActivity} activeOpacity={0.8}>
              <Text style={styles.actionIcon}>🧹</Text>
              <Text style={styles.actionText}>Clear Login Activity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {securityItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={[styles.cardStatus, { color: item.color }]}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.actionBtn} onPress={handleRunScan} activeOpacity={0.8}>
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionText}>Run Security Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleViewLogs} activeOpacity={0.8}>
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionText}>View Security Logs</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Undo Toast */}
      {toastVisible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Login activity cleared.</Text>
          <TouchableOpacity onPress={handleUndoClear}>
            <Text style={styles.toastUndo}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Security Scan Modal */}
      <Modal visible={scanVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>System Security Scan</Text>
            {scanComplete ? (
              <View style={styles.scanCompleteContainer}>
                <Text style={styles.scanCompleteIcon}>✅</Text>
                <Text style={styles.scanCompleteText}>0 threats found.</Text>
                <TouchableOpacity style={styles.modalBtnClose} onPress={() => setScanVisible(false)}>
                  <Text style={styles.modalBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.scanProgressContainer}>
                <Text style={styles.scanProgressText}>Scanning system...</Text>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { width: scanProgress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Security Logs Modal */}
      <Modal visible={logsVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Security Logs</Text>
              <TouchableOpacity onPress={() => setLogsVisible(false)}>
                <Text style={styles.sheetClose}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterRow}>
              {['All', 'Successful', 'Failed'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterBtn, logFilter === filter && styles.filterBtnActive]}
                  onPress={() => setLogFilter(filter)}
                >
                  <Text style={[styles.filterText, logFilter === filter && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView style={styles.sheetScroll}>
              {filteredLogs.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: '#888899' }}>No logs found.</Text>
              ) : (
                filteredLogs.map(log => (
                  <TouchableOpacity key={log.id} style={styles.activityRow} onPress={() => openDetails(log)}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityUser}>{log.name} · {log.user}</Text>
                      <Text style={styles.activityTime}>{log.time} · {log.ip}</Text>
                    </View>
                    <Text style={[styles.activityStatus, log.status === 'Successful' ? { color: '#2ECC71' } : { color: '#FF6B6B' }]}>{log.status}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal visible={detailsVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Activity Details</Text>
            {selectedActivity && (
              <View style={styles.detailsContent}>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>User:</Text><Text style={styles.detailValue}>{selectedActivity.name}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Email:</Text><Text style={styles.detailValue}>{selectedActivity.user}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Time:</Text><Text style={styles.detailValue}>{selectedActivity.time}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>IP Address:</Text><Text style={styles.detailValue}>{selectedActivity.ip}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Device:</Text><Text style={styles.detailValue}>{selectedActivity.device || 'Unknown'}</Text></View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, { color: selectedActivity.status === 'Successful' ? '#2ECC71' : '#FF6B6B', fontWeight: 'bold' }]}>{selectedActivity.status}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity style={styles.modalBtnClose} onPress={() => setDetailsVisible(false)}>
              <Text style={styles.modalBtnText}>Close</Text>
            </TouchableOpacity>
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
  alertCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  alertIcon: { fontSize: 24, marginRight: 12, color: '#2ECC71' },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '600', color: '#1B5E20' },
  alertText: { fontSize: 12, color: '#558B2F', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  cardStatus: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  actionBtn: {
    backgroundColor: '#1B3FA0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  actionIcon: { fontSize: 18, marginRight: 8 },
  actionText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  activityUser: { fontSize: 13, color: '#1A1A2E', fontWeight: '600' },
  activityTime: { fontSize: 12, color: '#888899', marginTop: 4 },
  activityStatus: { fontSize: 12, fontWeight: '700' },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#323232',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
  },
  toastText: { color: '#FFF', fontSize: 14 },
  toastUndo: { color: '#4A90E2', fontWeight: 'bold', fontSize: 14, paddingHorizontal: 8 },
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
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 16, textAlign: 'center' },
  scanProgressContainer: { alignItems: 'center', paddingVertical: 10, width: '100%' },
  scanProgressText: { marginBottom: 12, fontSize: 14, color: '#666880' },
  progressBarBg: { width: '100%', height: 8, backgroundColor: '#E8EBF0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4A90E2', borderRadius: 4 },
  scanCompleteContainer: { alignItems: 'center', paddingVertical: 10, width: '100%' },
  scanCompleteIcon: { fontSize: 40, marginBottom: 10 },
  scanCompleteText: { fontSize: 16, fontWeight: '600', color: '#2ECC71', marginBottom: 20 },
  modalBtnClose: { backgroundColor: '#1B3FA0', paddingVertical: 12, borderRadius: 8, alignItems: 'center', width: '100%' },
  modalBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '70%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  sheetClose: { fontSize: 30, color: '#888899', lineHeight: 30 },
  filterRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#F0F2F5' },
  filterBtnActive: { backgroundColor: '#4A90E2' },
  filterText: { fontSize: 12, color: '#666880', fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  sheetScroll: { flex: 1 },
  detailsContent: { marginBottom: 20, width: '100%' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  detailLabel: { fontSize: 13, color: '#888899', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#1A1A2E', fontWeight: '500', maxWidth: '70%', textAlign: 'right' },
});

export default Security;
