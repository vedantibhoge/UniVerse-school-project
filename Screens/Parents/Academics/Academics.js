import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

var screenWidth = Dimensions.get('window').width;
var IS_TABLET = screenWidth >= 768;

// ─── Colors ───────────────────────────────────────────────────────────────────
var C = {
  bg:          '#F5F7FB',
  card:        '#FFFFFF',
  blue:        '#1A56DB',
  blueLight:   '#EEF2FF',
  blueMid:     '#3B82F6',
  orange:      '#F97316',
  orangeLight: '#FFF7ED',
  green:       '#16A34A',
  greenLight:  '#F0FDF4',
  text:        '#111827',
  textSub:     '#6B7280',
  textMuted:   '#9CA3AF',
  border:      '#E5E7EB',
  mathOrange:  '#D97706',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
var GROWTH_DATA = {
  2022: [50, 53, 56, 58, 61, 60, 63, 65, 67, 69, 71, 73],
  2023: [60, 63, 67, 70, 72, 71, 74, 76, 75, 78, 80, 81],
  2024: [72, 75, 78, 80, 82, 79, 83, 85, 84, 87, 88, 90],
};

var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

var SUBJECTS = [
  { icon: 'Σ',  name: 'Advanced Mathematics', instructor: 'Dr. Robert Vance',    score: 94, grade: 'A',  classAvg: 82, color: C.blue,    bg: C.blueLight   },
  { icon: '🔬', name: 'Molecular Biology',    instructor: 'Mrs. Helena Thorne',  score: 87, grade: 'B+', classAvg: 78, color: C.blueMid, bg: '#EFF6FF'     },
  { icon: '📖', name: 'English Literature',   instructor: 'Prof. Alistair Cook', score: 74, grade: 'B-', classAvg: 80, color: C.orange,  bg: C.orangeLight  },
  { icon: '⚗️',  name: 'Chemistry',            instructor: 'Dr. Sandra Lee',      score: 91, grade: 'A-', classAvg: 76, color: C.green,   bg: C.greenLight  },
  { icon: '🌍', name: 'World History',        instructor: 'Mr. James Crawford',  score: 83, grade: 'B+', classAvg: 79, color: '#7C3AED', bg: '#F5F3FF'     },
];

var ASSESSMENTS = [
  { icon: '📝', name: 'Calculus Quiz 4',     date: 'May 14, 2024', score: '19/20', color: C.blue    },
  { icon: '📄', name: 'Shakespeare Essay',   date: 'May 11, 2024', score: '72%',   color: C.orange  },
  { icon: '🧪', name: 'Lab Report: Osmosis', date: 'May 08, 2024', score: 'A-',    color: C.green   },
  { icon: '📐', name: 'Geometry Test 3',     date: 'Apr 28, 2024', score: '88%',   color: C.blue    },
  { icon: '📚', name: 'History Essay',       date: 'Apr 20, 2024', score: 'B+',    color: '#7C3AED' },
];

var CURRICULUM = [
  {
    tag: 'MATHEMATICS', tagColor: C.blue, weeks: 'Week 12–14',
    title: 'Integral Calculus Foundations',
    desc:  'Exploration of indefinite integrals, substitution methods, and area under curves.',
    file:  'Study_Guide_Unit3.pdf',
  },
  {
    tag: 'LITERATURE', tagColor: C.orange, weeks: 'Week 11–15',
    title: 'Modernism & The Great Gatsby',
    desc:  'Analyzing social stratifications and the decline of the American Dream.',
    file:  'Lecture_Video_Series.link',
  },
  {
    tag: 'BIOLOGY', tagColor: C.green, weeks: 'Week 13–16',
    title: 'Cell Division & Genetics',
    desc:  'Mitosis, meiosis, Mendelian inheritance patterns and genetic variation.',
    file:  'Bio_Notes_Unit5.pdf',
  },
];

// ─── ProgressBar ──────────────────────────────────────────────────────────────
function ProgressBar(props) {
  var value = props.value;
  var color = props.color || C.blue;
  return (
    <View style={st.progressTrack}>
      <View style={[st.progressFill, { width: value + '%', backgroundColor: color }]} />
    </View>
  );
}

// ─── DonutChart ───────────────────────────────────────────────────────────────
function DonutChart() {
  var size   = IS_TABLET ? 140 : 110;
  var border = IS_TABLET ? 13  : 11;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: size / 2, borderWidth: border, borderColor: C.border,
      }} />
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: size / 2, borderWidth: border,
        borderTopColor:    C.blue,
        borderRightColor:  C.blue,
        borderBottomColor: C.blue,
        borderLeftColor:   C.border,
        transform: [{ rotate: '45deg' }],
      }} />
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: IS_TABLET ? 30 : 24, fontWeight: '800', color: C.text, letterSpacing: -1 }}>
          3.8
        </Text>
        <Text style={{ fontSize: 10, color: C.textSub, fontWeight: '700', letterSpacing: 1 }}>
          GPA
        </Text>
      </View>
    </View>
  );
}

