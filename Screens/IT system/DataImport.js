import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import ITSidebar from './ITSidebar';

const { width } = Dimensions.get('window');

const DataImport = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [parentFile, setParentFile] = useState(null);

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [adminPassword, setAdminPassword] = useState(null);

  // Status flags
  const [isValidated, setIsValidated] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  // Validate Modal
  const [validateVisible, setValidateVisible] = useState(false);
  const validateProgress = useRef(new Animated.Value(0)).current;
  const [validateComplete, setValidateComplete] = useState(false);

  // Process Modal
  const [processVisible, setProcessVisible] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleImportFile = (forType) => {
    Alert.alert(
      'Import File',
      'Choose import source',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'CSV File', onPress: () => selectFile(forType, 'csv') },
        { text: 'Excel File', onPress: () => selectFile(forType, 'xlsx') },
        { text: 'JSON File', onPress: () => selectFile(forType, 'json') },
      ]
    );
  };

  const selectFile = (forType, ext) => {
    const name = `${forType}-data.${ext}`;
    if (forType === 'students') setStudentFile(name);
    if (forType === 'teachers') setTeacherFile(name);
    if (forType === 'parents') setParentFile(name);
    setSelectedFile(name);
    setIsValidated(false);
    setIsProcessed(false);
  };

  const generatePassword = (len = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  };

  const handleCreateAdmin = () => {
    if (!adminName || !adminEmail || !adminPhone) {
      Alert.alert('Error', 'Please fill all admin fields');
      return;
    }
    const id = `${adminName.replace(/\s+/g, '').toLowerCase()}_${Date.now().toString().slice(-4)}`;
    const pwd = generatePassword(10);
    setAdminId(id);
    setAdminPassword(pwd);
    
    showToast('Admin credentials created & copied to clipboard');
  };

  const handleValidateData = () => {
    if (!selectedFile) return;
    setValidateVisible(true);
    setValidateComplete(false);
    validateProgress.setValue(0);
    Animated.timing(validateProgress, {
      toValue: 100,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setValidateComplete(true);
      setIsValidated(true);
    });
  };

  const handleProcessData = () => {
    if (!selectedFile || !isValidated) {
      if (!isValidated) Alert.alert('Error', 'Please validate the data first.');
      return;
    }
    setProcessStep(0);
    setProcessVisible(true);

    setTimeout(() => setProcessStep(1), 1000); 
    setTimeout(() => setProcessStep(2), 2000); 
    setTimeout(() => {
      setProcessStep(3); 
      setIsProcessed(true);
      setTimeout(() => setProcessVisible(false), 1500);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Sidebar */}
      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="DataImport"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={toggleSidebar}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Data Import</Text>
          <Text style={styles.headerSubtitle}>Import & Process Data</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Import Sections */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👩‍🎓 Students Import</Text>
          <TouchableOpacity
            style={[styles.uploadBtn, studentFile && styles.uploadBtnSelected, isProcessed && styles.uploadBtnComplete]}
            onPress={() => handleImportFile('students')}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadIcon}>{studentFile ? (isProcessed ? '✅' : '📄') : '📤'}</Text>
            <View style={styles.uploadContent}>
              <Text style={styles.uploadText}>
                {studentFile ? studentFile : 'Choose Students File'}
              </Text>
              <Text style={styles.uploadSubtext}>
                {studentFile ? (isProcessed ? 'Processed' : 'Selected') : 'CSV, Excel, or JSON'}
              </Text>
            </View>
            {!studentFile && <Text style={styles.uploadArrow}>›</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👨‍🏫 Teachers Import</Text>
          <TouchableOpacity
            style={[styles.uploadBtn, teacherFile && styles.uploadBtnSelected, isProcessed && styles.uploadBtnComplete]}
            onPress={() => handleImportFile('teachers')}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadIcon}>{teacherFile ? (isProcessed ? '✅' : '📄') : '📤'}</Text>
            <View style={styles.uploadContent}>
              <Text style={styles.uploadText}>
                {teacherFile ? teacherFile : 'Choose Teachers File'}
              </Text>
              <Text style={styles.uploadSubtext}>
                {teacherFile ? (isProcessed ? 'Processed' : 'Selected') : 'CSV, Excel, or JSON'}
              </Text>
            </View>
            {!teacherFile && <Text style={styles.uploadArrow}>›</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👨‍👩‍👧 Parents Import</Text>
          <TouchableOpacity
            style={[styles.uploadBtn, parentFile && styles.uploadBtnSelected, isProcessed && styles.uploadBtnComplete]}
            onPress={() => handleImportFile('parents')}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadIcon}>{parentFile ? (isProcessed ? '✅' : '📄') : '📤'}</Text>
            <View style={styles.uploadContent}>
              <Text style={styles.uploadText}>
                {parentFile ? parentFile : 'Choose Parents File'}
              </Text>
              <Text style={styles.uploadSubtext}>
                {parentFile ? (isProcessed ? 'Processed' : 'Selected') : 'CSV, Excel, or JSON'}
              </Text>
            </View>
            {!parentFile && <Text style={styles.uploadArrow}>›</Text>}
          </TouchableOpacity>
        </View>

        {selectedFile && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 File Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>File Name:</Text>
              <Text style={styles.infoValue}>{selectedFile}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>File Size:</Text>
              <Text style={styles.infoValue}>1.2 MB</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Records:</Text>
              <Text style={styles.infoValue}>2,450</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, isProcessed ? styles.statusReady : (isValidated ? {color: '#F39C12'} : {color: '#888899'})]}>
                {isProcessed ? 'Processed' : (isValidated ? 'Validated' : 'Pending')}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Assign Admin (IT Cell)</Text>
          <TextInput
            style={[styles.input, { marginBottom: 10 }]}
            placeholder="Admin Name"
            value={adminName}
            onChangeText={setAdminName}
          />
          <TextInput
            style={[styles.input, { marginBottom: 10 }]}
            placeholder="Admin Email"
            keyboardType="email-address"
            value={adminEmail}
            onChangeText={setAdminEmail}
          />
          <TextInput
            style={[styles.input, { marginBottom: 12 }]}
            placeholder="Admin Phone Number"
            keyboardType="phone-pad"
            value={adminPhone}
            onChangeText={setAdminPhone}
          />

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleCreateAdmin}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnIcon}>👤</Text>
            <View style={styles.actionBtnContent}>
              <Text style={styles.actionBtnTitle}>Create Admin</Text>
              <Text style={styles.actionBtnDesc}>Sets admin ID and password</Text>
            </View>
            <Text style={styles.actionBtnArrow}>›</Text>
          </TouchableOpacity>

          {adminId && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.infoLabel}>Admin ID: <Text style={styles.infoValue}>{adminId}</Text></Text>
              <Text style={styles.infoLabel}>Password: <Text style={styles.infoValue}>{adminPassword}</Text></Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Data Processing</Text>

          <TouchableOpacity
            style={[styles.actionBtn, (!selectedFile || isValidated) && styles.actionBtnDisabled]}
            onPress={handleValidateData}
            activeOpacity={0.8}
            disabled={!selectedFile || isValidated}
          >
            <Text style={styles.actionBtnIcon}>✓</Text>
            <View style={styles.actionBtnContent}>
              <Text style={styles.actionBtnTitle}>{isValidated ? 'Data Validated' : 'Validate Data'}</Text>
              <Text style={styles.actionBtnDesc}>Check for errors and inconsistencies</Text>
            </View>
            <Text style={styles.actionBtnArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, (!selectedFile || !isValidated || isProcessed) && styles.actionBtnDisabled]}
            onPress={handleProcessData}
            activeOpacity={0.8}
            disabled={!selectedFile || !isValidated || isProcessed}
          >
            <Text style={styles.actionBtnIcon}>⚡</Text>
            <View style={styles.actionBtnContent}>
              <Text style={styles.actionBtnTitle}>{isProcessed ? 'Data Processed' : 'Process Data'}</Text>
              <Text style={styles.actionBtnDesc}>Transform and prepare data for import</Text>
            </View>
            <Text style={styles.actionBtnArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {isProcessed && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Import Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>👥</Text>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Total Records</Text>
                <Text style={styles.summaryValue}>2,450</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>✓</Text>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Valid Records</Text>
                <Text style={styles.summaryValue}>2,450 (100%)</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>⚠️</Text>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Warnings</Text>
                <Text style={styles.summaryValue}>0</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Admin Creds Toast */}
      {toastVisible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Validate Modal */}
      <Modal visible={validateVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Validating Data</Text>
            {validateComplete ? (
              <View style={styles.scanCompleteContainer}>
                <Text style={styles.scanCompleteIcon}>✅</Text>
                <Text style={styles.scanCompleteText}>Validation Complete</Text>
                <Text style={{marginBottom: 20, color: '#666880', fontSize: 13}}>✓ 2,450 records validated</Text>
                <TouchableOpacity style={styles.modalBtnClose} onPress={() => setValidateVisible(false)}>
                  <Text style={styles.modalBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.scanProgressContainer}>
                <Text style={styles.scanProgressText}>Analyzing records...</Text>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { width: validateProgress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Process Modal */}
      <Modal visible={processVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Processing {selectedFile}</Text>
            <View style={styles.stepContainer}>
              <Text style={[styles.stepText, processStep >= 0 && styles.stepActive]}>
                {processStep >= 1 ? '✅' : '⏳'} Parsing data structures...
              </Text>
              <Text style={[styles.stepText, processStep >= 1 && styles.stepActive, processStep < 1 && styles.stepInactive]}>
                {processStep >= 2 ? '✅' : '⏳'} Transforming schema...
              </Text>
              <Text style={[styles.stepText, processStep >= 2 && styles.stepActive, processStep < 2 && styles.stepInactive]}>
                {processStep >= 3 ? '✅' : '⏳'} Finalizing import...
              </Text>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 25,
    paddingTop: StatusBar.currentHeight + 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
    elevation: 2,
  },
  hamburgerBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: '#1A1A2E',
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666880',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8EBF0',
    borderStyle: 'dashed',
  },
  uploadBtnSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#4A90E2',
    borderStyle: 'solid',
  },
  uploadBtnComplete: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2ECC71',
    borderStyle: 'solid',
  },
  uploadIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  uploadContent: {
    flex: 1,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#888899',
  },
  uploadArrow: {
    fontSize: 24,
    color: '#4A90E2',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
  },
  infoLabel: {
    fontSize: 13,
    color: '#888899',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: '600',
  },
  statusReady: {
    color: '#2ECC71',
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionBtnContent: {
    flex: 1,
  },
  actionBtnTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  actionBtnDesc: {
    fontSize: 11,
    color: '#888899',
  },
  actionBtnArrow: {
    fontSize: 20,
    color: '#4A90E2',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
  },
  summaryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888899',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  input: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8EBF0',
    fontSize: 13,
    color: '#1A1A2E',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#323232',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 6,
  },
  toastText: { color: '#FFF', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 20, textAlign: 'center' },
  scanProgressContainer: { alignItems: 'center', paddingVertical: 10, width: '100%' },
  scanProgressText: { marginBottom: 12, fontSize: 14, color: '#666880' },
  progressBarBg: { width: '100%', height: 8, backgroundColor: '#E8EBF0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4A90E2', borderRadius: 4 },
  scanCompleteContainer: { alignItems: 'center', paddingVertical: 10, width: '100%' },
  scanCompleteIcon: { fontSize: 40, marginBottom: 10 },
  scanCompleteText: { fontSize: 16, fontWeight: '600', color: '#2ECC71', marginBottom: 5 },
  modalBtnClose: { backgroundColor: '#1B3FA0', paddingVertical: 12, borderRadius: 8, alignItems: 'center', width: '100%' },
  modalBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  stepContainer: { width: '100%' },
  stepText: { fontSize: 14, marginBottom: 12, fontWeight: '500' },
  stepActive: { color: '#1A1A2E' },
  stepInactive: { color: '#AAAAAA' },
});

export default DataImport;
