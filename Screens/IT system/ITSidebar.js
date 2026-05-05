import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

const ITSidebar = ({ visible, onClose, navigation, activeRoute }) => {
  const menuItems = [
    { id: 1, icon: '📊', label: 'Dashboard', screen: 'ITDashboard' },
    { id: 2, icon: '📈', label: 'System Analytics', screen: 'Analytics' },
    { id: 3, icon: '🔐', label: 'Security', screen: 'Security' },
    { id: 4, icon: '🖥️', label: 'Servers', screen: 'Servers' },
    { id: 5, icon: '💾', label: 'Backups', screen: 'Backups' },
    { id: 6, icon: '📱', label: 'Devices', screen: 'Devices' },
    { id: 7, icon: '⚙️', label: 'Settings', screen: 'Settings' },
    { id: 8, icon: '📥', label: 'Data Import', screen: 'DataImport' },
  ];

  const handleMenuPress = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          onClose();
          navigation.navigate('Login');
        }
      }
    ]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarIcon}>⚙️</Text>
            <Text style={styles.sidebarTitle}>IT System</Text>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => {
              const isActive = activeRoute === item.screen;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleMenuPress(item.screen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.sidebarFooter}>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Close Button (Overlay) */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: '#E8EBF0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  sidebarHeader: {
    backgroundColor: '#1B3FA0',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sidebarIcon: {
    fontSize: 28,
  },
  sidebarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: '#1B3FA0',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sidebarFooter: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EBF0',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    gap: 8,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    color: '#E74C3C',
    fontWeight: '600',
    fontSize: 13,
  },
  closeButton: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingRight: 20,
  },
  closeIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ITSidebar;
