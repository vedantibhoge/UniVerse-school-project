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
  const [logoutPressed, setLogoutPressed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const MENU = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞', color: '#2563EB' },
    { id: 'students', label: 'Students', icon: '👤', color: '#06B6D4' },
    { id: 'finance', label: 'Finance', icon: '💰', color: '#10B981' },
    { id: 'staff', label: 'Staff', icon: '👥', color: '#8B5CF6' },
    { id: 'analytics', label: 'Analytics', icon: '📊', color: '#EC4899' },
    { id: 'branch', label: 'Branch', icon: '🏢', color: '#14B8A6' },
    { id: 'report', label: 'Report', icon: '📋', color: '#F97316' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', color: '#EF4444' },
    { id: 'settings', label: 'Settings', icon: '⚙', color: '#6B7280' },
  ];

  const handleLogout = () => {
    onSelect({ id: 'logout', label: 'Logout', parentId: 'logout' });
  };

  if (showProfile) {
    return <ProfileView onBack={() => setShowProfile(false)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileStrip} activeOpacity={0.8} onPress={() => setShowProfile(true)}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>DR</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Dr. Julian Vance</Text>
            <Text style={styles.profileRole}>School Director</Text>
          </View>
          <Text style={styles.profileChevron}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
        {MENU.map((item) => {
          const isActive = activeItem.id === item.id || activeItem.parentId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelect({ id: item.id, label: item.label, parentId: item.id })}
              style={[styles.menuRow, isActive && styles.menuRowActive]}
              activeOpacity={0.8}
            >
              <View style={[styles.iconPill, isActive && { backgroundColor: item.color + '22' }]}>
                <Text style={[styles.menuIcon, isActive && { color: item.color }]}>{item.icon}</Text>
              </View>
              <Text style={[styles.menuLabel, isActive && { color: item.color, fontWeight: '700' }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.footerText}>v2.4.1</Text>
        </View>
        <TouchableOpacity
          style={[styles.logoutBtn, logoutPressed && styles.logoutBtnPressed]}
          onPress={handleLogout}
          onPressIn={() => setLogoutPressed(true)}
          onPressOut={() => setLogoutPressed(false)}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutIcon}>↩</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────
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

// ─── Profile View ────────────────────────────────────────────────────────────
function ProfileView({ onBack }) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.profileBackBtn} onPress={onBack} activeOpacity={0.8}>
        <Text style={styles.profileBackText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.profileScroll} contentContainerStyle={styles.profileContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHero}>
          <View style={styles.profileAvatarLarge}>
            <Text style={styles.profileAvatarLargeText}>DR</Text>
          </View>
          <Text style={styles.profileHeroName}>Dr. Julian Vance</Text>
          <Text style={styles.profileHeroRole}>School Director</Text>
          <View style={styles.profileStatusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileCardTitle}>Profile Information</Text>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Email</Text>
            <Text style={styles.profileInfoValue}>julian.vance@universe.edu</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Phone</Text>
            <Text style={styles.profileInfoValue}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Department</Text>
            <Text style={styles.profileInfoValue}>Administration</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Joined</Text>
            <Text style={styles.profileInfoValue}>January 2022</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileCardTitle}>Access & Permissions</Text>
          <View style={styles.profilePermissionRow}>
            <View style={styles.permissionIcon}>
              <Text>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.permissionLabel}>Full System Access</Text>
              <Text style={styles.permissionDesc}>All modules and features</Text>
            </View>
          </View>
          <View style={styles.profilePermissionRow}>
            <View style={styles.permissionIcon}>
              <Text>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.permissionLabel}>User Management</Text>
              <Text style={styles.permissionDesc}>Create, edit, and manage users</Text>
            </View>
          </View>
          <View style={styles.profilePermissionRow}>
            <View style={styles.permissionIcon}>
              <Text>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.permissionLabel}>Report Generation</Text>
              <Text style={styles.permissionDesc}>Access all institutional reports</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  profileStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatarRing: { position: 'relative' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  profileName: { color: '#111827', fontSize: 11, fontWeight: '700' },
  profileRole: { color: '#6b7280', fontSize: 9, marginTop: 1 },
  profileChevron: { color: '#9ca3af', fontSize: 18, fontWeight: '300' },
  logoTitle: { fontSize: 16, fontWeight: '800' },
  logoSub: { fontSize: 11, color: '#6b7280' },
  menuScroll: { flex: 1 },
  menuContent: { padding: 12 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 10, borderRadius: 8, marginBottom: 6 },
  menuRowActive: { backgroundColor: '#eff6ff' },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  menuIcon: { fontSize: 16 },
  menuLabel: { flex: 1, fontWeight: '600', color: '#6b7280', fontSize: 12 },
  footer: { paddingHorizontal: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', gap: 10 },
  footerTop: { paddingBottom: 8 },
  footerText: { color: '#6b7280', fontSize: 11, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  logoutBtnPressed: {
    backgroundColor: '#DC2626',
  },
  logoutIcon: { fontSize: 16, color: '#FFFFFF', fontWeight: '700' },
  logoutText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  topBar: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  hamburgerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 16, fontWeight: '800' },
  drawerOverlay: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  drawerPanel: { width: SIDEBAR_WIDTH, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 24 },
  drawer: { position: 'absolute', width: SIDEBAR_WIDTH, height: '100%', backgroundColor: '#fff' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
  
  // Profile View Styles
  profileBackBtn: {
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  profileBackText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  profileScroll: { flex: 1, backgroundColor: '#f9fafb' },
  profileContent: { paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 24 },
  profileHero: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  profileAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileAvatarLargeText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  profileHeroName: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 },
  profileHeroRole: { fontSize: 13, color: '#6b7280', marginBottom: 12 },
  profileStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  profileCardTitle: { fontSize: 13, fontWeight: '800', color: '#111827', marginBottom: 12 },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileInfoLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280' },
  profileInfoValue: { fontSize: 12, fontWeight: '600', color: '#111827' },
  profilePermissionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  permissionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#10B981',
  },
  permissionLabel: { fontSize: 12, fontWeight: '700', color: '#111827', marginBottom: 2 },
  permissionDesc: { fontSize: 11, color: '#6b7280' },
});
