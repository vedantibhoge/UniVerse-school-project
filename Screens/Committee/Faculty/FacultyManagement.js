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

const FacultyManagement = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Departments');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Advanced filter states
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterQualification, setFilterQualification] = useState('All');
  const [filterExperience, setFilterExperience] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterJoiningYear, setFilterJoiningYear] = useState('All');

  // Bulk action states
  const [showBulkAssignSubjects, setShowBulkAssignSubjects] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [selectedFacultyForBulk, setSelectedFacultyForBulk] = useState(new Set());

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

  // Sample faculty data
  const facultyMembers = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      email: 'j.wilson@school.edu',
      facultyId: '#FAC-5021',
      department: 'Mathematics',
      qualification: 'PhD in Mathematics',
      experience: 12,
      status: 'Permanent',
      joiningDate: '15-Jun-2012',
      joiningYear: 2012,
      salary: 85000,
      leaveBalance: 18,
      performanceRating: 4.5,
      subjects: ['Algebra', 'Geometry'],
      classAssigned: 'Class X-A, Class X-B',
      lastReview: '02-Jan-2025',
      documents: 5,
    },
    {
      id: 2,
      name: 'Prof. Sarah Chen',
      email: 's.chen@school.edu',
      facultyId: '#FAC-5022',
      department: 'Science',
      qualification: 'M.Sc Physics',
      experience: 8,
      status: 'Permanent',
      joiningDate: '20-Aug-2016',
      joiningYear: 2016,
      salary: 72000,
      leaveBalance: 12,
      performanceRating: 4.2,
      subjects: ['Physics', 'Chemistry'],
      classAssigned: 'Class IX-A, Class IX-C',
      lastReview: '15-Dec-2024',
      documents: 4,
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      email: 'm.brown@school.edu',
      facultyId: '#FAC-5023',
      department: 'English',
      qualification: 'MA English',
      experience: 5,
      status: 'Visiting',
      joiningDate: '10-Feb-2020',
      joiningYear: 2020,
      salary: 55000,
      leaveBalance: 8,
      performanceRating: 3.8,
      subjects: ['English Literature', 'Grammar'],
      classAssigned: 'Class VIII-B',
      lastReview: '20-Nov-2024',
      documents: 3,
    },
    {
      id: 4,
      name: 'Prof. Emily Davis',
      email: 'e.davis@school.edu',
      facultyId: '#FAC-5024',
      department: 'History',
      qualification: 'M.A History',
      experience: 15,
      status: 'On Leave',
      joiningDate: '01-Jul-2009',
      joiningYear: 2009,
      salary: 88000,
      leaveBalance: 0,
      performanceRating: 4.7,
      subjects: ['World History', 'Indian History'],
      classAssigned: 'On Leave',
      lastReview: '10-Oct-2024',
      documents: 6,
    },
  ];

  const itemsPerPage = 4;

  // Filter options
  const filters = ['All Departments', 'Mathematics', 'Science', 'English', 'History'];

  // Filter faculty based on search query and advanced filters
  const filteredFaculty = facultyMembers.filter((faculty) => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === '' || 
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.facultyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchQuery.toLowerCase());

    // Department filter
    const matchesDepartment = activeFilter === 'All Departments' || faculty.department === activeFilter;

    // Advanced filters
    const matchesAdvDepartment = filterDepartment === 'All' || faculty.department === filterDepartment;
    const matchesQualification = filterQualification === 'All' || faculty.qualification.includes(filterQualification);
    const matchesExperience = filterExperience === 'All' || 
      (filterExperience === '0-5' && faculty.experience <= 5) ||
      (filterExperience === '5-10' && faculty.experience > 5 && faculty.experience <= 10) ||
      (filterExperience === '10+' && faculty.experience > 10);
    const matchesStatus = filterStatus === 'All' || faculty.status === filterStatus;
    const matchesJoiningYear = filterJoiningYear === 'All' || faculty.joiningYear === parseInt(filterJoiningYear);

    return matchesSearch && matchesDepartment && matchesAdvDepartment && matchesQualification && 
           matchesExperience && matchesStatus && matchesJoiningYear;
  });

  const totalFilteredFaculty = filteredFaculty.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFaculty = filteredFaculty.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, filterDepartment, filterQualification, filterExperience, filterStatus, filterJoiningYear]);

  // Handle filter selection
  const handleFilterPress = (filter) => {
    setActiveFilter(filter);
    AccessibilityInfo.announceForAccessibility(`Filter changed to ${filter}`);
  };

  // Handle Advanced Filter Toggle
  const handleAdvancedFilter = () => {
    setShowAdvancedFilter(!showAdvancedFilter);
    AccessibilityInfo.announceForAccessibility(
      showAdvancedFilter ? 'Advanced filter closed' : 'Advanced filter opened'
    );
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalFilteredFaculty / itemsPerPage)) {
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

  // Handle bulk faculty selection
  const handleBulkFacultySelect = (facultyId) => {
    const newSelected = new Set(selectedFacultyForBulk);
    if (newSelected.has(facultyId)) {
      newSelected.delete(facultyId);
    } else {
      newSelected.add(facultyId);
    }
    setSelectedFacultyForBulk(newSelected);
    AccessibilityInfo.announceForAccessibility(
      `${newSelected.size} faculty members selected for bulk action`
    );
  };

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    AccessibilityInfo.announceForAccessibility(
      `Searching for ${text || 'all faculty'}`
    );
  };

  // Handle hamburger menu - open sidebar overlay
  const handleMenuPress = () => {
    setSidebarOpen(true);
    AccessibilityInfo.announceForAccessibility('Sidebar opened');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Centered Title */}
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="UniVerseZ"
        >
          UniVerseZ
        </Text>

        {/* Hamburger Menu - Left Side */}
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

        {/* Profile Button - Right Side */}
      
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        accessible={true}
        accessibilityLabel="Faculty Management Screen"
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <Text
            style={styles.pageTitle}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Faculty Management"
          >
            Faculty Management
          </Text>
          <Text
            style={styles.pageSubtitle}
            accessible={true}
            accessibilityLabel="Manage faculty records, track qualifications, and monitor departmental staffing."
          >
            Manage faculty records, track qualifications, and monitor departmental staffing.
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
              accessibilityLabel="Total Faculty"
            >
              TOTAL FACULTY
            </Text>
            <Text
              style={styles.statsNumber}
              accessible={true}
              accessibilityLabel="847 faculty members"
            >
              847
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
              accessibilityLabel="Growth indicator: 8 percent increase compared to last year"
            >
              +8% vs LY
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
            placeholder="Search faculty name, ID, or department"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            accessible={true}
            accessibilityLabel="Search faculty"
            accessibilityHint="Enter faculty name, ID or department to search"
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
                <Text style={styles.filterLabel}>Department</Text>
                <View style={styles.filterOptions}>
                  {['All', 'Mathematics', 'Science', 'English', 'History'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        filterDepartment === option && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilterDepartment(option)}
                      accessible={true}
                      accessibilityLabel={option}
                      accessibilityRole="button"
                      accessibilityState={{ selected: filterDepartment === option }}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filterDepartment === option && styles.filterOptionTextActive,
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
                  {['All', 'Permanent', 'Visiting', 'On Leave'].map((option) => (
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
                <Text style={styles.filterLabel}>Experience</Text>
                <View style={styles.filterOptions}>
                  {['All', '0-5', '5-10', '10+'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        filterExperience === option && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilterExperience(option)}
                      accessible={true}
                      accessibilityLabel={option === '10+' ? 'More than 10 years' : option}
                      accessibilityRole="button"
                      accessibilityState={{ selected: filterExperience === option }}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          filterExperience === option && styles.filterOptionTextActive,
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

        {/* Faculty Directory Section */}
        <View
          style={styles.directoryContainer}
          accessible={true}
          accessibilityLabel="Faculty Directory"
          accessibilityRole="list"
        >
          <View style={styles.directoryHeader}>
            <Text
              style={styles.directoryTitle}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Faculty Directory"
            >
              Faculty Directory
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

          {/* Bulk Actions Buttons */}
          <View
            style={styles.bulkActionsContainer}
            accessible={true}
            accessibilityLabel="Bulk Actions"
            accessibilityRole="list"
          >
            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => setShowBulkAssignSubjects(!showBulkAssignSubjects)}
              accessible={true}
              accessibilityLabel="Assign Subjects"
              accessibilityRole="button"
              accessibilityHint="Double tap to assign subjects to faculty"
            >
              <Text style={styles.bulkActionIcon}>📚</Text>
              <Text style={styles.bulkActionText}>Assign Subjects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => setShowMarkAttendance(!showMarkAttendance)}
              accessible={true}
              accessibilityLabel="Mark Attendance"
              accessibilityRole="button"
              accessibilityHint="Double tap to mark staff attendance"
            >
              <Text style={styles.bulkActionIcon}>✓</Text>
              <Text style={styles.bulkActionText}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bulkActionButton}
              onPress={() => {
                AccessibilityInfo.announceForAccessibility('Exporting faculty directory');
                Alert.alert('Export', 'Faculty directory exported as PDF');
              }}
              accessible={true}
              accessibilityLabel="Export Directory"
              accessibilityRole="button"
              accessibilityHint="Double tap to export staff directory"
            >
              <Text style={styles.bulkActionIcon}>📥</Text>
              <Text style={styles.bulkActionText}>Export</Text>
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View
            style={styles.tableHeader}
            accessible={true}
            accessibilityRole="header"
          >
            <Text
              style={[styles.tableHeaderText, { flex: 2 }]}
              accessible={false}
              accessibilityLabel="Faculty name column header"
            >
              Name
            </Text>
            <Text
              style={[styles.tableHeaderText, { flex: 1 }]}
              accessible={false}
              accessibilityLabel="Department column header"
            >
              Dept
            </Text>
            <Text
              style={[styles.tableHeaderText, { flex: 1.3 }]}
              accessible={false}
              accessibilityLabel="Status column header"
            >
              Status
            </Text>
            <Text
              style={[styles.tableHeaderText, { flex: 0.7 }]}
              accessible={false}
              accessibilityLabel="Experience column header"
            >
              Exp
            </Text>
          </View>

          {/* Faculty List */}
          <FlatList
            scrollEnabled={false}
            data={paginatedFaculty}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={styles.facultyRow}
                accessible={true}
                accessibilityLabel={`Faculty ${item.name}`}
                accessibilityRole="text"
                accessibilityHint={`${item.department}, ${item.status}, ${item.experience} years experience`}
              >
                <Text style={[styles.facultyCell, { flex: 2 }]}>{item.name}</Text>
                <Text style={[styles.facultyCell, { flex: 1 }]}>{item.department.substring(0, 3)}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Permanent'
                      ? styles.statusPermanent
                      : item.status === 'Visiting'
                      ? styles.statusVisiting
                      : styles.statusOnLeave,
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
                <Text style={[styles.facultyCell, { flex: 0.7, textAlign: 'right' }]}>{item.experience}y</Text>
              </View>
            )}
          />

          {/* Pagination Info */}
          <View
            style={styles.paginationInfo}
            accessible={true}
            accessibilityLabel={`Showing ${startIndex + 1} to ${Math.min(
              startIndex + itemsPerPage,
              totalFilteredFaculty
            )} of ${totalFilteredFaculty} faculty members`}
          >
            <Text
              style={styles.paginationText}
              accessible={false}
              accessibilityLabel={`Showing ${startIndex + 1} to ${Math.min(
                startIndex + itemsPerPage,
                totalFilteredFaculty
              )} of ${totalFilteredFaculty} faculty members`}
            >
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalFilteredFaculty)} of {totalFilteredFaculty} faculty
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
                currentPage >= Math.ceil(totalFilteredFaculty / itemsPerPage) &&
                  styles.paginationButtonDisabled,
              ]}
              onPress={handleNextPage}
              disabled={currentPage >= Math.ceil(totalFilteredFaculty / itemsPerPage)}
              accessible={true}
              accessibilityLabel="Next Page"
              accessibilityRole="button"
              accessibilityState={{
                disabled:
                  currentPage >= Math.ceil(totalFilteredFaculty / itemsPerPage),
              }}
              accessibilityHint={
                currentPage >= Math.ceil(totalFilteredFaculty / itemsPerPage)
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

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
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
              currentRoute="FacultyManagement"
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
  profileButton: {
    padding: 8,
    borderRadius: 6,
    position: 'absolute',
    right: 20,
  },
  profileIcon: {
    fontSize: 24,
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
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
    marginBottom: 12,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0066cc',
  },
  facultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  facultyInfo: {
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
  facultyDetails: {
    flex: 1,
  },
  facultyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  facultyEmail: {
    fontSize: 12,
    color: '#999',
  },
  facultyId: {
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

  // Bulk Actions
  bulkActionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eef5',
  },
  bulkActionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d8e8',
  },
  bulkActionIcon: {
    fontSize: 18,
  },
  bulkActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#003d99',
    textAlign: 'center',
  },

  // Faculty Cell
  facultyCell: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  statusBadge: {
    flex: 1.3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPermanent: {
    backgroundColor: '#d4f0d4',
  },
  statusVisiting: {
    backgroundColor: '#fff4d4',
  },
  statusOnLeave: {
    backgroundColor: '#f0d4d4',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default FacultyManagement;
