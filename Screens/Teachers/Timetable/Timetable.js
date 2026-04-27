import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, Alert, Platform, StatusBar, SafeAreaView,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLaptop = SCREEN_WIDTH >= 768;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIMETABLE = {
  Monday: [
    { tag: 'STEM', tagColor: '#C2410C', tagBg: '#FFF7ED', time: '08:30–09:30', subject: 'Mathematics', teacher: 'Dr. Sarah Jenkins', icon: '∑' },
    { tag: 'HUMANITIES', tagColor: '#6D28D9', tagBg: '#F5F3FF', time: '09:45–10:45', subject: 'Literature', teacher: 'Marcus Thorne', icon: '📖' },
  ],
  Tuesday: [
    { tag: 'STEM', tagColor: '#C2410C', tagBg: '#FFF7ED', time: '08:30–09:30', subject: 'Science', teacher: 'Prof. Emily Vance', icon: '🧪' },
    { tag: 'ART', tagColor: '#0369A1', tagBg: '#F0F9FF', time: '09:45–11:45', subject: 'Digital Design', teacher: 'Elena Rodriguez', icon: '🎨', highlight: true },
  ],
  Wednesday: [
    { tag: 'STEM', tagColor: '#C2410C', tagBg: '#FFF7ED', time: '08:30–09:30', subject: 'Mathematics', teacher: 'Dr. Sarah Jenkins', icon: '∑', live: true },
    { tag: 'HISTORY', tagColor: '#92400E', tagBg: '#FFFBEB', time: '11:00–12:00', subject: 'Ancient Worlds', teacher: 'Julian Smith', icon: '🏛' },
  ],
  Thursday: [
    { tag: 'STEM', tagColor: '#C2410C', tagBg: '#FFF7ED', time: '08:30–09:30', subject: 'Science', teacher: 'Prof. Emily Vance', icon: '🧪' },
    { tag: 'MUSIC', tagColor: '#065F46', tagBg: '#ECFDF5', time: '10:00–11:30', subject: 'Orchestra', teacher: 'Winston Clarke', icon: '🎻' },
  ],
  Friday: [
    { tag: 'HUMANITIES', tagColor: '#6D28D9', tagBg: '#F5F3FF', time: '09:00–10:30', subject: 'Geography', teacher: 'Sandra Miller', icon: '🌍' },
    { tag: 'GENERAL', tagColor: '#374151', tagBg: '#F9FAFB', time: '11:00–12:00', subject: 'Counseling', teacher: 'Dr. Peter Lowe', icon: '💬' },
  ],
  Saturday: [
    { tag: 'WEEKEND', tagColor: '#6B7280', tagBg: '#F9FAFB', time: '10:00–13:00', subject: 'Weekend Workshops', teacher: '', icon: '🛠', optional: true },
    { tag: 'OPTIONAL', tagColor: '#6B7280', tagBg: '#F9FAFB', time: '09:00–10:00', subject: 'Self Study', teacher: '📍 Library', icon: '📚', optional: true },
  ],
};

const EXAMS = [
  { icon: '🧪', title: 'Science Midterm', date: 'Tue, Oct 24', time: '09:00 AM', scope: 'UNITS 1–4', accent: '#FED7AA', accentText: '#9A3412' },
  { icon: '∑', title: 'Math Quiz', date: 'Thu, Oct 26', time: '08:30 AM', scope: 'CALCULUS I', accent: '#FEF08A', accentText: '#713F12' },
  { icon: '📝', title: 'History Essay', date: 'Fri, Oct 27', time: '11:00 AM', scope: 'ANCIENT ROME', accent: '#BBF7D0', accentText: '#14532D' },
];

const DAY_SHORT = { Monday: 'MON', Tuesday: 'TUE', Wednesday: 'WED', Thursday: 'THU', Friday: 'FRI', Saturday: 'SAT' };

// ─── CLASS CARD ───────────────────────────────────────────────────────────────

