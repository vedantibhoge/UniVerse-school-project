import React, { useState, useRef, useEffect } from 'react';
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

const Backups = ({ navigation, route }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [backups, setBackups] = useState([
    { id: 1, name: 'Daily Backup', date: '2024-04-29', size: '2.5 GB', status: 'Success' },
    { id: 2, name: 'Weekly Backup', date: '2024-04-22', size: '5.2 GB', status: 'Success' },
    { id: 3, name: 'Monthly Backup', date: '2024-04-01', size: '8.7 GB', status: 'Success' },
  ]);

  // Create Backup State
  const [createVisible, setCreateVisible] = useState(false);
  const [createStep, setCreateStep] = useState(0); // 0: Init, 1: Compress, 2: Upload, 3: Complete

  // Restore Backup State
  const [restoreVisible, setRestoreVisible] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState('');
  const restoreProgress = useRef(new Animated.Value(0)).current;
  const [restoreComplete, setRestoreComplete] = useState(false);

  // Auto start if navigated from Dashboard
  useEffect(() => {
    if (route?.params?.autoStart) {
      handleCreateBackup();
    }
  }, [route?.params?.autoStart]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleCreateBackup = () => {
    if (createVisible) return;
    setCreateStep(0);
    setCreateVisible(true);

    setTimeout(() => setCreateStep(1), 1000); 
    setTimeout(() => setCreateStep(2), 2500); 
    setTimeout(() => {
      setCreateStep(3); 
      
      const newBackup = {
        id: Date.now(),
        name: 'Manual Backup',
        date: new Date().toISOString().split('T')[0],
        size: (Math.random() * 5 + 1).toFixed(1) + ' GB',
        status: 'Success'
      };
      setBackups(prev => [newBackup, ...prev]);

      setTimeout(() => {
        setCreateVisible(false);
      }, 1500);
    }, 4000);
  };

  const handleRestoreBackup = (backupName) => {
    Alert.alert('Confirm Restore', `Are you sure you want to restore the system from ${backupName}? Current unsaved data may be lost.`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Proceed', 
        style: 'destructive',
        onPress: () => {
          setRestoringBackup(backupName);
          setRestoreComplete(false);
          restoreProgress.setValue(0);
          setRestoreVisible(true);

          Animated.timing(restoreProgress, {
            toValue: 100,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start(() => {
            setRestoreComplete(true);
            setTimeout(() => {
              setRestoreVisible(false);
            }, 1500);
          });
        }
      },
    ]);
  };

  const handleDeleteBackup = (id, name) => {
    Alert.alert('Delete Backup', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          setBackups(prev => prev.filter(b => b.id !== id));
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="Backups"
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
          <Text style={styles.headerTitle}>Backups</Text>
          <Text style={styles.headerSubtitle}>Manage System Backups</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.createBtn} onPress={handleCreateBackup} activeOpacity={0.8}>
          <Text style={styles.createIcon}>➕</Text>
          <Text style={styles.createText}>Create New Backup</Text>
        </TouchableOpacity>

        {backups.map((backup) => (
          <View key={backup.id} style={styles.card}>
            <View style={styles.backupHeader}>
              <View style={styles.backupInfo}>
                <Text style={styles.backupName}>{backup.name}</Text>
                <Text style={styles.backupDate}>{backup.date}</Text>
                <Text style={styles.backupSize}>{backup.size}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.statusBadgeText}>{backup.status}</Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleRestoreBackup(backup.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>Restore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDeleteBackup(backup.id, backup.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💾 Backup Information</Text>
          <Text style={styles.infoText}>
            • Total backups stored: {backups.length}{'\n'}
            • Total storage used: {(backups.reduce((acc, curr) => acc + parseFloat(curr.size), 0)).toFixed(1)} GB{'\n'}
            • Last backup: {backups.length > 0 ? backups[0].date : 'Never'}{'\n'}
            • Auto-backup enabled: Yes
          </Text>
        </View>
      </ScrollView>

      {/* Create Backup Modal */}
      <Modal visible={createVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Creating Backup</Text>
            <View style={styles.stepContainer}>
              <Text style={[styles.stepText, createStep >= 0 && styles.stepActive]}>
                {createStep >= 1 ? '✅' : '⏳'} Initializing...
              </Text>
              <Text style={[styles.stepText, createStep >= 1 && styles.stepActive, createStep < 1 && styles.stepInactive]}>
                {createStep >= 2 ? '✅' : '⏳'} Compressing data...
              </Text>
              <Text style={[styles.stepText, createStep >= 2 && styles.stepActive, createStep < 2 && styles.stepInactive]}>
                {createStep >= 3 ? '✅' : '⏳'} Uploading to secure storage...
              </Text>
              <Text style={[styles.stepText, createStep >= 3 && styles.stepActive, createStep < 3 && styles.stepInactive]}>
                {createStep >= 3 ? '✅' : '⏳'} Complete!
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Restore Progress Modal */}
      <Modal visible={restoreVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Restoring from {restoringBackup}</Text>
            {restoreComplete ? (
              <View style={styles.completeContainer}>
                <Text style={styles.completeIcon}>✅</Text>
                <Text style={styles.completeText}>Restore Successful</Text>
              </View>
            ) : (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Applying backup state...</Text>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { width: restoreProgress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
                </View>
              </View>
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
  createBtn: {
    backgroundColor: '#2ECC71',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  createIcon: { fontSize: 18, marginRight: 8, color: '#FFFFFF' },
  createText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  backupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backupInfo: { flex: 1 },
  backupName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 4 },
  backupDate: { fontSize: 12, color: '#888899', marginBottom: 2 },
  backupSize: { fontSize: 11, color: '#AAAAAA' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: '600', color: '#2ECC71' },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  deleteBtn: { backgroundColor: '#FFE8E8' },
  actionBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  deleteButtonText: { color: '#E74C3C', fontWeight: '600', fontSize: 12 },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#1B3FA0', marginBottom: 8 },
  infoText: { fontSize: 12, color: '#1B3FA0', lineHeight: 18 },
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
  progressContainer: { alignItems: 'center', paddingVertical: 10, width: '100%' },
  progressText: { marginBottom: 12, fontSize: 14, color: '#666880' },
  progressBarBg: { width: '100%', height: 8, backgroundColor: '#E8EBF0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4A90E2', borderRadius: 4 },
  completeContainer: { alignItems: 'center', paddingVertical: 10, width: '100%' },
  completeIcon: { fontSize: 40, marginBottom: 10 },
  completeText: { fontSize: 16, fontWeight: '600', color: '#2ECC71', marginBottom: 10 },
});

export default Backups;
