import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';

const COLORS = {
  primary: '#1A56DB',
  primaryLight: '#EBF0FF',
  bg: '#F4F6FA',
  white: '#FFFFFF',
  dark: '#111827',
  gray600: '#4B5563',
  gray400: '#9CA3AF',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  green: '#059669',
  strategy: '#6D28D9',
  strategyBg: '#F5F3FF',
  operations: '#0891B2',
  operationsBg: '#ECFEFF',
  academic: '#1A56DB',
  academicBg: '#EBF0FF',
  finance: '#D97706',
  financeBg: '#FFFBEB',
  dot1: '#1A56DB',
  dot2: '#7C3AED',
  dot3: '#DC2626',
};

function Badge({ label }) {
  const map = {
    ACADEMIC: { bg: COLORS.academicBg, color: COLORS.academic },
    OPERATIONS: { bg: COLORS.operationsBg, color: COLORS.operations },
    FINANCE: { bg: COLORS.financeBg, color: COLORS.finance },
    STRATEGY: { bg: COLORS.strategyBg, color: COLORS.strategy },
  };
  const style = map[label] || { bg: COLORS.gray100, color: COLORS.gray600 };

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.badgeText, { color: style.color }]}>{label}</Text>
    </View>
  );
}

function DocumentRow({ icon, title, tag, date, author, size, iconBg, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.docRow}>
      <View style={[styles.docIcon, { backgroundColor: iconBg }]}>
        <Text style={styles.docIconText}>{icon}</Text>
      </View>
      <View style={styles.docInfo}>
        <View style={styles.docTitleRow}>
          <Text style={styles.docTitle} numberOfLines={2}>
            {title}
          </Text>
          <Badge label={tag} />
        </View>
        <View style={styles.docMetaRow}>
          <Text style={styles.docMeta}>📅 {date}</Text>
          <Text style={styles.docMeta}>👤 {author}</Text>
        </View>
        <Text style={styles.docSize}>💾 {size}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Pagination({ current, total, onPage, isMobile }) {
  const pages = isMobile
    ? [current - 1, current, current + 1].filter((page) => page > 0 && page <= total)
    : [1, 2, 3];

  return (
    <View style={[styles.paginationRow, isMobile && styles.paginationRowMobile]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPage(Math.max(1, current - 1))}
        style={[styles.pageArrow, isMobile && styles.pageArrowMobile]}
        disabled={current === 1}
      >
        <Text style={[styles.pageArrowText, current === 1 && styles.pageArrowTextDisabled]}>
          {isMobile ? '←' : '← Previous'}
        </Text>
      </TouchableOpacity>

      <View style={[styles.pageNumbers, isMobile && styles.pageNumbersMobile]}>
        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            activeOpacity={0.7}
            onPress={() => onPage(page)}
            style={[styles.pageNum, isMobile && styles.pageNumMobile, current === page && styles.pageNumActive]}
          >
            <Text style={[styles.pageNumText, current === page && styles.pageNumTextActive]}>{page}</Text>
          </TouchableOpacity>
        ))}
        {!isMobile && (
          <>
            <Text style={styles.pageEllipsis}>…</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => onPage(total)} style={styles.pageNum}>
              <Text style={styles.pageNumText}>{total}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPage(Math.min(total, current + 1))}
        style={[styles.pageArrow, isMobile && styles.pageArrowMobile]}
        disabled={current === total}
      >
        <Text style={[styles.pageArrowText, current === total && styles.pageArrowTextDisabled]}>
          {isMobile ? '→' : 'Next →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DirectorReport() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [category] = useState('All Categories');
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [showFilters, setShowFilters] = useState(false);
  const [activePage, setActivePage] = useState('list');

  const isMobile = screenWidth < 768;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const documents = [
    {
      icon: '📄',
      iconBg: COLORS.academicBg,
      title: 'Monthly Performance - October ...',
      tag: 'ACADEMIC',
      date: 'Oct 31, 2023',
      author: 'System Generated',
      size: '4.2 MB',
    },
    {
      icon: '👥',
      iconBg: '#EDE9FE',
      title: 'Attendance & Engagement Audit',
      tag: 'OPERATIONS',
      date: 'Nov 05, 2023',
      author: 'Registrar Office',
      size: '1.8 MB',
    },
    {
      icon: '💰',
      iconBg: COLORS.financeBg,
      title: 'Q3 Financial Expenditure Report',
      tag: 'FINANCE',
      date: 'Oct 28, 2023',
      author: 'CFO Thorne',
      size: '8.5 MB',
    },
    {
      icon: '📈',
      iconBg: COLORS.strategyBg,
      title: 'Strategic Growth & Expansion 2...',
      tag: 'STRATEGY',
      date: 'Nov 01, 2023',
      author: 'Board of Dir.',
      size: '12.4 MB',
    },
  ];

  const sectionTabs = ['all', 'archived'];
  const visibleDocuments = activeTab === 'archived' ? documents.slice(2) : documents.slice(0, 3);
  const visibleCount = activeTab === 'archived' ? 'Showing archived reports' : 'Showing live reports';

  const detailPages = {
    archive: {
      tag: 'Repository',
      title: 'Reports Repository',
      desc: 'Search, review, and export the report library from one clean view.',
      bullets: ['Access the full document archive.', 'Review live and archived report groups.', 'Open individual report details from the list.'],
    },
    monthly: {
      tag: 'Academic',
      title: 'Monthly Performance',
      desc: 'A focused page for the monthly performance report and its key observations.',
      bullets: ['Review the monthly performance summary.', 'Check academic highlights and comparisons.', 'Use this page for deeper monthly review.'],
    },
    attendance: {
      tag: 'Operations',
      title: 'Attendance & Engagement',
      desc: 'A dedicated view for attendance, engagement, and operational follow-up.',
      bullets: ['Review attendance trends and engagement notes.', 'Track operational follow-up items.', 'Open this page for more context.'],
    },
    financial: {
      tag: 'Finance',
      title: 'Q3 Financial Expenditure',
      desc: 'A dedicated page for financial spend, categories, and review notes.',
      bullets: ['Review the expenditure breakdown.', 'Check finance status and report context.', 'Use this page for finance drill-downs.'],
    },
    strategy: {
      tag: 'Strategy',
      title: 'Strategic Growth',
      desc: 'A clean next page for strategy and growth reporting.',
      bullets: ['Review growth and planning notes.', 'Check the strategy report details.', 'Use this page for board-ready context.'],
    },
    document: {
      tag: 'Document',
      title: 'Document Details',
      desc: 'A focused view for the selected report with a back button and clean summary.',
      bullets: ['Open the selected report in a dedicated page.', 'Review the file metadata and context.', 'Use this space for future document actions.'],
    },
    export: {
      tag: 'Export',
      title: 'Bulk Export',
      desc: 'Clean export controls for downloading selected reports.',
      bullets: ['Export the archive as ZIP.', 'Export the current library to Excel.', 'Keep the export actions grouped in one place.'],
    },
  };

  if (activePage !== 'list') {
    const page = detailPages[activePage] || detailPages.archive;

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={styles.appContainer}>
          <View style={styles.main}>
            <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
              <View style={[styles.searchBox, isMobile && styles.searchBoxMobile]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder={isMobile ? 'Search...' : 'Search reports, metrics, or archives...'}
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.downloadBtn}>
                <Text style={styles.downloadBtnText}>DOWNLOAD KPI</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setActivePage('list')} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>

              <View style={styles.detailHeroCard}>
                <Text style={styles.detailTag}>{page.tag}</Text>
                <Text style={styles.detailTitle}>{page.title}</Text>
                <Text style={styles.detailDesc}>{page.desc}</Text>
                <View style={styles.detailBullets}>
                  {page.bullets.map((item) => (
                    <View key={item} style={styles.detailBulletRow}>
                      <View style={styles.detailBulletDot} />
                      <Text style={styles.detailBulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {['document', 'monthly', 'attendance', 'financial', 'strategy'].includes(activePage) && (
                <View style={styles.detailCard}>
                  <Text style={styles.detailSectionTitle}>Document Summary</Text>
                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryMiniCard}>
                      <Text style={styles.summaryMiniLabel}>Status</Text>
                      <Text style={styles.summaryMiniValue}>Ready</Text>
                    </View>
                    <View style={styles.summaryMiniCard}>
                      <Text style={styles.summaryMiniLabel}>Type</Text>
                      <Text style={styles.summaryMiniValue}>PDF</Text>
                    </View>
                    <View style={styles.summaryMiniCard}>
                      <Text style={styles.summaryMiniLabel}>Access</Text>
                      <Text style={styles.summaryMiniValue}>Internal</Text>
                    </View>
                  </View>
                </View>
              )}

              {activePage === 'export' && (
                <View style={styles.exportCard}>
                  <Text style={styles.exportCardTitle}>Export Actions</Text>
                  <View style={styles.exportButtonsRow}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.exportBtnOutline}>
                      <Text style={styles.exportBtnOutlineText}>📁 EXPORT ARCHIVE (.ZIP)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.exportBtnFill}>
                      <Text style={styles.exportBtnFillText}>📊 EXPORT TO EXCEL (.XLSX)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.appContainer}>
        <View style={styles.main}>
          <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
            <View style={[styles.searchBox, isMobile && styles.searchBoxMobile]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder={isMobile ? 'Search...' : 'Search reports, metrics, or archives...'}
                placeholderTextColor={COLORS.gray400}
              />
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.downloadBtn}>
              <Text style={styles.downloadBtnText}>DOWNLOAD KPI</Text>
            </TouchableOpacity>

            {isMobile && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowFilters((value) => !value)}
                style={styles.filterToggleBtn}
              >
                <Text style={styles.filterToggleBtnText}>⚙️</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={[styles.bodyRow, isMobile && styles.bodyRowMobile]}>
              {(showFilters || !isMobile) && (
                <View style={[styles.leftPanel, isMobile && styles.leftPanelMobile]}>
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryCardHeader}>
                      <View style={styles.latestTag}>
                        <Text style={styles.latestTagText}>LATEST GENERATION</Text>
                      </View>
                      <Text style={styles.sparkle}>✦</Text>
                    </View>
                    <Text style={styles.summaryTitle}>Management{'\n'}Summary Q3</Text>
                    <View style={styles.efficiencyRow}>
                      <Text style={styles.efficiencyLabel}>Efficiency Rating</Text>
                      <Text style={styles.efficiencyValue}>+12.4%</Text>
                    </View>
                    <View style={styles.progressBg}>
                      <View style={styles.progressFill} />
                    </View>
                    <Text style={styles.summaryDesc}>
                      Generated 14 hours ago. Strategic growth shows significant momentum in STEM departments.
                    </Text>
                    <TouchableOpacity activeOpacity={0.85} style={styles.quickPreviewBtn}>
                      <Text style={styles.quickPreviewText}>👁 QUICK PREVIEW</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.refinePanel}>
                    <Text style={styles.refinePanelTitle}>REFINE REPOSITORY</Text>
                    <Text style={styles.filterLabel}>REPORT CATEGORY</Text>
                    <TouchableOpacity activeOpacity={0.7} style={styles.dropdown}>
                      <Text style={styles.dropdownText}>{category}</Text>
                      <Text style={styles.dropdownArrow}>▾</Text>
                    </TouchableOpacity>

                    <Text style={[styles.filterLabel, { marginTop: 16 }]}>DATE RANGE</Text>
                    <View style={styles.dateRow}>
                      <TouchableOpacity activeOpacity={0.7} style={styles.dateInput}>
                        <Text style={styles.dateInputText}>mm/dd/yy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.7} style={styles.dateInput}>
                        <Text style={styles.dateInputText}>mm/dd/yy</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.dotLegend}>
                      {[
                        { color: COLORS.dot1, label: 'Downloadable (PDF)', count: '124' },
                        { color: COLORS.dot2, label: 'Dataset (Excel)', count: '48' },
                        { color: COLORS.dot3, label: 'Confidential Only', count: '12' },
                      ].map((item, index) => (
                        <TouchableOpacity key={index} activeOpacity={0.7} style={styles.dotRow}>
                          <View style={[styles.dot, { backgroundColor: item.color }]} />
                          <Text style={styles.dotLabel}>{item.label}</Text>
                          <Text style={styles.dotCount}>{item.count}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
                <View style={styles.docLibHeader}>
                  <View>
                    <Text style={styles.docLibTitle}>Document Library</Text>
                    <Text style={styles.docLibCount}>{visibleCount}</Text>
                  </View>
                </View>

                <View style={styles.pillGroup}>
                  {sectionTabs.map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      activeOpacity={0.8}
                      onPress={() => setActiveTab(tab)}
                      style={[styles.pillBtn, activeTab === tab && styles.pillBtnActive]}
                    >
                      <Text style={[styles.pillBtnText, activeTab === tab && styles.pillBtnTextActive]}>
                        {tab === 'all' ? 'All Files' : 'Archived'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {visibleDocuments.map((doc, index) => {
                  const pageMap = {
                    'Monthly Performance - October ...': 'monthly',
                    'Attendance & Engagement Audit': 'attendance',
                    'Q3 Financial Expenditure Report': 'financial',
                    'Strategic Growth & Expansion 2...': 'strategy',
                  };

                  return (
                    <DocumentRow
                      key={`${doc.title}-${index}`}
                      {...doc}
                      onPress={() => setActivePage(pageMap[doc.title] || 'document')}
                    />
                  );
                })}

                <Pagination
                  current={currentPage}
                  total={activeTab === 'archived' ? 9 : 5}
                  onPage={setCurrentPage}
                  isMobile={isMobile}
                />
              </View>
            </View>

            <View style={styles.exportBanner}>
              <View style={styles.exportBannerLeft}>
                <Text style={styles.exportBannerTitle}>Bulk Export Available</Text>
                <Text style={styles.exportBannerSub}>
                  Download all selected reports in a single compressed archive.
                </Text>
              </View>
              <View style={styles.exportBtns}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setActivePage('export')} style={styles.exportBtnOutline}>
                  <Text style={styles.exportBtnOutlineText}>📁 EXPORT ARCHIVE (.ZIP)</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setActivePage('export')} style={styles.exportBtnFill}>
                  <Text style={styles.exportBtnFillText}>📊 EXPORT TO EXCEL (.XLSX)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  main: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  topBarMobile: {
    paddingHorizontal: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.gray100,
  },
  searchBoxMobile: {
    minWidth: 0,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.dark,
  },
  downloadBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.dark,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  filterToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleBtnText: {
    fontSize: 18,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  pageHeaderCard: {
    display: 'none',
  },
  pageHeaderCopy: {
    gap: 3,
    marginBottom: 12,
  },
  pageHeaderSub: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  pageHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
  },
  pageHeaderBody: {
    fontSize: 12,
    color: COLORS.gray600,
    lineHeight: 18,
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 999,
    backgroundColor: COLORS.gray100,
    alignSelf: 'flex-start',
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillBtnActive: {
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
      },
      android: { elevation: 2 },
    }),
  },
  pillBtnText: {
    fontSize: 12,
    color: COLORS.gray400,
    fontWeight: '600',
  },
  pillBtnTextActive: {
    color: COLORS.dark,
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  bodyRowMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  leftPanel: {
    width: 220,
    gap: 14,
  },
  leftPanelMobile: {
    width: '100%',
  },
  rightPanel: {
    flex: 1,
  },
  rightPanelMobile: {
    width: '100%',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  summaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  latestTag: {
    backgroundColor: COLORS.gray100,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  latestTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray600,
    letterSpacing: 0.5,
  },
  sparkle: {
    fontSize: 18,
    color: COLORS.primary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    lineHeight: 24,
    marginBottom: 12,
  },
  efficiencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  efficiencyLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  efficiencyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.green,
  },
  progressBg: {
    height: 5,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    width: '72%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  summaryDesc: {
    fontSize: 12,
    color: COLORS.gray600,
    lineHeight: 18,
    marginBottom: 14,
  },
  quickPreviewBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickPreviewText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  refinePanel: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  refinePanelTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray400,
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray600,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: 13,
    color: COLORS.gray600,
  },
  dropdownArrow: {
    color: COLORS.gray400,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: 11,
    color: COLORS.gray400,
  },
  dotLegend: {
    marginTop: 18,
    gap: 10,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  dotLabel: {
    flex: 1,
    fontSize: 12,
    color: COLORS.gray600,
  },
  dotCount: {
    fontSize: 12,
    color: COLORS.gray400,
    fontWeight: '600',
  },
  docLibHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  docLibTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
  },
  docLibCount: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    gap: 14,
    minHeight: 90,
  },
  docIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  docIconText: {
    fontSize: 24,
  },
  docInfo: {
    flex: 1,
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
    lineHeight: 20,
  },
  docMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  docSize: {
    fontSize: 12,
    color: COLORS.gray400,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  paginationRowMobile: {
    padding: 12,
    gap: 8,
  },
  pageArrow: {
    paddingHorizontal: 4,
  },
  pageArrowMobile: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
  },
  pageArrowText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  pageArrowTextDisabled: {
    color: COLORS.gray300,
    opacity: 0.5,
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageNumbersMobile: {
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  pageNum: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
  },
  pageNumMobile: {
    width: 36,
    height: 36,
  },
  pageNumActive: {
    backgroundColor: COLORS.primary,
  },
  pageNumText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: '600',
  },
  pageNumTextActive: {
    color: COLORS.white,
  },
  pageEllipsis: {
    color: COLORS.gray400,
    marginHorizontal: 4,
  },
  exportBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  exportBannerLeft: {
    flex: 1,
    minWidth: 160,
  },
  exportBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  exportBannerSub: {
    fontSize: 12,
    color: COLORS.gray600,
    lineHeight: 18,
  },
  exportBtns: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  exportBtnOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 140,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  exportBtnOutlineText: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: '600',
  },
  exportBtnFill: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  exportBtnFillText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  detailHeroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  detailTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: COLORS.primary,
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: 6,
  },
  detailDesc: {
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 19,
  },
  detailBullets: {
    marginTop: 14,
    gap: 10,
  },
  detailBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailBulletDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  detailBulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.dark,
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  summaryMiniCard: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 92,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
  },
  summaryMiniLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryMiniValue: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  exportCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  exportCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 12,
  },
  exportButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
});