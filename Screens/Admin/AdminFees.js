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
  red: '#E53935',
};

const feesData = [
  { id: 1, category: 'Tuition Fee', total: '₹50,00,000', collected: '₹45,50,000', pending: '₹4,50,000', percentage: 91 },
  { id: 2, category: 'Transportation Fee', total: '₹8,00,000', collected: '₹7,80,000', pending: '₹20,000', percentage: 97 },
  { id: 3, category: 'Activity Fee', total: '₹4,00,000', collected: '₹3,90,000', pending: '₹10,000', percentage: 97 },
  { id: 4, category: 'Library Fee', total: '₹2,00,000', collected: '₹1,95,000', pending: '₹5,000', percentage: 97 },
];

function FeeCard({ fee, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{fee.category}</Text>
        <View style={[styles.percentageBadge, { backgroundColor: fee.percentage >= 90 ? COLORS.green + '20' : COLORS.red + '20' }]}>
          <Text style={[styles.percentageText, { color: fee.percentage >= 90 ? COLORS.green : COLORS.red }]}>
            {fee.percentage}%
          </Text>
        </View>
      </View>
      
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${fee.percentage}%`, backgroundColor: fee.percentage >= 90 ? COLORS.green : COLORS.red },
          ]}
        />
      </View>

      <View style={styles.feeDetails}>
        <View>
          <Text style={styles.label}>Collected</Text>
          <Text style={[styles.value, { color: COLORS.green }]}>{fee.collected}</Text>
        </View>
        <View>
          <Text style={styles.label}>Pending</Text>
          <Text style={[styles.value, { color: COLORS.red }]}>{fee.pending}</Text>
        </View>
        <View>
          <Text style={styles.label}>Total</Text>
          <Text style={[styles.value, { color: COLORS.primary }]}>{fee.total}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AdminFees({ onBack }) {
  const totalCollected = '₹58,15,000';
  const totalPending = '₹4,85,000';

  const handleViewDetails = (fee) => {
    Alert.alert(
      `${fee.category}`,
      `Collected: ${fee.collected}\nPending: ${fee.pending}\nCollection Rate: ${fee.percentage}%`,
      [
        { text: 'Send Reminder', onPress: () => Alert.alert('Sent', 'Payment reminder sent to students!') },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fee Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.green + '20' }]}>
            <Text style={styles.summaryLabel}>Collected</Text>
            <Text style={[styles.summaryValue, { color: COLORS.green }]}>{totalCollected}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.red + '20' }]}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={[styles.summaryValue, { color: COLORS.red }]}>{totalPending}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Fee Collection Status</Text>
        {feesData.map((fee) => (
          <FeeCard
            key={fee.id}
            fee={fee}
            onPress={() => handleViewDetails(fee)}
          />
        ))}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Report', 'Generating fee collection report...')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Generate Fee Report</Text>
        </TouchableOpacity>

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
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  percentageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8ECF5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  feeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF5',
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
