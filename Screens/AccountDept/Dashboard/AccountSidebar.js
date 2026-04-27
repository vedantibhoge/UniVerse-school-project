import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import AccountDashboard from './AccountDashboard';
import DefaultersList from '../DefaultersList/DefaultersList';
import SendReminders from '../SendReminders/SendReminders';
import ReceiptsList from '../ReceiptsList/ReceiptsList';
import TotalCollection from '../TotalCollection/TotalCollection';
import Fees from '../Fees/Fees';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET_OR_DESKTOP = SCREEN_WIDTH >= 768;
const SIDEBAR_WIDTH = Math.floor(SCREEN_WIDTH / 2);

// ─── Icons ───────────────────────────────────────────────────────────────────

const DashboardIcon = ({ color = '#64748B' }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={3} width={7} height={7} rx={1.5} fill={color} opacity={0.9} />
    <Rect x={14} y={3} width={7} height={7} rx={1.5} fill={color} opacity={0.9} />
    <Rect x={3} y={14} width={7} height={7} rx={1.5} fill={color} opacity={0.9} />
    <Rect x={14} y={14} width={7} height={7} rx={1.5} fill={color} opacity={0.9} />
  </Svg>
);

const FeeIcon = ({ color = '#64748B' }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={5} width={20} height={14} rx={2} stroke={color} strokeWidth={1.8} />
    <Path d="M2 10h20" stroke={color} strokeWidth={1.8} />
    <Circle cx={7} cy={15} r={1.5} fill={color} />
  </Svg>
);

const LedgerIcon = ({ color = '#64748B' }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={4} y={2} width={14} height={18} rx={2} stroke={color} strokeWidth={1.8} />
    <Path d="M8 7h8M8 11h8M8 15h5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Rect x={2} y={5} width={4} height={14} rx={1} fill={color} opacity={0.25} />
  </Svg>
);

const DefaultersIcon = ({ color = '#64748B' }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3L2 20h20L12 3z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Path d="M12 10v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx={12} cy={17} r={0.8} fill={color} />
  </Svg>
);

const ExpensesIcon = ({ color = '#64748B' }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={5} width={18} height={14} rx={2} stroke={color} strokeWidth={1.8} />
    <Path d="M3 9h18" stroke={color} strokeWidth={1.8} />
    <Path d="M7 13h4M7 16h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const ReportsIcon = ({ color = '#64748B' }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={3} width={18} height={18} rx={2} stroke={color} strokeWidth={1.8} />
    <Path d="M7 17V13M11 17V9M15 17V11" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = ({ color = '#64748B' }) => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} />
    <Path
      d="M12 3.5v1.7M12 18.8v1.7M4.8 4.8l1.2 1.2M18 18l1.2 1.2M3.5 12h1.7M18.8 12h1.7M4.8 19.2l1.2-1.2M18 6l1.2-1.2"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
  </Svg>
);

const MenuIcon = ({ color = '#1E293B' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#64748B" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'fees', label: 'Fees', Icon: FeeIcon },
  { id: 'total-collection', label: 'Total Collection', Icon: FeeIcon },
  { id: 'defaulters', label: 'Defaulters', Icon: DefaultersIcon },
  { id: 'send-reminders', label: 'Send Reminders', Icon: ExpensesIcon },
  { id: 'receipts', label: 'Receipts', Icon: ReportsIcon },
];

// ─── Placeholder Module Screens ───────────────────────────────────────────────

const ModulePlaceholder = ({ label, Icon }) => (
  <View style={placeholderStyles.container}>
    <View style={placeholderStyles.iconWrapper}>
      <Icon color="#2563EB" />
    </View>
    <Text style={placeholderStyles.title}>{label}</Text>
    <Text style={placeholderStyles.subtitle}>
      This module is under construction. Content for {label} will appear here.
    </Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF2F7',
    padding: 40,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
});

// ─── Render Active Module ─────────────────────────────────────────────────────

const renderModuleContent = (activeItem, onBackToDashboard, onLogout) => {
  if (activeItem === 'dashboard') return <AccountDashboard onLogout={onLogout} />;
  if (activeItem === 'fees') return <Fees />;
  if (activeItem === 'total-collection') return <TotalCollection onBack={onBackToDashboard} />;
  if (activeItem === 'defaulters') return <DefaultersList onBack={onBackToDashboard} />;
  if (activeItem === 'send-reminders') return <SendReminders onBack={onBackToDashboard} />;
  if (activeItem === 'receipts') return <ReceiptsList onBack={onBackToDashboard} />;
  if (activeItem === 'settings') return <ModulePlaceholder label="Settings" Icon={SettingsIcon} />;
  const item = NAV_ITEMS.find((n) => n.id === activeItem);
  if (!item) return null;
  return <ModulePlaceholder label={item.label} Icon={item.Icon} />;
};

