import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  primary:       '#1A56DB',
  primaryLight:  '#EBF0FF',
  primaryDark:   '#1239A6',
  accent:        '#F59E0B',
  danger:        '#EF4444',
  dangerLight:   '#FEE2E2',
  success:       '#10B981',
  successLight:  '#D1FAE5',
  warning:       '#F59E0B',
  warningLight:  '#FEF3C7',
  pending:       '#6B7280',
  pendingLight:  '#F3F4F6',
  white:         '#FFFFFF',
  background:    '#F8FAFC',
  border:        '#E5E7EB',
  textPrimary:   '#111827',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',
  mathColor:     '#EF4444',
  scienceColor:  '#10B981',
  englishColor:  '#8B5CF6',
  historyColor:  '#F59E0B',
};

// ─── Navigation ───────────────────────────────────────────────────────────────
const SCREENS = {
  HOMEWORK: 'Homework',
  UPLOAD:   'Upload',
  DETAIL:   'Detail',
  HISTORY:  'History',
  LIBRARY:  'Library',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
// Calculus Problem Set #4 removed
const ASSIGNMENTS = [
  {
    id: '2',
    subject: 'SCIENCE',
    title: 'Cellular Mitosis Lab Report',
    description:
      'Analyze the microscopic images provided and document the phases of mitosis observed in the onion root tip cells.',
    due: 'Oct 30, 2023',
    status: 'PENDING',
    timeLeft: '3 Days Left',
    color: COLORS.scienceColor,
    icon: '🔬',
  },
  {
    id: '3',
    subject: 'ENGLISH LITERATURE',
    title: 'Gatsby: The American Dream Essay',
    description:
      "Write a 1500-word analysis on how F. Scott Fitzgerald portrays the corruption of the American Dream through Jay Gatsby's pursuit of Daisy.",
    due: 'Nov 02, 2023',
    status: 'PENDING',
    color: COLORS.englishColor,
    icon: '📖',
  },
  {
    id: '4',
    subject: 'HISTORY',
    title: 'World War II Timeline',
    description:
      'Create a detailed timeline of World War II events from 1939 to 1945 covering major battles and treaties.',
    due: 'Nov 05, 2023',
    status: 'PENDING',
    color: COLORS.historyColor,
    icon: '📜',
  },
];

// due field added to each submission
const SUBMISSIONS = [
  { id: '1', title: 'World History Quiz',      date: 'Oct 22', due: 'Oct 25, 2023', grade: 'A+', status: 'graded', statusLabel: 'Graded: A+' },
  { id: '2', title: 'Computer Science Proj 1', date: 'Oct 21', due: 'Oct 24, 2023',              status: 'review', statusLabel: 'In Review'  },
  { id: '3', title: 'Physical Education Log',  date: 'Oct 18', due: 'Oct 20, 2023', grade: 'B',  status: 'graded', statusLabel: 'Graded: B'  },
  { id: '4', title: 'Chemistry Lab Report',    date: 'Oct 15', due: 'Oct 18, 2023', grade: 'A-', status: 'graded', statusLabel: 'Graded: A-' },
  { id: '5', title: 'Art Portfolio Review',    date: 'Oct 12', due: 'Oct 15, 2023',              status: 'review', statusLabel: 'In Review'  },
  { id: '6', title: 'Math Mid-Term Exam',      date: 'Oct 10', due: 'Oct 12, 2023', grade: 'B+', status: 'graded', statusLabel: 'Graded: B+' },
  { id: '7', title: 'English Literature Quiz', date: 'Oct 07', due: 'Oct 09, 2023', grade: 'A',  status: 'graded', statusLabel: 'Graded: A'  },
];

const LIBRARY_NOTES = [
  { id: '1', subject: 'Mathematics', title: 'Differential Equations – Full Notes', size: '2.4 MB', type: 'PDF', color: COLORS.mathColor    },
  { id: '2', subject: 'Science',     title: 'Cell Biology & Mitosis Guide',        size: '1.8 MB', type: 'PDF', color: COLORS.scienceColor  },
  { id: '3', subject: 'English',     title: 'The Great Gatsby – Study Guide',      size: '1.2 MB', type: 'PDF', color: COLORS.englishColor  },
  { id: '4', subject: 'History',     title: 'WWII – Comprehensive Summary',        size: '3.1 MB', type: 'PDF', color: COLORS.historyColor  },
  { id: '5', subject: 'Mathematics', title: 'Calculus – Practice Problem Sets',    size: '4.0 MB', type: 'PDF', color: COLORS.mathColor    },
  { id: '6', subject: 'Science',     title: 'Physics – Wave Mechanics Notes',      size: '2.7 MB', type: 'PDF', color: COLORS.scienceColor  },
];

const SUBJECTS = ['All Subjects', 'Mathematics', 'Science', 'English', 'History'];

// ─── Reusable: Badge ──────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const config = {
    OVERDUE: { bg: COLORS.dangerLight,  text: COLORS.danger,  label: 'OVERDUE' },
    PENDING: { bg: COLORS.pendingLight, text: COLORS.pending, label: 'PENDING' },
    GRADED:  { bg: COLORS.successLight, text: COLORS.success, label: 'GRADED'  },
  }[status] || { bg: COLORS.pendingLight, text: COLORS.pending, label: status };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