// ─── GrowthChart ─────────────────────────────────────────────────────────────
function GrowthChart(props) {
  var year     = props.year;
  var data     = GROWTH_DATA[year] || GROWTH_DATA[2024];
  var chartW   = screenWidth - (IS_TABLET ? 96 : 64);
  var chartH   = IS_TABLET ? 160 : 130;
  var padLeft  = 36;
  var padBot   = 30;
  var innerW   = chartW - padLeft - 8;
  var innerH   = chartH - padBot - 10;
  var minV = 40;
  var maxV = 100;

  var pts = [];
  for (var i = 0; i < data.length; i++) {
    pts.push({
      x: padLeft + (i / 11) * innerW,
      y: 10 + ((maxV - data[i]) / (maxV - minV)) * innerH,
    });
  }

  var gridLabels = [100, 80, 60, 40];

  return (
    <View style={{ height: chartH + 4, width: chartW }}>
      {gridLabels.map(function(v, i) {
        var yPos = 10 + ((maxV - v) / (maxV - minV)) * innerH;
        return (
          <View key={'grid-' + i} style={{
            position: 'absolute', top: yPos, left: 0, right: 0,
            flexDirection: 'row', alignItems: 'center',
          }}>
            <Text style={{ fontSize: 9, color: C.textMuted, width: padLeft - 4, textAlign: 'right' }}>
              {v}
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          </View>
        );
      })}

      {pts.slice(0, 11).map(function(p, i) {
        var next  = pts[i + 1];
        var dx    = next.x - p.x;
        var dy    = next.y - p.y;
        var len   = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <View key={'seg-' + i} style={{
            position:        'absolute',
            left:            p.x,
            top:             p.y - 1.25,
            width:           len,
            height:          2.5,
            backgroundColor: C.blue,
            transform:       [{ rotate: angle + 'deg' }],
          }} />
        );
      })}

      {pts.map(function(p, i) {
        return (
          <View key={'dot-' + i} style={{
            position:        'absolute',
            left:            p.x - 4,
            top:             p.y - 4,
            width:           8,
            height:          8,
            borderRadius:    4,
            backgroundColor: C.blue,
            borderWidth:     2,
            borderColor:     '#fff',
          }} />
        );
      })}

      {MONTHS.map(function(m, i) {
        return (
          <Text key={'month-' + m} style={{
            position:  'absolute',
            top:       chartH - padBot + 8,
            left:      padLeft + (i / 11) * innerW - 13,
            fontSize:  IS_TABLET ? 9 : 8,
            color:     C.textMuted,
            width:     28,
            textAlign: 'center',
          }}>
            {m}
          </Text>
        );
      })}
    </View>
  );
}

