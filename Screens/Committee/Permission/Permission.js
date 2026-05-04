import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  AccessibilityInfo,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../Sidebar/Sidebar';

const Permission = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const slideAnim = useRef(new Animated.Value(-280)).current;

  // Upload Permissions State
  const [uploadPerms, setUploadPerms] = useState({
    admin: { uploadData: true, loginAccess: true },
    teacher: { uploadData: true, loginAccess: true },
    student: { uploadData: false, loginAccess: true },
    parent: { uploadData: false, loginAccess: true },
  });

  // Tab Access Control State
  const [tabAccess, setTabAccess] = useState({
    admin: { dashboard: true, reports: true, settings: true, users: true },
    teacher: { dashboard: true, attendance: true, grades: true, assignments: false },
    student: { dashboard: true, grades: true, assignments: true, attendance: false },
    parent: { dashboard: true, grades: true, attendance: true, messages: true },
  });

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 0 : -280,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen]);

  const handleMenuPress = () => {
    setSidebarOpen(true);
    AccessibilityInfo.announceForAccessibility('Sidebar opened');
  };

  // Stats Data
  const stats = [
    { id: 1, icon: '👥', label: 'Total Roles', value: '4', color: '#00D9FF' },
    { id: 2, icon: '🟢', label: 'Active Sessions', value: '12', color: '#4CAF50' },
    { id: 3, icon: '⚠️', label: 'Failed Logins', value: '3', color: '#FF9800' },
    { id: 4, icon: '📊', label: 'Total Logs', value: '256', color: '#9C27B0' },
  ];

  // Login Activity Data
  const loginActivity = [
    {
      id: 1,
      initials: 'AK',
      name: 'Arjun Kumar',
      email: 'arjun@school.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2 min ago',
      ip: '192.168.1.100',
      device: 'iPhone 12',
    },
    {
      id: 2,
      initials: 'SP',
      name: 'Sarah Patel',
      email: 'sarah@school.com',
      role: 'Teacher',
      status: 'Active',
      lastLogin: '15 min ago',
      ip: '192.168.1.101',
      device: 'Chrome on Windows',
    },
    {
      id: 3,
      initials: 'MJ',
      name: 'Maya Joshi',
      email: 'maya@school.com',
      role: 'Parent',
      status: 'Expired',
      lastLogin: '2 days ago',
      ip: '192.168.1.102',
      device: 'Safari on Mac',
    },
  ];

  // Role Filters
  const roles = ['all', 'admin', 'teacher', 'student', 'parent'];

  // Filtered Login Activity
  const filteredActivity = loginActivity.filter(
    (item) =>
      (selectedRoleFilter === 'all' || item.role.toLowerCase() === selectedRoleFilter) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#4CAF50';
      case 'Blocked':
        return '#F44336';
      case 'Expired':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={handleMenuPress}
          accessible={true}
          accessibilityLabel="Open Navigation Menu"
          accessibilityRole="button"
          accessibilityHint="Open the sidebar menu to navigate to other screens"
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>UniVerseZ</Text>

      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Permissions Dashboard Content"
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text
            style={styles.sectionTitle}
            accessible={true}
            accessibilityLabel="Permissions and Access"
            accessibilityRole="header"
          >
            Permissions & Access
          </Text>
          <Text
            style={styles.sectionDescription}
            accessible={true}
            accessibilityLabel="Manage access and monitor activity"
          >
            Manage access and monitor activity
          </Text>
        </View>

        {/* Stats Cards - Vertical Layout */}
        <View
          style={styles.statsGrid}
          accessible={true}
          accessibilityLabel="Statistics Section"
        >
          {stats.map((stat) => (
            <View
              key={stat.id}
              style={styles.statCard}
              accessible={true}
              accessibilityLabel={`${stat.label}: ${stat.value}`}
              accessibilityRole="summary"
            >
              <Text
                style={[styles.statIcon, { color: stat.color }]}
                accessible={true}
                accessibilityLabel={stat.label}
              >
                {stat.icon}
              </Text>
              <Text
                style={styles.statValue}
                accessible={true}
                accessibilityLabel={stat.value}
              >
                {stat.value}
              </Text>
              <Text
                style={styles.statLabel}
                accessible={true}
                accessibilityLabel={stat.label}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Tab Navigation - Mobile Style */}
        <View
          style={styles.tabNavigation}
          accessible={true}
          accessibilityLabel="Tab Navigation"
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upload' && styles.tabActive]}
            onPress={() => {
              setActiveTab('upload');
              AccessibilityInfo.announceForAccessibility('Upload Permissions tab selected');
            }}
            accessible={true}
            accessibilityLabel="Upload Permissions"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'upload' }}
          >
            <Text style={[styles.tabIcon, activeTab === 'upload' && styles.tabIconActive]}>
              📤
            </Text>
            <Text style={[styles.tabText, activeTab === 'upload' && styles.tabTextActive]}>
              Upload
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
            onPress={() => {
              setActiveTab('activity');
              AccessibilityInfo.announceForAccessibility('Login Activity tab selected');
            }}
            accessible={true}
            accessibilityLabel="Login Activity"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'activity' }}
          >
            <Text style={[styles.tabIcon, activeTab === 'activity' && styles.tabIconActive]}>
              📋
            </Text>
            <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>
              Activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'access' && styles.tabActive]}
            onPress={() => {
              setActiveTab('access');
              AccessibilityInfo.announceForAccessibility('Tab Access Control tab selected');
            }}
            accessible={true}
            accessibilityLabel="Tab Access"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'access' }}
          >
            <Text style={[styles.tabIcon, activeTab === 'access' && styles.tabIconActive]}>
              🔐
            </Text>
            <Text style={[styles.tabText, activeTab === 'access' && styles.tabTextActive]}>
              Access
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upload Permissions Tab */}
        {activeTab === 'upload' && (
          <View accessible={true} accessibilityLabel="Upload Permissions Section">
            {Object.entries(uploadPerms).map(([role, perms]) => (
              <View
                key={role}
                style={styles.roleCard}
                accessible={true}
                accessibilityLabel={`${role.charAt(0).toUpperCase() + role.slice(1)} Role Permissions`}
              >
                <View style={styles.roleHeader}>
                  <Text
                    style={styles.roleBadge}
                    accessible={true}
                    accessibilityLabel={`${role.charAt(0).toUpperCase() + role.slice(1)}`}
                  >
                    {role.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.permissionToggle}>
                  <Text
                    style={styles.permissionLabel}
                    accessible={true}
                    accessibilityLabel="Upload Data"
                  >
                    📤 Upload Data
                  </Text>
                  <Switch
                    value={perms.uploadData}
                    onValueChange={(val) =>
                      setUploadPerms({
                        ...uploadPerms,
                        [role]: { ...perms, uploadData: val },
                      })
                    }
                    accessible={true}
                    accessibilityLabel={`Upload Data ${perms.uploadData ? 'enabled' : 'disabled'}`}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: perms.uploadData }}
                    accessibilityHint={`Toggle to ${
                      perms.uploadData ? 'disable' : 'enable'
                    } upload permissions`}
                  />
                </View>

                <View style={styles.permissionToggle}>
                  <Text
                    style={styles.permissionLabel}
                    accessible={true}
                    accessibilityLabel="Login Access"
                  >
                    🔓 Login Access
                  </Text>
                  <Switch
                    value={perms.loginAccess}
                    onValueChange={(val) =>
                      setUploadPerms({
                        ...uploadPerms,
                        [role]: { ...perms, loginAccess: val },
                      })
                    }
                    accessible={true}
                    accessibilityLabel={`Login Access ${perms.loginAccess ? 'enabled' : 'disabled'}`}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: perms.loginAccess }}
                    accessibilityHint={`Toggle to ${
                      perms.loginAccess ? 'disable' : 'enable'
                    } login access`}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Login Activity Tab */}
        {activeTab === 'activity' && (
          <View accessible={true} accessibilityLabel="Login Activity Section">
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or email..."
                placeholderTextColor="#ccc"
                value={searchQuery}
                onChangeText={setSearchQuery}
                accessible={true}
                accessibilityLabel="Search users"
                accessibilityHint="Type to search login activity by name or email"
              />
            </View>

            {/* Role Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterChipsContainer}
              accessible={true}
              accessibilityLabel="Role Filter"
            >
              {roles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.filterChip,
                    selectedRoleFilter === role && styles.filterChipActive,
                  ]}
                  onPress={() => {
                    setSelectedRoleFilter(role);
                    AccessibilityInfo.announceForAccessibility(`Filtered to ${role}`);
                  }}
                  accessible={true}
                  accessibilityLabel={`Filter: ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedRoleFilter === role }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedRoleFilter === role && styles.filterChipTextActive,
                    ]}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Login Activity Cards */}
            {filteredActivity.length > 0 ? (
              filteredActivity.map((activity) => (
                <View
                  key={activity.id}
                  style={styles.activityCard}
                  accessible={true}
                  accessibilityLabel={`${activity.name} - ${activity.status}`}
                >
                  <View style={styles.activityHeader}>
                    <View
                      style={styles.avatar}
                      accessible={true}
                      accessibilityLabel={`Avatar for ${activity.name}`}
                    >
                      <Text style={styles.avatarText}>{activity.initials}</Text>
                    </View>

                    <View style={styles.activityInfo}>
                      <Text
                        style={styles.activityName}
                        accessible={true}
                        accessibilityLabel={activity.name}
                      >
                        {activity.name}
                      </Text>
                      <Text
                        style={styles.activityEmail}
                        accessible={true}
                        accessibilityLabel={activity.email}
                      >
                        {activity.email}
                      </Text>
                    </View>

                    <View
                      style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) }]}
                      accessible={true}
                      accessibilityLabel={`Status: ${activity.status}`}
                    >
                      <Text style={styles.statusBadgeText}>{activity.status}</Text>
                    </View>
                  </View>

                  <View style={styles.activityDetails}>
                    <View style={styles.detailItem}>
                      <Text
                        style={styles.detailLabel}
                        accessible={true}
                        accessibilityLabel="Role"
                      >
                        👥 Role
                      </Text>
                      <Text
                        style={styles.detailValue}
                        accessible={true}
                        accessibilityLabel={activity.role}
                      >
                        {activity.role}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Text
                        style={styles.detailLabel}
                        accessible={true}
                        accessibilityLabel="Last Login"
                      >
                        ⏱️ Last Login
                      </Text>
                      <Text
                        style={styles.detailValue}
                        accessible={true}
                        accessibilityLabel={activity.lastLogin}
                      >
                        {activity.lastLogin}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.activityDetails}>
                    <View style={styles.detailItem}>
                      <Text
                        style={styles.detailLabel}
                        accessible={true}
                        accessibilityLabel="IP Address"
                      >
                        🌐 IP
                      </Text>
                      <Text
                        style={styles.detailValue}
                        accessible={true}
                        accessibilityLabel={activity.ip}
                      >
                        {activity.ip}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Text
                        style={styles.detailLabel}
                        accessible={true}
                        accessibilityLabel="Device"
                      >
                        💻 Device
                      </Text>
                      <Text
                        style={styles.detailValue}
                        accessible={true}
                        accessibilityLabel={activity.device}
                      >
                        {activity.device}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text
                  style={styles.emptyStateText}
                  accessible={true}
                  accessibilityLabel="No matching login activity found"
                >
                  No matching activity found
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tab Access Control */}
        {activeTab === 'access' && (
          <View accessible={true} accessibilityLabel="Tab Access Control Section">
            {/* Role Selector */}
            <View
              style={styles.roleSelectorContainer}
              accessible={true}
              accessibilityLabel="Select Role for Tab Access"
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.rolePills}
              >
                {['admin', 'teacher', 'student', 'parent'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.rolePill,
                      selectedRole === role && styles.rolePillActive,
                    ]}
                    onPress={() => {
                      setSelectedRole(role);
                      AccessibilityInfo.announceForAccessibility(
                        `Selected ${role} role for tab access control`
                      );
                    }}
                    accessible={true}
                    accessibilityLabel={`Select ${role.charAt(0).toUpperCase() + role.slice(1)} Role`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selectedRole === role }}
                  >
                    <Text
                      style={[
                        styles.rolePillText,
                        selectedRole === role && styles.rolePillTextActive,
                      ]}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tab Access Items */}
            <View
              style={styles.tabAccessContainer}
              accessible={true}
              accessibilityLabel={`Tab access for ${selectedRole}`}
            >
              {Object.entries(tabAccess[selectedRole] || {}).map(([tab, hasAccess]) => (
                <View
                  key={tab}
                  style={styles.tabAccessItem}
                  accessible={true}
                  accessibilityLabel={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Tab - ${
                    hasAccess ? 'Unlocked' : 'Locked'
                  }`}
                >
                  <View style={styles.tabAccessLeft}>
                    <Text style={styles.lockIcon}>{hasAccess ? '🔓' : '🔒'}</Text>
                    <Text
                      style={styles.tabAccessLabel}
                      accessible={true}
                      accessibilityLabel={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Tab`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </View>

                  <Switch
                    value={hasAccess}
                    onValueChange={(val) => {
                      setTabAccess({
                        ...tabAccess,
                        [selectedRole]: {
                          ...tabAccess[selectedRole],
                          [tab]: val,
                        },
                      });
                    }}
                    accessible={true}
                    accessibilityLabel={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Access`}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: hasAccess }}
                    accessibilityHint={`Toggle to ${hasAccess ? 'disable' : 'enable'} access`}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          accessible={true}
          accessibilityLabel="Save All Changes"
          accessibilityRole="button"
          accessibilityHint="Save all permission changes"
        >
          <Text style={styles.saveBtnText}>💾 Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <View style={styles.sidebarOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={() => setSidebarOpen(false)}
            accessible={true}
            accessibilityLabel="Close Sidebar"
            accessibilityRole="button"
          />
          <Animated.View
            style={[
              styles.sidebarModal,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Sidebar
              navigation={navigation}
              onNavigate={() => setSidebarOpen(false)}
              currentRoute="Permission"
            />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hamburger: {
    position: 'absolute',
    left: 16,
    padding: 8,
    borderRadius: 6,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: '#0052B3',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0052B3',
    letterSpacing: 0.3,
  },
  profileBtn: {
    position: 'absolute',
    right: 16,
    padding: 8,
    borderRadius: 6,
  },
  profileIcon: {
    fontSize: 24,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Title Section
  titleSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#E3F2FD',
  },
  tabIcon: {
    fontSize: 18,
    color: '#999',
  },
  tabIconActive: {
    color: '#0052B3',
  },
  tabText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0052B3',
  },

  // Role Card
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roleBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0052B3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Permission Toggle
  permissionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  permissionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Search Container
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 12,
  },

  // Filter Chips
  filterChipsContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0052B3',
    borderColor: '#0052B3',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },

  // Activity Card
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0052B3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  activityEmail: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // Activity Details
  activityDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },

  // Role Selector
  roleSelectorContainer: {
    marginBottom: 20,
  },
  rolePills: {
    marginBottom: 0,
  },
  rolePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  rolePillActive: {
    backgroundColor: '#0052B3',
    borderColor: '#0052B3',
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  rolePillTextActive: {
    color: '#fff',
  },

  // Tab Access Container
  tabAccessContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tabAccessItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tabAccessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lockIcon: {
    fontSize: 16,
  },
  tabAccessLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Save Button
  saveBtn: {
    backgroundColor: '#0052B3',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // Sidebar Overlay
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  sidebarModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#fff',
  },
});

export default Permission;