// ─── Reusable: SubjectIcon ────────────────────────────────────────────────────
const SubjectIcon = ({ icon, color }) => (
  <View style={[styles.subjectIcon, { backgroundColor: color + '20' }]}>
    <Text style={styles.subjectIconText}>{icon}</Text>
  </View>
);

// ─── Reusable: SubmissionItem ─────────────────────────────────────────────────
// Clicking the submission date toggles the due date pill below it
const SubmissionItem = ({ item, onView }) => {
  const [showDue, setShowDue] = useState(false);
  const isGraded = item.status === 'graded';

  return (
    <View style={styles.submissionItem}>
      <View style={[styles.submissionCheck, { backgroundColor: COLORS.successLight }]}>
        <Text style={{ color: COLORS.success, fontSize: 14 }}>✓</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.submissionTitle}>{item.title}</Text>

        {/* Tappable submission date — reveals due date below */}
        <TouchableOpacity onPress={() => setShowDue(prev => !prev)} activeOpacity={0.7}>
          <Text style={[styles.submissionDate, showDue && { color: COLORS.primary }]}>
            Submitted {item.date}
          </Text>
        </TouchableOpacity>

        {/* Due date pill — visible only after tapping the date */}
        {showDue && (
          <View style={styles.dueDatePill}>
            <Text style={styles.dueDateText}>📅 Due date: {item.due}</Text>
          </View>
        )}

        <View style={styles.submissionFooter}>
          <Text style={[styles.submissionStatus, { color: isGraded ? COLORS.success : COLORS.warning }]}>
            {item.statusLabel}
          </Text>
          <TouchableOpacity onPress={onView} activeOpacity={0.7}>
            <Text style={styles.submissionView}>{isGraded ? 'Feedback' : 'View'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Screen: Homework (Main) ──────────────────────────────────────────────────
const HomeworkScreen = ({ onNavigate }) => {
  const [activeSubject, setActiveSubject] = useState('All Subjects');

  const filtered = ASSIGNMENTS.filter((a) => {
    if (activeSubject === 'All Subjects') return true;
    return a.subject.toLowerCase().includes(activeSubject.toLowerCase());
  });

  return (
    <ScrollView
      style={styles.mainContent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbMuted}>Dashboard  </Text>
        <Text style={styles.breadcrumbActive}>Homework</Text>
      </View>

      {/* Page Header */}
      <Text style={styles.pageTitle}>Homework & Assignments</Text>
      <View style={styles.headerSubRow}>
        <View style={styles.dot} />
        <Text style={styles.headerSubText}>
          2 assignments due this week for{' '}
          <Text style={styles.studentName}>Ethan Jenkins</Text>
        </Text>
      </View>

      {/* Subject Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {SUBJECTS.map((s) => {
          const active = activeSubject === s;
          return (
            <TouchableOpacity
              key={s}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setActiveSubject(s)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Two-column on tablet, single-column on mobile */}
      <View style={isTablet ? styles.tabletRow : null}>

        {/* Left / Main Column: Assignment Cards */}
        <View style={isTablet ? styles.tabletLeft : null}>
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No assignments for this subject.</Text>
            </View>
          ) : (
            filtered.map((item) => (
              <View key={item.id} style={styles.assignmentCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.cardLeft}>
                    <SubjectIcon icon={item.icon} color={item.color} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={[styles.cardSubject, { color: item.color }]}>{item.subject}</Text>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </View>
                  </View>
                  <Badge status={item.status} />
                </View>

                <Text style={styles.cardDesc}>{item.description}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.cardMeta}>
                    <Text style={styles.metaText}>📅 Due: {item.due}</Text>
                    {item.timeLeft && <Text style={styles.metaText}>  ⏱ {item.timeLeft}</Text>}
                    {item.files   && <Text style={styles.metaText}>  📎 {item.files} Files</Text>}
                  </View>
                  <TouchableOpacity
                    style={styles.viewDetailsBtn}
                    onPress={() => onNavigate(SCREENS.DETAIL, item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewDetailsBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Right Column: Recent Submissions + Study Support */}
        <View style={isTablet ? styles.tabletRight : null}>

          {/* Recent Submissions */}
          <View style={styles.recentCard}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Submissions</Text>
              <TouchableOpacity onPress={() => onNavigate(SCREENS.HISTORY)} activeOpacity={0.7}>
                <Text style={styles.historyIcon}>🕐</Text>
              </TouchableOpacity>
            </View>

            {SUBMISSIONS.slice(0, 3).map((s, idx) => (
              <View key={s.id}>
                <SubmissionItem item={s} onView={() => onNavigate(SCREENS.HISTORY)} />
                {idx < 2 && <View style={styles.itemDivider} />}
              </View>
            ))}

            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => onNavigate(SCREENS.HISTORY)}
              activeOpacity={0.8}
            >
              <Text style={styles.seeAllText}>SEE ALL HISTORY</Text>
            </TouchableOpacity>
          </View>

          {/* Study Support */}
          <View style={styles.studySupportCard}>
            <Text style={styles.studySupportTitle}>Study Support</Text>
            <Text style={styles.studySupportSub}>
              Access tutors and extra resources for this week's assignments.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => onNavigate(SCREENS.LIBRARY)}
              activeOpacity={0.8}
            >
              <Text style={styles.exploreBtnText}>Explore Library</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScrollView>
  );
};

// ─── Screen: Upload ───────────────────────────────────────────────────────────
// Upload dropzone / file picker section removed — shows summary + submit only
const UploadScreen = ({ assignment, onBack }) => (
  <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 40 }}>
    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
      <Text style={styles.backBtnText}>← Back to Homework</Text>
    </TouchableOpacity>

    <Text style={styles.pageTitle}>Upload Assignment</Text>
    <Text style={[styles.headerSubText, { marginBottom: 20 }]}>{assignment?.title}</Text>

    {/* Assignment Summary */}
    <View style={styles.uploadSummaryCard}>
      <Badge status={assignment?.status || 'PENDING'} />
      <Text style={styles.uploadCardTitle}>{assignment?.title}</Text>
      <Text style={styles.cardDesc}>{assignment?.description}</Text>
      <Text style={styles.metaText}>📅 Due: {assignment?.due}</Text>
    </View>

    <TouchableOpacity
      style={styles.submitBtn}
      onPress={() => Alert.alert('Submitted!', 'Your assignment has been submitted successfully.')}
      activeOpacity={0.8}
    >
      <Text style={styles.submitBtnText}>Submit Assignment</Text>
    </TouchableOpacity>
  </ScrollView>
);

// ─── Screen: Assignment Detail ────────────────────────────────────────────────
const DetailScreen = ({ assignment, onBack }) => (
  <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 40 }}>
    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
      <Text style={styles.backBtnText}>← Back to Homework</Text>
    </TouchableOpacity>

    <Text style={styles.pageTitle}>Assignment Details</Text>

    <View style={styles.detailCard}>
      <View style={styles.cardTopRow}>
        <SubjectIcon icon={assignment?.icon || '📚'} color={assignment?.color || COLORS.primary} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[styles.cardSubject, { color: assignment?.color }]}>{assignment?.subject}</Text>
          <Text style={styles.cardTitle}>{assignment?.title}</Text>
        </View>
        <Badge status={assignment?.status} />
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Description</Text>
      <Text style={styles.cardDesc}>{assignment?.description}</Text>

      <View style={styles.divider} />

      <View style={styles.detailMeta}>
        <View style={styles.detailMetaItem}>
          <Text style={styles.metaLabel}>Due Date</Text>
          <Text style={styles.metaValue}>📅 {assignment?.due}</Text>
        </View>
        {assignment?.timeLeft && (
          <View style={styles.detailMetaItem}>
            <Text style={styles.metaLabel}>Time Remaining</Text>
            <Text style={styles.metaValue}>⏱ {assignment?.timeLeft}</Text>
          </View>
        )}
        {assignment?.files && (
          <View style={styles.detailMetaItem}>
            <Text style={styles.metaLabel}>Attachments</Text>
            <Text style={styles.metaValue}>📎 {assignment?.files} Files</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Instructions</Text>
      <Text style={styles.cardDesc}>
        {'• Read all instructions carefully before starting.\n'}
        {'• Show all working/derivations for full marks.\n'}
        {'• Submit as a PDF or scanned clear copy.\n'}
        {'• Late submissions will incur a 10% penalty per day.'}
      </Text>
    </View>

  </ScrollView>
);

// ─── Screen: History ─────────────────────────────────────────────────────────
const HistoryScreen = ({ onBack }) => (
  <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 40 }}>
    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
      <Text style={styles.backBtnText}>← Back to Homework</Text>
    </TouchableOpacity>

    <Text style={styles.pageTitle}>Submission History</Text>
    <Text style={[styles.headerSubText, { marginBottom: 20 }]}>Your complete homework submission record</Text>

    <View style={styles.historyCard}>
      {SUBMISSIONS.map((s, idx) => (
        <View key={s.id}>
          <SubmissionItem item={s} onView={() => Alert.alert('Submission', s.title)} />
          {idx < SUBMISSIONS.length - 1 && <View style={styles.itemDivider} />}
        </View>
      ))}
    </View>
  </ScrollView>
);