// ─── ReportCardModal ──────────────────────────────────────────────────────────
function ReportCardModal(props) {
  var visible = props.visible;
  var onClose = props.onClose;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={st.modalHeader}>
          <Text style={st.modalTitle}>Full Report Card</Text>
          <TouchableOpacity onPress={onClose} style={st.modalCloseBtn} activeOpacity={0.7}>
            <Text style={st.modalCloseTxt}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 13, color: C.textSub, marginBottom: 16, fontWeight: '500' }}>
            Academic Year 2024–25 · Alex Johnson
          </Text>

          {SUBJECTS.map(function(s, i) {
            return (
              <View key={'rpt-' + i} style={st.reportRow}>
                <View style={[st.reportIconBox, { backgroundColor: s.bg }]}>
                  <Text style={{ fontSize: 20 }}>{s.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.reportSubjectName}>{s.name}</Text>
                  <Text style={st.reportInstructor}>{s.instructor}</Text>
                  <ProgressBar value={s.score} color={s.color} />
                </View>
                <View style={[st.reportGradeBadge, { backgroundColor: s.bg }]}>
                  <Text style={[st.reportGradeText, { color: s.color }]}>{s.grade}</Text>
                  <Text style={[st.reportScoreText, { color: s.color }]}>{s.score}/100</Text>
                </View>
              </View>
            );
          })}

          <View style={st.summaryBox}>
            <Text style={st.summaryTitle}>Term Summary</Text>
            {[
              { label: 'GPA',         val: '3.8 / 4.0' },
              { label: 'Class Rank',  val: '4th / 32'  },
              { label: 'Total Score', val: '88 / 100'  },
              { label: 'Attendance',  val: '96%'       },
            ].map(function(row, i) {
              return (
                <View key={'sum-' + i} style={st.summaryRow}>
                  <Text style={st.summaryLabel}>{row.label}</Text>
                  <Text style={st.summaryVal}>{row.val}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Academics() {
  var s1 = useState(2024);
  var selectedYear    = s1[0];
  var setSelectedYear = s1[1];

  var s2 = useState(false);
  var reportVisible    = s2[0];
  var setReportVisible = s2[1];

  var s3 = useState(null);
  var expandedSubject = s3[0];
  var setExpandedSubj = s3[1];

  var s4 = useState(false);
  var showAll    = s4[0];
  var setShowAll = s4[1];

  var visibleAssessments = showAll ? ASSESSMENTS : ASSESSMENTS.slice(0, 3);

  return (
    <SafeAreaView style={st.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Semester Performance ── */}
        <View style={st.card}>
          <View style={IS_TABLET ? st.perfRowTablet : st.perfRowMobile}>
            <DonutChart />
            <View style={{ flex: 1 }}>
              <Text style={st.perfTitle}>Semester Performance</Text>
              <Text style={st.perfDesc}>
                Alex is performing in the top 15% of his class. His strongest performance is
                currently in STEM subjects, showing a 4% increase from last term.
              </Text>
              <View style={st.badgeRow}>
                <TouchableOpacity style={st.badgeBlue} activeOpacity={0.75}>
                  <Text style={st.badgeBlueTxt}>↗ Honor Roll</Text>
                </TouchableOpacity>
                <TouchableOpacity style={st.badgeOrange} activeOpacity={0.75}>
                  <Text style={st.badgeOrangeTxt}>★ Math Lead</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={st.rankBox}>
            <Text style={st.rankLabel}>TOTAL SCORE</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={st.rankScore}>88</Text>
              <Text style={st.rankScoreMax}> / 100</Text>
            </View>
            <View style={st.rankDivider} />
            <Text style={st.rankLabel}>RANK IN CLASS</Text>
            <Text style={st.rankBig}>4th</Text>
            <Text style={st.rankSub}>Out of 32 Students</Text>
          </View>
        </View>

        {/* ── Growth Chart ── */}
        <View style={st.card}>
          <View style={st.rowBetween}>
            <View>
              <Text style={st.sectionTitle}>Growth Chart</Text>
              <Text style={st.sectionSub}>Performance trend over the last 12 months</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[2022, 2023, 2024].map(function(y) {
                var isActive = selectedYear === y;
                return (
                  <TouchableOpacity
                    key={'yr-' + y}
                    style={[st.yearBtn, isActive && st.yearBtnOn]}
                    onPress={function() { setSelectedYear(y); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[st.yearBtnTxt, isActive && st.yearBtnTxtOn]}>{y}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 16 }}>
            <GrowthChart year={selectedYear} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={st.legendDot} />
            <Text style={st.legendTxt}>CURRENT YEAR · {selectedYear}</Text>
          </View>
        </View>

        {/* ── Subject Insights ── */}
        <View style={st.card}>
          <View style={st.rowBetween}>
            <View>
              <Text style={st.sectionTitle}>Subject Insights</Text>
              <Text style={st.sectionSub}>Detailed performance breakdown by faculty</Text>
            </View>
            <TouchableOpacity onPress={function() { setReportVisible(true); }} activeOpacity={0.75}>
              <Text style={st.linkTxt}>View Report Card ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
            {SUBJECTS.map(function(s, i) {
              var isOpen = expandedSubject === i;
              return (
                <TouchableOpacity
                  key={'sub-' + i}
                  style={[st.subjectCard, isOpen && st.subjectCardOpen]}
                  onPress={function() { setExpandedSubj(isOpen ? null : i); }}
                  activeOpacity={0.85}
                >
                  <View style={st.rowBetween}>
                    <View style={[st.subjectIconBox, { backgroundColor: s.bg }]}>
                      <Text style={{ fontSize: 18 }}>{s.icon}</Text>
                    </View>
                    <Text style={[st.subjectScore, { color: s.color }]}>{s.score}/100</Text>
                  </View>
                  <Text style={[st.subjectGrade, { color: s.color }]}>GRADE: {s.grade}</Text>
                  <Text style={st.subjectName}>{s.name}</Text>
                  <Text style={st.subjectInstructor}>{s.instructor}</Text>
                  <View style={st.rowBetween}>
                    <Text style={st.avgLabel}>Class Average</Text>
                    <Text style={st.avgVal}>{s.classAvg}%</Text>
                  </View>
                  <ProgressBar value={s.classAvg} color={s.color} />
                  {isOpen ? (
                    <View style={st.subjectExpanded}>
                      <Text style={st.subjectExpandedTxt}>
                        Your score is {s.score - s.classAvg}% above class average
                      </Text>
                      <TouchableOpacity
                        style={[st.subjectViewBtn, { backgroundColor: s.bg }]}
                        onPress={function() { setReportVisible(true); }}
                        activeOpacity={0.8}
                      >
                        <Text style={[st.subjectViewBtnTxt, { color: s.color }]}>View Full Report</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Recent Assessments ── */}
        <View style={st.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>📝</Text>
            <Text style={st.sectionTitle}>Recent Assessments</Text>
          </View>

          {visibleAssessments.map(function(a, i) {
            return (
              <TouchableOpacity key={'ass-' + i} style={st.assessRow} activeOpacity={0.7}>
                <View style={[st.assessIconBox, { backgroundColor: a.color + '22' }]}>
                  <Text style={{ fontSize: 16 }}>{a.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.assessName}>{a.name}</Text>
                  <Text style={st.assessDate}>{a.date}</Text>
                </View>
                <Text style={[st.assessScore, { color: a.color }]}>{a.score}</Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={st.showMoreBtn}
            onPress={function() { setShowAll(!showAll); }}
            activeOpacity={0.75}
          >
            <Text style={st.showMoreTxt}>{showAll ? 'Show Less ▲' : 'Show All ▼'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Active Curriculum Units ── */}
        <View style={st.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>📋</Text>
            <Text style={st.sectionTitle}>Active Curriculum Units</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CURRICULUM.map(function(c, i) {
              return (
                <TouchableOpacity key={'cur-' + i} style={st.currCard} activeOpacity={0.85}>
                  <View style={st.rowBetween}>
                    <View style={[st.currTag, { backgroundColor: c.tagColor + '22' }]}>
                      <Text style={[st.currTagTxt, { color: c.tagColor }]}>{c.tag}</Text>
                    </View>
                    <Text style={st.currWeeks}>{c.weeks}</Text>
                  </View>
                  <Text style={st.currTitle}>{c.title}</Text>
                  <Text style={st.currDesc} numberOfLines={3}>{c.desc}</Text>
                  <TouchableOpacity style={st.currFile} activeOpacity={0.75}>
                    <Text style={st.currFileTxt}>📎 {c.file}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

      </ScrollView>

      <ReportCardModal
        visible={reportVisible}
        onClose={function() { setReportVisible(false); }}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
var st = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: C.bg },
  scrollContent: { padding: IS_TABLET ? 24 : 16, paddingBottom: 48, gap: 16 },

  card: {
    backgroundColor: C.card,
    borderRadius:    16,
    padding:         IS_TABLET ? 24 : 16,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },

  perfRowMobile: { flexDirection: 'column', alignItems: 'center', gap: 14 },
  perfRowTablet: { flexDirection: 'row',    alignItems: 'flex-start', gap: 20 },
  perfTitle:     { fontSize: IS_TABLET ? 20 : 17, fontWeight: '700', color: C.text, marginBottom: 6 },
  perfDesc:      { fontSize: 13, color: C.textSub, lineHeight: 20 },
  badgeRow:      { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  badgeBlue:     { backgroundColor: C.blueLight,   borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  badgeBlueTxt:  { color: C.blue,       fontSize: 13, fontWeight: '600' },
  badgeOrange:   { backgroundColor: C.orangeLight, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  badgeOrangeTxt:{ color: C.mathOrange, fontSize: 13, fontWeight: '600' },

  rankBox:      { backgroundColor: C.blue, borderRadius: 14, padding: 16, marginTop: 16 },
  rankLabel:    { fontSize: 10, color: '#93C5FD', fontWeight: '700', letterSpacing: 0.8 },
  rankScore:    { fontSize: IS_TABLET ? 46 : 38, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  rankScoreMax: { fontSize: 15, color: '#93C5FD', fontWeight: '600' },
  rankDivider:  { height: 1, backgroundColor: '#3B82F6', marginVertical: 10 },
  rankBig:      { fontSize: IS_TABLET ? 38 : 32, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  rankSub:      { fontSize: 11, color: '#93C5FD', marginTop: 2 },

  rowBetween:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  sectionTitle: { fontSize: IS_TABLET ? 17 : 15, fontWeight: '700', color: C.text },
  sectionSub:   { fontSize: 12, color: C.textSub, marginTop: 2 },
  linkTxt:      { color: C.blue, fontSize: 13, fontWeight: '600' },

  yearBtn:      { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, backgroundColor: C.border },
  yearBtnOn:    { backgroundColor: C.blue },
  yearBtnTxt:   { fontSize: 12, fontWeight: '600', color: C.textSub },
  yearBtnTxtOn: { color: '#fff' },

  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue, marginRight: 6 },
  legendTxt: { fontSize: 11, color: C.textSub, fontWeight: '600', letterSpacing: 0.5 },

  progressTrack: { height: 5, backgroundColor: C.border, borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  progressFill:  { height: 5, borderRadius: 3 },

  subjectCard: {
    width: IS_TABLET ? 210 : 175, backgroundColor: C.bg,
    borderRadius: 14, padding: 14, marginRight: 12,
    borderWidth: 1.5, borderColor: C.border,
  },
  subjectCardOpen:    { borderColor: C.blue, backgroundColor: '#F0F5FF' },
  subjectIconBox:     { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  subjectScore:       { fontSize: 16, fontWeight: '700' },
  subjectGrade:       { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  subjectName:        { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 2 },
  subjectInstructor:  { fontSize: 11, color: C.textSub, marginBottom: 8 },
  avgLabel:           { fontSize: 11, color: C.textSub },
  avgVal:             { fontSize: 11, fontWeight: '600', color: C.text },
  subjectExpanded:    { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border },
  subjectExpandedTxt: { fontSize: 11, color: C.textSub, marginBottom: 8 },
  subjectViewBtn:     { borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
  subjectViewBtnTxt:  { fontSize: 12, fontWeight: '700' },

  assessRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.border },
  assessIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  assessName:    { fontSize: 13, fontWeight: '600', color: C.text },
  assessDate:    { fontSize: 11, color: C.textMuted, marginTop: 2 },
  assessScore:   { fontSize: 15, fontWeight: '700' },
  showMoreBtn:   { alignItems: 'center', paddingTop: 12 },
  showMoreTxt:   { color: C.blue, fontSize: 13, fontWeight: '600' },

  currCard: {
    width: IS_TABLET ? 250 : 210, backgroundColor: C.bg,
    borderRadius: 14, padding: 14, marginRight: 12,
    borderWidth: 1.5, borderColor: C.border,
  },
  currTag:    { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  currTagTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  currWeeks:  { fontSize: 10, color: C.textMuted },
  currTitle:  { fontSize: 14, fontWeight: '700', color: C.text, marginTop: 8, marginBottom: 6 },
  currDesc:   { fontSize: 12, color: C.textSub, lineHeight: 18, marginBottom: 10 },
  currFile:   { backgroundColor: C.blueLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  currFileTxt:{ fontSize: 11, color: C.blue, fontWeight: '600' },

  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.card,
  },
  modalTitle:    { fontSize: 20, fontWeight: '700', color: C.text },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.border, alignItems: 'center', justifyContent: 'center' },
  modalCloseTxt: { fontSize: 13, color: C.textSub, fontWeight: '700' },

  reportRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  reportIconBox:     { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reportSubjectName: { fontSize: 14, fontWeight: '700', color: C.text },
  reportInstructor:  { fontSize: 12, color: C.textSub, marginBottom: 4 },
  reportGradeBadge:  { alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, minWidth: 60 },
  reportGradeText:   { fontSize: 18, fontWeight: '800' },
  reportScoreText:   { fontSize: 10, fontWeight: '600', marginTop: 2 },

  summaryBox:   { backgroundColor: C.blue, borderRadius: 16, padding: 20, marginTop: 8, marginBottom: 24 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 14 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#3B82F6' },
  summaryLabel: { fontSize: 13, color: '#93C5FD' },
  summaryVal:   { fontSize: 14, fontWeight: '700', color: '#fff' },
});
