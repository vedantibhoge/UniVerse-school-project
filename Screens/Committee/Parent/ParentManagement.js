import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../Sidebar/Sidebar';

const ParentManagement = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);
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

  const communications = [
    {
      id: 1,
      name: 'Elena Rossi',
      message: 'Inquiry about the field trip...',
      time: '2m ago',
      badge: 'NEW',
      badgeColor: '#4CAF50',
    },
    {
      id: 2,
      name: 'James Decker',
      message: 'Password reset assistance...',
      time: '45m ago',
      badge: 'URGENT',
      badgeColor: '#FF6B6B',
    },
    {
      id: 3,
      name: 'Mark Thompson',
      message: 'Feedback regarding the new...',
      time: '2h ago',
      badge: null,
      badgeColor: null,
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

      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Parent Portal Oversight Content"
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text
            style={styles.sectionTitle}
            accessible={true}
            accessibilityLabel="Parent Portal Oversight"
            accessibilityRole="header"
          >
            Parent Portal Oversight
          </Text>
          <Text
            style={styles.sectionDescription}
            accessible={true}
            accessibilityLabel="Manage parental relationships and engagement metrics"
          >
            Manage parental relationships and engagement metrics.
          </Text>
        </View>

        {/* Broadcast Announcement Button */}
        <TouchableOpacity
          style={styles.broadcastBtn}
          accessible={true}
          accessibilityLabel="Broadcast Announcement"
          accessibilityRole="button"
          accessibilityHint="Send an announcement to all parents"
        >
          <Text style={styles.broadcastIcon}>📢</Text>
          <Text style={styles.broadcastText}>Broadcast Announcement</Text>
        </TouchableOpacity>

        {/* Stats Container */}
        <View
          style={styles.statsContainer}
          accessible={true}
          accessibilityLabel="Statistics section"
        >
          {/* Pending Registrations Card */}
          <View
            style={styles.statCard}
            accessible={true}
            accessibilityLabel="Pending Registrations Card"
            accessibilityRole="summary"
          >
            <View style={styles.statHeader}>
              <Text
                style={styles.statLabel}
                accessible={true}
                accessibilityLabel="Pending Registrations"
              >
                PENDING REGISTRATIONS
              </Text>
              <Text style={styles.statIcon}>👥</Text>
            </View>
            <Text
              style={styles.statNumber}
              accessible={true}
              accessibilityLabel="24 pending registrations"
            >
              24
            </Text>
            <Text
              style={styles.statChange}
              accessible={true}
              accessibilityLabel="12 percent increase from yesterday"
            >
              +12% from yesterday
            </Text>
          </View>

          {/* Active Users Card */}
          <View
            style={[styles.statCard, styles.activeUsersCard]}
            accessible={true}
            accessibilityLabel="Active Users Daily Card"
            accessibilityRole="summary"
          >
            <View style={styles.activeUsersHeader}>
              <Text
                style={styles.activeUsersLabel}
                accessible={true}
                accessibilityLabel="Active Users Daily"
              >
                ACTIVE USERS (DAILY)
              </Text>
              <Text style={styles.activeUsersIcon}>👁️</Text>
            </View>
            <Text
              style={styles.activeUsersNumber}
              accessible={true}
              accessibilityLabel="1,284 active users"
            >
              1,284
            </Text>
            <Text
              style={styles.activeUsersSubtext}
              accessible={true}
              accessibilityLabel="82 percent of total population"
            >
              82% of total population
            </Text>
          </View>
        </View>

        {/* Engagement Score Section */}
        <View
          style={styles.engagementSection}
          accessible={true}
          accessibilityLabel="Total Engagement Score Section"
        >
          <View style={styles.engagementHeader}>
            <View>
              <Text
                style={styles.engagementTitle}
                accessible={true}
                accessibilityLabel="Total Engagement Score"
                accessibilityRole="header"
              >
                Total
              </Text>
              <Text
                style={styles.engagementTitle}
                accessible={true}
                accessibilityLabel="Engagement Score"
              >
                Engagement
              </Text>
              <Text
                style={styles.engagementTitle}
                accessible={true}
                accessibilityLabel="Score"
              >
                Score
              </Text>
              <Text
                style={styles.engagementSubtext}
                accessible={true}
                accessibilityLabel="Aggregated interaction frequency per cohort"
              >
                Aggregated interaction
              </Text>
              <Text
                style={styles.engagementSubtext}
                accessible={true}
                accessibilityLabel="frequency per cohort"
              >
                frequency per cohort
              </Text>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, styles.tabActive]}
                accessible={true}
                accessibilityLabel="Weekly Tab"
                accessibilityRole="tab"
                accessibilityState={{ selected: true }}
                accessibilityHint="View weekly engagement data"
              >
                <Text style={styles.tabTextActive}>WEEKLY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                accessible={true}
                accessibilityLabel="Monthly Tab"
                accessibilityRole="tab"
                accessibilityState={{ selected: false }}
                accessibilityHint="View monthly engagement data"
              >
                <Text style={styles.tabText}>MONTHLY</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Chart Placeholder */}
          <View
            style={styles.chartContainer}
            accessible={true}
            accessibilityLabel="Engagement Chart"
          >
            <View style={styles.chartBar}>
              <View style={[styles.barSegment, { height: '60%' }]} />
              <Text style={styles.gradeLabel}>Grade 1</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.barSegment, { height: '75%' }]} />
              <Text style={styles.gradeLabel}>Grade 2</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.barSegment, { height: '55%' }]} />
              <Text style={styles.gradeLabel}>Grade 3</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.barSegment, { height: '80%' }]} />
              <Text style={styles.gradeLabel}>Grade 4</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.barSegment, { height: '70%' }]} />
              <Text style={styles.gradeLabel}>Grade 5</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.barSegment, { height: '65%' }]} />
              <Text style={styles.gradeLabel}>Grade 6</Text>
            </View>
          </View>
        </View>

        {/* Recent Communications */}
        <View
          style={styles.communicationsSection}
          accessible={true}
          accessibilityLabel="Recent Communications Section"
        >
          <Text
            style={styles.communicationsTitle}
            accessible={true}
            accessibilityLabel="Recent Communications"
            accessibilityRole="header"
          >
            Recent Communications
          </Text>
          <Text
            style={styles.communicationsSubtitle}
            accessible={true}
            accessibilityLabel="Direct messages from parent portal"
          >
            Direct messages from parent portal
          </Text>

          {communications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.communicationItem}
              accessible={true}
              accessibilityLabel={`Message from ${item.name}`}
              accessibilityRole="button"
              accessibilityHint={`${item.message}. Received ${item.time} ${
                item.badge ? `Status: ${item.badge}` : ''
              }`}
            >
              <View style={styles.communicationAvatar}>
                <Text style={styles.avatarText}>
                  {item.name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.communicationContent}>
                <Text
                  style={styles.communicationName}
                  accessible={true}
                  accessibilityLabel={item.name}
                >
                  {item.name}
                </Text>
                <Text
                  style={styles.communicationMessage}
                  accessible={true}
                  accessibilityLabel={item.message}
                >
                  {item.message}
                </Text>
              </View>
              <View style={styles.communicationRight}>
                <Text
                  style={styles.communicationTime}
                  accessible={true}
                  accessibilityLabel={item.time}
                >
                  {item.time}
                </Text>
                {item.badge && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: item.badgeColor },
                    ]}
                    accessible={true}
                    accessibilityLabel={item.badge}
                  >
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.viewAllBtn}
            accessible={true}
            accessibilityLabel="View All Messages"
            accessibilityRole="button"
            accessibilityHint="View all communications from parents"
          >
            <Text style={styles.viewAllBtnText}>View All Messages</Text>
          </TouchableOpacity>
        </View>

        {/* Accessibility Alert */}
        {!dismissedAlert && (
          <View
            style={styles.alertSection}
            accessible={true}
            accessibilityLabel="Enhance Portal Accessibility Alert"
            accessibilityRole="alert"
          >
            <Text
              style={styles.alertTitle}
              accessible={true}
              accessibilityLabel="Enhance Portal Accessibility"
            >
              Enhance Portal Accessibility
            </Text>
            <Text
              style={styles.alertMessage}
              accessible={true}
              accessibilityLabel="Our latest analytics show that 40 percent of parents access the portal after 7 PM. Schedule your broadcasts to hit their notifications during peak evening engagement."
            >
              Our latest analytics show that 40% of parents access the portal
              after 7:00 PM. Schedule your broadcasts to hit their
              notifications during peak evening engagement.
            </Text>

            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={styles.scheduleTaskBtn}
                accessible={true}
                accessibilityLabel="Schedule Task"
                accessibilityRole="button"
                accessibilityHint="Schedule a broadcast task for peak evening time"
              >
                <Text style={styles.scheduleTaskText}>Schedule Task</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dismissBtn}
                onPress={() => setDismissedAlert(true)}
                accessible={true}
                accessibilityLabel="Dismiss"
                accessibilityRole="button"
                accessibilityHint="Dismiss this notification"
              >
                <Text style={styles.dismissText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          accessible={true}
          accessibilityLabel="Add New Task"
          accessibilityRole="button"
          accessibilityHint="Create a new task or communication"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sidebar Overlay */}
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
              currentRoute="ParentManagement"
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
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hamburger: {
    position: 'absolute',
    left: 16,
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
    paddingVertical: 12,
  },

  // Title Section
  titleSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  // Broadcast Button
  broadcastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#0052B3',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  broadcastIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#fff',
  },
  broadcastText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Stats Container
  statsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  statChange: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '600',
  },

  // Active Users Card
  activeUsersCard: {
    backgroundColor: '#003D82',
    borderColor: '#003D82',
  },
  activeUsersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeUsersLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  activeUsersIcon: {
    fontSize: 24,
  },
  activeUsersNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  activeUsersSubtext: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Engagement Section
  engagementSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  engagementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  engagementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  engagementSubtext: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabActive: {
    borderColor: '#0052B3',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  tabTextActive: {
    fontSize: 12,
    color: '#0052B3',
    fontWeight: '600',
  },

  // Chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barSegment: {
    width: '70%',
    backgroundColor: '#0052B3',
    borderRadius: 4,
    marginBottom: 8,
  },
  gradeLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },

  // Communications Section
  communicationsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  communicationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  communicationsSubtitle: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginBottom: 16,
  },
  communicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  communicationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0052B3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  communicationContent: {
    flex: 1,
  },
  communicationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  communicationMessage: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  communicationRight: {
    alignItems: 'flex-end',
  },
  communicationTime: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '500',
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },

  // View All Button
  viewAllBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0052B3',
    marginTop: 8,
  },
  viewAllBtnText: {
    fontSize: 14,
    color: '#0052B3',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Alert Section
  alertSection: {
    backgroundColor: '#003D82',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 80,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.95,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  scheduleTaskBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  scheduleTaskText: {
    fontSize: 13,
    color: '#003D82',
    fontWeight: '600',
    textAlign: 'center',
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
  },
  dismissText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0052B3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
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
});

export default ParentManagement;
