import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  green: '#22C55E',
};

// Principal Profile Data
const principalData = {
  name: 'Dr. Rajesh Kumar',
  email: 'principal@university-school.edu',
  phone: '+91 98765 43210',
  joinDate: 'January 2015',
  qualification: 'Ph.D. in Education',
  experience: '18 years',
  department: 'Academic Administration',
  bio: 'Dedicated educator with extensive experience in school management and academic excellence.',
};

export default function PrincipalSettings({ onToggleSidebar }) {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [twoFA, setTwoFA] = React.useState(true);
  const [activeView, setActiveView] = React.useState('settings');

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon');
  };

  const handleProfilePress = () => {
    setActiveView('profile');
  };

  const handleEmailPress = () => {
    Alert.alert('Email Address', `${principalData.email}`);
  };

  const handleLoginActivityPress = () => {
    Alert.alert('Login Activity', 'Last login: Today at 10:30 AM\nDevice: Mobile App');
  };

  const handleHelpCenterPress = () => {
    Alert.alert('Help Center', 'For support, contact: support@university-school.edu');
  };

  const handlePrivacyPolicyPress = () => {
    Alert.alert('Privacy Policy', 'We take your privacy seriously. Your data is encrypted and secure.');
  };

  const handleTermsPress = () => {
    Alert.alert('Terms of Service', 'By using this platform, you agree to our terms and conditions.');
  };

  const handleLanguagePress = () => {
    Alert.alert('Language', 'Current Language: English\n\nMore languages coming soon.');
  };

  // Profile Details View
  if (activeView === 'profile') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => onToggleSidebar(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => setActiveView('settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.profileHeader}>
            <Text style={styles.profileAvatar}>👤</Text>
            <Text style={styles.profileName}>{principalData.name}</Text>
            <Text style={styles.profileRole}>Principal</Text>
          </View>

          {/* Profile Details */}
          <View style={styles.profileCard}>
            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>Email</Text>
              <Text style={styles.profileItemValue}>{principalData.email}</Text>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>Phone</Text>
              <Text style={styles.profileItemValue}>{principalData.phone}</Text>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>Qualification</Text>
              <Text style={styles.profileItemValue}>{principalData.qualification}</Text>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>Experience</Text>
              <Text style={styles.profileItemValue}>{principalData.experience}</Text>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>Department</Text>
              <Text style={styles.profileItemValue}>{principalData.department}</Text>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>Joining Date</Text>
              <Text style={styles.profileItemValue}>{principalData.joinDate}</Text>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>Bio</Text>
              <Text style={styles.profileItemValue}>{principalData.bio}</Text>
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => onToggleSidebar(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleProfilePress} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>👤</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Profile Information</Text>
                <Text style={styles.settingDesc}>View and edit your profile</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔐</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDesc}>Update your password</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleEmailPress} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📧</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Email Address</Text>
                <Text style={styles.settingDesc}>{principalData.email}</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDesc}>Receive alerts and updates</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D0D0D0', true: COLORS.primary }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔑</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Two-Factor Auth</Text>
                <Text style={styles.settingDesc}>Add extra security layer</Text>
              </View>
            </View>
            <Switch
              value={twoFA}
              onValueChange={setTwoFA}
              trackColor={{ false: '#D0D0D0', true: COLORS.primary }}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleLoginActivityPress} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>👁️</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Login Activity</Text>
                <Text style={styles.settingDesc}>View your recent logins</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDesc}>Coming soon</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#D0D0D0', true: COLORS.primary }}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleLanguagePress} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌐</Text>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingDesc}>English</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  hamburger: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 48,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  settingArrow: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 12,
  },
  profileAvatar: {
    fontSize: 80,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileItem: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  profileItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileItemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    lineHeight: 22,
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#E8ECF5',
  },
});
