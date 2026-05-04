import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Sidebar = ({ navigation, onNavigate, currentRoute }) => {
  const [activeItem, setActiveItem] = useState('Overview');

  // Map route names to menu labels
  const routeToLabelMap = {
    CommitteeSidebar: 'Overview',
    StudentManagement: 'Student Management',
    FacultyManagement: 'Faculty Management',
    ParentManagement: 'Parent Portal',
    Permission: 'Permission Settings',
    AddSchool: 'Add School',
  };

  // Update active item when route changes
  useEffect(() => {
    if (currentRoute && routeToLabelMap[currentRoute]) {
      setActiveItem(routeToLabelMap[currentRoute]);
    }
  }, [currentRoute]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Student Management', icon: '👨‍🎓' },
    { id: 'faculty', label: 'Faculty Management', icon: '👨‍🏫' },
    { id: 'parents', label: 'Parent Portal', icon: '👥' },
    { id: 'permissions', label: 'Permission Settings', icon: '🔐' },
    { id: 'school', label: 'Add School', icon: '🏫' },
  ];

  const handleMenuPress = (itemId, label) => {
    setActiveItem(label);
    if (onNavigate) {
      onNavigate(itemId);
    }
    
    // Navigate based on item ID
    if (navigation) {
      switch (itemId) {
        case 'overview':
          navigation.navigate('CommitteeSidebar');
          break;
        case 'students':
          navigation.navigate('StudentManagement');
          break;
        case 'faculty':
          navigation.navigate('FacultyManagement');
          break;
        case 'parents':
          navigation.navigate('ParentManagement');
          break;
        case 'permissions':
          navigation.navigate('Permission');
          break;
        case 'school':
          navigation.navigate('AddSchool');
          break;
        default:
          Alert.alert(label, `Navigating to ${label}...`);
          break;
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            if (navigation) {
              navigation.replace('Login');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      accessible={true}
      accessibilityLabel="Navigation Sidebar"
    >
      {/* Header Logo with Close Button */}
      <View
        style={styles.header}
        accessible={true}
        accessibilityLabel="UniVerseZ Pro Navigation"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>🎓</Text>
          </View>
          <Text style={styles.logoText}>UniVerseZ Pro</Text>
        </View>
        <TouchableOpacity
          style={styles.closeHeaderBtn}
          onPress={() => {
            if (onNavigate) {
              onNavigate('close');
            }
          }}
          accessible={true}
          accessibilityLabel="Close Sidebar"
          accessibilityRole="button"
          accessibilityHint="Close the navigation sidebar"
        >
          <Text style={styles.closeHeaderIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Navigation menu"
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              activeItem === item.label && styles.menuItemActive,
            ]}
            onPress={() => handleMenuPress(item.id, item.label)}
            accessible={true}
            accessibilityLabel={item.label}
            accessibilityRole="menuitem"
            accessibilityState={{
              selected: activeItem === item.label,
            }}
            accessibilityHint={`Navigate to ${item.label}. Currently ${
              activeItem === item.label ? 'selected' : 'not selected'
            }`}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.menuLabel,
                activeItem === item.label && styles.menuLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleSignOut}
        accessible={true}
        accessibilityLabel="Logout Button"
        accessibilityRole="button"
        accessibilityHint="Sign out from your administrator account"
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0052B3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoBadgeText: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0052B3',
    letterSpacing: 0.3,
  },
  closeHeaderBtn: {
    padding: 8,
    borderRadius: 6,
  },
  closeHeaderIcon: {
    fontSize: 24,
    color: '#0052B3',
    fontWeight: 'bold',
  },

  // Menu Container
  menuContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 4,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: '#e3f2fd',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  menuLabelActive: {
    color: '#0052B3',
    fontWeight: '600',
  },

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#fff',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default Sidebar;
