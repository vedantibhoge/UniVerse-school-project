import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  SafeAreaView,
} from 'react-native';

import ParentsDashboard from './ParentsDashboard';
import Attendance from '../Attendance/Attendance';
import Homework from '../Homework/Homework';
import Fees from '../Fees/Fees';
import Academics from '../Academics/Academics';
import Timetable from '../Timetable/Timetable';
import Profile from '../Profile/Profile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_LARGE_SCREEN = SCREEN_WIDTH >= 768;

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '⊞', screen: 'ParentsDashboard' },
  { id: 'attendance', label: 'Attendance', icon: '📅', screen: 'Attendance' },
  { id: 'homework',   label: 'Homework',   icon: '📋', screen: 'Homework' },
  { id: 'fees',       label: 'Fees',       icon: '🖥️', screen: 'Fees' },
  { id: 'academics',  label: 'Academics',  icon: '🎓', screen: 'Academics' },
  { id: 'timetable',  label: 'Timetable',  icon: '🕐', screen: 'Timetable' },
  { id: 'profile',    label: 'Profile',    icon: '👤', screen: 'Profile' },
];

// ─── Logo Component ───────────────────────────────────────────────────────────
const Logo = ({ collapsed }) => (
  <View style={styles.logoContainer}>
    <View style={styles.logoIconWrapper}>
      <Text style={styles.logoIcon}>🎓</Text>
    </View>
    {!collapsed && (
      <View style={styles.logoTextWrapper}>
        <Text style={styles.logoTitle}>EduCurator</Text>
        <Text style={styles.logoSubtitle}>ACADEMIC EXCELLENCE</Text>
      </View>
    )}
  </View>
);

