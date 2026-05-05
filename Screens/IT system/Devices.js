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
  TextInput,
} from 'react-native';
import ITSidebar from './ITSidebar';

const { width } = Dimensions.get('window');

const Devices = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [devices, setDevices] = useState([
    { id: 1, name: 'Laptop - Admin', type: 'Laptop', status: 'Connected', lastSeen: 'Just now' },
    { id: 2, name: 'Desktop - Office', type: 'Desktop', status: 'Connected', lastSeen: '5 mins ago' },
    { id: 3, name: 'Mobile - Support', type: 'Mobile', status: 'Idle', lastSeen: '1 hour ago' },
  ]);

  const [addDeviceVisible, setAddDeviceVisible] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('Laptop');

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleRemoveDevice = (id, deviceName) => {
    Alert.alert('Remove Device', `Are you sure you want to remove ${deviceName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Remove', 
        style: 'destructive',
        onPress: () => {
          setDevices(prev => prev.filter(d => d.id !== id));
        }
      },
    ]);
  };

  const handleLockDevice = (id) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: d.status === 'Locked' ? 'Connected' : 'Locked'
        };
      }
      return d;
    }));
  };

  const handleAddDevice = () => {
    if (!newDeviceName.trim()) {
      Alert.alert('Error', 'Please enter a device name');
      return;
    }
    const newDev = {
      id: Date.now(),
      name: newDeviceName,
      type: newDeviceType,
      status: 'Connected',
      lastSeen: 'Just now'
    };
    setDevices(prev => [newDev, ...prev]);
    setAddDeviceVisible(false);
    setNewDeviceName('');
    setNewDeviceType('Laptop');
  };

  const totalDevices = devices.length;
  const connectedDevices = devices.filter(d => d.status === 'Connected').length;
  const idleDevices = devices.filter(d => d.status === 'Idle').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="Devices"
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
          <Text style={styles.headerTitle}>Devices</Text>
          <Text style={styles.headerSubtitle}>Manage Connected Devices</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.addBtn} onPress={() => setAddDeviceVisible(true)} activeOpacity={0.8}>
          <Text style={styles.addIcon}>➕</Text>
          <Text style={styles.addText}>Add Device</Text>
        </TouchableOpacity>

        {devices.map((device) => {
          const isLocked = device.status === 'Locked';
          const dotColor = isLocked ? '#E74C3C' : (device.status === 'Connected' ? '#2ECC71' : '#F39C12');
          const badgeBg = isLocked ? '#FFE8E8' : (device.status === 'Connected' ? '#E8F5E9' : '#FEF5E7');
          const badgeColor = isLocked ? '#E74C3C' : (device.status === 'Connected' ? '#2ECC71' : '#F39C12');

          return (
            <View key={device.id} style={styles.card}>
              <View style={styles.deviceHeader}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                    <Text style={styles.lastSeen}>{device.lastSeen}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.statusBadgeText, { color: badgeColor }]}>{device.status}</Text>
                </View>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionBtn, isLocked && { backgroundColor: '#F0F2F5' }]}
                  onPress={() => handleLockDevice(device.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionBtnText, isLocked && { color: '#1A1A2E' }]}>
                    {isLocked ? '🔓 Unlock' : '🔒 Lock'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleRemoveDevice(device.id, device.name)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Device Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Devices:</Text>
            <Text style={styles.summaryValue}>{totalDevices}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Connected:</Text>
            <Text style={[styles.summaryValue, { color: '#2ECC71' }]}>{connectedDevices}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Idle:</Text>
            <Text style={[styles.summaryValue, { color: '#F39C12' }]}>{idleDevices}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Device Modal */}
      <Modal visible={addDeviceVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Device</Text>
            <TextInput
              style={styles.input}
              placeholder="Device Name (e.g. Laptop - Library)"
              value={newDeviceName}
              onChangeText={setNewDeviceName}
            />
            
            <Text style={styles.pickerLabel}>Device Type</Text>
            <View style={styles.typeSelector}>
              {['Laptop', 'Desktop', 'Mobile', 'Tablet'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeOption, newDeviceType === type && styles.typeOptionActive]}
                  onPress={() => setNewDeviceType(type)}
                >
                  <Text style={[styles.typeText, newDeviceType === type && styles.typeTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setAddDeviceVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSubmit} onPress={handleAddDevice}>
                <Text style={styles.modalBtnSubmitText}>Add</Text>
              </TouchableOpacity>
            </View>
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
  addBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  addIcon: { fontSize: 16, marginRight: 8, color: '#FFFFFF' },
  addText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  deviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 4 },
  deviceType: { fontSize: 12, color: '#888899', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  lastSeen: { fontSize: 11, color: '#AAAAAA' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: '600' },
  actionContainer: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  deleteBtn: { backgroundColor: '#FFE8E8' },
  actionBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  deleteButtonText: { color: '#E74C3C', fontWeight: '600', fontSize: 12 },
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
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 20, textAlign: 'center' },
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
  pickerLabel: { fontSize: 13, color: '#888899', marginBottom: 8, fontWeight: '500' },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  typeOption: {
    backgroundColor: '#F0F2F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  typeOptionActive: { backgroundColor: '#4A90E2' },
  typeText: { fontSize: 12, color: '#666880', fontWeight: '600' },
  typeTextActive: { color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtnCancel: { flex: 1, backgroundColor: '#F0F2F5', paddingVertical: 12, borderRadius: 8, marginRight: 8, alignItems: 'center' },
  modalBtnCancelText: { color: '#666880', fontWeight: '600', fontSize: 14 },
  modalBtnSubmit: { flex: 1, backgroundColor: '#1B3FA0', paddingVertical: 12, borderRadius: 8, marginLeft: 8, alignItems: 'center' },
  modalBtnSubmitText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});

export default Devices;
