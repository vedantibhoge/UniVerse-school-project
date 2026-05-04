import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  AccessibilityInfo,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../Sidebar/Sidebar';

const AddSchool = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [schoolName, setSchoolName] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [udiseCode, setUdiseCode] = useState('');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [classrooms, setClassrooms] = useState('');
  const [labs, setLabs] = useState('');
  const [playground, setPlayground] = useState('');
  const [library, setLibrary] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalEmail, setPrincipalEmail] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [classesOffered, setClassesOffered] = useState('');
  const [academicSession, setAcademicSession] = useState('');
  const [gradingSystem, setGradingSystem] = useState('');
  const [feeStructure, setFeeStructure] = useState('');
  const [subjects, setSubjects] = useState('');
  const [academicCalendar, setAcademicCalendar] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showExistingSchools, setShowExistingSchools] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;

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

  const institutionTypes = [
    'Primary School',
    'Secondary School',
    'High School',
  ];

  const steps = [
    { number: 1, label: 'INSTITUTION' },
    { number: 2, label: 'CONTACTS' },
    { number: 3, label: 'ADMIN' },
  ];

  const existingSchools = [
    { id: 1, name: 'St. Andrews Academy', type: 'Secondary School', studentCount: 450, teacherCount: 35, establishedYear: 2015 },
    { id: 2, name: 'Trinity Public School', type: 'High School', studentCount: 680, teacherCount: 48, establishedYear: 2010 },
    { id: 3, name: 'Bright Future Institute', type: 'College', studentCount: 520, teacherCount: 42, establishedYear: 2018 },
  ];

  const documentTypes = [
    { id: 'registration', label: 'Registration Certificate', icon: '📜' },
    { id: 'recognition', label: 'Recognition Letter', icon: '🏆' },
    { id: 'photo', label: 'School Photo', icon: '📷' },
  ];

  const features = [
    {
      id: 'secure',
      icon: '🛡️',
      title: 'Secure',
      description: 'Data encryption active',
      bgColor: '#e8f5e9',
    },
    {
      id: 'fast',
      icon: '⚡',
      title: 'Fast',
      description: 'Approval in 24 hours',
      bgColor: '#fff3e0',
    },
    {
      id: 'autosave',
      icon: '☁️',
      title: 'Autosave',
      description: 'Draft saved locally',
      bgColor: '#e3f2fd',
    },
  ];

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

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => setShowExistingSchools(true)}
          accessible={true}
          accessibilityLabel="View Existing Schools"
          accessibilityRole="button"
          accessibilityHint="Switch between existing schools or view school management"
        >
          <Text style={styles.profileIcon}>📚</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Add School Registration Content"
      >
        {/* Step Indicator */}
        <View
          style={styles.stepIndicator}
          accessible={true}
          accessibilityLabel="Registration Steps"
        >
          {steps.map((step, index) => (
            <View
              key={step.number}
              style={styles.stepContainer}
              accessible={true}
              accessibilityLabel={`Step ${step.number}: ${step.label}`}
            >
              <View
                style={[
                  styles.stepCircle,
                  currentStep >= step.number && styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep >= step.number && styles.stepNumberActive,
                  ]}
                >
                  {step.number}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  currentStep >= step.number && styles.stepLabelActive,
                ]}
              >
                {step.label}
              </Text>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    currentStep > step.number && styles.stepLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Form Section */}
        <View
          style={styles.formCard}
          accessible={true}
          accessibilityLabel="School Registration Form"
        >
          {/* Title */}
          <Text
            style={styles.formTitle}
            accessible={true}
            accessibilityLabel="Register New School"
            accessibilityRole="header"
          >
            Register New School
          </Text>
          <Text
            style={styles.formDescription}
            accessible={true}
            accessibilityLabel="Complete 6 step registration process"
          >
            Complete 6 steps to register your school.
          </Text>

          {/* Step 1: Institution */}
          {currentStep === 1 && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>SCHOOL NAME</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🏢</Text>
                  <TextInput style={styles.input} placeholder="School name" value={schoolName} onChangeText={setSchoolName} accessible={true} accessibilityLabel="School Name" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>INSTITUTION TYPE</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowTypeDropdown(!showTypeDropdown)} accessible={true} accessibilityLabel="Institution type" accessibilityRole="button">
                  <Text style={styles.dropdownText}>{institutionType || 'Select Type'}</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                {showTypeDropdown && (
                  <View style={styles.dropdownMenu}>
                    {institutionTypes.map((type, i) => (
                      <TouchableOpacity key={i} style={styles.dropdownItem} onPress={() => { setInstitutionType(type); setShowTypeDropdown(false); }} accessible={true} accessibilityLabel={type} accessibilityRole="menuitem">
                        <Text style={styles.dropdownItemText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>UDISE CODE</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🔢</Text>
                  <TextInput style={styles.input} placeholder="UDISE code" value={udiseCode} onChangeText={setUdiseCode} accessible={true} accessibilityLabel="UDISE Code" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>AFFILIATION NUMBER</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>📝</Text>
                  <TextInput style={styles.input} placeholder="Affiliation #" value={affiliationNumber} onChangeText={setAffiliationNumber} accessible={true} accessibilityLabel="Affiliation" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CONTACT PHONE</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>📞</Text>
                  <TextInput style={styles.input} placeholder="Phone number" value={contactPhone} onChangeText={setContactPhone} accessible={true} accessibilityLabel="Phone" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ADDRESS</Text>
                <View style={[styles.inputContainer, styles.addressInputContainer]}>
                  <Text style={styles.inputIcon}>📍</Text>
                  <TextInput style={[styles.input, styles.textAreaInput]} placeholder="Address" value={address} onChangeText={setAddress} multiline={true} numberOfLines={3} accessible={true} accessibilityLabel="Address" />
                </View>
              </View>
            </>
          )}

          {/* Step 2: Contacts */}
          {currentStep === 2 && (
            <>
              <Text style={styles.stepTitle}>Contact Information</Text>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>PRINCIPAL NAME</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput style={styles.input} placeholder="Principal name" value={principalName} onChangeText={setPrincipalName} accessible={true} accessibilityLabel="Principal" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>PRINCIPAL EMAIL</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput style={styles.input} placeholder="Email" value={principalEmail} onChangeText={setPrincipalEmail} keyboardType="email-address" accessible={true} accessibilityLabel="Email" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CONTACT PHONE</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>📞</Text>
                  <TextInput style={styles.input} placeholder="Phone number" value={contactPhone} onChangeText={setContactPhone} accessible={true} accessibilityLabel="Phone" />
                </View>
              </View>
            </>
          )}

          {/* Step 3: Administrative */}
          {currentStep === 3 && (
            <>
              <Text style={styles.stepTitle}>Admin Account Setup</Text>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ADMIN USERNAME</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>👨‍💼</Text>
                  <TextInput style={styles.input} placeholder="Username" value={adminUsername} onChangeText={setAdminUsername} accessible={true} accessibilityLabel="Username" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ADMIN PASSWORD</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>🔐</Text>
                  <TextInput style={styles.input} placeholder="Password" value={adminPassword} onChangeText={setAdminPassword} secureTextEntry={true} accessible={true} accessibilityLabel="Password" />
                </View>
              </View>
            </>
          )}

          {/* Step Navigation Buttons */}
          <View style={styles.stepNavigation}>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {[1, 2, 3].map((step) => (
                <View key={step} style={[styles.stepDot, currentStep >= step && styles.stepDotActive]}>
                  <Text style={styles.stepDotText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Step Counter */}
            <Text style={styles.stepCounter}>
              Step {currentStep} of 3
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              {/* Back/Cancel Button */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  if (currentStep === 1) {
                    navigation.goBack();
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                accessible={true}
                accessibilityLabel={currentStep === 1 ? 'Cancel' : 'Go Back'}
                accessibilityRole="button"
                accessibilityHint={currentStep === 1 ? 'Cancel and return to previous screen' : `Go back to step ${currentStep - 1}`}
              >
                <Text style={styles.cancelBtnText}>
                  {currentStep === 1 ? '❌ CANCEL' : '⬅️ BACK'}
                </Text>
              </TouchableOpacity>

              {/* Next/Complete Button */}
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => {
                  if (currentStep < 3) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    Alert.alert('✅ Success', 'School registered successfully!', [
                      {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                      },
                    ]);
                  }
                }}
                accessible={true}
                accessibilityLabel={currentStep === 3 ? 'Complete Registration' : 'Next Step'}
                accessibilityRole="button"
                accessibilityHint={currentStep === 3 ? 'Complete school registration' : `Proceed to step ${currentStep + 1}`}
              >
                <Text style={styles.nextBtnText}>
                  {currentStep === 3 ? '✅ COMPLETE' : 'NEXT ➡️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Existing Schools Switcher Modal */}
      <Modal
        visible={showExistingSchools}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExistingSchools(false)}
        accessible={true}
        accessibilityLabel="Existing Schools List"
      >
        <View style={styles.existingSchoolsContainer}>
          <View style={styles.existingSchoolsHeader}>
            <Text style={styles.existingSchoolsTitle}>📚 Existing Schools</Text>
            <TouchableOpacity
              onPress={() => setShowExistingSchools(false)}
              accessible={true}
              accessibilityLabel="Close"
              accessibilityRole="button"
              accessibilityHint="Close existing schools list"
            >
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.existingSchoolsList}>
            {existingSchools.map((school) => (
              <TouchableOpacity
                key={school.id}
                style={styles.schoolCard}
                onPress={() => {
                  Alert.alert('School Selected', `${school.name}`, [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                    },
                    {
                      text: 'Switch',
                      onPress: () => {
                        setShowExistingSchools(false);
                        Alert.alert('Success', `Switched to ${school.name}`);
                      },
                    },
                  ]);
                }}
                accessible={true}
                accessibilityLabel={`${school.name}, type: ${school.type}`}
                accessibilityRole="button"
                accessibilityHint={`Students: ${school.studentCount}, Teachers: ${school.teacherCount}`}
              >
                <View style={styles.schoolCardHeader}>
                  <Text style={styles.schoolCardTitle}>{school.name}</Text>
                  <Text style={styles.schoolCardType}>{school.type}</Text>
                </View>
                <View style={styles.schoolCardStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statIcon}>👥</Text>
                    <View>
                      <Text style={styles.statLabel}>Students</Text>
                      <Text style={styles.statValue}>{school.studentCount}</Text>
                    </View>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statIcon}>👨‍🏫</Text>
                    <View>
                      <Text style={styles.statLabel}>Teachers</Text>
                      <Text style={styles.statValue}>{school.teacherCount}</Text>
                    </View>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statIcon}>📅</Text>
                    <View>
                      <Text style={styles.statLabel}>Est.</Text>
                      <Text style={styles.statValue}>{school.establishedYear}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
              currentRoute="AddSchool"
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
    backgroundColor: '#f5f7fa',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hamburger: {
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
    paddingVertical: 16,
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepCircleActive: {
    backgroundColor: '#0052B3',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.3,
    marginRight: 8,
  },
  stepLabelActive: {
    color: '#0052B3',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e8e8e8',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#0052B3',
  },

  // Form Card
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0052B3',
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 20,
  },

  // Form Group
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#f9f9f9',
  },
  addressInputContainer: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    paddingVertical: 12,
  },
  textAreaInput: {
    paddingVertical: 8,
    textAlignVertical: 'top',
  },

  // Dropdown
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    marginTop: 4,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0052B3',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0052B3',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Button Container
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0052B3',
    backgroundColor: '#fff',
  },
  cancelBtnText: {
    fontSize: 14,
    color: '#0052B3',
    fontWeight: '600',
    textAlign: 'center',
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0052B3',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  continueBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Features Section
  featuresSection: {
    marginBottom: 30,
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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

  // Step Navigation
  stepNavigation: {
    marginTop: 24,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  stepDotActive: {
    backgroundColor: '#00D9FF',
    borderColor: '#00A8CC',
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  stepCounter: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  nextBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#00D9FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },

  // Step Titles
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2332',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00D9FF',
    marginTop: 16,
    marginBottom: 12,
  },

  // Document Upload
  documentInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  documentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  documentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  documentContent: {
    flex: 1,
  },
  documentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a2332',
  },
  documentHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  uploadArrow: {
    fontSize: 18,
    color: '#00D9FF',
    fontWeight: '600',
  },

  // Existing Schools Modal
  existingSchoolsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  existingSchoolsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  existingSchoolsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a2332',
  },
  closeBtn: {
    fontSize: 24,
    color: '#666',
    fontWeight: '600',
    padding: 4,
  },
  existingSchoolsList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  schoolCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  schoolCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  schoolCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a2332',
  },
  schoolCardType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00D9FF',
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  schoolCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a2332',
  },
});

export default AddSchool;