// ─── Screen: Study Library ────────────────────────────────────────────────────
const LibraryScreen = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Mathematics', 'Science', 'English', 'History'];

  const filtered = LIBRARY_NOTES.filter(
    (n) => activeFilter === 'All' || n.subject === activeFilter,
  );

  return (
    <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backBtnText}>← Back to Homework</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Study Library</Text>
      <Text style={[styles.headerSubText, { marginBottom: 20 }]}>
        Download notes and resources for your assignments
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {filters.map((f) => {
          const active = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filtered.map((note) => (
        <View key={note.id} style={styles.libraryCard}>
          <View style={[styles.libraryIcon, { backgroundColor: note.color + '20' }]}>
            <Text style={{ fontSize: 22 }}>📄</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.cardSubject, { color: note.color }]}>{note.subject}</Text>
            <Text style={styles.cardTitle}>{note.title}</Text>
            <Text style={styles.metaText}>{note.type}  •  {note.size}</Text>
          </View>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => Alert.alert('Download', `Downloading "${note.title}" (${note.size})…`)}
            activeOpacity={0.8}
          >
            <Text style={styles.downloadBtnText}>⬇ Download</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function Homework() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.HOMEWORK);
  const [selectedItem, setSelectedItem]   = useState(null);

  const navigate = (screen, item = null) => {
    setSelectedItem(item);
    setCurrentScreen(screen);
  };

  const goBack = () => navigate(SCREENS.HOMEWORK);

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.HOMEWORK:
        return <HomeworkScreen onNavigate={navigate} />;
      case SCREENS.UPLOAD:
        return <UploadScreen assignment={selectedItem} onBack={goBack} />;
      case SCREENS.DETAIL:
        return (
          <DetailScreen
            assignment={selectedItem}
            onBack={goBack}
          />
        );
      case SCREENS.HISTORY:
        return <HistoryScreen onBack={goBack} />;
      case SCREENS.LIBRARY:
        return <LibraryScreen onBack={goBack} />;
      default:
        return <HomeworkScreen onNavigate={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {renderScreen()}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Main Content
  mainContent: {
    flex: 1,
    paddingHorizontal: isTablet ? 32 : 16,
    paddingTop: 20,
    backgroundColor: COLORS.background,
  },

  // Tablet Two-Column Layout
  tabletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  tabletLeft: {
    flex: 1,
  },
  tabletRight: {
    width: 280,
  },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  breadcrumbMuted: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  breadcrumbActive: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Page Header
  pageTitle: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  headerSubText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  studentName: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Subject Filter Tabs
  tabsRow: {
    marginBottom: 20,
    flexGrow: 0,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    backgroundColor: COLORS.white,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  tabBtnTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },

  // Assignment Card
  assignmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  subjectIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectIconText: {
    fontSize: 20,
  },
  cardSubject: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Buttons
  viewDetailsBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  viewDetailsBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },

  // Badge
  badge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Empty State
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
  },

  // Recent Submissions
  recentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  historyIcon: {
    fontSize: 20,
  },
  submissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 12,
  },
  submissionCheck: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submissionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  submissionDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    textDecorationLine: 'underline',
  },

  // Due date pill — shown on submission date tap
  dueDatePill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  dueDateText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },

  submissionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  submissionStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  submissionView: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  seeAllBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },

  // Study Support
  studySupportCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 22,
    marginBottom: 16,
  },
  studySupportTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  studySupportSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    marginBottom: 18,
    lineHeight: 19,
  },
  exploreBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  exploreBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },

  // Back Button
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Upload Screen
  uploadSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },

  // Detail Screen
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  detailMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  detailMetaItem: {
    minWidth: 120,
  },
  metaLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  // History Screen
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  // Library Screen
  libraryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  libraryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  downloadBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});