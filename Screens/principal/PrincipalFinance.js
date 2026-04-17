import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
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

const budgetData = [
  { category: 'Staff Salaries', amount: '$450,000', percentage: 45, color: '#1B3FA0' },
  { category: 'Infrastructure', amount: '$250,000', percentage: 25, color: '#F97316' },
  { category: 'Technology', amount: '$150,000', percentage: 15, color: '#3B82F6' },
  { category: 'Supplies', amount: '$100,000', percentage: 10, color: '#22C55E' },
  { category: 'Maintenance', amount: '$50,000', percentage: 5, color: '#8B5CF6' },
];

const transactions = [
  { id: 1, desc: 'Internet Bill Payment', amount: '-$1,200', type: 'expense', date: 'Apr 15' },
  { id: 2, desc: 'Student Fee Collection', amount: '+$5,400', type: 'income', date: 'Apr 14' },
  { id: 3, desc: 'Electricity Bill', amount: '-$2,100', type: 'expense', date: 'Apr 13' },
  { id: 4, desc: 'Grant Received', amount: '+$10,000', type: 'income', date: 'Apr 12' },
];

function BudgetBar({ category, percentage, color }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View style={styles.budgetItem}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetLabel}>{category.category}</Text>
        <Text style={styles.budgetAmount}>{category.amount}</Text>
      </View>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={styles.budgetPercent}>{category.percentage}%</Text>
    </View>
  );
}

function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
      <Text style={styles.transactionIcon}>{isIncome ? '📥' : '📤'}</Text>
      <View style={styles.transactionContent}>
        <Text style={styles.transactionDesc}>{transaction.desc}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, isIncome ? styles.income : styles.expense]}>
        {transaction.amount}
      </Text>
    </TouchableOpacity>
  );
}

export default function PrincipalFinance({ onToggleSidebar }) {
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
        <Text style={styles.headerTitle}>Finance</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Finance</Text>
          <Text style={styles.subtitle}>Total Budget: $1,000,000</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>$850K</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🏦</Text>
            <Text style={styles.statValue}>$150K</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Utilization</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Allocation</Text>
          <View style={styles.budgetCard}>
            {budgetData.map((budget, index) => (
              <BudgetBar key={index} category={budget} percentage={budget.percentage} color={budget.color} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  budgetCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  budgetItem: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  budgetAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8ECF5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetPercent: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  income: {
    color: COLORS.green,
  },
  expense: {
    color: COLORS.red,
  },
});
