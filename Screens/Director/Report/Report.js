import React, { useState, useEffect } from 'react';
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

// ─── Icons (inline SVG-style via unicode / emoji fallbacks) ───────────────────
// In a real project, replace these with react-native-vector-icons or @expo/vector-icons

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
  greenBg: '#ECFDF5',
  orange: '#D97706',
  orangeBg: '#FFFBEB',
  strategy: '#6D28D9',
  strategyBg: '#F5F3FF',
  operations: '#0891B2',
  operationsBg: '#ECFEFF',
  academic: '#1A56DB',
  academicBg: '#EBF0FF',
  finance: '#D97706',
  financeBg: '#FFFBEB',
  sidebarActive: '#1A56DB',
  navUnderline: '#1A56DB',
  dot1: '#1A56DB',
  dot2: '#7C3AED',
  dot3: '#DC2626',
};

// Using central DirectorMenu for consistency across Director screens

// ─── Tag Badge ────────────────────────────────────────────────────────────────
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

// ─── Document Row ─────────────────────────────────────────────────────────────
function DocumentRow({ icon, title, tag, date, author, size, iconBg }) {
  return (
    <TouchableOpacity activeOpacity={0.75} style={styles.docRow}>
      <View style={[styles.docIcon, { backgroundColor: iconBg }]}>
        <Text style={styles.docIconText}>{icon}</Text>
      </View>
      <View style={styles.docInfo}>
        <View style={styles.docTitleRow}>
          <Text style={styles.docTitle} numberOfLines={2}>{title}</Text>
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

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, total, onPage, isMobile }) {
  const pages = isMobile ? [current - 1, current, current + 1].filter(p => p > 0 && p <= total) : [1, 2, 3];
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
        {pages.map((p) => (
          <TouchableOpacity
            key={p}
            activeOpacity={0.7}
            onPress={() => onPage(p)}
            style={[styles.pageNum, isMobile && styles.pageNumMobile, current === p && styles.pageNumActive]}
          >
            <Text style={[styles.pageNumText, current === p && styles.pageNumTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
        {!isMobile && (
          <>
            <Text style={styles.pageEllipsis}>…</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => onPage(12)} style={styles.pageNum}>
              <Text style={styles.pageNumText}>12</Text>
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DirectorReport() {
  const [activeNav, setActiveNav] = useState('reports');
  const [activeTab, setActiveTab] = useState('all');
  const [activeTopNav, setActiveTopNav] = useState('strategy');
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('All Categories');
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [showFilters, setShowFilters] = useState(false);

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

  const topNavItems = ['DASHBOARD', 'ANALYTICS', 'STRATEGY'];

  // ─── Screen Components ────────────────────────────────────────────────────────

  // Dashboard Report Screen
  const DashboardReportScreen = () => (
    <>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageHeaderSub}>PERFORMANCE OVERVIEW</Text>
          <Text style={styles.pageHeaderTitle}>Dashboard Reports</Text>
        </View>
        <View style={styles.tabToggle}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('all')}
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              All Files
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('archived')}
            style={[styles.tabBtn, activeTab === 'archived' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'archived' && styles.tabBtnTextActive]}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.bodyRow, isMobile && styles.bodyRowMobile]}>
        <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
          <View style={styles.docLibHeader}>
            <Text style={styles.docLibTitle}>Dashboard Documents</Text>
            <Text style={styles.docLibCount}>Showing 3 of 47 Reports</Text>
          </View>
          {documents.slice(0, 3).map((doc, i) => (
            <DocumentRow key={i} {...doc} />
          ))}
          <Pagination
            current={currentPage}
            total={5}
            onPage={setCurrentPage}
            isMobile={isMobile}
          />
        </View>
      </View>
    </>
  );

  // Analytics Report Screen
  const AnalyticsReportScreen = () => (
    <>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageHeaderSub}>DATA ANALYSIS</Text>
          <Text style={styles.pageHeaderTitle}>Analytics Reports</Text>
        </View>
        <View style={styles.tabToggle}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('all')}
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              All Files
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('archived')}
            style={[styles.tabBtn, activeTab === 'archived' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'archived' && styles.tabBtnTextActive]}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.bodyRow, isMobile && styles.bodyRowMobile]}>
        <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
          <View style={styles.docLibHeader}>
            <Text style={styles.docLibTitle}>Analytics Documents</Text>
            <Text style={styles.docLibCount}>Showing 4 of 92 Reports</Text>
          </View>
          {documents.map((doc, i) => (
            <DocumentRow key={i} {...doc} />
          ))}
          <Pagination
            current={currentPage}
            total={23}
            onPage={setCurrentPage}
            isMobile={isMobile}
          />
        </View>
      </View>
    </>
  );

  // Strategy Report Screen
  const StrategyReportScreen = () => (
    <>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageHeaderSub}>STRATEGIC PLANNING</Text>
          <Text style={styles.pageHeaderTitle}>Strategy Reports</Text>
        </View>
        <View style={styles.tabToggle}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('all')}
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              All Files
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('archived')}
            style={[styles.tabBtn, activeTab === 'archived' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'archived' && styles.tabBtnTextActive]}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.bodyRow, isMobile && styles.bodyRowMobile]}>
        <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
          <View style={styles.docLibHeader}>
            <Text style={styles.docLibTitle}>Strategy Documents</Text>
            <Text style={styles.docLibCount}>Showing 2 of 34 Reports</Text>
          </View>
          {documents.slice(2, 4).map((doc, i) => (
            <DocumentRow key={i} {...doc} />
          ))}
          <Pagination
            current={currentPage}
            total={9}
            onPage={setCurrentPage}
            isMobile={isMobile}
          />
        </View>
      </View>
    </>
  );

  // Institutional Archive Screen (Default)
  const InstitutionalArchiveScreen = () => (
    <>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageHeaderSub}>INSTITUTIONAL ARCHIVE</Text>
          <Text style={styles.pageHeaderTitle}>Reports Repository</Text>
        </View>
        <View style={styles.tabToggle}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('all')}
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              All Files
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('archived')}
            style={[styles.tabBtn, activeTab === 'archived' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'archived' && styles.tabBtnTextActive]}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
                <Text style={styles.quickPreviewText}>👁  QUICK PREVIEW</Text>
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
                ].map((d, i) => (
                  <TouchableOpacity key={i} activeOpacity={0.7} style={styles.dotRow}>
                    <View style={[styles.dot, { backgroundColor: d.color }]} />
                    <Text style={styles.dotLabel}>{d.label}</Text>
                    <Text style={styles.dotCount}>{d.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
        <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
          <View style={styles.docLibHeader}>
            <Text style={styles.docLibTitle}>Document Library</Text>
            <Text style={styles.docLibCount}>Showing 4 of 184 Reports</Text>
          </View>
          {documents.map((doc, i) => (
            <DocumentRow key={i} {...doc} />
          ))}
          <Pagination
            current={currentPage}
            total={12}
            onPage={setCurrentPage}
            isMobile={isMobile}
          />
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.appContainer}>

        {/* ── Main Content ── */}
        <View style={styles.main}>

          {/* Top Bar */}
          <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
            <View style={[styles.searchBox, isMobile && { flex: 1 }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder={isMobile ? "Search..." : "Search reports, metrics, or archives..."}
                placeholderTextColor={COLORS.gray400}
              />
            </View>
            {!isMobile && (
              <>
                <View style={styles.topNavLinks}>
                  {topNavItems.map((item) => (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.7}
                      onPress={() => setActiveTopNav(item.toLowerCase())}
                      style={styles.topNavItem}
                    >
                      <Text
                        style={[
                          styles.topNavText,
                          activeTopNav === item.toLowerCase() && styles.topNavTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                      {activeTopNav === item.toLowerCase() && (
                        <View style={styles.topNavUnderline} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity activeOpacity={0.8} style={styles.downloadBtn}>
                  <Text style={styles.downloadBtnText}>DOWNLOAD KPI</Text>
                </TouchableOpacity>
              </>
            )}
            {isMobile && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowFilters(!showFilters)}
                style={styles.filterToggleBtn}
              >
                <Text style={styles.filterToggleBtnText}>⚙️</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Mobile Navigation Tabs */}
          {isMobile && (
            <View style={styles.mobileNavTabs}>
              {topNavItems.map((item) => (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  onPress={() => setActiveTopNav(item.toLowerCase())}
                  style={[styles.mobileNavTab, activeTopNav === item.toLowerCase() && styles.mobileNavTabActive]}
                >
                  <Text
                    style={[
                      styles.mobileNavTabText,
                      activeTopNav === item.toLowerCase() && styles.mobileNavTabTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Render appropriate screen based on activeTopNav */}
            {activeTopNav === 'dashboard' && <DashboardReportScreen />}
            {activeTopNav === 'analytics' && <AnalyticsReportScreen />}
            {activeTopNav === 'strategy' && <StrategyReportScreen />}
            {!['dashboard', 'analytics', 'strategy'].includes(activeTopNav) && (
              <>
                <InstitutionalArchiveScreen />
                {/* Bulk Export Banner */}
                <View style={styles.exportBanner}>
                  <View style={styles.exportBannerLeft}>
                    <Text style={styles.exportBannerTitle}>Bulk Export Available</Text>
                    <Text style={styles.exportBannerSub}>
                      Download all selected reports in a single compressed archive.
                    </Text>
                  </View>
                  <View style={styles.exportBtns}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.exportBtnOutline}>
                      <Text style={styles.exportBtnOutlineText}>📁  EXPORT ARCHIVE (.ZIP)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.exportBtnFill}>
                      <Text style={styles.exportBtnFillText}>📊  EXPORT TO EXCEL (.XLSX)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            {['dashboard', 'analytics', 'strategy'].includes(activeTopNav) && (
              <>
                {/* Bulk Export Banner for other sections */}
                <View style={styles.exportBanner}>
                  <View style={styles.exportBannerLeft}>
                    <Text style={styles.exportBannerTitle}>Bulk Export Available</Text>
                    <Text style={styles.exportBannerSub}>
                      Download all selected reports in a single compressed archive.
                    </Text>
                  </View>
                  <View style={styles.exportBtns}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.exportBtnOutline}>
                      <Text style={styles.exportBtnOutlineText}>📁  EXPORT ARCHIVE (.ZIP)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.exportBtnFill}>
                      <Text style={styles.exportBtnFillText}>📊  EXPORT TO EXCEL (.XLSX)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  appContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
  },

  // ── Sidebar ──
  sidebar: {
    width: 220,
    backgroundColor: COLORS.white,
    paddingTop: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray200,
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  logoName: { fontSize: 15, fontWeight: '700', color: COLORS.dark },
  logoSub: { fontSize: 9, color: COLORS.gray400, letterSpacing: 0.5 },
  navItems: { flex: 1, gap: 2 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    position: 'relative',
    gap: 10,
  },
  navItemActive: { backgroundColor: COLORS.primaryLight },
  navIcon: { fontSize: 16, color: COLORS.gray400 },
  navIconActive: { color: COLORS.primary },
  navLabel: { fontSize: 14, color: COLORS.gray600, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '600' },
  navActivePill: {
    position: 'absolute',
    right: -16,
    width: 3,
    height: '80%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  sidebarBottom: { paddingBottom: 16, gap: 8 },
  generateBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  generateBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  sidebarFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  sidebarFooterIcon: { fontSize: 16 },
  sidebarFooterLabel: { fontSize: 13, color: COLORS.gray600 },

  // ── Main ──
  main: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    gap: 16,
  },
  topBarMobile: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.dark },
  topNavLinks: { flexDirection: 'row', gap: 4 },
  topNavItem: { paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center', position: 'relative' },
  topNavText: { fontSize: 12, fontWeight: '600', color: COLORS.gray400, letterSpacing: 0.5 },
  topNavTextActive: { color: COLORS.primary },
  topNavUnderline: {
    position: 'absolute',
    bottom: -13,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  downloadBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.dark,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  downloadBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.dark, letterSpacing: 0.5 },

  filterToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleBtnText: { fontSize: 18 },

  mobileNavTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    paddingHorizontal: 0,
  },
  mobileNavTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  mobileNavTabActive: {
    borderBottomColor: COLORS.primary,
  },
  mobileNavTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray400,
    letterSpacing: 0.3,
  },
  mobileNavTabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  scroll: { flex: 1, paddingHorizontal: 20 },

  // ── Page Header ──
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 16,
  },
  pageHeaderSub: { fontSize: 11, color: COLORS.primary, fontWeight: '600', letterSpacing: 0.8 },
  pageHeaderTitle: { fontSize: 26, fontWeight: '800', color: COLORS.dark, marginTop: 2 },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    padding: 3,
  },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6 },
  tabBtnActive: { backgroundColor: COLORS.white, ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }, android: { elevation: 2 } }) },
  tabBtnText: { fontSize: 13, color: COLORS.gray400, fontWeight: '500' },
  tabBtnTextActive: { color: COLORS.dark, fontWeight: '600' },

  // ── Body Layout ──
  bodyRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  bodyRowMobile: { flexDirection: 'column', gap: 12 },
  leftPanel: { width: 220, gap: 14 },
  leftPanelMobile: { width: '100%', gap: 12, paddingHorizontal: 0 },
  rightPanel: { flex: 1 },
  rightPanelMobile: { width: '100%' },

  // ── Summary Card ──
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 3 } }),
  },
  summaryCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  latestTag: { backgroundColor: COLORS.gray100, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  latestTagText: { fontSize: 9, fontWeight: '700', color: COLORS.gray600, letterSpacing: 0.5 },
  sparkle: { fontSize: 18, color: COLORS.primary },
  summaryTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark, lineHeight: 24, marginBottom: 12 },
  efficiencyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  efficiencyLabel: { fontSize: 12, color: COLORS.gray600, fontWeight: '500' },
  efficiencyValue: { fontSize: 13, fontWeight: '700', color: COLORS.green },
  progressBg: { height: 5, backgroundColor: COLORS.gray200, borderRadius: 3, marginBottom: 12 },
  progressFill: { width: '72%', height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  summaryDesc: { fontSize: 12, color: COLORS.gray600, lineHeight: 18, marginBottom: 14 },
  quickPreviewBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickPreviewText: { color: COLORS.white, fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },

  // ── Refine Panel ──
  refinePanel: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 3 } }),
  },
  refinePanelTitle: { fontSize: 10, fontWeight: '700', color: COLORS.gray400, letterSpacing: 0.8, marginBottom: 14 },
  filterLabel: { fontSize: 10, fontWeight: '700', color: COLORS.gray600, letterSpacing: 0.5, marginBottom: 6 },
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
  dropdownText: { fontSize: 13, color: COLORS.gray600 },
  dropdownArrow: { color: COLORS.gray400 },
  dateRow: { flexDirection: 'row', gap: 8 },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dateInputText: { fontSize: 11, color: COLORS.gray400 },
  dotLegend: { marginTop: 18, gap: 10 },
  dotRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  dotLabel: { flex: 1, fontSize: 12, color: COLORS.gray600 },
  dotCount: { fontSize: 12, color: COLORS.gray400, fontWeight: '600' },

  // ── Document Library ──
  docLibHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
  },
  docLibTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  docLibCount: { fontSize: 12, color: COLORS.gray400 },
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    paddingVertical: 18,
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
  docIconText: { fontSize: 24 },
  docInfo: { flex: 1 },
  docTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  docTitle: { fontSize: 15, fontWeight: '600', color: COLORS.dark, flex: 1, lineHeight: 20 },
  docMetaRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  docMeta: { fontSize: 12, color: COLORS.gray400 },
  docSize: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },

  // ── Badge ──
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },

  // ── Pagination ──
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
  pageArrow: { paddingHorizontal: 4 },
  pageArrowMobile: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 8, backgroundColor: COLORS.gray100 },
  pageArrowText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  pageArrowTextDisabled: { color: COLORS.gray300, opacity: 0.5 },
  pageNumbers: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pageNumbersMobile: { gap: 6, flex: 1, justifyContent: 'center' },
  pageNum: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
  },
  pageNumMobile: { width: 36, height: 36 },
  pageNumActive: { backgroundColor: COLORS.primary },
  pageNumText: { fontSize: 13, color: COLORS.gray600, fontWeight: '600' },
  pageNumTextActive: { color: COLORS.white },
  pageEllipsis: { color: COLORS.gray400, marginHorizontal: 4 },

  // ── Export Banner ──
  exportBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.dark,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  exportBannerLeft: { flex: 1, minWidth: 160 },
  exportBannerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  exportBannerSub: { fontSize: 12, color: '#9CA3AF', lineHeight: 18 },
  exportBtns: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  exportBtnOutline: {
    borderWidth: 1.5,
    borderColor: '#4B5563',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  exportBtnOutlineText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  exportBtnFill: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  exportBtnFillText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
});