// ─── Sidebar Drawer Panel ─────────────────────────────────────────────────────

const SidebarPanel = ({ activeItem, onNavPress, onClose, onLogoutPress }) => (
  <View style={[drawerStyles.panel, { width: SIDEBAR_WIDTH }]}>

    {/* Brand Row + Close */}
    <View style={drawerStyles.topRow}>
      <View style={drawerStyles.brand}>
        <View style={drawerStyles.logoBox}>
          <DashboardIcon color="#2563EB" />
        </View>
        <View>
          <Text style={drawerStyles.brandName}>FinancePro</Text>
          <Text style={drawerStyles.brandSub}>ACADEMIC</Text>
        </View>
      </View>
      <TouchableOpacity style={drawerStyles.closeBtn} onPress={onClose} activeOpacity={0.7}>
        <CloseIcon />
      </TouchableOpacity>
    </View>

    <View style={drawerStyles.divider} />

    {/* Scrollable Nav */}
    <ScrollView
      style={drawerStyles.navScroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={drawerStyles.navScrollContent}
    >
      <View style={drawerStyles.nav}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeItem === id;
          const color = isActive ? '#2563EB' : '#64748B';
          return (
            <TouchableOpacity
              key={id}
              onPress={() => onNavPress(id)}
              activeOpacity={0.75}
              style={[drawerStyles.navItem, isActive && drawerStyles.navItemActive]}
            >
              {isActive && <View style={drawerStyles.activeBar} />}
              <Icon color={color} />
              <Text style={[drawerStyles.navLabel, { color, fontWeight: isActive ? '600' : '500' }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>

    {/* Fixed bottom actions */}
    <View style={drawerStyles.bottomSection}>
      <View style={drawerStyles.divider} />
      <TouchableOpacity style={drawerStyles.settingsBtn} onPress={() => onNavPress('settings')} activeOpacity={0.75}>
        <SettingsIcon />
        <Text style={drawerStyles.settingsLabel}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={drawerStyles.logoutBtn} onPress={onLogoutPress} activeOpacity={0.82}>
        <Text style={drawerStyles.logoutLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const drawerStyles = StyleSheet.create({
  panel: {
    height: '100%',
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.14,
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  nav: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  navScroll: {
    flex: 1,
  },
  navScrollContent: {
    paddingBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
    gap: 11,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: '#EFF6FF',
  },
  activeBar: {
    position: 'absolute',
    right: 0,
    width: 3,
    height: 22,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    backgroundColor: '#2563EB',
  },
  navLabel: {
    fontSize: 13.5,
    color: '#475569',
  },
  bottomSection: {
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: '#F8FAFC',
  },
  quickReceiptBtn: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  quickReceiptLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingsBtn: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsLabel: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569',
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  logoutLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AccountSidebar() {
  const navigation = useNavigation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [modalVisible, setModalVisible] = useState(false);

  // Animated value: starts off-screen to the left (-SIDEBAR_WIDTH), slides to 0
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  // Backdrop fade: 0 → 1
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = (callback) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      if (callback) callback();
    });
  };

  const handleNavPress = (id) => {
    closeSidebar(() => setActiveItem(id));
  };

  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  const handleLogoutPress = () => {
    closeSidebar(handleLogout);
  };

  const activeLabel = activeItem === 'settings'
    ? 'Settings'
    : NAV_ITEMS.find((n) => n.id === activeItem)?.label ?? 'Dashboard';

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Top Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openSidebar}
          activeOpacity={0.7}
        >
          <MenuIcon color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeLabel}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* ── Module Content (always visible behind sidebar) ── */}
      <View style={styles.content}>
        {renderModuleContent(activeItem, () => setActiveItem('dashboard'), handleLogout)}
      </View>

      {/* ── Sidebar Drawer (Modal Overlay with left-slide animation) ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"          // ← we handle animation ourselves
        onRequestClose={() => closeSidebar()}
      >
        {/* Full-screen row: animated panel left, faded backdrop right */}
        <View style={styles.modalRow}>

          {/* Sidebar slides in from the LEFT */}
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <SidebarPanel
              activeItem={activeItem}
              onNavPress={handleNavPress}
              onClose={() => closeSidebar()}
              onLogoutPress={handleLogoutPress}
            />
          </Animated.View>

          {/* Backdrop fades in and is tappable to close */}
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSidebar()}
            />
          </Animated.View>

        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#EFF2F7',
  },
  // Modal overlay
  modalRow: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.40)',
  },
});