// ─── Nav Item Component ───────────────────────────────────────────────────────
const NavItem = ({ item, isActive, collapsed, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.navItemTouchable}
      accessibilityLabel={item.label}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.navItem,
          collapsed && styles.navItemCollapsed,
          isActive && styles.navItemActive,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {isActive && <View style={styles.activeBar} />}

        <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
          <Text style={[styles.navIcon, isActive && styles.navIconActive]}>
            {item.icon}
          </Text>
        </View>

        {!collapsed && (
          <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
            {item.label}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Hamburger Button ─────────────────────────────────────────────────────────
const HamburgerButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.hamburgerBtn}
    activeOpacity={0.7}
    accessibilityLabel="Open sidebar menu"
    accessibilityRole="button"
  >
    <View style={styles.hamburgerLine} />
    <View style={[styles.hamburgerLine, styles.hamburgerLineMid]} />
    <View style={styles.hamburgerLine} />
  </TouchableOpacity>
);

// ─── Overlay Sidebar ──────────────────────────────────────────────────────────
const OverlaySidebar = ({ visible, onClose, activeItem, onNavigate, onLogout }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = IS_LARGE_SCREEN
    ? collapsed ? 72 : 220
    : SCREEN_WIDTH * 0.72;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlayContainer} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropAnim },
          ]}
        />
      </TouchableOpacity>

      {/* Sidebar Panel */}
      <Animated.View
        style={[
          styles.sidebarPanel,
          { width: sidebarWidth, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <Logo collapsed={collapsed} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {IS_LARGE_SCREEN && (
                <TouchableOpacity
                  onPress={() => setCollapsed(!collapsed)}
                  style={styles.collapseBtn}
                  activeOpacity={0.7}
                  accessibilityLabel="Toggle sidebar"
                >
                  <Text style={styles.collapseBtnText}>{collapsed ? '›' : '‹'}</Text>
                </TouchableOpacity>
              )}
              {/* Close button */}
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                activeOpacity={0.7}
                accessibilityLabel="Close sidebar"
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Nav Items ── */}
          <ScrollView
            style={styles.navList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.navListContent}
          >
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                collapsed={collapsed}
                onPress={(navItem) => {
                  onNavigate(navItem);
                }}
              />
            ))}
          </ScrollView>

          <View style={styles.divider} />

          {/* ── Logout ── */}
          <View style={styles.logoutSection}>
            {collapsed ? (
              <TouchableOpacity
                style={styles.logoutIconBtn}
                activeOpacity={0.7}
                onPress={onLogout}
                accessibilityLabel="Logout"
                accessibilityRole="button"
              >
                <Text style={styles.logoutIconText}>🚪</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.logoutBtn}
                activeOpacity={0.7}
                onPress={onLogout}
                accessibilityLabel="Logout"
                accessibilityRole="button"
              >
                <Text style={styles.logoutBtnIcon}>🚪</Text>
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>

        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

// ─── Placeholder Screen Component ─────────────────────────────────────────────
const PlaceholderScreen = ({ route, navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const screenName = route.name;
  const navItem = NAV_ITEMS.find(i => i.screen === screenName);

  const screenIcons = {
    Attendance: '📅',
    Homework: '📋',
    Fees: '🖥️',
    Academics: '🎓',
    Timetable: '🕐',
    Profile: '👤',
  };

  const handleNavigate = (item) => {
    setSidebarVisible(false);
    setTimeout(() => {
      navigation.navigate(item.screen);
    }, 250);
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    console.log('Logout pressed');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F8FF' }}>
      <SafeAreaView style={styles.topBar}>
        <HamburgerButton onPress={() => setSidebarVisible(true)} />
        <Text style={styles.topBarTitle}>{screenName}</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <View style={styles.placeholderContent}>
        <Text style={styles.placeholderIcon}>{screenIcons[screenName] || '📄'}</Text>
        <Text style={styles.placeholderTitle}>{screenName}</Text>
        <Text style={styles.placeholderSubtitle}>This section is coming soon.</Text>
      </View>

      <OverlaySidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeItem={navItem?.id || ''}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </View>
  );
};

// ─── Dashboard Wrapper ────────────────────────────────────────────────────────
const DashboardWithSidebar = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleNavigate = (item) => {
    setSidebarVisible(false);
    setTimeout(() => {
      if (item.screen !== 'ParentsDashboard') {
        navigation.navigate(item.screen);
      }
    }, 250);
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    console.log('Logout pressed');
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.topBar}>
        <HamburgerButton onPress={() => setSidebarVisible(true)} />
        <Text style={styles.topBarTitle}>Dashboard</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      <View style={{ flex: 1 }}>
        <ParentsDashboard navigation={navigation} />
      </View>

      <OverlaySidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeItem="dashboard"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF2',
    ...Platform.select({
      ios: {
        shadowColor: '#1A3A5C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A2D4F',
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  // ── Hamburger ──
  hamburgerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#1565D8',
    borderRadius: 2,
  },
  hamburgerLineMid: {
    width: 14,
    alignSelf: 'flex-start',
    marginLeft: 12,
  },

  // ── Overlay Container ──
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 30, 60, 0.35)',
  },

  // ── Sidebar Panel ──
  sidebarPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E8EDF2',
    ...Platform.select({
      ios: {
        shadowColor: '#1A3A5C',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1565D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { fontSize: 18 },
  logoTextWrapper: { flex: 1 },
  logoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565D8',
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  logoSubtitle: {
    fontSize: 8,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginTop: 1,
  },

  // ── Collapse + Close Buttons ──
  collapseBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  collapseBtnText: {
    fontSize: 16,
    color: '#1565D8',
    fontWeight: '700',
    lineHeight: 20,
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  closeBtnText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
    lineHeight: 16,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginHorizontal: 12,
    marginVertical: 4,
  },

  // ── Nav List ──
  navList: { flex: 1 },
  navListContent: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 2,
  },
  navItemTouchable: {
    borderRadius: 12,
    marginVertical: 1,
    overflow: 'hidden',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    gap: 0,
  },
  navItemActive: { backgroundColor: '#EBF1FD' },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: '20%',
    height: '60%',
    width: 3,
    borderRadius: 2,
    backgroundColor: '#1565D8',
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapperActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#1565D8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  navIcon: { fontSize: 16 },
  navIconActive: {},
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 0.1,
  },
  navLabelActive: {
    color: '#1565D8',
    fontWeight: '700',
  },

  // ── Logout Section ──
  logoutSection: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnIcon: {
    fontSize: 16,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  logoutIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoutIconText: { fontSize: 18 },

  // ── Placeholder Screen ──
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderIcon: { fontSize: 56 },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A2D4F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
});

// ─── Main ParentSidebar Component ─────────────────────────────────────────────
const ParentSidebar = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('ParentsDashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleNavigate = (item) => {
    setSidebarVisible(false);
    setTimeout(() => {
      setCurrentScreen(item.screen);
    }, 200);
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    setTimeout(() => {
      navigation.replace('Login');
    }, 150);
  };

  const getScreenTitle = () => {
    const found = NAV_ITEMS.find(i => i.screen === currentScreen);
    return found ? found.label : 'Dashboard';
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Attendance':
        return <Attendance />;
      case 'Homework':
        return <Homework />;
      case 'Fees':
        return <Fees />;
      case 'Academics':
        return <Academics />;
      case 'Timetable':
        return <Timetable />;
      case 'Profile':
        return <Profile />;
      default:
        return <ParentsDashboard />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F8FF' }}>

      {/* ── Top Bar ── */}
      <SafeAreaView style={styles.topBar}>
        <HamburgerButton onPress={() => setSidebarVisible(true)} />
        <Text style={styles.topBarTitle}>{getScreenTitle()}</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>

      {/* ── Screen Content ── */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* ── Overlay Sidebar ── */}
      <OverlaySidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeItem={
          NAV_ITEMS.find(i => i.screen === currentScreen)?.id || 'dashboard'
        }
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

    </View>
  );
};

export default ParentSidebar;