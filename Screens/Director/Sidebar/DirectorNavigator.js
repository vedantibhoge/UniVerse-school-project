import React, { useState, useRef, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';

import DirectorDashboard from '../Dashboard/Dashboards';
import DirectorFinance from '../Finance/Finance';
import DirectorStaff from '../Staff/Staff';
import DirectorStudents from '../Student/Student';
import DirectorBranch from '../Branch/Branch';
import DirectorAnalytics from '../Analytics/Analytics';
import DirectorSettings from '../Settings/Settings';
import DirectorReport from '../Report/Report';
import DirectorNotifications from '../Notification/Notifications';
import { DIRECTOR_ROUTE_MAP } from './directorNavigation';

const { height } = Dimensions.get('window');

// Content stack (all screens rendered to the right of the sidebar)
const ContentStack = createStackNavigator();

export default function DirectorNavigator({ navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stackRef = useRef(null);

  function ContentStackScreens() {
    return (
      <ContentStack.Navigator
        initialRouteName="DirectorDashboard"
        ref={stackRef}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setSidebarOpen((s) => !s)}
              style={{ marginLeft: 12, paddingVertical: 8, paddingHorizontal: 10 }}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 20, fontWeight: '700' }}>{'☰'}</Text>
            </TouchableOpacity>
          ),
        })}
      >
        <ContentStack.Screen name="DirectorDashboard" component={DirectorDashboard} />
        <ContentStack.Screen name="DirectorStudents" component={DirectorStudents} />
        <ContentStack.Screen name="DirectorStudentGrowth" component={DirectorStudents} />
        <ContentStack.Screen name="DirectorAdmissions" component={DirectorStudents} />
        <ContentStack.Screen name="DirectorDropouts" component={DirectorStudents} />
        <ContentStack.Screen name="DirectorFinance" component={DirectorFinance} />
        <ContentStack.Screen name="DirectorRevenue" component={DirectorFinance} />
        <ContentStack.Screen name="DirectorFeeCollection" component={DirectorFinance} />
        <ContentStack.Screen name="DirectorExpenditure" component={DirectorFinance} />
        <ContentStack.Screen name="DirectorIncomeVsExpense" component={DirectorFinance} />
        <ContentStack.Screen name="DirectorProfitLoss" component={DirectorFinance} />
        <ContentStack.Screen name="DirectorStaff" component={DirectorStaff} />
        <ContentStack.Screen name="DirectorStaffPerformance" component={DirectorStaff} />
        <ContentStack.Screen name="DirectorStaffAttendance" component={DirectorStaff} />
        <ContentStack.Screen name="DirectorSalaryReports" component={DirectorStaff} />
        <ContentStack.Screen name="DirectorSchoolPerformance" component={DirectorAnalytics} />
        <ContentStack.Screen name="DirectorResultReports" component={DirectorAnalytics} />
        <ContentStack.Screen name="DirectorDeptPerformance" component={DirectorAnalytics} />
        <ContentStack.Screen name="DirectorBranch" component={DirectorBranch} />
        <ContentStack.Screen name="DirectorBranchPerformance" component={DirectorBranch} />
        <ContentStack.Screen name="DirectorBranchComparison" component={DirectorBranch} />
        <ContentStack.Screen name="DirectorGrowthReports" component={DirectorBranch} />
        <ContentStack.Screen name="DirectorAnalytics" component={DirectorAnalytics} />
        <ContentStack.Screen name="DirectorAdmissionTrends" component={DirectorAnalytics} />
        <ContentStack.Screen name="DirectorKPIDashboard" component={DirectorAnalytics} />
        <ContentStack.Screen name="DirectorChartsReports" component={DirectorAnalytics} />
        <ContentStack.Screen name="DirectorReport" component={DirectorReport} />
        <ContentStack.Screen name="DirectorHighLevelReports" component={DirectorReport} />
        <ContentStack.Screen name="DirectorMonthlyReports" component={DirectorReport} />
        <ContentStack.Screen name="DirectorDownloadReports" component={DirectorReport} />
        <ContentStack.Screen name="DirectorAlerts" component={DirectorNotifications} />
        <ContentStack.Screen name="DirectorUpdates" component={DirectorNotifications} />
        <ContentStack.Screen name="DirectorProfile" component={DirectorSettings} />
        <ContentStack.Screen name="DirectorAccess" component={DirectorSettings} />
        <ContentStack.Screen name="DirectorLogout" component={DirectorDashboard} />
      </ContentStack.Navigator>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: sidebarOpen ? 300 : 0 }}>
          {sidebarOpen && (
            <DirectorSidebar
              activeKey="dashboard"
              onNavigate={(key) => {
                const route = DIRECTOR_ROUTE_MAP[key];
                if (!route) return;
                if (route.name === 'logout') {
                  if (navigation && typeof navigation.replace === 'function') {
                    navigation.replace('Login');
                  }
                  return;
                }
                // navigate using the nested stack ref when available
                  // navigate into the nested ContentStack by targeting this navigator's route
                  // prefer navigating the nested ContentStack directly
                  if (stackRef.current && typeof stackRef.current.navigate === 'function') {
                    if (route.params) stackRef.current.navigate(route.name, route.params);
                    else stackRef.current.navigate(route.name);
                    setSidebarOpen(false);
                    return;
                  }

                  // fallback to parent navigation (nested navigate)
                  if (navigation && typeof navigation.navigate === 'function') {
                    navigation.navigate('DirectorSidebar', { screen: route.name, params: route.params });
                    setSidebarOpen(false);
                  }
              }}
              onLogout={() => {
                if (navigation && typeof navigation.replace === 'function') navigation.replace('Login');
              }}
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <ContentStackScreens />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#FFFFFF',
  bgCard: '#F9FAFB',
  bgHover: '#F3F4F6',
  bgActive: '#EBF2FF',
  accent: '#2563EB',
  accentSoft: 'rgba(37,99,235,0.1)',
  accentGlow: 'rgba(37,99,235,0.06)',
  text: '#111827',
  textMuted: '#6B7280',
  textDim: '#9CA3AF',
  border: 'rgba(0,0,0,0.08)',
  borderActive: 'rgba(37,99,235,0.3)',
  divider: 'rgba(0,0,0,0.06)',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  pink: '#EC4899',
  teal: '#14B8A6',
  orange: '#F97316',
};

// ─── Menu Structure ────────────────────────────────────────────────────────────
const MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '⊞',
    color: C.accent,
    badge: null,
    children: [
      { id: 'overview', label: 'Overview', icon: '◈' },
    ],
  },
  {
    id: 'students',
    label: 'Students',
    icon: '👤',
    color: C.cyan,
    badge: '1.2k',
    children: [
      { id: 'total_students', label: 'Total Students', icon: '◎' },
      { id: 'student_growth', label: 'Student Growth', icon: '↗' },
      { id: 'admissions', label: 'Admissions', icon: '✦' },
      { id: 'dropouts', label: 'Dropouts / Transfers', icon: '↩' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: '💰',
    color: C.green,
    badge: null,
    children: [
      { id: 'revenue', label: 'Revenue', icon: '◈' },
      { id: 'fee_collection', label: 'Fee Collection Summary', icon: '◎' },
      { id: 'expenses', label: 'Expenses', icon: '↘' },
      { id: 'income_vs_expense', label: 'Income vs Expense', icon: '⇄' },
      { id: 'profit_loss', label: 'Profit / Loss Analytics', icon: '↗' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff Management',
    icon: '👥',
    color: C.purple,
    badge: null,
    children: [
      { id: 'staff_performance', label: 'Staff Performance', icon: '★' },
      { id: 'staff_attendance', label: 'Attendance', icon: '✓' },
      { id: 'salary_reports', label: 'Salary Reports', icon: '◈' },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: '🎓',
    color: C.amber,
    badge: null,
    children: [
      { id: 'school_performance', label: 'School Performance Analytics', icon: '↗' },
      { id: 'result_reports', label: 'Result Reports', icon: '◎' },
      { id: 'dept_performance', label: 'Department Performance', icon: '⊞' },
    ],
  },
  {
    id: 'branches',
    label: 'Branches',
    icon: '🏢',
    color: C.teal,
    badge: '5',
    children: [
      { id: 'branch_performance', label: 'Branch Performance', icon: '↗' },
      { id: 'branch_comparison', label: 'Branch Comparison', icon: '⇄' },
      { id: 'growth_reports', label: 'Growth Reports', icon: '◈' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📊',
    color: C.pink,
    badge: null,
    children: [
      { id: 'admission_trends', label: 'Admission Trends Prediction', icon: '↗' },
      { id: 'kpi_dashboard', label: 'KPI Dashboard', icon: '⊞' },
      { id: 'charts_reports', label: 'Charts & Reports', icon: '◈' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '📋',
    color: C.orange,
    badge: '3',
    children: [
      { id: 'high_level', label: 'High Level Reports', icon: '◈' },
      { id: 'monthly_reports', label: 'Monthly Reports', icon: '◎' },
      { id: 'download_reports', label: 'Download Reports', icon: '⬇' },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    color: C.red,
    badge: '12',
    children: [
      { id: 'alerts', label: 'Alerts', icon: '⚠' },
      { id: 'updates', label: 'Important Updates', icon: '✦' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙',
    color: C.textMuted,
    badge: null,
    children: [
      { id: 'profile', label: 'Profile', icon: '◎' },
      { id: 'permissions', label: 'Permissions', icon: '🔒' },
      { id: 'logout', label: 'Logout', icon: '↩', danger: true },
    ],
  },
];

function findMenuEntryByKey(key) {
  for (const item of MENU) {
    if (item.id === key) {
      return { id: item.id, label: item.label, parentId: item.id };
    }

    const child = item.children?.find((entry) => entry.id === key);
    if (child) {
      return { id: child.id, label: child.label, parentId: item.id };
    }
  }

  return null;
}

// ─── Menu Section ─────────────────────────────────────────────────────────
function MenuSection({ item, activeItem, expandedId, setExpandedId, onSelect }) {
  const isParentActive = activeItem?.id === item.id || activeItem?.parentId === item.id;
  const isExpanded = true;

  const handleParentPress = () => {
    onSelect({ id: item.id, label: item.label, parentId: item.id });
  };

  return (
    <View style={styles.accordionWrapper}>
      <TouchableOpacity
        style={[
          styles.parentRow,
          isParentActive && styles.parentRowActive,
        ]}
        onPress={handleParentPress}
        activeOpacity={0.75}
      >
        {isParentActive && <View style={[styles.accentBar, { backgroundColor: item.color }]} />}

        <View style={[styles.iconPill, { backgroundColor: isParentActive ? item.color + '22' : C.bgHover }]}>
          <Text style={[styles.parentIcon, isParentActive && { color: item.color }]}>{item.icon}</Text>
        </View>

        <Text
          style={[
            styles.parentLabel,
            isParentActive && { color: item.color, fontWeight: '700' },
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Text>

        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.color + '22', borderColor: item.color + '44' }]}>
            <Text style={[styles.badgeText, { color: item.color }]}>{item.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Director Sidebar Component ──────────────────────────────────────────────────────────
function DirectorSidebar({ onNavigate, activeKey, onLogout }) {
  const [activeItem, setActiveItem] = useState({
    id: 'overview',
    label: 'Overview',
    parentId: 'dashboard',
  });
  const [expandedId, setExpandedId] = useState('dashboard');
  const [logoutPressed, setLogoutPressed] = useState(false);

  useEffect(() => {
    if (!activeKey) return;
    const match = findMenuEntryByKey(activeKey);
    if (match) {
      setActiveItem(match);
      setExpandedId(match.parentId);
    }
  }, [activeKey]);

  const handleSelect = (item) => {
    setActiveItem(item);
    if (item.id === 'logout' && onLogout) {
      onLogout();
      return;
    }
    onNavigate && onNavigate(item.id);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={styles.sidebar}>

        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoBoxText}>✦</Text>
            </View>
            <View>
              <Text style={styles.logoTitle}>Director</Text>
              <Text style={styles.logoSub}>Control Panel</Text>
            </View>
          </View>

          {/* Profile strip */}
          <TouchableOpacity style={styles.profileStrip} activeOpacity={0.8}>
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

        {/* ── Active Breadcrumb ────────────────────────────── */}
        {activeItem && (
          <View style={styles.breadcrumb}>
            <Text style={styles.breadcrumbIcon}>◈</Text>
            <Text style={styles.breadcrumbText} numberOfLines={1}>
              {activeItem.label}
            </Text>
          </View>
        )}

        {/* ── Menu ───────────────────────────────────────── */}
        <ScrollView
          style={styles.menuScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuContent}
        >
          <Text style={styles.sectionLabel}>NAVIGATION</Text>

          {MENU.map((item) => (
            <React.Fragment key={item.id}>
              {/* Divider before Settings */}
              {item.id === 'settings' && <View style={styles.divider} />}
              <MenuSection
                item={item}
                activeItem={activeItem}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                onSelect={handleSelect}
              />
            </React.Fragment>
          ))}

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* ── Footer ─────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerRow}>
              <View style={styles.footerDot} />
              <Text style={styles.footerText}>System Online</Text>
            </View>
            <Text style={styles.footerVersion}>v2.4.1</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.logoutBtn, logoutPressed && styles.logoutBtnPressed]}
            activeOpacity={0.85}
            onPress={handleLogout}
            onPressIn={() => setLogoutPressed(true)}
            onPressOut={() => setLogoutPressed(false)}
          >
            <Text style={styles.logoutIcon}>↩</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  sidebar: {
    flex: 1,
    backgroundColor: C.bg,
    borderRightWidth: 1,
    borderRightColor: C.border,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    gap: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.accent,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  logoBoxText: { color: '#fff', fontSize: 18 },
  logoTitle: { color: C.text, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  logoSub: { color: C.textMuted, fontSize: 9, fontWeight: '600', letterSpacing: 1, marginTop: 1 },

  profileStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bgCard,
    borderRadius: 10,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  avatarRing: { position: 'relative' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.bgCard,
  },
  profileName: { color: C.text, fontSize: 11, fontWeight: '700' },
  profileRole: { color: C.textMuted, fontSize: 9, marginTop: 1 },
  profileChevron: { color: C.textDim, fontSize: 18, fontWeight: '300' },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.accentGlow,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  breadcrumbIcon: { color: C.accent, fontSize: 10 },
  breadcrumbText: { color: C.accent, fontSize: 10, fontWeight: '600', letterSpacing: 0.5, flex: 1 },

  // Menu
  menuScroll: { flex: 1 },
  menuContent: { paddingTop: 8, paddingHorizontal: 10 },
  sectionLabel: {
    color: C.textDim,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 2,
  },

  // Menu Item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 10,
    marginBottom: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  menuItemActive: {
    backgroundColor: C.accentGlow,
    borderWidth: 1,
    borderColor: C.borderActive,
  },
  menuLabel: {
    flex: 1,
    color: C.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // Accordion
  accordionWrapper: { marginBottom: 2 },

  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  parentRowActive: {
    backgroundColor: C.accentGlow,
    borderWidth: 1,
    borderColor: C.borderActive,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
  },
  iconPill: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentIcon: { fontSize: 14 },
  parentLabel: {
    flex: 1,
    color: C.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 8, fontWeight: '800' },
  arrow: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '300',
    marginRight: 2,
  },

  // Children
  childrenContainer: {
    marginLeft: 20,
    marginTop: 2,
    marginBottom: 4,
    borderLeftWidth: 1,
    borderLeftColor: C.divider,
    paddingLeft: 0,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 1,
    marginLeft: -1,
    gap: 8,
  },
  childRowActive: {
    backgroundColor: C.bgHover,
  },
  connectorLine: {
    width: 12,
    height: 1,
    backgroundColor: C.divider,
  },
  connectorDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: C.textDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorDotFill: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  childIcon: {
    fontSize: 10,
    color: C.textDim,
    width: 14,
    textAlign: 'center',
  },
  childLabel: {
    flex: 1,
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  activeChip: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChipDot: { width: 5, height: 5, borderRadius: 3 },

  // Misc
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginVertical: 8,
    marginHorizontal: 8,
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.divider,
    gap: 10,
  },
  footerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  footerText: { color: C.textDim, fontSize: 9, fontWeight: '600' },
  footerVersion: { color: C.textDim, fontSize: 9 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.red,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    opacity: 0.9,
  },
  logoutBtnPressed: {
    opacity: 0.75,
    backgroundColor: '#DC2626',
  },
  logoutIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});