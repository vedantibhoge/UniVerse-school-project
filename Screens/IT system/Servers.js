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
  Modal,
} from 'react-native';
import ITSidebar from './ITSidebar';

const { width } = Dimensions.get('window');

const Servers = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [servers, setServers] = useState([
    { id: 1, name: 'Server 1', status: 'Online', uptime: '99.9%', icon: '🖥️' },
    { id: 2, name: 'Server 2', status: 'Online', uptime: '99.8%', icon: '🖥️' },
    { id: 3, name: 'Server 3', status: 'Online', uptime: '99.7%', icon: '🖥️' },
  ]);

  // Restart State
  const [restartVisible, setRestartVisible] = useState(false);
  const [restartingServer, setRestartingServer] = useState('');
  const [restartStep, setRestartStep] = useState(0);

  // Logs State
  const [logsVisible, setLogsVisible] = useState(false);
  const [selectedLogServer, setSelectedLogServer] = useState('');

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleRestartServer = (serverName) => {
    Alert.alert('Restart Server', `Restart ${serverName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Restart', 
        style: 'destructive',
        onPress: () => {
          setServers(prev => prev.map(s => s.name === serverName ? { ...s, status: 'Restarting' } : s));
          setRestartingServer(serverName);
          setRestartStep(0);
          setRestartVisible(true);

          setTimeout(() => setRestartStep(1), 1000);
          setTimeout(() => {
            setRestartStep(2);
            setServers(prev => prev.map(s => s.name === serverName ? { ...s, status: 'Online' } : s));
            setTimeout(() => {
              setRestartVisible(false);
            }, 1000);
          }, 2500);
        }
      },
    ]);
  };

  const handleViewLogs = (serverName) => {
    setSelectedLogServer(serverName);
    setLogsVisible(true);
  };

  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'Online').length;
  const offlineServers = totalServers - onlineServers;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="Servers"
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
          <Text style={styles.headerTitle}>Servers</Text>
          <Text style={styles.headerSubtitle}>Manage Server Infrastructure</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {servers.map((server) => (
          <View key={server.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.serverIcon}>{server.icon}</Text>
              <View style={styles.serverInfo}>
                <Text style={styles.serverName}>{server.name}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: server.status === 'Online' ? '#2ECC71' : '#F39C12' }]} />
                  <Text style={[styles.statusText, { color: server.status === 'Online' ? '#2ECC71' : '#F39C12' }]}>{server.status}</Text>
                  <Text style={styles.uptimeText}>Uptime: {server.uptime}</Text>
                </View>
              </View>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleViewLogs(server.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>View Logs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#FF6B6B' }]}
                onPress={() => handleRestartServer(server.name)}
                activeOpacity={0.8}
                disabled={server.status !== 'Online'}
              >
                <Text style={styles.actionBtnText}>Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Server Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Servers:</Text>
            <Text style={styles.summaryValue}>{totalServers}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Online:</Text>
            <Text style={[styles.summaryValue, { color: '#2ECC71' }]}>{onlineServers}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Offline/Restarting:</Text>
            <Text style={[styles.summaryValue, { color: '#E74C3C' }]}>{offlineServers}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Restart Progress Modal */}
      <Modal visible={restartVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Restarting {restartingServer}</Text>
            <View style={styles.stepContainer}>
              <Text style={[styles.stepText, restartStep >= 0 && styles.stepActive]}>
                {restartStep >= 1 ? '✅' : '⏳'} Stopping services...
              </Text>
              <Text style={[styles.stepText, restartStep >= 1 && styles.stepActive, restartStep < 1 && styles.stepInactive]}>
                {restartStep >= 2 ? '✅' : '⏳'} Starting services...
              </Text>
              <Text style={[styles.stepText, restartStep >= 2 && styles.stepActive, restartStep < 2 && styles.stepInactive]}>
                {restartStep >= 2 ? '✅' : '⏳'} Server Online
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Server Logs Modal */}
      <Modal visible={logsVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.logsContainer}>
            <View style={styles.logsHeader}>
              <Text style={styles.logsTitle}>{selectedLogServer} Logs</Text>
              <TouchableOpacity onPress={() => setLogsVisible(false)}>
                <Text style={styles.logsClose}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.logsScroll} nestedScrollEnabled>
              <Text style={styles.logText}>[2026-05-02 10:15:22] [INFO] Connection established from 192.168.1.5</Text>
              <Text style={styles.logText}>[2026-05-02 10:15:25] [INFO] Request handled successfully. (200 OK)</Text>
              <Text style={[styles.logText, styles.logWarn]}>[2026-05-02 10:16:01] [WARN] High CPU utilization detected (85%)</Text>
              <Text style={styles.logText}>[2026-05-02 10:16:05] [INFO] Background worker started.</Text>
              <Text style={styles.logText}>[2026-05-02 10:18:12] [INFO] Session token expired.</Text>
              <Text style={[styles.logText, styles.logError]}>[2026-05-02 10:20:00] [ERROR] Failed to connect to database cache.</Text>
              <Text style={styles.logText}>[2026-05-02 10:20:02] [INFO] Retrying connection...</Text>
              <Text style={styles.logText}>[2026-05-02 10:20:03] [INFO] Connection restored.</Text>
            </ScrollView>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  serverIcon: { fontSize: 32, marginRight: 14 },
  serverInfo: { flex: 1 },
  serverName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  uptimeText: { fontSize: 11, color: '#888899', marginLeft: 8 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  summaryTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 13, color: '#888899', fontWeight: '500' },
  summaryValue: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 20, textAlign: 'center' },
  stepContainer: { width: '100%' },
  stepText: { fontSize: 14, marginBottom: 12, fontWeight: '500' },
  stepActive: { color: '#1A1A2E' },
  stepInactive: { color: '#AAAAAA' },
  logsContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: '#1E1E1E', // Dark theme for logs
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  logsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  logsTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  logsClose: { fontSize: 28, color: '#FFF', lineHeight: 28 },
  logsScroll: { flex: 1 },
  logText: { color: '#A0A0A0', fontSize: 12, fontFamily: 'monospace', marginBottom: 6, lineHeight: 18 },
  logWarn: { color: '#F39C12' },
  logError: { color: '#E74C3C' },
});

export default Servers;
