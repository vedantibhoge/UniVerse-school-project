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
  Dimensions,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const CREDENTIALS = {
    parent: { email: '12345', password: '12345', route: 'ParentSidebar' },
    teacher: { email: '1234', password: '1234', route: 'TeacherSidebar' },
    account: { email: 'a', password: 'a', route: 'AccountSidebar' },
    director: { email: 'd', password: 'd', route: 'DirectorSidebar' },
  };

  const handleSignIn = () => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password.');
      return;
    }
    if (email === CREDENTIALS.parent.email && password === CREDENTIALS.parent.password) {
      navigation.replace(CREDENTIALS.parent.route);
    } else if (email === CREDENTIALS.teacher.email && password === CREDENTIALS.teacher.password) {
      navigation.replace(CREDENTIALS.teacher.route);
    } else if (email === CREDENTIALS.account.email && password === CREDENTIALS.account.password) {
      navigation.replace(CREDENTIALS.account.route);
    } else if (email === CREDENTIALS.director.email && password === CREDENTIALS.director.password) {
      navigation.replace(CREDENTIALS.director.route);
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
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
        { text: 'Send Email', onPress: () => Linking.openURL('mailto:admin@school.edu') },
        { text: 'Call', onPress: () => Linking.openURL('tel:+1800000000') },
      ]
    );
  };

  const handlePrivacyPolicy = () => Alert.alert('Privacy Policy', 'Opening Privacy Policy...');
  const handleTermsOfService = () => Alert.alert('Terms of Service', 'Opening Terms of Service...');
  const handleHelpCenter = () => Alert.alert('Help Center', 'Opening Help Center...');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF2F7" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isTablet && styles.scrollContainerTablet,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.title}>Scholar Metric</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access the institution
          </Text>
        </View>

        {/* Card */}
        <View style={[styles.card, isTablet && styles.cardTablet]}>

          {/* Email */}
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

          {/* Password */}
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
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} activeOpacity={0.85}>
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
        <View style={[styles.badgesRow, isTablet && styles.badgesRowTablet]}>
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
  safeArea: { flex: 1, backgroundColor: '#EEF2F7' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32 },
  scrollContainerTablet: { paddingHorizontal: 0, alignItems: 'center', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  headerTablet: { width: 480 },
  logoContainer: {
    width: 72, height: 72, borderRadius: 16, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 }),
  },
  logoIcon: { fontSize: 36 },
  title: { fontSize: isTablet ? 36 : 32, fontWeight: '800', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666880', textAlign: 'center', lineHeight: 22 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 28,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 28 }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6, marginBottom: 28 }),
  },
  cardTablet: { width: 480, padding: 40 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#1A1A2E', letterSpacing: 1, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5',
    borderRadius: 12, paddingHorizontal: 14, height: 54, borderWidth: 1.5, borderColor: 'transparent',
  },
  inputWrapperFocused: { borderColor: '#1B3FA0', backgroundColor: '#F8F9FF' },
  inputIcon: { fontSize: 16, color: '#888', marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A1A2E', paddingVertical: 0 },
  eyeButton: { padding: 4 },
  eyeIcon: { fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 24 },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20, height: 20, borderWidth: 1.5, borderColor: '#CCCCCC',
    borderRadius: 4, marginRight: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
  },
  checkboxChecked: { backgroundColor: '#1B3FA0', borderColor: '#1B3FA0' },
  checkmark: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  rememberText: { fontSize: 14, color: '#444' },
  forgotText: { fontSize: 14, color: '#1B3FA0', fontWeight: '600' },
  signInButton: {
    backgroundColor: '#1B3FA0', borderRadius: 14, height: 56,
    alignItems: 'center', justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 6px 18px rgba(27,63,160,0.18)' }
      : { shadowColor: '#1B3FA0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 }),
  },
  signInText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.3 },
  divider: { height: 1, backgroundColor: '#EBEBEB', marginVertical: 24 },
  newFacultyText: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22 },
  contactLink: { color: '#1B3FA0', fontWeight: '600' },
  badgesRow: { flexDirection: 'row', marginBottom: 32 },
  badgesRowTablet: { width: 480 },
  badge: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  badgeMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#DDE2EC' },
  badgeIcon: { fontSize: 22, marginBottom: 6 },
  badgeLabel: { fontSize: 11, fontWeight: 'bold', color: '#888', letterSpacing: 1.2 },
  footer: { alignItems: 'flex-start' },
  copyright: { fontSize: 11, color: '#888', letterSpacing: 0.4, marginBottom: 16, lineHeight: 18 },
  footerLinks: { flexDirection: 'row', gap: 32 },
  footerLink: { fontSize: 11, color: '#888', fontWeight: '600', letterSpacing: 0.5, lineHeight: 17 },
});