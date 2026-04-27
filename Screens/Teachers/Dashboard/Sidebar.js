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
import { useNavigation } from '@react-navigation/native';

import Dashboardpage from './Dashboardpage';
import Myclasses from '../Myclasses/Myclasses';
import TeacherAttendance from '../Attendance/Attendance';
import TeacherHomework from '../Homework/Homework';
import MarksEntry from '../MarksEntry/MarksEntry';
import TeacherTimetable from '../Timetable/Timetable';
import TeacherSettings from '../Settings/Settings';
import TeacherSupport from '../Support/Support';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_LARGE_SCREEN = SCREEN_WIDTH >= 768;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', screen: 'Dashboard' },
  { id: 'classes', label: 'My Classes', icon: '📚', screen: 'MyClasses' },
  { id: 'attendance', label: 'Attendance', icon: '📅', screen: 'Attendance' },
  { id: 'homework', label: 'Homework', icon: '📋', screen: 'Homework' },
  { id: 'marks', label: 'Marks Entry', icon: '✏️', screen: 'MarksEntry' },
  { id: 'timetable', label: 'Timetable', icon: '🕐', screen: 'Timetable' },
  { id: 'settings', label: 'Settings', icon: '⚙️', screen: 'Settings' },
  { id: 'support', label: 'Support', icon: '❓', screen: 'Support' },
];

const Logo = ({ collapsed }) => (
  <View style={styles.logoContainer}>
    <View style={styles.logoIconWrapper}>
      <Text style={styles.logoIcon}>🎓</Text>
    </View>
    {!collapsed && (
      <View style={styles.logoTextWrapper}>
        <Text style={styles.logoTitle}>EduCurator</Text>
        <Text style={styles.logoSubtitle}>TEACHER PORTAL</Text>
      </View>
    )}
  </View>
);

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

const HamburgerButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.hamburgerBtn}
    activeOpacity={0.7}
  >
    <View style={styles.hamburgerLine} />
    <View style={[styles.hamburgerLine, styles.hamburgerLineMid]} />
    <View style={styles.hamburgerLine} />
  </TouchableOpacity>
);

const OverlaySidebar = ({ visible, onClose, activeItem, onNavigate, onLogout }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [collapsed, setCollapsed] = useState(false);

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
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.backdrop, { opacity: backdropAnim }]}
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.sidebarPanel,
          { width: SCREEN_WIDTH * 0.72, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Logo collapsed={collapsed} />
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

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

          <View style={styles.logoutSection}>
            <TouchableOpacity
              style={styles.logoutBtn}
              activeOpacity={0.7}
              onPress={onLogout}
            >
              <Text style={styles.logoutBtnIcon}>🚪</Text>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default function TeacherSidebar() {
  const navigation = useNavigation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  const handleNavigate = (item) => {
    setActiveItem(item.id);
    setCurrentScreen(item.screen);
    setSidebarVisible(false);
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.replace('Login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <Dashboardpage />;
      case 'MyClasses':
        return <Myclasses />;
      case 'Attendance':
        return <TeacherAttendance />;
      case 'Homework':
        return <TeacherHomework />;
      case 'MarksEntry':
        return <MarksEntry />;
      case 'Timetable':
        return <TeacherTimetable />;
      case 'Settings':
        return <TeacherSettings />;
      case 'Support':
        return <TeacherSupport />;
      default:
        return <Dashboardpage />;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topBar}>
        <HamburgerButton onPress={() => setSidebarVisible(true)} />
        <Text style={styles.topBarTitle}>Teacher Portal</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      {renderScreen()}

      <OverlaySidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FF' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  hamburgerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  hamburgerLine: { width: 24, height: 2.5, backgroundColor: '#1A1A2E', marginVertical: 3 },
  hamburgerLineMid: { width: 18 },
  overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000' },
  sidebarPanel: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  logoIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { fontSize: 24 },
  logoTextWrapper: { marginLeft: 12 },
  logoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },
  logoSubtitle: { fontSize: 11, color: '#888', letterSpacing: 0.5 },
  closeBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { fontSize: 20, color: '#666' },
  divider: { height: 1, backgroundColor: '#E8EAED', marginHorizontal: 12 },
  navList: { flex: 1 },
  navListContent: { paddingVertical: 8 },
  navItemTouchable: { paddingHorizontal: 12, paddingVertical: 4 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 4,
  },
  navItemActive: { backgroundColor: '#F0F2F5' },
  navItemCollapsed: { justifyContent: 'center' },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: '#1B3FA0',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  iconWrapper: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  iconWrapperActive: { backgroundColor: '#E3ECFF', borderRadius: 8 },
  navIcon: { fontSize: 18, color: '#666' },
  navIconActive: { color: '#1B3FA0' },
  navLabel: { marginLeft: 12, fontSize: 14, color: '#444', fontWeight: '500' },
  navLabelActive: { color: '#1B3FA0', fontWeight: '600' },
  logoutSection: { padding: 12 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FFE8E8',
  },
  logoutBtnIcon: { fontSize: 18, marginRight: 8 },
  logoutBtnText: { fontSize: 14, fontWeight: '600', color: '#D32F2F' },
});
