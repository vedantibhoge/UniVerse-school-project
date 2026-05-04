import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  AccessibilityInfo,
  Animated,
} from 'react-native';
import Sidebar from '../Sidebar/Sidebar';

const StudentManagement = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Grades');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  
  // Advanced filter states
  const [filterGender, setFilterGender] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterFeeStatus, setFilterFeeStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

  // Animated value for sidebar slide
  const slideAnim = useRef(new Animated.Value(-280)).current;

  // Animate sidebar on open/close
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? 0 : -280,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen]);

  // Sample student data
  const students = [
    {
      id: 1,
      name: 'Elena Sorvino',
      email: 'elena.s@school.edu',
      studentId: '#STU-9402',
      rollNo: '01',
      class: 'Class X',
      section: 'A',
      fatherName: 'John Sorvino',
      contact: '+91 9876543210',
      admissionDate: '15-Apr-2023',
      status: 'Active',
      feeStatus: 'Paid',
      gender: 'Female',
      category: 'General',
      admissionYear: 2023,
      academicScore: 85.5,
    },
    {
      id: 2,
      name: 'Marcus Kinsley',
      email: 'm.kinsley@school.edu',
      studentId: '#STU-8821',
      rollNo: '02',
      class: 'Class X',
      section: 'B',
      fatherName: 'Robert Kinsley',
      contact: '+91 9876543211',
      admissionDate: '20-May-2023',
      status: 'Active',
      feeStatus: 'Pending',
      gender: 'Male',
      category: 'General',
      admissionYear: 2023,
      academicScore: 78.2,
    },
    {
      id: 3,
      name: 'Julia Lopez',
      email: 'j.lopez@school.edu',
      studentId: '#STU-7734',
      rollNo: '03',
      class: 'Class IX',
      section: 'A',
      fatherName: 'Carlos Lopez',
      contact: '+91 9876543212',
      admissionDate: '10-Jun-2023',
      status: 'Active',
      feeStatus: 'Paid',
      gender: 'Female',
      category: 'OBC',
      admissionYear: 2023,
      academicScore: 88.9,
    },
    {
      id: 4,
      name: 'Thomas Baxter',
      email: 't.baxter@school.edu',
      studentId: '#STU-9012',
      rollNo: '04',
      class: 'Class IX',
      section: 'B',
      fatherName: 'Michael Baxter',
      contact: '+91 9876543213',
      admissionDate: '05-Jul-2023',
      status: 'Inactive',
      feeStatus: 'Overdue',
      gender: 'Male',
      category: 'General',
      admissionYear: 2023,
      academicScore: 72.1,
    },
  ];

  const itemsPerPage = 4;

  // Filter students based on search query and advanced filters
  const filteredStudents = students.filter((student) => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === '' || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Grade/Class filter
    const matchesGradeFilter = activeFilter === 'All Grades' || student.class === activeFilter;

    // Gender filter
    const matchesGender = filterGender === 'All' || student.gender === filterGender;

    // Status filter
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;

    // Fee Status filter
    const matchesFeeStatus = filterFeeStatus === 'All' || student.feeStatus === filterFeeStatus;

    return matchesSearch && matchesGradeFilter && matchesGender && matchesStatus && matchesFeeStatus;
  });

  const totalFilteredStudents = filteredStudents.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, filterGender, filterStatus, filterFeeStatus]);

  // Filter options
  const filters = ['All Grades', 'Class X', 'Class IX', 'Class VIII'];

  // Analytics Data
  const dropoutTrends = [
    { year: 2021, dropouts: 8, totalStudents: 340 },
    { year: 2022, dropouts: 5, totalStudents: 385 },
    { year: 2023, dropouts: 3, totalStudents: 420 },
    { year: 2024, dropouts: 2, totalStudents: 450 },
  ];

  const genderParity = [
    { gender: 'Male', count: 655, percentage: 51 },
    { gender: 'Female', count: 629, percentage: 49 },
  ];

  // Handle filter selection
  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
    AccessibilityInfo.announceForAccessibility(`Filter changed to ${filter}`);
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalFilteredStudents / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
      AccessibilityInfo.announceForAccessibility(
        `Navigated to page ${currentPage + 1}`
      );
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      AccessibilityInfo.announceForAccessibility(
        `Navigated to page ${currentPage - 1}`
      );
    }
  };

  // Handle student selection
  const handleStudentPress = (student) => {
    AccessibilityInfo.announceForAccessibility(
      `Selected student ${student.name}`
    );
    Alert.alert('Student Details', `You selected ${student.name}`);
  };

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    AccessibilityInfo.announceForAccessibility(
      `Searching for ${text || 'all students'}`
    );
  };

  // Handle hamburger menu - open sidebar overlay
  const handleMenuPress = () => {
    setSidebarOpen(true);
    AccessibilityInfo.announceForAccessibility('Sidebar opened');
  };

  // Handle Advanced Filter Toggle
  const handleAdvancedFilter = () => {
    setShowAdvancedFilter(!showAdvancedFilter);
    AccessibilityInfo.announceForAccessibility(
      showAdvancedFilter ? 'Advanced filter closed' : 'Advanced filter opened'
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={handleMenuPress}
          accessible={true}
          accessibilityLabel="Open Navigation Menu"
          accessibilityRole="button"
          accessibilityHint="Double tap to open sidebar navigation menu"
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="UniVerseZ"
        >
          UniVerseZ
        </Text>
        <View style={styles.spacer} />
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        accessible={true}
        accessibilityLabel="Student Management Screen"
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <Text
            style={styles.pageTitle}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Student Management"
          >
            Student Management
          </Text>
          <Text
            style={styles.pageSubtitle}
            accessible={true}
            accessibilityLabel="Manage enrollments, verify statuses, and monitor institutional growth."
          >
            Manage enrollments, verify statuses, and monitor institutional
            growth.
          </Text>
        </View>

        {/* Stats Card */}
        <View
          style={styles.statsCard}
          accessible={true}
          accessibilityLabel="Statistics Card"
          accessibilityRole="summary"
        >
          <View style={styles.statsContent}>
            <Text
              style={styles.statsLabel}
              accessible={true}
              accessibilityLabel="Total Enrolled"
            >
              TOTAL ENROLLED
            </Text>
            <Text
              style={styles.statsNumber}
              accessible={true}
              accessibilityLabel="1284 students enrolled"
            >
              1,284
            </Text>
            <View style={styles.statsChart}>
              <View style={styles.chartBar}></View>
              <View style={styles.chartBar}></View>
              <View style={styles.chartBar}></View>
            </View>
          </View>
          <View style={styles.statsGrowth}>
            <Text
              style={styles.growthText}
              accessible={true}
              accessibilityLabel="Growth indicator: 12 percent increase compared to last year"
            >
              +12% vs LY
            </Text>
          </View>
        </View>

        {/* Search Section */}
        <View
          style={styles.searchContainer}
          accessible={true}
          accessibilityLabel="Search and Filter Section"
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Search student name, ID, or grade level"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            accessible={true}
            accessibilityLabel="Search students"
            accessibilityHint="Enter student name, ID or grade level to search"
            accessibilityRole="search"
          />
        </View>

        {/* Filter Buttons */}
        <View
          style={styles.filterContainer}
          accessible={true}
          accessibilityLabel="Filter Options"
        >
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterPress(filter)}
              accessible={true}
              accessibilityLabel={filter}
              accessibilityRole="button"
              accessibilityState={{ selected: activeFilter === filter }}
              accessibilityHint={`Filter by ${filter}. Currently ${
                activeFilter === filter ? 'selected' : 'not selected'
              }`}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Advanced Filter Panel */}
        {showAdvancedFilter && (
          <View
            style={styles.advancedFilterPanel}
            accessible={true}
            accessibilityLabel="Advanced Filter Panel"
          >
            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <Text style={styles.filterLabel}>Gender</Text>
                <View style={styles.filterOptions}>
                  {['All', 'Male', 'Female'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        filterGender === option && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilterGender(option)}
                      accessible={true}
                      accessibilityLabel={option}
                      accessibilityRole="button"
                      accessibilityState={{ selected: filterGender === option }}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filterGender === option && styles.filterOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterCol}>
                <Text style={styles.filterLabel}>Status</Text>
                <View style={styles.filterOptions}>
                  {['All', 'Active', 'Inactive'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        filterStatus === option && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilterStatus(option)}
                      accessible={true}
                      accessibilityLabel={option}
                      accessibilityRole="button"
                      accessibilityState={{ selected: filterStatus === option }}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filterStatus === option && styles.filterOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterCol}>
                <Text style={styles.filterLabel}>Fee Status</Text>
                <View style={styles.filterOptions}>
                  {['All', 'Paid', 'Pending', 'Overdue'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        filterFeeStatus === option && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilterFeeStatus(option)}
                      accessible={true}
                      accessibilityLabel={option}
                      accessibilityRole="button"
                      accessibilityState={{ selected: filterFeeStatus === option }}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filterFeeStatus === option && styles.filterOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Student Directory Section */}
        <View
          style={styles.directoryContainer}
          accessible={true}
          accessibilityLabel="Student Directory"
          accessibilityRole="list"
        >
          <View style={styles.directoryHeader}>
            <Text
              style={styles.directoryTitle}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Student Directory"
            >
              Student Directory
            </Text>
            <TouchableOpacity
              style={styles.filterIconButton}
              onPress={handleAdvancedFilter}
              accessible={true}
              accessibilityLabel="Advanced Filter"
              accessibilityRole="button"
              accessibilityHint="Double tap to toggle advanced filter options"
            >
              <Text style={styles.filterIcon}>⚙️</Text>
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View
            style={styles.tableHeader}
            accessible={true}
            accessibilityRole="header"
          >
            <Text style={styles.tableHeaderText} accessible={false}>Name</Text>
            <Text style={styles.tableHeaderText} accessible={false}>Class</Text>
            <Text style={styles.tableHeaderText} accessible={false}>Roll</Text>
            <Text style={styles.tableHeaderText} accessible={false}>Status</Text>
          </View>

          {/* Student List */}
          <FlatList
            scrollEnabled={false}
            data={paginatedStudents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.studentRow}
                onPress={() => handleStudentPress(item)}
                accessible={true}
                accessibilityLabel={`Student ${item.name}`}
                accessibilityRole="button"
                accessibilityHint={`Class: ${item.class}, Roll: ${item.rollNo}, Status: ${item.status}. Double tap for details.`}
              >
                <Text style={styles.studentCell}>{item.name}</Text>
                <Text style={styles.studentCell}>{item.class}</Text>
                <Text style={styles.studentCell}>{item.rollNo}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Active'
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}
                >
                  <Text
                    style={styles.statusText}
                    accessible={false}
                    accessibilityLabel={item.status}
                  >
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Pagination Info */}
          <View
            style={styles.paginationInfo}
            accessible={true}
            accessibilityLabel={`Showing ${startIndex + 1} to ${Math.min(
              startIndex + itemsPerPage,
              totalFilteredStudents
            )} of ${totalFilteredStudents} students`}
          >
            <Text
              style={styles.paginationText}
              accessible={false}
              accessibilityLabel={`Showing ${startIndex + 1} to ${Math.min(
                startIndex + itemsPerPage,
                totalFilteredStudents
              )} of ${totalFilteredStudents} students`}
            >
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalFilteredStudents)} of {totalFilteredStudents} students
            </Text>
          </View>

          {/* Pagination Buttons */}
          <View
            style={styles.paginationButtons}
            accessible={true}
            accessibilityLabel="Pagination controls"
          >
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
              accessible={true}
              accessibilityLabel="Previous Page"
              accessibilityRole="button"
              accessibilityState={{ disabled: currentPage === 1 }}
              accessibilityHint={
                currentPage === 1
                  ? 'Disabled - you are on the first page'
                  : 'Double tap to go to previous page'
              }
            >
              <Text
                style={styles.paginationButtonText}
                accessible={false}
                accessibilityLabel="Previous"
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage >= Math.ceil(totalFilteredStudents / itemsPerPage) &&
                  styles.paginationButtonDisabled,
              ]}
              onPress={handleNextPage}
              disabled={currentPage >= Math.ceil(totalFilteredStudents / itemsPerPage)}
              accessible={true}
              accessibilityLabel="Next Page"
              accessibilityRole="button"
              accessibilityState={{
                disabled:
                  currentPage >= Math.ceil(totalFilteredStudents / itemsPerPage),
              }}
              accessibilityHint={
                currentPage >= Math.ceil(totalFilteredStudents / itemsPerPage)
                  ? 'Disabled - you are on the last page'
                  : 'Double tap to go to next page'
              }
            >
              <Text
                style={styles.paginationButtonText}
                accessible={false}
                accessibilityLabel="Next"
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Analytics Section */}
        <View
          style={styles.analyticsSection}
          accessible={true}
          accessibilityLabel="Analytics Section"
          accessibilityRole="list"
        >
          {/* Dropout Trends */}
          <View style={styles.analyticsCard}>
            <Text
              style={styles.analyticsTitle}
              accessible={true}
              accessibilityRole="header"
            >
              Dropout Trends
            </Text>
            {dropoutTrends.map((item, index) => (
              <View key={index} style={styles.trendRow}>
                <Text style={styles.trendYear}>{item.year}</Text>
                <View style={styles.trendBar}>
                  <View
                    style={[
                      styles.trendBarFill,
                      {
                        width: `${(item.dropouts / item.totalStudents) * 100}%`,
                      },
                    ]}
                    accessible={true}
                    accessibilityLabel={`${item.year}: ${item.dropouts} dropouts out of ${item.totalStudents}`}
                    accessibilityRole="progressbar"
                    accessibilityValue={{
                      min: 0,
                      max: 100,
                      now: (item.dropouts / item.totalStudents) * 100,
                    }}
                  />
                </View>
                <Text style={styles.dropoutCount}>
                  {item.dropouts}/{item.totalStudents}
                </Text>
              </View>
            ))}
          </View>

          {/* Gender Parity */}
          <View style={styles.analyticsCard}>
            <Text
              style={styles.analyticsTitle}
              accessible={true}
              accessibilityRole="header"
            >
              Gender Parity Metrics
            </Text>
            <View style={styles.genderMetricsContainer}>
              {genderParity.map((item, index) => (
                <View key={index} style={styles.genderMetric}>
                  <Text style={styles.genderMetricIcon}>
                    {item.gender === 'Male' ? '👦' : '👧'}
                  </Text>
                  <Text style={styles.genderMetricLabel}>{item.gender}</Text>
                  <Text style={styles.genderMetricCount}>{item.count}</Text>
                  <Text style={styles.genderMetricPercentage}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
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
            {/* Sidebar Component */}
            <Sidebar 
              navigation={navigation} 
              onNavigate={() => setSidebarOpen(false)}
              currentRoute="StudentManagement"
            />
          </Animated.View>
        </View>
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    position: 'relative',
  },
  hamburgerBtn: {
    padding: 8,
    borderRadius: 6,
    position: 'absolute',
    left: 20,
  },
  hamburgerIcon: {
    fontSize: 28,
    color: '#0052B3',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  spacer: {
    position: 'absolute',
    right: 20,
    width: 44,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#003d99',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContent: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a8d0ff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statsChart: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  chartBar: {
    width: 4,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 2,
    opacity: 0.6,
  },
  statsGrowth: {
    paddingLeft: 20,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ade80',
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#e8eef5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  filterContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e8eef5',
  },
  filterButtonActive: {
    backgroundColor: '#c7d9f7',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#003d99',
    fontWeight: '600',
  },
  directoryContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  directoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  directoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  filterIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterIcon: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eef5',
    marginBottom: 12,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 12,
    color: '#999',
  },
  studentId: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  paginationInfo: {
    marginTop: 16,
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 12,
    color: '#999',
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  paginationButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
  
  // Sidebar Overlay Styles
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: '#f5f7fa',
  },
  closeIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Advanced Filter Panel
  advancedFilterPanel: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterCol: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003d99',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e8eef5',
    borderWidth: 1,
    borderColor: '#d0d8e8',
  },
  filterOptionActive: {
    backgroundColor: '#003d99',
    borderColor: '#003d99',
  },
  filterOptionText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // Updated Student Row
  studentCell: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  statusActive: {
    backgroundColor: '#d4f0d4',
  },
  statusInactive: {
    backgroundColor: '#f0d4d4',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Analytics Section
  analyticsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },

  // Dropout Trends
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  trendYear: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    width: 40,
  },
  trendBar: {
    flex: 1,
    height: 16,
    backgroundColor: '#e8eef5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    backgroundColor: '#ef4444',
  },
  dropoutCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    minWidth: 50,
    textAlign: 'right',
  },

  // Gender Parity
  genderMetricsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-around',
  },
  genderMetric: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  genderMetricIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  genderMetricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  genderMetricCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
  genderMetricPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066cc',
    marginTop: 2,
  },
});

export default StudentManagement;