const ClassCard = ({ item, compact }) => {
  const isHighlight = !!item.highlight;
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.classCard,
        isHighlight && styles.classCardHighlight,
        compact && styles.classCardCompact,
      ]}
    >
      {/* Left accent stripe */}
      <View style={[
        styles.cardStripe,
        { backgroundColor: isHighlight ? 'rgba(255,255,255,0.35)' : item.tagBg },
      ]} />

      <View style={styles.cardInner}>
        {/* Top row */}
        <View style={styles.cardTopRow}>
          {/* Subject icon circle */}
          <View style={[styles.subjectIconCircle, { backgroundColor: isHighlight ? 'rgba(255,255,255,0.2)' : item.tagBg }]}>
            <Text style={styles.subjectIconText}>{item.icon}</Text>
          </View>

          {/* Tag + time */}
          <View style={styles.cardMetaCol}>
            <View style={[styles.tagPill, { backgroundColor: isHighlight ? 'rgba(255,255,255,0.25)' : item.tagBg }]}>
              <Text style={[styles.tagPillText, { color: isHighlight ? '#FFF' : item.tagColor }]}>
                {item.tag}
              </Text>
            </View>
            <Text style={[styles.cardTime, isHighlight && { color: 'rgba(255,255,255,0.8)' }]}>
              {item.time}
            </Text>
          </View>

          {/* Live dot */}
          {item.live && (
            <View style={styles.liveDotWrap}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLabel}>LIVE</Text>
            </View>
          )}

          {/* Optional tag */}
          {item.optional && (
            <View style={styles.optionalPill}>
              <Text style={styles.optionalText}>opt</Text>
            </View>
          )}
        </View>

        {/* Subject name */}
        <Text style={[styles.cardSubject, isHighlight && { color: '#FFF' }]} numberOfLines={1}>
          {item.subject}
        </Text>

        {/* Teacher */}
        {!!item.teacher && (
          <Text style={[styles.cardTeacher, isHighlight && { color: 'rgba(255,255,255,0.75)' }]} numberOfLines={1}>
            {item.teacher}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── EXAM CARD ────────────────────────────────────────────────────────────────

const ExamCard = ({ exam, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.examCard} onPress={onPress}>
    {/* Top color band */}
    <View style={[styles.examBand, { backgroundColor: exam.accent }]}>
      <Text style={[styles.examBandScope, { color: exam.accentText }]}>{exam.scope}</Text>
      <Text style={styles.examBandIcon}>{exam.icon}</Text>
    </View>
    <View style={styles.examBody}>
      <Text style={styles.examTitle}>{exam.title}</Text>
      <Text style={styles.examDate}>{exam.date}</Text>
      <View style={styles.examTimeRow}>
        <View style={styles.examTimePill}>
          <Text style={styles.examTimeText}>{exam.time}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

export default function WeeklyTimetable() {
  const [activeDay, setActiveDay] = useState('Wednesday');
  const [expandedExam, setExpandedExam] = useState(null);
  const scrollRef = useRef(null);
  const laptopLayout = SCREEN_WIDTH >= 768;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container, laptopLayout && styles.containerLaptop]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ── */}
        <View style={[styles.headerRow, laptopLayout && styles.headerRowLaptop]}>
          <View style={styles.headerLeft}>
            {/* Decorative dot cluster */}
            <View style={styles.dotCluster}>
              {[0,1,2,3,4,5].map(i => (
                <View key={i} style={[styles.dot, { opacity: 0.12 + i * 0.12, width: 7 + i, height: 7 + i, borderRadius: 10 }]} />
              ))}
            </View>
            <Text style={styles.breadcrumb}>ACADEMICS  ›  TIMETABLE</Text>
            <Text style={styles.pageTitle}>Weekly Timetable</Text>
            <View style={styles.studentChip}>
              <View style={styles.studentAvatar}><Text style={styles.studentAvatarText}>LM</Text></View>
              <Text style={styles.studentChipText}>Leo Miller</Text>
              <View style={styles.gradePill}><Text style={styles.gradeText}>8-B</Text></View>
            </View>
          </View>
        </View>

        {/* ── DAY SELECTOR ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayTabsRow}
        >
          {DAYS.map(day => {
            const active = day === activeDay;
            const hasSessions = TIMETABLE[day]?.length > 0;
            return (
              <TouchableOpacity
                key={day}
                activeOpacity={0.8}
                style={[styles.dayTab, active && styles.dayTabActive]}
                onPress={() => setActiveDay(day)}
              >
                <Text style={[styles.dayTabShort, active && styles.dayTabShortActive]}>
                  {DAY_SHORT[day]}
                </Text>
                <Text style={[styles.dayTabCount, active && styles.dayTabCountActive]}>
                  {TIMETABLE[day].length} cls
                </Text>
                {/* Active indicator bar */}
                {active && <View style={styles.dayTabBar} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── SCHEDULE ── */}
        {laptopLayout ? (
          <View style={styles.laptopGrid}>
            {DAYS.map(day => (
              <View key={day} style={styles.laptopDayCol}>
                <TouchableOpacity
                  onPress={() => setActiveDay(day)}
                  style={[styles.laptopDayHeader, day === activeDay && styles.laptopDayHeaderActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.laptopDayText, day === activeDay && styles.laptopDayTextActive]}>
                    {DAY_SHORT[day]}
                  </Text>
                  <Text style={[styles.laptopDayCount, day === activeDay && { color: '#EA580C' }]}>
                    {TIMETABLE[day].length}
                  </Text>
                </TouchableOpacity>
                {TIMETABLE[day].map((item, idx) => (
                  <ClassCard key={idx} item={item} compact />
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.mobileSchedule}>
            {/* Day header strip */}
            <View style={styles.mobileDayStrip}>
              <Text style={styles.mobileDayName}>{activeDay}</Text>
              <View style={styles.sessionCountPill}>
                <Text style={styles.sessionCountText}>{TIMETABLE[activeDay].length} sessions</Text>
              </View>
            </View>

            {/* Timeline view */}
            <View style={styles.timeline}>
              {TIMETABLE[activeDay].map((item, idx) => (
                <View key={idx} style={styles.timelineRow}>
                  {/* Timeline dot + line */}
                  <View style={styles.timelineTrack}>
                    <View style={[styles.timelineDot, item.highlight && { backgroundColor: '#EA580C' }]} />
                    {idx < TIMETABLE[activeDay].length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineCardWrap}>
                    <ClassCard item={item} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── BOTTOM SECTION ── */}
        <View style={[styles.bottomSection, laptopLayout && styles.bottomSectionLaptop]}>

          {/* Upcoming Exams */}
          <View style={[styles.examsPanel, laptopLayout && styles.examsPanelLaptop]}>
            <View style={styles.examsPanelHeader}>
              <View>
                <Text style={styles.examsPanelTitle}>Upcoming Exams</Text>
                <Text style={styles.examsPanelSub}>Next 7 days</Text>
              </View>
              <View style={styles.pendingBadge}>
                <View style={styles.pendingDot} />
                <Text style={styles.pendingBadgeText}>3 pending</Text>
              </View>
            </View>

            <ScrollView
              horizontal={!laptopLayout}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={laptopLayout ? styles.examCardsWrap : styles.examCardsRow}
            >
              {EXAMS.map((exam, i) => (
                <ExamCard
                  key={i}
                  exam={exam}
                  onPress={() => setExpandedExam(expandedExam === i ? null : i)}
                />
              ))}
            </ScrollView>

            {/* Expanded exam detail */}
            {expandedExam !== null && !laptopLayout && (
              <View style={[styles.examDetailBox, { borderColor: EXAMS[expandedExam].accent }]}>
                <Text style={styles.examDetailTitle}>{EXAMS[expandedExam].title}</Text>
                <Text style={styles.examDetailLine}>
                  {EXAMS[expandedExam].date}  ·  {EXAMS[expandedExam].time}
                </Text>
                <Text style={styles.examDetailScope}>Scope: {EXAMS[expandedExam].scope}</Text>
              </View>
            )}
          </View>

          {/* Advisory */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.advisoryCard, laptopLayout && styles.advisoryCardLaptop]}
            onPress={() => Alert.alert('Exam Advisory', 'The Science midterm is next week. Please ensure Leo has reviewed the lab safety protocols and chemical reaction charts available in his study guide.')}
          >
            {/* Decorative corner */}
            <View style={styles.advisoryCorner} />

            <View style={styles.advisoryTopRow}>
              <View style={styles.advisoryIconBox}>
                <Text style={styles.advisoryIconText}>!</Text>
              </View>
              <View style={styles.advisoryUrgencyPill}>
                <Text style={styles.advisoryUrgencyText}>ACTION NEEDED</Text>
              </View>
            </View>

            <Text style={styles.advisoryTitle}>Exam Advisory</Text>
            <Text style={styles.advisoryBody}>
              The Science midterm is next week. Please ensure Leo has reviewed the lab safety protocols and the chemical reaction charts.
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── QUICK STATS STRIP ── */}
        <View style={styles.statsStrip}>
          {[
            { label: 'Total Classes', value: Object.values(TIMETABLE).flat().length },
            { label: 'This Week', value: DAYS.reduce((a, d) => a + TIMETABLE[d].length, 0) },
            { label: 'Exams Ahead', value: EXAMS.length },
            { label: 'Today', value: `${TIMETABLE['Wednesday'].length} cls` },
          ].map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const ORANGE = '#EA580C';
const ORANGE_LIGHT = '#FFF7ED';
const ORANGE_MID = '#FED7AA';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAF8' },

  container: { padding: 16, paddingBottom: 48 },
  containerLaptop: { padding: 32, maxWidth: 1280, alignSelf: 'center', width: '100%' },

  // ── Header ──
  headerRow: { marginBottom: 24, gap: 14 },
  headerRowLaptop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { position: 'relative' },

  dotCluster: {
    position: 'absolute',
    top: -4,
    right: -8,
    flexDirection: 'row',
    gap: 3,
    alignItems: 'flex-end',
  },
  dot: { backgroundColor: ORANGE, borderRadius: 10 },

  breadcrumb: { fontSize: 11, fontWeight: '600', letterSpacing: 1.4, color: '#9CA3AF', marginBottom: 6 },

  pageTitle: {
    fontSize: isLaptop ? 34 : 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.8,
    marginBottom: 10,
  },

  studentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  studentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ORANGE_MID,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: { fontSize: 10, fontWeight: '800', color: '#9A3412' },
  studentChipText:   { fontSize: 13, fontWeight: '600', color: '#374151' },
  gradePill: {
    backgroundColor: ORANGE_LIGHT,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeText: { fontSize: 11, fontWeight: '700', color: ORANGE },

  // ── Day tabs ──
  dayTabsRow: { flexDirection: 'row', gap: 6, marginBottom: 20, paddingVertical: 4 },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    position: 'relative',
    minWidth: 58,
  },
  dayTabActive: {
    backgroundColor: ORANGE_LIGHT,
    borderColor: ORANGE_MID,
  },
  dayTabShort:        { fontSize: 12, fontWeight: '800', color: '#9CA3AF', letterSpacing: 0.6 },
  dayTabShortActive:  { color: ORANGE },
  dayTabCount:        { fontSize: 10, color: '#D1D5DB', marginTop: 2 },
  dayTabCountActive:  { color: '#C2410C' },
  dayTabBar: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: ORANGE,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  // ── Mobile schedule / timeline ──
  mobileSchedule: { marginBottom: 24 },
  mobileDayStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mobileDayName: { fontSize: 20, fontWeight: '800', color: '#111827' },
  sessionCountPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sessionCountText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },

  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineTrack: { width: 20, alignItems: 'center', paddingTop: 18 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#F3F4F6',
    marginTop: 4,
    marginBottom: -8,
  },
  timelineCardWrap: { flex: 1, paddingBottom: 14 },

  // ── Class card ──
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  classCardHighlight: {
    backgroundColor: '#1C1917',
    borderColor: '#1C1917',
  },
  classCardCompact: { marginBottom: 8 },

  cardStripe: { width: 4, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },

  cardInner: { flex: 1, padding: 14, gap: 5 },

  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  subjectIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectIconText: { fontSize: 14 },

  cardMetaCol: { flex: 1, gap: 3 },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  tagPillText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },

  cardTime: { fontSize: 10, color: '#9CA3AF', fontWeight: '500' },

  liveDotWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#16A34A' },
  liveLabel: { fontSize: 9, fontWeight: '800', color: '#16A34A', letterSpacing: 0.5 },

  optionalPill: { backgroundColor: '#F3F4F6', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  optionalText: { fontSize: 9, color: '#9CA3AF', fontWeight: '700' },

  cardSubject: { fontSize: 15, fontWeight: '700', color: '#111827' },
  cardTeacher: { fontSize: 12, color: '#9CA3AF' },

  // ── Laptop grid ──
  laptopGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  laptopDayCol: { flex: 1, gap: 8 },
  laptopDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    marginBottom: 2,
  },
  laptopDayHeaderActive: { backgroundColor: ORANGE_LIGHT },
  laptopDayText:       { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#9CA3AF' },
  laptopDayTextActive: { color: ORANGE },
  laptopDayCount:      { fontSize: 11, fontWeight: '700', color: '#D1D5DB' },

  // ── Bottom section ──
  bottomSection: { gap: 16 },
  bottomSectionLaptop: { flexDirection: 'row', alignItems: 'flex-start' },

  // Exams panel
  examsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  examsPanelLaptop: { flex: 2 },
  examsPanelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  examsPanelTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  examsPanelSub:   { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pendingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D97706' },
  pendingBadgeText: { fontSize: 12, fontWeight: '700', color: '#92400E' },

  examCardsRow:  { flexDirection: 'row', gap: 12, paddingBottom: 4 },
  examCardsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  // Exam card
  examCard: {
    width: isLaptop ? 190 : 170,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  examBand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  examBandScope: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  examBandIcon:  { fontSize: 18 },
  examBody: { padding: 14, gap: 4 },
  examTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  examDate:  { fontSize: 11, color: '#6B7280' },
  examTimeRow: { marginTop: 4 },
  examTimePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  examTimeText: { fontSize: 10, fontWeight: '600', color: '#374151' },

  examDetailBox: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 2,
    padding: 14,
    gap: 6,
    backgroundColor: '#FAFAF8',
  },
  examDetailTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  examDetailLine:  { fontSize: 12, color: '#6B7280' },
  examDetailScope: { fontSize: 12, color: '#9CA3AF' },

  // Advisory card
  advisoryCard: {
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 20,
    padding: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: ORANGE_MID,
    overflow: 'hidden',
    position: 'relative',
  },
  advisoryCardLaptop: { flex: 1 },
  advisoryCorner: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: ORANGE_MID,
    opacity: 0.4,
  },

  advisoryTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  advisoryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisoryIconText: { fontSize: 18, fontWeight: '900', color: '#FFF' },

  advisoryUrgencyPill: {
    backgroundColor: ORANGE,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  advisoryUrgencyText: { fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 0.8 },

  advisoryTitle: { fontSize: 20, fontWeight: '800', color: '#7C2D12' },
  advisoryBody:  { fontSize: 13, color: '#9A3412', lineHeight: 20 },

  // ── Stats strip ──
  statsStrip: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  statBox: {
    flex: 1,
    minWidth: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3, fontWeight: '600', textAlign: 'center' },
});