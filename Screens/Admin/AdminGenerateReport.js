import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  green: '#22C55E',
  orange: '#F97316',
  blue: '#3B82F6',
};

const reportTypes = [
  {
    id: 'academic',
    title: 'Academic Report',
    description: 'Performance analysis by grades and subjects',
    icon: '📊',
    color: COLORS.blue,
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Student and staff attendance statistics',
    icon: '✓',
    color: COLORS.green,
  },
  {
    id: 'fee',
    title: 'Fee Collection Report',
    description: 'Monthly and quarterly fee collection',
    icon: '💰',
    color: COLORS.orange,
  },
  {
    id: 'student',
    title: 'Student Report',
    description: 'Enrollment, dropouts, and transfers',
    icon: '👥',
    color: COLORS.primary,
  },
  {
    id: 'staff',
    title: 'Staff Report',
    description: 'Staff details and performance metrics',
    icon: '👨‍💼',
    color: '#8B5CF6',
  },
  {
    id: 'class',
    title: 'Class Report',
    description: 'Class-wise performance and statistics',
    icon: '📚',
    color: '#EC4899',
  },
];

const timeRanges = [
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'semester', label: 'This Semester' },
  { id: 'year', label: 'This Year' },
];

function ReportTypeCard({ report, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[
        styles.reportCard,
        isSelected && styles.reportCardActive,
      ]}
      onPress={() => onSelect(report.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.reportIcon}>{report.icon}</Text>
      <Text style={styles.reportTitle}>{report.title}</Text>
      <Text style={styles.reportDescription}>{report.description}</Text>
      {isSelected && (
        <View style={[styles.checkmark, { backgroundColor: report.color }]}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function TimeRangeOption({ range, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[
        styles.timeOption,
        isSelected && styles.timeOptionActive,
      ]}
      onPress={() => onSelect(range.id)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.timeOptionText,
        isSelected && styles.timeOptionTextActive,
      ]}>
        {range.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AdminGenerateReport({ onBack }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  const handleGenerateReport = () => {
    if (!selectedReport) {
      Alert.alert('Please Select', 'Select a report type to generate');
      return;
    }

    const report = reportTypes.find(r => r.id === selectedReport);
    const timeRange = timeRanges.find(t => t.id === selectedTimeRange);

    Alert.alert(
      'Report Generated',
      `${report.title}\nPeriod: ${timeRange.label}\n\nReport is ready for download.`,
      [
        { text: 'Download PDF', onPress: () => Alert.alert('Downloaded', 'Report downloaded successfully!') },
        { text: 'Download Excel', onPress: () => Alert.alert('Downloaded', 'Report downloaded successfully!') },
        { text: 'Close', onPress: onBack },
      ]
    );
  };

  const handleEmailReport = () => {
    if (!selectedReport) {
      Alert.alert('Please Select', 'Select a report type first');
      return;
    }

    Alert.alert('Email Sent', 'Report has been sent to your email successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Report Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Report Type</Text>
          <View style={styles.reportsGrid}>
            {reportTypes.map((report) => (
              <ReportTypeCard
                key={report.id}
                report={report}
                isSelected={selectedReport === report.id}
                onSelect={setSelectedReport}
              />
            ))}
          </View>
        </View>

        {/* Time Range Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Range</Text>
          <View style={styles.timeOptionsContainer}>
            {timeRanges.map((range) => (
              <TimeRangeOption
                key={range.id}
                range={range}
                isSelected={selectedTimeRange === range.id}
                onSelect={setSelectedTimeRange}
              />
            ))}
          </View>
        </View>

        {/* Options Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Format</Text>
          <View style={styles.optionsContainer}>
            <View style={styles.option}>
              <Text style={styles.optionIcon}>📄</Text>
              <Text style={styles.optionText}>PDF Format</Text>
            </View>
            <View style={styles.option}>
              <Text style={styles.optionIcon}>📊</Text>
              <Text style={styles.optionText}>Excel Format</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleEmailReport}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonIcon}>📧</Text>
            <Text style={styles.secondaryButtonText}>Email Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGenerateReport}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonIcon}>⬇️</Text>
            <Text style={styles.primaryButtonText}>Generate Report</Text>
          </TouchableOpacity>
        </View>

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8ECF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reportCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8ECF5',
  },
  reportCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  reportIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  reportDescription: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#E8ECF5',
    alignItems: 'center',
  },
  timeOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  timeOptionTextActive: {
    color: COLORS.white,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    gap: 6,
  },
  secondaryButtonIcon: {
    fontSize: 18,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    gap: 6,
  },
  primaryButtonIcon: {
    fontSize: 18,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
