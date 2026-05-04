// DashboardScreen.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure Dashboard screen — no sidebar logic here.
// Import this file into your Sidebar.js / App shell and render it as the
// "Dashboard" route screen.
//
// Usage in Sidebar.js (replace placeholder):
//   import DashboardScreen from './DashboardScreen';
//   const NAV_ITEMS = [
//     { key: 'Dashboard', label: 'Dashboard', icon: '⊞', screen: DashboardScreen },
//     ...
//   ];
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:          '#F0F4F8',
  white:       '#FFFFFF',
  blue:        '#2563EB',
  blueSoft:    '#EEF4FF',
  blueMid:     '#DBEAFE',
  green:       '#16A34A',
  greenSoft:   '#DCFCE7',
  orange:      '#EA580C',
  orangeSoft:  '#FFF7ED',
  red:         '#DC2626',
  redSoft:     '#FEF2F2',
  amber:       '#D97706',
  amberSoft:   '#FFFBEB',
  text:        '#0F172A',
  textMid:     '#334155',
  textSub:     '#64748B',
  textLight:   '#94A3B8',
  border:      '#E2E8F0',
  shadow:      '#0F172A',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, subColor, action, actionLabel, urgent, onPress, onActionPress }) => {
  const Content = (
    <View style={[card.wrap, IS_TABLET ? card.wrapTablet : card.wrapMobile]}>
      <Text style={card.title}>{title}</Text>
      <Text style={[card.value, urgent && { color: C.red }]}>{value}</Text>
      {sub   && <Text style={[card.sub, { color: subColor ?? C.textSub }]}>{sub}</Text>}
      {urgent && <View style={card.urgentBadge}><Text style={card.urgentText}>URGENT</Text></View>}
      {action && (
        <TouchableOpacity
          style={card.actionBtn}
          activeOpacity={0.8}
          onPress={onActionPress || onPress}
        >
          <Text style={card.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const card = StyleSheet.create({
  wrap: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 18,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: IS_TABLET ? 0 : 12,
  },
  wrapTablet: { flex: 1, marginHorizontal: 6 },
  wrapMobile: { marginHorizontal: 16 },
  title:  { fontSize: 11, fontWeight: '600', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  value:  { fontSize: 34, fontWeight: '800', color: C.blue, marginBottom: 4 },
  sub:    { fontSize: 12, fontWeight: '500', marginTop: 2 },
  urgentBadge: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: C.redSoft, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  urgentText:  { fontSize: 10, fontWeight: '800', color: C.red, letterSpacing: 1 },
  actionBtn:   { marginTop: 10, backgroundColor: C.blue, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  actionText:  { color: C.white, fontWeight: '700', fontSize: 12 },
});

// ─── Schedule Item ────────────────────────────────────────────────────────────
const ScheduleItem = ({ start, end, subject, grade, room, isCurrent, onMarkPresent }) => (
  <View style={[sched.row, isCurrent && sched.rowCurrent]}>
    <View style={sched.timeCol}>
      <Text style={sched.timeText}>{start}</Text>
      <View style={sched.timeLine} />
      <Text style={sched.timeText}>{end}</Text>
    </View>
    <View style={[sched.card, isCurrent && sched.cardCurrent]}>
      <View style={sched.cardTop}>
        {isCurrent && <View style={sched.currentBadge}><Text style={sched.currentText}>CURRENT</Text></View>}
        <Text style={sched.subject}>{subject}</Text>
        <TouchableOpacity activeOpacity={0.7} style={sched.menuBtn}>
          <Text style={sched.menuDot}>⋮</Text>
        </TouchableOpacity>
      </View>
      <Text style={sched.meta}>{grade} • {room}</Text>
      {isCurrent && (
        <View style={sched.attendanceRow}>
          <Text style={sched.attendLabel}>Attendance:</Text>
          <TouchableOpacity style={sched.presentBtn} activeOpacity={0.8} onPress={onMarkPresent}>
            <Text style={sched.presentText}>✓ Mark Present</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

const sched = StyleSheet.create({
  row:         { flexDirection: 'row', marginBottom: 10, alignItems: 'stretch' },
  rowCurrent:  {},
  timeCol:     { width: 46, alignItems: 'center', paddingTop: 4 },
  timeText:    { fontSize: 11, color: C.textSub, fontWeight: '500' },
  timeLine:    { flex: 1, width: 1, backgroundColor: C.border, marginVertical: 3 },
  card:        { flex: 1, backgroundColor: C.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  cardCurrent: { borderLeftWidth: 3, borderLeftColor: C.blue, borderColor: C.blueMid, backgroundColor: '#FAFCFF' },
  cardTop:     { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  currentBadge:{ backgroundColor: C.blueSoft, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  currentText: { fontSize: 9, fontWeight: '800', color: C.blue, letterSpacing: 0.8 },
  subject:     { flex: 1, fontSize: 15, fontWeight: '700', color: C.text },
  menuBtn:     { padding: 4 },
  menuDot:     { fontSize: 18, color: C.textLight },
  meta:        { fontSize: 12, color: C.textSub, marginBottom: 8 },
  attendanceRow:{ flexDirection: 'row', alignItems: 'center', gap: 10 },
  attendLabel: { fontSize: 12, color: C.textSub },
  presentBtn:  { backgroundColor: C.greenSoft, borderRadius: 7, paddingHorizontal: 12, paddingVertical: 6 },
  presentText: { fontSize: 12, fontWeight: '700', color: C.green },
});

// ─── Student Row ──────────────────────────────────────────────────────────────
const StudentRow = ({ name, roll, term, assignment, status }) => (
  <View style={table.row}>
    <Text style={[table.cell, table.name]}>{name}</Text>
    <Text style={[table.cell, table.roll]}>{roll}</Text>
    <View style={[table.cell, table.score]}>
      <Text style={table.scoreText}>{term}</Text>
    </View>
    <View style={[table.cell, table.score]}>
      <Text style={table.scoreText}>{assignment}</Text>
    </View>
    <View style={table.cell}>
      <View style={[table.badge, status === 'Saved' ? table.badgeSaved : table.badgePending]}>
        <Text style={[table.badgeText, status === 'Saved' ? table.badgeSavedText : table.badgePendingText]}>
          {status}
        </Text>
      </View>
    </View>
  </View>
);

const table = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  cell:       { flex: 1 },
  name:       { flex: 2, fontSize: 13, fontWeight: '600', color: C.text },
  roll:       { fontSize: 12, color: C.textSub },
  score:      { alignItems: 'center' },
  scoreText:  { fontSize: 13, fontWeight: '600', color: C.textMid, borderWidth: 1, borderColor: C.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, textAlign: 'center' },
  badge:      { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  badgeSaved: { backgroundColor: C.greenSoft },
  badgePending:{ backgroundColor: C.amberSoft },
  badgeText:  { fontSize: 11, fontWeight: '700' },
  badgeSavedText:   { color: C.green },
  badgePendingText: { color: C.amber },
});

// ─── Parent Message ───────────────────────────────────────────────────────────
const ParentMessage = ({ name, child, time, preview }) => (
  <TouchableOpacity style={msg.row} activeOpacity={0.75}>
    <View style={msg.avatar}>
      <Text style={msg.avatarText}>{name[0]}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <View style={msg.topRow}>
        <Text style={msg.name}>{name}</Text>
        <Text style={msg.time}>{time}</Text>
      </View>
      <Text style={msg.child}>{child}</Text>
      <Text style={msg.preview} numberOfLines={2}>{preview}</Text>
    </View>
  </TouchableOpacity>
);

const msg = StyleSheet.create({
  row:        { flexDirection: 'row', paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  avatar:     { width: 38, height: 38, borderRadius: 19, backgroundColor: C.blueMid, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 15, fontWeight: '800', color: C.blue },
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  name:       { fontSize: 13, fontWeight: '700', color: C.text },
  time:       { fontSize: 11, color: C.textLight },
  child:      { fontSize: 11, color: C.blue, fontWeight: '600', marginBottom: 2 },
  preview:    { fontSize: 12, color: C.textSub, lineHeight: 17 },
});

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboardpage() {
  const [classView, setClassView] = useState('Physics 10-A');
  const [screen, setScreen] = useState('dashboard');
  const [attendanceClass, setAttendanceClass] = useState('');
  const [attendanceDivision, setAttendanceDivision] = useState('');
  const [attendanceSearch, setAttendanceSearch] = useState('');

  const TEACHER_CLASSES = [
    { subject: 'Theoretical Physics', classDivision: '10-A', room: 'Room 102', period: '09:15 - 10:15' },
    { subject: 'Physics Theory', classDivision: '10-D', room: 'Room 104', period: '12:30 - 01:30' },
    { subject: 'Lab Physics', classDivision: '9-B', room: 'Lab 2', period: '02:00 - 03:00' },
  ];

  const ATTENDANCE_CLASSES = ['10', '9', '8'];
  const ATTENDANCE_DIVISIONS = ['A', 'B', 'C', 'D'];

  const ATTENDANCE_STUDENTS = {
    '10-A': [
      { id: '10A01', name: 'Aarav Iyer', roll: '10A01', status: 'Present' },
      { id: '10A14', name: 'Megha Reddy', roll: '10A14', status: 'Absent' },
      { id: '10A19', name: 'Kiran Nair', roll: '10A19', status: 'Present' },
    ],
    '10-D': [
      { id: '10D03', name: 'Vikram Das', roll: '10D03', status: 'Present' },
      { id: '10D10', name: 'Ria Sen', roll: '10D10', status: 'Late' },
    ],
    '9-B': [
      { id: '9B02', name: 'Ananya Patel', roll: '9B02', status: 'Present' },
      { id: '9B18', name: 'Nakul Rao', roll: '9B18', status: 'Absent' },
    ],
  };

  const PENDING_HOMEWORK = [
    { id: 'HW-102', title: 'Kinematics Worksheet', classDivision: '10-A', due: 'Today', pending: 12 },
    { id: 'HW-118', title: 'Force and Motion Quiz Prep', classDivision: '10-D', due: 'Tomorrow', pending: 9 },
    { id: 'HW-121', title: 'Light Reflection Notes', classDivision: '9-B', due: 'Today', pending: 7 },
  ];

  const SCHEDULE = [
    { start: '09:15', end: '10:15', subject: 'Theoretical Physics', grade: 'Grade 10-A', room: 'Room 102', isCurrent: true },
    { start: '10:30', end: '11:30', subject: 'Remedial English',    grade: 'Grade 8-B',  room: 'Room 402', isCurrent: false },
    { start: '12:30', end: '01:30', subject: 'Physics Theory',      grade: 'Grade 10-D', room: 'Room 104', isCurrent: false },
  ];

  const STUDENTS = [
    { name: 'Aarav Iyer',  roll: '10A01', term: '72',  assignment: '18', status: 'Saved'   },
    { name: 'Megha Reddy', roll: '10A14', term: '--',  assignment: '19', status: 'Pending' },
  ];

  const MESSAGES = [
    { name: 'Mr. Rajesh Iyer',    child: 'Aarav (10-A)',  time: '10:45 AM',  preview: 'Aarav is struggling with the new Kinematics numericals. Could he stay after class?' },
    { name: 'Mrs. Kavita Reddy',  child: 'Megha (10-A)', time: 'Yesterday', preview: 'Thank you for the detailed feedback on Megha\'s lab report. We are working on it...' },
  ];

  const COMMUNICATION_HISTORY = [
    { name: 'Mr. Rajesh Iyer', child: 'Aarav (10-A)', time: '10:45 AM', preview: 'Aarav is struggling with the new Kinematics numericals. Could he stay after class?' },
    { name: 'Mrs. Kavita Reddy', child: 'Megha (10-A)', time: 'Yesterday', preview: 'Thank you for the detailed feedback on Megha\'s lab report. We are working on it...' },
    { name: 'Mr. Deepak Nair', child: 'Kiran (10-A)', time: 'Mon, 06:30 PM', preview: 'Please confirm tomorrow\'s practical notebook submission details.' },
    { name: 'Mrs. Farah Ali', child: 'Ria (10-D)', time: 'Sun, 09:20 PM', preview: 'Ria will be late tomorrow due to a medical appointment.' },
    { name: 'Mr. Nitin Rao', child: 'Nakul (9-B)', time: 'Sat, 11:00 AM', preview: 'Could you share extra revision problems for chapter 5?' },
    { name: 'Mrs. Pooja Patel', child: 'Ananya (9-B)', time: 'Fri, 07:15 PM', preview: 'Ananya completed the assignment and uploaded it in the portal.' },
  ];

  const selectedAttendanceKey = attendanceClass && attendanceDivision
    ? `${attendanceClass}-${attendanceDivision}`
    : '';

  const attendanceList = ATTENDANCE_STUDENTS[selectedAttendanceKey] || [];
  const filteredAttendance = attendanceList.filter((student) => {
    const q = attendanceSearch.trim().toLowerCase();
    if (!q) return true;
    return student.name.toLowerCase().includes(q) || student.roll.toLowerCase().includes(q);
  });

  if (screen === 'classes') {
    return (
      <ScrollView style={dash.scroll} contentContainerStyle={dash.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={dash.header}>
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setScreen('dashboard')} style={dash.backPill}>
              <Text style={dash.backPillText}>← Back to Dashboard</Text>
            </TouchableOpacity>
            <Text style={dash.greeting}>Today's Classes</Text>
            <Text style={dash.greetingSub}>Showing only classes assigned to you</Text>
          </View>
        </View>

        <View style={dash.section}>
          {TEACHER_CLASSES.map((item) => (
            <View key={`${item.classDivision}-${item.subject}`} style={dash.listCard}>
              <Text style={dash.listTitle}>{item.subject}</Text>
              <Text style={dash.listMeta}>Class {item.classDivision} • {item.room}</Text>
              <Text style={dash.listSub}>{item.period}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (screen === 'attendance-select') {
    return (
      <ScrollView style={dash.scroll} contentContainerStyle={dash.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={dash.header}>
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setScreen('dashboard')} style={dash.backPill}>
              <Text style={dash.backPillText}>← Back to Dashboard</Text>
            </TouchableOpacity>
            <Text style={dash.greeting}>Attendance Form</Text>
            <Text style={dash.greetingSub}>Select class and division to open attendance mark list</Text>
          </View>
        </View>

        <View style={dash.section}>
          <Text style={dash.formLabel}>Select Class</Text>
          <View style={dash.optionRow}>
            {ATTENDANCE_CLASSES.map((cls) => {
              const active = attendanceClass === cls;
              return (
                <TouchableOpacity
                  key={cls}
                  style={[dash.optionBtn, active && dash.optionBtnActive]}
                  activeOpacity={0.8}
                  onPress={() => setAttendanceClass(cls)}
                >
                  <Text style={[dash.optionBtnText, active && dash.optionBtnTextActive]}>{cls}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[dash.formLabel, { marginTop: 14 }]}>Select Division</Text>
          <View style={dash.optionRow}>
            {ATTENDANCE_DIVISIONS.map((div) => {
              const active = attendanceDivision === div;
              return (
                <TouchableOpacity
                  key={div}
                  style={[dash.optionBtn, active && dash.optionBtnActive]}
                  activeOpacity={0.8}
                  onPress={() => setAttendanceDivision(div)}
                >
                  <Text style={[dash.optionBtnText, active && dash.optionBtnTextActive]}>{div}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[dash.assignBtn, (!attendanceClass || !attendanceDivision) && dash.disabledBtn]}
            activeOpacity={0.82}
            onPress={() => {
              if (attendanceClass && attendanceDivision) {
                setAttendanceSearch('');
                setScreen('attendance-list');
              }
            }}
          >
            <Text style={dash.assignBtnText}>Open Attendance List</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (screen === 'attendance-list') {
    return (
      <ScrollView style={dash.scroll} contentContainerStyle={dash.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={dash.header}>
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setScreen('attendance-select')} style={dash.backPill}>
              <Text style={dash.backPillText}>← Back to Attendance Form</Text>
            </TouchableOpacity>
            <Text style={dash.greeting}>Attendance Mark List</Text>
            <Text style={dash.greetingSub}>Class {selectedAttendanceKey || '--'}</Text>
          </View>
        </View>

        <View style={dash.section}>
          <TextInput
            style={dash.searchInput}
            placeholder="Search by student name or roll"
            value={attendanceSearch}
            onChangeText={setAttendanceSearch}
            placeholderTextColor={C.textLight}
          />

          {!filteredAttendance.length ? (
            <Text style={dash.emptyText}>No students found for this class/division.</Text>
          ) : (
            filteredAttendance.map((student) => (
              <View key={student.id} style={dash.listCard}>
                <Text style={dash.listTitle}>{student.name}</Text>
                <Text style={dash.listMeta}>Roll No: {student.roll}</Text>
                <View style={[table.badge, student.status === 'Present' ? table.badgeSaved : table.badgePending]}>
                  <Text style={[table.badgeText, student.status === 'Present' ? table.badgeSavedText : table.badgePendingText]}>
                    {student.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    );
  }

  if (screen === 'pending-homework') {
    return (
      <ScrollView style={dash.scroll} contentContainerStyle={dash.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={dash.header}>
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setScreen('dashboard')} style={dash.backPill}>
              <Text style={dash.backPillText}>← Back to Dashboard</Text>
            </TouchableOpacity>
            <Text style={dash.greeting}>Pending Homework</Text>
            <Text style={dash.greetingSub}>All pending homework submissions</Text>
          </View>
        </View>

        <View style={dash.section}>
          {PENDING_HOMEWORK.map((item) => (
            <View key={item.id} style={dash.listCard}>
              <Text style={dash.listTitle}>{item.title}</Text>
              <Text style={dash.listMeta}>Class {item.classDivision} • Due: {item.due}</Text>
              <Text style={dash.listSub}>{item.pending} submissions pending</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (screen === 'communication-hub') {
    return (
      <ScrollView style={dash.scroll} contentContainerStyle={dash.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={dash.header}>
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setScreen('dashboard')} style={dash.backPill}>
              <Text style={dash.backPillText}>← Back to Dashboard</Text>
            </TouchableOpacity>
            <Text style={dash.greeting}>Communication History</Text>
            <Text style={dash.greetingSub}>Complete parent communication history list</Text>
          </View>
        </View>

        <View style={dash.section}>
          {COMMUNICATION_HISTORY.map((item, idx) => (
            <ParentMessage
              key={`${item.name}-${item.child}-${idx}`}
              name={item.name}
              child={item.child}
              time={item.time}
              preview={item.preview}
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={dash.scroll}
      contentContainerStyle={dash.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {Platform.OS !== 'web' && <StatusBar barStyle="dark-content" backgroundColor={C.bg} />}

      {/* ── Header ── */}
      <View style={dash.header}>
        <View>
          <Text style={dash.greeting}>Good morning, Dr. Sharma.</Text>
          <Text style={dash.greetingSub}>
            You have{' '}
            <Text style={{ color: C.blue, fontWeight: '700' }}>4 classes</Text>
            {' '}today and 15 pending administrative tasks.
          </Text>
        </View>
        {IS_TABLET && (
          <View style={dash.headerRight}>
            <TouchableOpacity style={dash.notifBtn} activeOpacity={0.8}>
              <Text style={dash.notifIcon}>🔔</Text>
              <View style={dash.notifDot} />
            </TouchableOpacity>
            <View style={dash.doctorChip}>
              <View style={dash.doctorAvatar}><Text style={dash.doctorInitial}>A</Text></View>
              <View>
                <Text style={dash.doctorName}>Dr. Arnab Sharma</Text>
                <Text style={dash.doctorDept}>PHYSICS DEPARTMENT</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ── Stat Cards ── */}
      {IS_TABLET ? (
        <View style={dash.statsRow}>
          <StatCard
            title="Today's Classes"
            value="4"
            sub="Next: 10:15 AM ›"
            subColor={C.blue}
            onPress={() => setScreen('classes')}
          />
          <StatCard
            title="Pending Attendance"
            value="2"
            onPress={() => setScreen('attendance-select')}
          />
          <StatCard
            title="Homework Pending"
            value="12"
            sub="Grading deadline tomorrow"
            subColor={C.amber}
            onPress={() => setScreen('pending-homework')}
          />
        </View>
      ) : (
        <>
          <StatCard
            title="Today's Classes"
            value="4"
            sub="Next: 10:15 AM ›"
            subColor={C.blue}
            onPress={() => setScreen('classes')}
          />
          <StatCard
            title="Pending Attendance"
            value="2"
            onPress={() => setScreen('attendance-select')}
          />
          <StatCard
            title="Homework Pending"
            value="12"
            sub="Grading deadline tomorrow"
            subColor={C.amber}
            onPress={() => setScreen('pending-homework')}
          />
        </>
      )}

      {/* ── Main two-col (tablet) / single-col (mobile) ── */}
      <View style={IS_TABLET ? dash.twoCol : null}>

        {/* LEFT COLUMN */}
        <View style={IS_TABLET ? dash.colLeft : null}>

          {/* Today's Schedule */}
          <View style={dash.section}>
            <View style={dash.sectionHead}>
              <Text style={dash.sectionTitle}>Today's Schedule</Text>
              <TouchableOpacity activeOpacity={0.75} style={dash.fullTimetableBtn}>
                <Text style={dash.fullTimetableText}>Full Timetable ☰</Text>
              </TouchableOpacity>
            </View>
            {SCHEDULE.map((item, i) => (
              <React.Fragment key={i}>
                {i === 2 && (
                  <View style={dash.lunchBreak}>
                    <View style={dash.lunchLine} />
                    <Text style={dash.lunchText}>LUNCH BREAK</Text>
                    <View style={dash.lunchLine} />
                  </View>
                )}
                <ScheduleItem {...item} />
              </React.Fragment>
            ))}
          </View>

          {/* Active Class Modules */}
          <View style={dash.section}>
            <View style={dash.sectionHead}>
              <Text style={dash.sectionTitle}>Active Class Modules</Text>
              <View style={dash.viewChip}>
                <Text style={dash.viewLabel}>View: </Text>
                <TouchableOpacity
                  style={dash.viewSelector}
                  activeOpacity={0.8}
                  onPress={() => setClassView(classView === 'Physics 10-A' ? 'Physics 10-D' : 'Physics 10-A')}
                >
                  <Text style={dash.viewSelectorText}>{classView}  ▾</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Table Header */}
            <View style={[table.row, { borderBottomWidth: 2, borderBottomColor: C.border }]}>
              {['STUDENT NAME', 'ROLL NO', 'TERM 1 (80)', 'ASSIGN (20)', 'STATUS'].map(h => (
                <Text key={h} style={[table.cell, h === 'STUDENT NAME' ? table.name : null, dash.tableHead]}>{h}</Text>
              ))}
            </View>
            {STUDENTS.map((s, i) => <StudentRow key={i} {...s} />)}
          </View>
        </View>

        {/* RIGHT COLUMN */}
        <View style={IS_TABLET ? dash.colRight : null}>

          {/* Parent Portal */}
          <View style={dash.section}>
            <View style={dash.sectionHead}>
              <Text style={dash.sectionTitle}>Parent Portal</Text>
              <View style={dash.newBadge}><Text style={dash.newBadgeText}>3 NEW</Text></View>
            </View>
            {MESSAGES.map((m, i) => <ParentMessage key={i} {...m} />)}
            <TouchableOpacity style={dash.openHubBtn} activeOpacity={0.8} onPress={() => setScreen('communication-hub')}>
              <Text style={dash.openHubText}>Open Full Communication Hub</Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Insight */}
          <View style={dash.insightCard}>
            <Text style={dash.insightLabel}>WEEKLY INSIGHT</Text>
            <Text style={dash.insightTitle}>Class Engagement</Text>
            <View style={dash.insightRow}>
              <Text style={dash.insightValue}>94%</Text>
              <Text style={dash.insightDelta}>▲ +2.4% this week</Text>
            </View>
            <View style={dash.insightBar}>
              <View style={[dash.insightFill, { width: '94%' }]} />
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

// ─── Dashboard Styles ─────────────────────────────────────────────────────────
const dash = StyleSheet.create({
  scroll:        { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: IS_TABLET ? 28 : 16,
    paddingTop: IS_TABLET ? 28 : 20,
    paddingBottom: 20,
  },
  greeting:    { fontSize: IS_TABLET ? 26 : 22, fontWeight: '800', color: C.text, marginBottom: 4 },
  greetingSub: { fontSize: 13, color: C.textSub, lineHeight: 19 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  notifBtn:    { width: 38, height: 38, borderRadius: 19, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  notifIcon:   { fontSize: 16 },
  notifDot:    { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: C.red, borderWidth: 1.5, borderColor: C.white },
  doctorChip:  { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.white, borderRadius: 12, padding: 8, borderWidth: 1, borderColor: C.border },
  doctorAvatar:{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.blue, justifyContent: 'center', alignItems: 'center' },
  doctorInitial:{ color: C.white, fontWeight: '800', fontSize: 14 },
  doctorName:  { fontSize: 13, fontWeight: '700', color: C.text },
  doctorDept:  { fontSize: 9, color: C.textLight, letterSpacing: 0.8, fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 22,
    marginBottom: 20,
    gap: 0,
  },

  // Layout
  twoCol:  { flexDirection: 'row', paddingHorizontal: 22, gap: 20, alignItems: 'flex-start' },
  colLeft: { flex: 1.4 },
  colRight:{ flex: 1 },

  // Section
  section: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: IS_TABLET ? 20 : 16,
    marginBottom: 16,
    marginHorizontal: IS_TABLET ? 0 : 16,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHead:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  fullTimetableBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  fullTimetableText:{ fontSize: 12, color: C.blue, fontWeight: '600' },

  // Lunch
  lunchBreak: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
  lunchLine:  { flex: 1, height: 1, backgroundColor: C.border },
  lunchText:  { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 1.2 },

  // Table
  tableHead: { fontSize: 10, fontWeight: '700', color: C.textLight, letterSpacing: 0.6 },
  viewChip:  { flexDirection: 'row', alignItems: 'center' },
  viewLabel: { fontSize: 12, color: C.textSub },
  viewSelector: { backgroundColor: C.blueSoft, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 5 },
  viewSelectorText: { fontSize: 12, fontWeight: '700', color: C.blue },

  // Action and forms
  assignBtn: { backgroundColor: C.blue, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 2, shadowColor: C.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 },
  assignBtnText: { color: C.white, fontWeight: '800', fontSize: 14 },
  disabledBtn: { opacity: 0.5 },
  backPill: {
    alignSelf: 'flex-start',
    backgroundColor: C.blueSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  backPillText: { color: C.blue, fontSize: 12, fontWeight: '700' },
  formLabel: { fontSize: 12, fontWeight: '700', color: C.textSub, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.7 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: C.white,
    minWidth: 54,
    alignItems: 'center',
  },
  optionBtnActive: { borderColor: C.blue, backgroundColor: C.blueSoft },
  optionBtnText: { fontSize: 14, fontWeight: '700', color: C.textMid },
  optionBtnTextActive: { color: C.blue },
  listCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    backgroundColor: C.white,
    padding: 12,
    marginBottom: 10,
  },
  listTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 4 },
  listMeta: { fontSize: 12, color: C.textSub, marginBottom: 4 },
  listSub: { fontSize: 12, color: C.blue, fontWeight: '600' },
  searchInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: C.text,
    marginBottom: 12,
    backgroundColor: C.white,
  },
  emptyText: { fontSize: 13, color: C.textSub, textAlign: 'center', marginTop: 6 },

  // Parent Portal
  newBadge:     { backgroundColor: C.red, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  newBadgeText: { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  openHubBtn:   { marginTop: 10, alignItems: 'center', paddingVertical: 6 },
  openHubText:  { color: C.blue, fontSize: 13, fontWeight: '700' },

  // Insight
  insightCard: {
    backgroundColor: C.blue,
    borderRadius: 16,
    padding: IS_TABLET ? 20 : 16,
    marginBottom: 16,
    marginHorizontal: IS_TABLET ? 0 : 16,
  },
  insightLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: 1.2, marginBottom: 4 },
  insightTitle: { fontSize: 18, fontWeight: '800', color: C.white, marginBottom: 10 },
  insightRow:   { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 12 },
  insightValue: { fontSize: 38, fontWeight: '900', color: C.white },
  insightDelta: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  insightBar:   { height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' },
  insightFill:  { height: '100%', backgroundColor: C.white, borderRadius: 3 },
});