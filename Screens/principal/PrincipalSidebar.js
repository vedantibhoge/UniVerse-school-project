import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import PrincipalDashboard from './PrincipalDashboard';
import PrincipalReports from './PrincipalReports';
import PrincipalStaffManagement from './PrincipalStaffManagement';
import PrincipalStudentOverview from './PrincipalStudentOverview';
import PrincipalFinance from './PrincipalFinance';
import PrincipalSettings from './PrincipalSettings';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  sidebarBg: '#1B3FA0',
  sidebarText: '#FFFFFF',
  activeTab: '#E8EEFF',
  activeTabText: '#1B3FA0',
};

export default function PrincipalSidebarContainer({ navigation }) {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(width >= 900); // Open by default on large screens

  return (
    <PrincipalSidebarContent
      activeTab={activeTab}
      onTabChange={setActiveTab}
      navigation={navigation}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={setSidebarOpen}
    />
  );
}

function PrincipalSidebarContent({ activeTab, onTabChange, navigation, sidebarOpen, onToggleSidebar }) {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Login'),
          style: 'destructive',
        },
      ]
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PrincipalDashboard onToggleSidebar={onToggleSidebar} navigation={navigation} />;
      case 'reports':
        return <PrincipalReports onToggleSidebar={onToggleSidebar} />;
      case 'staff':
        return <PrincipalStaffManagement onToggleSidebar={onToggleSidebar} navigation={navigation} />;
      case 'students':
        return <PrincipalStudentOverview onToggleSidebar={onToggleSidebar} />;
      case 'finance':
        return <PrincipalFinance onToggleSidebar={onToggleSidebar} />;
      case 'settings':
        return <PrincipalSettings onToggleSidebar={onToggleSidebar} />;
      default:
        return <PrincipalDashboard onToggleSidebar={onToggleSidebar} navigation={navigation} />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📈' },
    { id: 'staff', label: 'Staff Management', icon: '👥' },
    { id: 'students', label: 'Student Overview', icon: '🎓' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && width < 900 && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => onToggleSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <View
        style={[
          styles.sidebarContainer,
          width < 900 && {
            position: 'absolute',
            left: sidebarOpen ? 0 : -250,
          },
        ]}
      >
        <SafeAreaView style={styles.sidebarContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>P</Text>
            </View>
            <Text style={styles.headerTitle}>Principal</Text>
            <Text style={styles.headerSubtitle}>Dashboard</Text>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  activeTab === item.id && styles.menuItemActive,
                ]}
                onPress={() => {
                  onTabChange(item.id);
                  if (width < 900) onToggleSidebar(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuLabel,
                    activeTab === item.id && styles.menuLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {activeTab === item.id && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Content Area */}
      <View style={[styles.contentContainer, width >= 900 && { width: '100%' }]}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  sidebarContainer: {
    width: 250,
    backgroundColor: COLORS.sidebarBg,
    position: 'relative',
    height: '100%',
    zIndex: 20,
  },
  sidebarContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.sidebarText,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.sidebarText,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: COLORS.activeTab,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  menuLabelActive: {
    color: COLORS.activeTabText,
    fontWeight: '600',
  },
  activeIndicator: {
    width: 4,
    height: 24,
    backgroundColor: COLORS.activeTabText,
    borderRadius: 2,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.sidebarText,
  },
});
