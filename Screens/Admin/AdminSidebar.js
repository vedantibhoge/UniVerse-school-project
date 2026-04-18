import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  textSub: '#6B7280',
  green: '#22C55E',
  red: '#E53935',
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', screen: 'dashboard' },
  { id: 'classes', label: 'Classes', icon: '📚', screen: 'classes' },
  { id: 'attendance', label: 'Attendance', icon: '✓', screen: 'attendance' },
  { id: 'exams', label: 'Exams', icon: '📋', screen: 'exams' },
  { id: 'fees', label: 'Fees', icon: '💰', screen: 'fees' },
  { id: 'staff', label: 'Staff', icon: '👨‍💼', screen: 'staff' },
  { id: 'timetable', label: 'Timetable', icon: '⏰', screen: 'timetable' },
  { id: 'settings', label: 'Settings', icon: '⚙️', screen: 'settings' },

];

const bottomItems = [
  { id: 'help', label: 'Help Center', icon: '❓', action: 'help' },
  { id: 'logout', label: 'Logout', icon: '🚪', action: 'logout' },
];

function SidebarItem({ item, isActive, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isActive && styles.menuItemActive,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.menuLabel,
          isActive && styles.menuLabelActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AdminSidebar({
  visible,
  onClose,
  activeScreen,
  onScreenChange,
}) {
  const handleMenuPress = (screen) => {
    onScreenChange(screen);
    onClose();
  };

  const handleBottomItemPress = (action) => {
    if (action === 'help') {
      Alert.alert('Help Center', 'For support, contact: support@academix.edu');
    } else if (action === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            Alert.alert('Logged Out', 'You have been logged out successfully');
          },
          style: 'destructive',
        },
      ]);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={0.5}
      />

      {/* Sidebar */}
      <SafeAreaView style={styles.sidebar}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🎓</Text>
            </View>
            <View style={styles.logoText2}>
              <Text style={styles.headerTitle}>Academix Admin</Text>
              <Text style={styles.headerSubtitle}>PRIMARY INSTITUTION</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={activeScreen === item.screen}
              onPress={() => handleMenuPress(item.screen)}
            />
          ))}
        </ScrollView>

        {/* Bottom Items */}
        <View style={styles.bottomContainer}>
          {bottomItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.bottomItem}
              onPress={() => handleBottomItemPress(item.action)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.bottomLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: COLORS.white,
    zIndex: 1000,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  logoText2: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#B3C9E8',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: COLORS.primary + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  menuLabelActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E8ECF5',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    borderRadius: 10,
  },
  bottomLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDark,
    marginLeft: 14,
  },
});
