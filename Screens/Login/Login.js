import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  navigation,
} from 'react-native';
import SchoolDashboard from '../Admin/Dashboard/Dashboard';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';



export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSignIn = () => {
  if (!email.trim()) {
    Alert.alert('Validation Error', 'Please enter your email address.');
    return;
  }
  if (!password.trim()) {
    Alert.alert('Validation Error', 'Please enter your password.');
    return;
  }

  // Example: basic credential check (replace with real auth)
  if (email === '1' && password === '123') {
    navigation.navigate('SchoolDashboard');
  } else {
    Alert.alert('Login Failed', 'Invalid email or password');
  }
};

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'A password reset link will be sent to your registered email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Reset Link',
          onPress: () =>
            Alert.alert('Success', 'Password reset link sent! Check your inbox.'),
        },
      ]
    );
  };

  const handleContactAdmin = () => {
    Alert.alert(
      'Contact Administration',
      'How would you like to reach out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => Linking.openURL('mailto:admin@school.edu'),
        },
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+1800000000'),
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Opening Privacy Policy...');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Opening Terms of Service...');
  };

  const handleHelpCenter = () => {
    Alert.alert('Help Center', 'Opening Help Center...');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF2F7" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.title}>Scholar Metric</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access the institution
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Email Field */}
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
            <Text style={styles.inputIcon}>@</Text>
            <TextInput
              style={styles.input}
              placeholder="name@school.edu"
              placeholderTextColor="#AAAAAA"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* Password Field */}
          <Text style={[styles.label, { marginTop: 20 }]}>PASSWORD</Text>
          <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#AAAAAA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.signInText}>Sign In  →</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Contact Admin */}
          <Text style={styles.newFacultyText}>
            Are you a new faculty member?{' '}
            <Text style={styles.contactLink} onPress={handleContactAdmin}>
              Contact Administration
            </Text>
          </Text>
        </View>

        {/* Trust Badges */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🛡️</Text>
            <Text style={styles.badgeLabel}>SECURE</Text>
          </View>
          <View style={[styles.badge, styles.badgeMiddle]}>
            <Text style={styles.badgeIcon}>📊</Text>
            <Text style={styles.badgeLabel}>PRECISE</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>✅</Text>
            <Text style={styles.badgeLabel}>RELIABLE</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2024 THE ACADEMIC ATELIER. ALL RIGHTS RESERVED.
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={handlePrivacyPolicy} activeOpacity={0.7}>
              <Text style={styles.footerLink}>PRIVACY{'\n'}POLICY</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTermsOfService} activeOpacity={0.7}>
              <Text style={styles.footerLink}>TERMS OF{'\n'}SERVICE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHelpCenter} activeOpacity={0.7}>
              <Text style={styles.footerLink}>HELP{'\n'}CENTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF2F7',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666880',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 28,
  },

  // Labels
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
    letterSpacing: 1,
    marginBottom: 8,
  },

  // Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: '#1B3FA0',
    backgroundColor: '#F8F9FF',
  },
  inputIcon: {
    fontSize: 16,
    color: '#888',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A2E',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // Remember Me & Forgot
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 24,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#1B3FA0',
    borderColor: '#1B3FA0',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  rememberText: {
    fontSize: 14,
    color: '#444',
  },
  forgotText: {
    fontSize: 14,
    color: '#1B3FA0',
    fontWeight: '600',
  },

  // Sign In Button
  signInButton: {
    backgroundColor: '#1B3FA0',
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B3FA0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 24,
  },

  // New Faculty
  newFacultyText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  contactLink: {
    color: '#1B3FA0',
    fontWeight: '600',
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  badgeMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#DDE2EC',
  },
  badgeIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 1.2,
  },

  // Footer
  footer: {
    alignItems: 'flex-start',
  },
  copyright: {
    fontSize: 11,
    color: '#888',
    letterSpacing: 0.4,
    marginBottom: 16,
    lineHeight: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  footerLink: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 17,
  },
});