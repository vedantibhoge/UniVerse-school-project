import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Dashboards from '../Dashboard/Dashboards';
import Analytics from '../Analytics/Analytics';
import Branch from '../Branch/Branch';
import Finance from '../Finance/Finance';
import Report from '../Report/Report';
import Staff from '../Staff/Staff';
import Students from '../Student/Student';
import Settings from '../Settings/Settings';
import Notifications from '../Notification/Notifications';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;
const IS_DESKTOP = SCREEN_WIDTH >= 768;

const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" component={Dashboards} />
      <Stack.Screen name="students" component={Students} />
      <Stack.Screen name="finance" component={Finance} />
      <Stack.Screen name="staff" component={Staff} />
      <Stack.Screen name="analytics" component={Analytics} />
      <Stack.Screen name="branch" component={Branch} />
      <Stack.Screen name="report" component={Report} />
      <Stack.Screen name="notifications" component={Notifications} />
      <Stack.Screen name="settings" component={Settings} />
    </Stack.Navigator>
  );
}

export default function Sidebar({ navigation }) {
  const [activeItem, setActiveItem] = useState({ id: 'dashboard', label: 'Dashboard', parentId: 'dashboard' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(IS_DESKTOP);

  useEffect(() => {
    const handler = ({ window }) => setIsDesktop(window.width >= 768);
    const sub = Dimensions.addEventListener?.('change', handler);
    return () => sub?.remove?.();
  }, []);

  const handleSelect = (item) => {
    setActiveItem(item);
    if (item.id === 'logout') {
      // simple logout hook
      navigation.replace('Login');
      return;
    }
    // navigate to parent group (dashboard, students, etc.)
    //const route = item.parentId || item.id;
   // navigation.navigate(route);
    setDrawerOpen(false);
  };

  const SCREEN_MAP = {
    dashboard: Dashboards,
    students: Students,
    finance: Finance,
    staff: Staff,
    analytics: Analytics,
    branch: Branch,
    report: Report,
    notifications: Notifications,
    settings: Settings,
  };

  const ActiveScreen = SCREEN_MAP[activeItem.parentId || activeItem.id] || Dashboards;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}>
        {isDesktop && (
          <View style={styles.persistentSidebar}>
            <SidebarContent activeItem={activeItem} onSelect={handleSelect} />
          </View>
        )}

        <View style={{ flex: 1 }}>
          {!isDesktop && (
            <TopBar onHamburgerPress={() => setDrawerOpen((v) => !v)} isDrawerOpen={drawerOpen} activeItem={activeItem} />
          )}

          {/* Use internal stack for nested screens */}
          <ActiveScreen />

          {!isDesktop && (
            <MobileDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} activeItem={activeItem} onSelect={handleSelect} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function SidebarContent({ activeItem, onSelect }) {
  const MENU = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'finance', label: 'Finance' },
    { id: 'staff', label: 'Staff' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'branch', label: 'Branch' },
    { id: 'report', label: 'Report' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.logoTitle}>Director</Text>
        <Text style={styles.logoSub}>Control Panel</Text>
      </View>

      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect({ id: item.id, label: item.label, parentId: item.id })}
            style={[styles.menuRow, (activeItem.id === item.id || activeItem.parentId === item.id) && styles.menuRowActive]}
            activeOpacity={0.8}
          >
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v2.4.1</Text>
      </View>
    </View>
  );
}

function TopBar({ onHamburgerPress, isDrawerOpen, activeItem }) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={onHamburgerPress} style={styles.hamburgerBtn}>
        <Text style={{ fontSize: 20 }}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.topBarTitle}>{activeItem?.label || 'Dashboard'}</Text>
      <View style={{ width: 44 }} />
    </View>
  );
}

function MobileDrawer({ visible, onClose, activeItem, onSelect }) {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleSelect = (item) => {
    onSelect(item);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.drawerOverlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.drawerPanel, { transform: [{ translateX: slideAnim }] }]}>
          <SidebarContent activeItem={activeItem} onSelect={handleSelect} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  persistentSidebar: { width: SIDEBAR_WIDTH, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#eee' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  logoTitle: { fontSize: 16, fontWeight: '800' },
  logoSub: { fontSize: 11, color: '#6b7280' },
  menuScroll: { flex: 1 },
  menuContent: { padding: 12 },
  menuRow: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, marginBottom: 6 },
  menuRowActive: { backgroundColor: '#eff6ff' },
  menuLabel: { fontWeight: '700', color: '#111827' },
  footer: { padding: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  footerText: { color: '#6b7280', fontSize: 12 },
  topBar: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  hamburgerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 16, fontWeight: '800' },
  drawerOverlay: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawerPanel: { width: SIDEBAR_WIDTH, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 24 },
  drawer: { position: 'absolute', width: SIDEBAR_WIDTH, height: '100%', backgroundColor: '#fff' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
});
