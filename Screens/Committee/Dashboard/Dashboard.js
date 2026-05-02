import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  AccessibilityInfo,
  useWindowDimensions,
  Animated,
} from 'react-native';
import Sidebar from '../Sidebar/Sidebar';

const Dashboard = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [selectedStat, setSelectedStat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(8);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  
  // Animated value for sidebar slide
  const slideAnim = useRef(new Animated.Value(-280)).current;
  
  // Animated value for notifications panel slide
  const notificationSlideAnim = useRef(new Animated.Value(400)).current;

  // School Summary Data
  const schoolData = {
    name: 'UniVerse International School',
    principal: 'Dr. Rajesh Kumar Singh',
    contact: '+91 9876543210',
    email: 'admin@universe.edu.in',
    branches: 3,
    establishedYear: 2010,
    totalStudents: 3842,
    totalFaculty: 215,
    registeredParents: 3500,
  };

  // KPI Data
  const kpis = [
    { id: 1, label: 'Total Students', value: '3,842', icon: '👥', color: '#0052B3' },
    { id: 2, label: 'Active Faculty', value: '215', icon: '🎓', color: '#10B981' },
    { id: 3, label: 'Registered Parents', value: '3,500', icon: '👨‍👩‍👧', color: '#F59E0B' },
    { id: 4, label: 'Classes/Sections', value: '126', icon: '📚', color: '#8B5CF6' },
    { id: 5, label: 'Current Attendance %', value: '94.3%', icon: '✓', color: '#EC4899' },
    { id: 6, label: 'Avg Academic Score', value: '78.5', icon: '⭐', color: '#06B6D4' },
    { id: 7, label: 'Pending Tasks', value: '12', icon: '⏳', color: '#EF4444' },
  ];

  // Enrollment Trend Data (Last 6 months)
  const enrollmentTrendData = [
    { month: 'JAN', value: 3520 },
    { month: 'FEB', value: 3598 },
    { month: 'MAR', value: 3701 },
    { month: 'APR', value: 3776 },
    { month: 'MAY', value: 3825 },
    { month: 'JUN', value: 3842 },
  ];

  // Attendance by Class Data
  const attendanceByClass = [
    { class: 'Class X', attendance: 92 },
    { class: 'Class IX', attendance: 96 },
    { class: 'Class VIII', attendance: 89 },
    { class: 'Class VII', attendance: 94 },
    { class: 'Class VI', attendance: 98 },
  ];

  // Academic Performance Distribution
  const academicPerformance = [
    { range: 'Excellent (90-100)', count: 456, percentage: 12 },
    { range: 'Good (75-89)', count: 1823, percentage: 47 },
    { range: 'Average (60-74)', count: 1298, percentage: 34 },
    { range: 'Need Improvement (<60)', count: 265, percentage: 7 },
  ];

  // Gender-wise Distribution
  const genderDistribution = [
    { category: 'Boys', count: 1968, percentage: 51 },
    { category: 'Girls', count: 1874, percentage: 49 },
  ];

  // Alerts and Notifications Data
  const alerts = [
    { id: 1, title: 'Overdue Fees', description: '145 students with pending fees exceeding 30 days', type: 'critical', icon: '💳', actionText: 'View Details' },
    { id: 2, title: 'Low Attendance Alert', description: '23 students with attendance below 75%', type: 'warning', icon: '📍', actionText: 'View Details' },
    { id: 3, title: 'Expiring Staff Contracts', description: '4 faculty members contracts expiring in next 60 days', type: 'warning', icon: '📋', actionText: 'Renew' },
    { id: 4, title: 'Pending Approvals', description: '8 leave requests awaiting approval', type: 'info', icon: '✉️', actionText: 'Review' },
  ];

  // Sample notifications data
  const notifications = [
    { id: 1, title: 'Fee Payment Received', description: 'Student #84291 paid tuition fee', time: '2 mins ago', type: 'success' },
    { id: 2, title: 'Payroll Processed', description: 'Faculty department payroll disbursed', time: '15 mins ago', type: 'info' },
    { id: 3, title: 'Fire Safety Alert', description: 'Fire safety inspection completed', time: '1 hour ago', type: 'warning' },
    { id: 4, title: 'Database Backup', description: 'Automated backup completed successfully', time: '3 hours ago', type: 'success' },
    { id: 5, title: 'New Admission', description: 'New student registered', time: '5 hours ago', type: 'info' },
    { id: 6, title: 'Low Attendance', description: 'Class X-A attendance below 90%', time: '6 hours ago', type: 'warning' },
    { id: 7, title: 'Exam Schedule', description: 'Mid-term exams scheduled for next month', time: '8 hours ago', type: 'info' },
    { id: 8, title: 'Event Reminder', description: 'Annual sports day registration open', time: '1 day ago', type: 'info' },
  ];

  // Animate sidebar on open/close
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 0 : -280,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen, slideAnim]);

  // Animate notifications panel on open/close
  useEffect(() => {
    Animated.timing(notificationSlideAnim, {
      toValue: notificationPanelOpen ? 0 : 400,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [notificationPanelOpen, notificationSlideAnim]);

  // Sample data for chart
  const chartData = [45, 60, 50, 75, 85, 95];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];

  // Handle stat card press
  const handleStatPress = (statName, value) => {
    setSelectedStat(statName);
    Alert.alert(`${statName}`, `Current Value: ${value}`);
  };

  // Handle Generate Report
  const handleGenerateReport = () => {
    Alert.alert('Generate Report', 'Report generation started. You will receive it via email.');
  };

  // Handle View Details
  const handleViewDetails = () => {
    Alert.alert('Monthly Financial Overview', 'Detailed financial report will be displayed.');
  };

  // Handle Notifications
  const handleNotifications = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  // Handle Operational Log Item Press
  const handleLogItemPress = (title, status) => {
    const statusDescriptions = {
      VERIFIED: 'This transaction has been verified successfully.',
      PROCESSING: 'This transaction is being processed.',
      'ACTION REQUIRED': 'This item requires immediate attention.',
      HISTORY: 'Historical record of completed operation.',
    };
    Alert.alert(title, statusDescriptions[status] || 'View details');
  };

  // Handle Quick Action Buttons
  const handleAddStudent = () => {
    Alert.alert('Add Student', 'Navigating to student registration form...');
    // navigation.navigate('AddStudent'); // Uncomment when route exists
  };

  const handleMarkAttendance = () => {
    Alert.alert('Mark Attendance', 'Opening attendance marking interface...');
    // navigation.navigate('MarkAttendance'); // Uncomment when route exists
  };

  const handleSendNotification = () => {
    Alert.alert('Send Notification', 'Opening notification composer...');
    // navigation.navigate('SendNotification'); // Uncomment when route exists
  };

  // Handle Alert Actions
  const handleAlertAction = (alertId, actionText) => {
    const alert = alerts.find(a => a.id === alertId);
    Alert.alert(alert?.title, `Action: ${actionText}\n\n${alert?.description}`);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Sidebar - Hidden on mobile, shown on tablet */}
      {isTablet && (
        <View style={styles.sidebarWrapper}>
          <Sidebar navigation={navigation} currentRoute="CommitteeSidebar" />
        </View>
      )}

      {/* Dashboard Content */}
      <ScrollView
        style={styles.container}
        accessibilityLabel="Dashboard Screen"
        accessibilityRole="list"
      >
      {/* Header Section with Hamburger and Notifications */}
      <View
        style={styles.header}
        accessible={true}
        accessibilityLabel="Dashboard Header"
      >
        {/* Left: Hamburger Menu Button - Visible on Mobile Only */}
        {!isTablet && (
          <TouchableOpacity
            style={styles.hamburgerBtn}
            onPress={() => setSidebarOpen(true)}
            accessible={true}
            accessibilityLabel="Open Navigation Menu"
            accessibilityRole="button"
            accessibilityHint="Opens the sidebar navigation menu"
          >
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
        )}
        
        {/* Middle: Greeting Text */}
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>
            Good Morning, Administrator
          </Text>
          <Text
            style={styles.subheading}
            accessibilityHint="Overview of your institutional health for today"
          >
            Here is your institutional health overview for today.
          </Text>
        </View>

        {/* Right: Notification Button */}
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={handleNotifications}
          accessible={true}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          accessibilityHint={`You have ${notificationCount} unread notifications. Double-tap to view`}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          {notificationCount > 0 && (
            <View
              style={styles.notificationBadge}
              accessible={true}
              accessibilityLabel={`${notificationCount} unread`}
            >
              <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* School Summary Card */}
      <View
        style={styles.schoolSummaryCard}
        accessible={true}
        accessibilityLabel="School Summary Card"
        accessibilityRole="list"
      >
        <View style={styles.schoolSummaryHeader}>
          <View>
            <Text style={styles.schoolName}>{schoolData.name}</Text>
            <Text style={styles.schoolMeta}>Est. {schoolData.establishedYear} | {schoolData.branches} Branches</Text>
          </View>
          <Text style={styles.schoolIcon}>🏫</Text>
        </View>
        
        <View style={styles.schoolSummaryDetails}>
          <View style={styles.summaryDetailRow}>
            <Text style={styles.summaryLabel}>Principal:</Text>
            <Text style={styles.summaryValue}>{schoolData.principal}</Text>
          </View>
          <View style={styles.summaryDetailRow}>
            <Text style={styles.summaryLabel}>Contact:</Text>
            <Text style={styles.summaryValue}>{schoolData.contact}</Text>
          </View>
          <View style={styles.summaryDetailRow}>
            <Text style={styles.summaryLabel}>Email:</Text>
            <Text style={styles.summaryValue}>{schoolData.email}</Text>
          </View>
        </View>
      </View>

      {/* KPIs Section */}
      <View
        style={styles.kpisSection}
        accessible={true}
        accessibilityLabel="Key Performance Indicators Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
        
        {/* First Row of KPIs */}
        <View style={styles.kpisGrid}>
          {kpis.slice(0, 3).map((kpi) => (
            <TouchableOpacity
              key={kpi.id}
              style={[styles.kpiCard, { borderLeftColor: kpi.color }]}
              onPress={() => handleStatPress(kpi.label, kpi.value)}
              accessible={true}
              accessibilityLabel={kpi.label}
              accessibilityRole="button"
              accessibilityHint={`Current value: ${kpi.value}. Double-tap for details`}
            >
              <Text style={styles.kpiIcon}>{kpi.icon}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Second Row of KPIs */}
        <View style={styles.kpisGrid}>
          {kpis.slice(3, 6).map((kpi) => (
            <TouchableOpacity
              key={kpi.id}
              style={[styles.kpiCard, { borderLeftColor: kpi.color }]}
              onPress={() => handleStatPress(kpi.label, kpi.value)}
              accessible={true}
              accessibilityLabel={kpi.label}
              accessibilityRole="button"
              accessibilityHint={`Current value: ${kpi.value}. Double-tap for details`}
            >
              <Text style={styles.kpiIcon}>{kpi.icon}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Third Row - Single KPI */}
        <View style={styles.kpisGrid}>
          {kpis.slice(6, 7).map((kpi) => (
            <TouchableOpacity
              key={kpi.id}
              style={[styles.kpiCard, { borderLeftColor: kpi.color, flex: 1 }]}
              onPress={() => handleStatPress(kpi.label, kpi.value)}
              accessible={true}
              accessibilityLabel={kpi.label}
              accessibilityRole="button"
              accessibilityHint={`Current value: ${kpi.value}. Double-tap for details`}
            >
              <Text style={styles.kpiIcon}>{kpi.icon}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View
        style={styles.quickActionsSection}
        accessible={true}
        accessibilityLabel="Quick Actions Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={handleMarkAttendance}
            accessible={true}
            accessibilityLabel="Mark Attendance"
            accessibilityRole="button"
            accessibilityHint="Opens attendance marking interface"
          >
            <Text style={styles.quickActionIcon}>📍</Text>
            <Text style={styles.quickActionText}>Mark Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={handleAddStudent}
            accessible={true}
            accessibilityLabel="Add Student"
            accessibilityRole="button"
            accessibilityHint="Opens student registration form"
          >
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>Add Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={handleGenerateReport}
            accessible={true}
            accessibilityLabel="Generate Report"
            accessibilityRole="button"
            accessibilityHint="Generates institutional report"
          >
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Generate Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={handleSendNotification}
            accessible={true}
            accessibilityLabel="Send Notification"
            accessibilityRole="button"
            accessibilityHint="Opens notification composer"
          >
            <Text style={styles.quickActionIcon}>📢</Text>
            <Text style={styles.quickActionText}>Send Notification</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alerts and Notifications Panel */}
      <View
        style={styles.alertsSection}
        accessible={true}
        accessibilityLabel="Alerts and Notifications Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>Alerts & Notifications</Text>
        
        {alerts.map((alert) => (
          <View
            key={alert.id}
            style={[
              styles.alertItem,
              alert.type === 'critical' && styles.alertCritical,
              alert.type === 'warning' && styles.alertWarning,
              alert.type === 'info' && styles.alertInfo,
            ]}
            accessible={true}
            accessibilityLabel={alert.title}
            accessibilityRole="list"
            accessibilityHint={alert.description}
          >
            <View style={styles.alertIconContainer}>
              <Text style={styles.alertIcon}>{alert.icon}</Text>
            </View>
            
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDescription}>{alert.description}</Text>
            </View>

            <TouchableOpacity
              style={styles.alertActionBtn}
              onPress={() => handleAlertAction(alert.id, alert.actionText)}
              accessible={true}
              accessibilityLabel={alert.actionText}
              accessibilityRole="button"
              accessibilityHint={`Action for ${alert.title}`}
            >
              <Text style={styles.alertActionText}>{alert.actionText}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Enrollment Trend Chart Section */}
      <View
        style={styles.chartSection}
        accessible={true}
        accessibilityLabel="Enrollment Trend Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>Enrollment Trend (Last 6 Months)</Text>
        
        <View style={styles.lineChartContainer} accessible={true} accessibilityHint="Line chart showing enrollment trend">
          <View style={styles.lineChart}>
            <View style={styles.lineChartWrapper}>
              {enrollmentTrendData.map((data, index) => {
                const maxValue = Math.max(...enrollmentTrendData.map(d => d.value));
                const minValue = Math.min(...enrollmentTrendData.map(d => d.value));
                const range = maxValue - minValue;
                const heightPercent = ((data.value - minValue) / range) * 100;
                
                return (
                  <View key={index} style={styles.lineChartBar}>
                    <View
                      style={[
                        styles.lineChartColumn,
                        { height: `${heightPercent || 10}%`, backgroundColor: '#0052B3' },
                      ]}
                      accessible={true}
                      accessibilityLabel={`${data.month}: ${data.value} students`}
                      accessibilityRole="progressbar"
                      accessibilityValue={{ min: minValue, max: maxValue, now: data.value }}
                    />
                    <Text style={styles.lineChartLabel}>{data.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* Attendance by Class Section */}
      <View
        style={styles.chartSection}
        accessible={true}
        accessibilityLabel="Attendance by Class Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>Attendance by Class</Text>
        
        {attendanceByClass.map((item, index) => (
          <View
            key={index}
            style={styles.attendanceBarContainer}
            accessible={true}
            accessibilityLabel={`${item.class}: ${item.attendance}% attendance`}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: item.attendance }}
          >
            <View style={styles.attendanceLabel}>
              <Text style={styles.attendanceClassName}>{item.class}</Text>
              <Text style={styles.attendancePercentage}>{item.attendance}%</Text>
            </View>
            <View style={styles.attendanceBarBg}>
              <View
                style={[
                  styles.attendanceBarFill,
                  {
                    width: `${item.attendance}%`,
                    backgroundColor: item.attendance >= 95 ? '#10B981' : item.attendance >= 85 ? '#0052B3' : '#F59E0B',
                  },
                ]}
                accessible={false}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Academic Performance Distribution Section */}
      <View
        style={styles.chartSection}
        accessible={true}
        accessibilityLabel="Academic Performance Distribution Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>Academic Performance Distribution</Text>
        
        {academicPerformance.map((item, index) => (
          <View
            key={index}
            style={styles.performanceItem}
            accessible={true}
            accessibilityLabel={`${item.range}: ${item.count} students`}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 2000, now: item.count }}
          >
            <View style={styles.performanceLabel}>
              <Text style={styles.performanceRange}>{item.range}</Text>
              <Text style={styles.performanceCount}>{item.count} students ({item.percentage}%)</Text>
            </View>
            <View style={styles.performanceBarBg}>
              <View
                style={[
                  styles.performanceBarFill,
                  {
                    width: `${item.percentage}%`,
                    backgroundColor: index === 0 ? '#10B981' : index === 1 ? '#0052B3' : index === 2 ? '#F59E0B' : '#EF4444',
                  },
                ]}
                accessible={false}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Gender Distribution Section */}
      <View
        style={styles.chartSection}
        accessible={true}
        accessibilityLabel="Gender Distribution Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>Student Distribution</Text>
        
        <View style={styles.genderDistributionContainer}>
          {genderDistribution.map((item, index) => (
            <View
              key={index}
              style={styles.genderCard}
              accessible={true}
              accessibilityLabel={`${item.category}: ${item.count} students`}
            >
              <Text style={styles.genderIcon}>{item.category === 'Boys' ? '👦' : '👧'}</Text>
              <Text style={styles.genderLabel}>{item.category}</Text>
              <Text style={styles.genderValue}>{item.count}</Text>
              <Text style={styles.genderPercentage}>{item.percentage}%</Text>
              <View style={styles.genderPieSlice}>
                <View
                  style={[
                    styles.genderPie,
                    {
                      backgroundColor: item.category === 'Boys' ? '#0052B3' : '#EC4899',
                      width: item.percentage * 2,
                      height: item.percentage * 2,
                      borderRadius: (item.percentage * 2) / 2,
                    },
                  ]}
                  accessible={false}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* MTD Revenue Card */}
      <TouchableOpacity
        style={styles.revenueCard}
        onPress={() => handleStatPress('MTD REVENUE', '$1,248,500')}
        accessible={true}
        accessibilityLabel="MTD Revenue"
        accessibilityRole="button"
        accessibilityHint="Revenue card showing monthly-to-date revenue. Double-tap for details"
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>MTD REVENUE</Text>
          <Text style={styles.cardIcon}>💰</Text>
        </View>
        <Text style={styles.revenueAmount}>$1,248,500</Text>
        <View style={styles.revenueChange}>
          <Text style={styles.changeIcon}>📈</Text>
          <Text
            style={styles.changeText}
            accessibilityLabel="Increase of 12.4 percent compared to last month"
          >
            +12.4% vs last month
          </Text>
        </View>
      </TouchableOpacity>

      {/* Monthly Financial Overview Section */}
      <View
        style={styles.chartSection}
        accessible={true}
        accessibilityLabel="Monthly Financial Overview Section"
        accessibilityRole="list"
      >
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Monthly Financial Overview</Text>
          <TouchableOpacity
            onPress={handleViewDetails}
            accessible={true}
            accessibilityLabel="View Details Button"
            accessibilityRole="button"
            accessibilityHint="Opens detailed financial report"
          >
            <Text style={styles.viewDetailsButton}>View Details</Text>
            <Text style={styles.viewDetailsArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={styles.chartSubtitle}
          accessibilityLabel="Chart shows projected versus actual revenue"
        >
          Projected vs Actual Revenue
        </Text>
      </View>

      {/* Operational Log Section */}
      <View
        style={styles.logSection}
        accessible={true}
        accessibilityLabel="Operational Log Section"
        accessibilityRole="list"
      >
        <Text style={styles.sectionTitle}>
          Operational Log
        </Text>

        {/* Log Item 1: Tuition Fee Paid */}
        <TouchableOpacity
          style={styles.logItem}
          onPress={() => handleLogItemPress('Tuition Fee Paid', 'VERIFIED')}
          accessible={true}
          accessibilityLabel="Tuition Fee Paid"
          accessibilityRole="button"
          accessibilityHint="Status: VERIFIED. Double-tap for more details"
        >
          <View style={styles.logIcon}>
            <Text style={styles.logIconText}>💳</Text>
          </View>
          <View style={styles.logContent}>
            <Text style={styles.logTitle}>Tuition Fee Paid</Text>
            <Text style={styles.logSubtitle}>Student #84291</Text>
          </View>
          <View
            style={[styles.logStatus, styles.statusVerified]}
            accessible={false}
          >
            <Text style={styles.statusText}>VERIFIED</Text>
          </View>
        </TouchableOpacity>

        {/* Log Item 2: Payroll Disbursed */}
        <TouchableOpacity
          style={styles.logItem}
          onPress={() => handleLogItemPress('Payroll Disbursed', 'PROCESSING')}
          accessible={true}
          accessibilityLabel="Payroll Disbursed"
          accessibilityRole="button"
          accessibilityHint="Status: PROCESSING. Double-tap for more details"
        >
          <View style={styles.logIcon}>
            <Text style={styles.logIconText}>📋</Text>
          </View>
          <View style={styles.logContent}>
            <Text style={styles.logTitle}>Payroll Disbursed</Text>
            <Text style={styles.logSubtitle}>Faculty Department</Text>
          </View>
          <View
            style={[styles.logStatus, styles.statusProcessing]}
            accessible={false}
          >
            <Text style={styles.statusText}>PROCESSING</Text>
          </View>
        </TouchableOpacity>

        {/* Log Item 3: Compliance Alert */}
        <TouchableOpacity
          style={styles.logItem}
          onPress={() => handleLogItemPress('Compliance Alert', 'ACTION REQUIRED')}
          accessible={true}
          accessibilityLabel="Compliance Alert"
          accessibilityRole="button"
          accessibilityHint="Status: ACTION REQUIRED. This requires immediate attention. Double-tap for details"
        >
          <View style={styles.logIcon}>
            <Text style={styles.logIconText}>⚠️</Text>
          </View>
          <View style={styles.logContent}>
            <Text style={styles.logTitle}>Compliance Alert</Text>
            <Text style={styles.logSubtitle}>Fire Safety Check</Text>
          </View>
          <View
            style={[styles.logStatus, styles.statusAction]}
            accessible={false}
          >
            <Text style={styles.statusText}>ACTION REQUIRED</Text>
          </View>
        </TouchableOpacity>

        {/* Log Item 4: Database Backup */}
        <TouchableOpacity
          style={styles.logItem}
          onPress={() => handleLogItemPress('Database Backup', 'HISTORY')}
          accessible={true}
          accessibilityLabel="Database Backup"
          accessibilityRole="button"
          accessibilityHint="Status: HISTORY. Automated backup completed successfully. Double-tap for details"
        >
          <View style={styles.logIcon}>
            <Text style={styles.logIconText}>💾</Text>
          </View>
          <View style={styles.logContent}>
            <Text style={styles.logTitle}>Database Backup</Text>
            <Text style={styles.logSubtitle}>Automated Success</Text>
          </View>
          <View
            style={[styles.logStatus, styles.statusHistory]}
            accessible={false}
          >
            <Text style={styles.statusText}>HISTORY</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && !isTablet && (
        <View style={styles.sidebarOverlay}>
          {/* Backdrop */}
          <TouchableOpacity
            style={styles.backdrop}
            onPress={() => setSidebarOpen(false)}
            accessible={true}
            accessibilityLabel="Close Navigation Menu"
            accessibilityRole="button"
          />
          
          {/* Sidebar Modal with Slide Animation */}
          <Animated.View 
            style={[
              styles.sidebarModal,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSidebarOpen(false)}
              accessible={true}
              accessibilityLabel="Close Sidebar"
              accessibilityRole="button"
              accessibilityHint="Closes the navigation sidebar"
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            
            {/* Sidebar Component */}
            <Sidebar 
              navigation={navigation} 
              onNavigate={() => setSidebarOpen(false)}
              currentRoute="CommitteeSidebar"
            />
          </Animated.View>
        </View>
      )}

      {/* Notifications Panel - Slide from Right */}
      {notificationPanelOpen && (
        <View style={styles.notificationOverlay}>
          {/* Backdrop */}
          <TouchableOpacity
            style={styles.notificationBackdrop}
            onPress={() => setNotificationPanelOpen(false)}
            accessible={true}
            accessibilityLabel="Close Notifications"
            accessibilityRole="button"
          />

          {/* Notifications Panel */}
          <Animated.View
            style={[
              styles.notificationPanel,
              {
                transform: [{ translateX: notificationSlideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationPanelTitle}>Notifications</Text>
              <TouchableOpacity
                style={styles.notificationCloseBtn}
                onPress={() => setNotificationPanelOpen(false)}
                accessible={true}
                accessibilityLabel="Close Notifications Panel"
                accessibilityRole="button"
                accessibilityHint="Closes the notifications panel"
              >
                <Text style={styles.notificationCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Notifications List */}
            <ScrollView
              style={styles.notificationsList}
              accessible={true}
              accessibilityLabel="Notifications List"
              accessibilityRole="list"
              showsVerticalScrollIndicator={false}
            >
              {notifications.map((notification, index) => (
                <TouchableOpacity
                  key={notification.id}
                  style={styles.notificationItemContainer}
                  onPress={() => Alert.alert(notification.title, notification.description)}
                  accessible={true}
                  accessibilityLabel={notification.title}
                  accessibilityRole="button"
                  accessibilityHint={`${notification.description}. ${notification.time}`}
                >
                  <View style={[
                    styles.notificationItem,
                    notification.type === 'success' && styles.notificationSuccess,
                    notification.type === 'warning' && styles.notificationWarning,
                    notification.type === 'info' && styles.notificationInfo,
                  ]}>
                    <View style={[
                      styles.notificationIconContainer,
                      notification.type === 'success' && styles.notificationIconSuccess,
                      notification.type === 'warning' && styles.notificationIconWarning,
                      notification.type === 'info' && styles.notificationIconInfo,
                    ]}>
                      <Text style={styles.notificationIconText}>
                        {notification.type === 'success' && '✓'}
                        {notification.type === 'warning' && '⚠'}
                        {notification.type === 'info' && 'ℹ'}
                      </Text>
                    </View>

                    <View style={styles.notificationContent}>
                      <Text
                        style={styles.notificationItemTitle}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        style={styles.notificationItemDescription}
                      >
                        {notification.description}
                      </Text>
                      <Text
                        style={styles.notificationItemTime}
                        accessibilityLabel={`Time: ${notification.time}`}
                      >
                        {notification.time}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Footer */}
            <TouchableOpacity
              style={styles.notificationViewAllBtn}
              onPress={() => Alert.alert('All Notifications', 'Loading all notifications...')}
              accessible={true}
              accessibilityLabel="View All Notifications"
              accessibilityRole="button"
              accessibilityHint="Opens the complete notifications center"
            >
              <Text style={styles.notificationViewAllText}>View All Notifications</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    position: 'relative',
  },

  sidebarWrapper: {
    width: 280,
    backgroundColor: '#f5f7fa',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 16,
  },

  // Header
  header: {
    marginTop: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },

  // Hamburger Button
  hamburgerBtn: {
    padding: 8,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: '#0052B3',
    fontWeight: 'bold',
  },

  // Notification Button
  notificationBtn: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
  },

  // Sidebar Overlay (Mobile)
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    overflow: 'visible',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarModal: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#f5f7fa',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    elevation: 3,
  },
  closeIcon: {
    fontSize: 24,
    color: '#0052B3',
    fontWeight: 'bold',
  },

  // Revenue Card
  revenueCard: {
    backgroundColor: '#0052B3',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  cardIcon: {
    fontSize: 20,
  },
  revenueAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  revenueChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  changeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Chart Section
  chartSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  viewDetailsButton: {
    color: '#0052B3',
    fontSize: 14,
    fontWeight: '600',
  },
  viewDetailsArrow: {
    color: '#0052B3',
    fontSize: 16,
    marginTop: 2,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    fontWeight: '400',
  },
  chartContainer: {
    marginBottom: 16,
  },
  chart: {
    height: 250,
    marginBottom: 20,
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    backgroundColor: '#0052B3',
    borderRadius: 4,
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Operational Log
  logSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logIconText: {
    fontSize: 24,
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  logSubtitle: {
    fontSize: 13,
    color: '#999',
    fontWeight: '400',
  },
  logStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusVerified: {
    backgroundColor: '#d4f0d4',
  },
  statusProcessing: {
    backgroundColor: '#d4e8f7',
  },
  statusAction: {
    backgroundColor: '#f0d4d4',
  },
  statusHistory: {
    backgroundColor: '#e8d4f0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  // Generate Report Button
  generateReportBtn: {
    backgroundColor: '#0052B3',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  reportBtnIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  reportBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 20,
  },

  // Notifications Panel
  notificationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    overflow: 'visible',
  },
  notificationBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  notificationPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 350,
    maxWidth: '90%',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  notificationPanelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  notificationCloseBtn: {
    padding: 8,
    borderRadius: 6,
  },
  notificationCloseIcon: {
    fontSize: 20,
    color: '#0052B3',
    fontWeight: 'bold',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  notificationItemContainer: {
    marginBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
  },
  notificationSuccess: {
    borderLeftColor: '#4caf50',
  },
  notificationWarning: {
    borderLeftColor: '#ff9800',
  },
  notificationInfo: {
    borderLeftColor: '#0052B3',
  },
  notificationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIconSuccess: {
    backgroundColor: '#e8f5e9',
  },
  notificationIconWarning: {
    backgroundColor: '#fff3e0',
  },
  notificationIconInfo: {
    backgroundColor: '#e3f2fd',
  },
  notificationIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  notificationItemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  notificationItemTime: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  notificationViewAllBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  notificationViewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052B3',
    textAlign: 'center',
  },

  // School Summary Card
  schoolSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0052B3',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  schoolSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  schoolMeta: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  schoolIcon: {
    fontSize: 32,
  },
  schoolSummaryDetails: {
    marginTop: 12,
  },
  summaryDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 80,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 1,
  },

  // KPIs Section
  kpisSection: {
    marginBottom: 24,
  },
  kpisGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  kpiIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
  },

  // Quick Actions Section
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    minWidth: '23%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderTopWidth: 2,
    borderTopColor: '#0052B3',
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },

  // Alerts Section
  alertsSection: {
    marginBottom: 24,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    backgroundColor: '#f9f9f9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  alertCritical: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  alertWarning: {
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFBF0',
  },
  alertInfo: {
    borderLeftColor: '#0052B3',
    backgroundColor: '#F0F7FF',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  alertIcon: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  alertActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#0052B3',
  },
  alertActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },

  // Enrollment Trend Chart
  lineChartContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
  },
  lineChart: {
    height: 200,
  },
  lineChartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    paddingHorizontal: 8,
  },
  lineChartBar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: '100%',
  },
  lineChartColumn: {
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  lineChartLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },

  // Attendance by Class
  attendanceBarContainer: {
    marginBottom: 12,
  },
  attendanceLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  attendanceClassName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  attendancePercentage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0052B3',
  },
  attendanceBarBg: {
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  attendanceBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Academic Performance Distribution
  performanceItem: {
    marginBottom: 12,
  },
  performanceLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  performanceRange: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  performanceCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  performanceBarBg: {
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Gender Distribution
  genderDistributionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  genderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  genderLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  genderValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  genderPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052B3',
    marginBottom: 8,
  },
  genderPieSlice: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderPie: {
    opacity: 0.3,
  },
});

export default Dashboard;
