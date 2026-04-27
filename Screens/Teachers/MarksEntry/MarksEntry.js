import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, TextInput, Alert,
} from 'react-native';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CLASSES = ['10-A', '10-B', '11-A', '12-C'];

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'];

const CLASS_STUDENTS = {
  '10-A': [
    { id: 1, name: 'Aarav Sharma',    roll: '01' },
    { id: 2, name: 'Bhavna Patel',    roll: '02' },
    { id: 3, name: 'Chirag Mehta',    roll: '03' },
    { id: 4, name: 'Deepika Rao',     roll: '04' },
    { id: 5, name: 'Eshan Verma',     roll: '05' },
    { id: 6, name: 'Farida Khan',     roll: '06' },
    { id: 7, name: 'Gaurav Joshi',    roll: '07' },
    { id: 8, name: 'Hina Desai',      roll: '08' },
  ],
  '10-B': [
    { id: 9,  name: 'Ishaan Gupta',   roll: '01' },
    { id: 10, name: 'Jyoti Nair',     roll: '02' },
    { id: 11, name: 'Karan Singh',    roll: '03' },
    { id: 12, name: 'Lavanya Iyer',   roll: '04' },
    { id: 13, name: 'Manav Tiwari',   roll: '05' },
    { id: 14, name: 'Nikita Bose',    roll: '06' },
  ],
  '11-A': [
    { id: 15, name: 'Om Prakash',     roll: '01' },
    { id: 16, name: 'Pooja Reddy',    roll: '02' },
    { id: 17, name: 'Rohit Malhotra', roll: '03' },
    { id: 18, name: 'Sneha Pillai',   roll: '04' },
    { id: 19, name: 'Tanvi Shah',     roll: '05' },
    { id: 20, name: 'Uday Kapoor',    roll: '06' },
  ],
  '12-C': [
    { id: 22, name: 'Waqar Ahmed',    roll: '01' },
    { id: 23, name: 'Xena D\'Souza',  roll: '02' },
    { id: 24, name: 'Yash Kulkarni',  roll: '03' },
    { id: 25, name: 'Zara Siddiqui',  roll: '04' },
    { id: 26, name: 'Arjun Pawar',    roll: '05' },
  ],
};

const EXAM_TIMETABLES = {
  'Mid Term': [
    { date: 'May 05, 2025', day: 'Monday',    subject: 'Mathematics', time: '10:00 AM – 12:00 PM', maxMarks: 50 },
    { date: 'May 07, 2025', day: 'Wednesday', subject: 'Physics',     time: '10:00 AM – 12:00 PM', maxMarks: 50 },
    { date: 'May 09, 2025', day: 'Friday',    subject: 'Chemistry',   time: '10:00 AM – 12:00 PM', maxMarks: 50 },
    { date: 'May 12, 2025', day: 'Monday',    subject: 'English',     time: '10:00 AM – 12:00 PM', maxMarks: 50 },
    { date: 'May 14, 2025', day: 'Wednesday', subject: 'Biology',     time: '10:00 AM – 12:00 PM', maxMarks: 50 },
  ],
  'Term 1': [
    { date: 'Aug 04, 2025', day: 'Monday',    subject: 'Mathematics', time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Aug 06, 2025', day: 'Wednesday', subject: 'Physics',     time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Aug 08, 2025', day: 'Friday',    subject: 'Chemistry',   time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Aug 11, 2025', day: 'Monday',    subject: 'English',     time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Aug 13, 2025', day: 'Wednesday', subject: 'Biology',     time: '10:00 AM – 01:00 PM', maxMarks: 100 },
  ],
  'Term 2': [
    { date: 'Jan 05, 2026', day: 'Monday',    subject: 'Mathematics', time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Jan 07, 2026', day: 'Wednesday', subject: 'Physics',     time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Jan 09, 2026', day: 'Friday',    subject: 'Chemistry',   time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Jan 12, 2026', day: 'Monday',    subject: 'English',     time: '10:00 AM – 01:00 PM', maxMarks: 100 },
    { date: 'Jan 14, 2026', day: 'Wednesday', subject: 'Biology',     time: '10:00 AM – 01:00 PM', maxMarks: 100 },
  ],
};

const EXAM_COLORS = {
  'Mid Term': { bg: '#F3E5F5', border: '#CE93D8', text: '#6A1B9A', badge: '#E1BEE7' },
  'Term 1':   { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0', badge: '#BBDEFB' },
  'Term 2':   { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32', badge: '#C8E6C9' },
};

const GRADE_CONFIG = [
  { min: 90, grade: 'A+', color: '#1B5E20' },
  { min: 80, grade: 'A',  color: '#2E7D32' },
  { min: 70, grade: 'B+', color: '#1565C0' },
  { min: 60, grade: 'B',  color: '#1976D2' },
  { min: 50, grade: 'C',  color: '#E65100' },
  { min: 35, grade: 'D',  color: '#BF360C' },
  { min: 0,  grade: 'F',  color: '#B71C1C' },
];

function getGrade(marks, max) {
  if (marks === '' || marks === null || marks === undefined) return null;
  const pct = (parseFloat(marks) / max) * 100;
  return GRADE_CONFIG.find((g) => pct >= g.min) || GRADE_CONFIG[GRADE_CONFIG.length - 1];
}

// ─── Timetable Screen ────────────────────────────────────────────────────────
function TimetableScreen({ exam, onBack }) {
  const timetable = EXAM_TIMETABLES[exam];
  const colors    = EXAM_COLORS[exam];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{exam} · Timetable</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.timetableBanner, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <Text style={[styles.timetableBannerTitle, { color: colors.text }]}>{exam} Examination</Text>
          <Text style={[styles.timetableBannerSub, { color: colors.text }]}>
            {timetable[0].date}  →  {timetable[timetable.length - 1].date}
          </Text>
          <View style={[styles.timetableBannerBadge, { backgroundColor: colors.badge }]}>
            <Text style={[styles.timetableBannerBadgeText, { color: colors.text }]}>
              Max Marks: {timetable[0].maxMarks} per subject
            </Text>
          </View>
        </View>

        {/* Schedule cards */}
        {timetable.map((row, index) => (
          <View key={index} style={[styles.timetableCard, { borderLeftColor: colors.border }]}>
            <View style={styles.timetableCardLeft}>
              <Text style={[styles.timetableCardIndex, { color: colors.text }]}>
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.timetableCardBody}>
              <Text style={styles.timetableSubject}>{row.subject}</Text>
              <Text style={styles.timetableDate}>{row.day}, {row.date}</Text>
              <View style={styles.timetableMetaRow}>
                <View style={[styles.timetableTag, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.timetableTagText, { color: colors.text }]}>🕐 {row.time}</Text>
                </View>
                <View style={[styles.timetableTag, { backgroundColor: '#FFF8E1' }]}>
                  <Text style={[styles.timetableTagText, { color: '#E65100' }]}>📝 {row.maxMarks} marks</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.formSectionLabel}>Grade Legend</Text>
          <View style={styles.legendGrid}>
            {GRADE_CONFIG.map((g) => (
              <View key={g.grade} style={[styles.legendChip, { borderColor: g.color + '55', backgroundColor: g.color + '11' }]}>
                <Text style={[styles.legendGrade, { color: g.color }]}>{g.grade}</Text>
                <Text style={styles.legendMin}>{g.min}%+</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Enter Marks Screen ───────────────────────────────────────────────────────
function EnterMarksScreen({ classKey, exam, subject, onBack, onSave, existingMarks }) {
  const students  = CLASS_STUDENTS[classKey] || [];
  const maxMarks  = EXAM_TIMETABLES[exam].find((r) => r.subject === subject)?.maxMarks || 100;
  const [marks, setMarks]     = useState(() => {
    const init = {};
    students.forEach((s) => { init[s.id] = existingMarks?.[s.id] ?? ''; });
    return init;
  });
  const [errors, setErrors]   = useState({});

  const validate = (id, val) => {
    const n = parseFloat(val);
    if (val === '') return '';
    if (isNaN(n) || n < 0)       return 'Invalid';
    if (n > maxMarks)             return `Max ${maxMarks}`;
    return '';
  };

  const handleChange = (id, val) => {
    setMarks((prev) => ({ ...prev, [id]: val }));
    setErrors((prev) => ({ ...prev, [id]: validate(id, val) }));
  };

  const handleSave = () => {
    const newErrors = {};
    let hasError = false;
    students.forEach((s) => {
      const err = validate(s.id, marks[s.id]);
      if (err) { newErrors[s.id] = err; hasError = true; }
    });
    if (hasError) { setErrors(newErrors); return; }
    onSave(classKey, exam, subject, marks);
    Alert.alert('✅ Marks Saved', `Marks for ${subject} (${exam}) saved successfully!`);
    onBack();
  };

  const filled  = students.filter((s) => marks[s.id] !== '').length;
  const average = students.length
    ? (students.reduce((sum, s) => sum + (parseFloat(marks[s.id]) || 0), 0) / students.length).toFixed(1)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle} numberOfLines={1}>{subject} · {exam}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Info bar */}
      <View style={styles.infoBar}>
        <View style={styles.infoChip}>
          <Text style={styles.infoChipVal}>{classKey}</Text>
          <Text style={styles.infoChipLabel}>Class</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoChip}>
          <Text style={styles.infoChipVal}>{maxMarks}</Text>
          <Text style={styles.infoChipLabel}>Max Marks</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoChip}>
          <Text style={styles.infoChipVal}>{filled}/{students.length}</Text>
          <Text style={styles.infoChipLabel}>Entered</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoChip}>
          <Text style={styles.infoChipVal}>{average}</Text>
          <Text style={styles.infoChipLabel}>Avg</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.marksCard}>
          <Text style={styles.marksCardHeader}>
            Enter marks out of <Text style={{ color: '#1B3FA0' }}>{maxMarks}</Text>
          </Text>
          {students.map((student, index) => {
            const val   = marks[student.id];
            const err   = errors[student.id];
            const grade = getGrade(val, maxMarks);
            return (
              <View
                key={student.id}
                style={[styles.marksRow, index === students.length - 1 && { borderBottomWidth: 0 }]}
              >
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: grade ? grade.color + '18' : '#EEF2FF' }]}>
                  <Text style={[styles.avatarText, { color: grade ? grade.color : '#1B3FA0' }]}>
                    {student.name.charAt(0)}
                  </Text>
                </View>

                {/* Name */}
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>Roll No. {student.roll}</Text>
                </View>

                {/* Grade badge */}
                {grade && (
                  <View style={[styles.gradeBadge, { backgroundColor: grade.color + '18', borderColor: grade.color + '55' }]}>
                    <Text style={[styles.gradeBadgeText, { color: grade.color }]}>{grade.grade}</Text>
                  </View>
                )}

                {/* Input */}
                <View style={styles.marksInputWrap}>
                  <TextInput
                    style={[styles.marksInput, err ? styles.marksInputError : {}]}
                    value={String(val)}
                    onChangeText={(t) => handleChange(student.id, t)}
                    keyboardType="numeric"
                    placeholder="—"
                    placeholderTextColor="#CCC"
                    maxLength={3}
                  />
                  {err ? <Text style={styles.marksErr}>{err}</Text> : null}
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footerBar}>
        <View style={styles.footerProgress}>
          <View style={styles.footerProgressBar}>
            <View style={[styles.footerProgressFill, { width: `${(filled / students.length) * 100}%` }]} />
          </View>
          <Text style={styles.footerProgressText}>{filled} of {students.length} marks entered</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>💾  Save Marks</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Marks Entry Class Screen ────────────────────────────────────────────────
function MarksEntryClassScreen({ classKey, exam, onBack, savedMarks, onSave }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  if (selectedSubject) {
    return (
      <EnterMarksScreen
        classKey={classKey}
        exam={exam}
        subject={selectedSubject}
        onBack={() => setSelectedSubject(null)}
        onSave={onSave}
        existingMarks={savedMarks?.[classKey]?.[exam]?.[selectedSubject]}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Class {classKey} · {exam}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Subject to Enter Marks</Text>
          <Text style={styles.cardHint}>Tap a subject to open the marks entry sheet</Text>

          {SUBJECTS.map((subject, index) => {
            const subjectMarks = savedMarks?.[classKey]?.[exam]?.[subject];
            const students     = CLASS_STUDENTS[classKey] || [];
            const filled = subjectMarks
              ? students.filter((s) => subjectMarks[s.id] !== '' && subjectMarks[s.id] !== undefined).length
              : 0;
            const isDone = filled === students.length && students.length > 0;
            const maxMarks = EXAM_TIMETABLES[exam].find((r) => r.subject === subject)?.maxMarks || 100;

            return (
              <TouchableOpacity
                key={subject}
                style={[
                  styles.subjectRow,
                  index === SUBJECTS.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.75}
                onPress={() => setSelectedSubject(subject)}
              >
                <View style={[styles.subjectIcon, { backgroundColor: isDone ? '#E8F5E9' : '#EEF2FF' }]}>
                  <Text style={{ fontSize: 18 }}>
                    {isDone ? '✅' : filled > 0 ? '📝' : '📋'}
                  </Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.subjectName}>{subject}</Text>
                  <Text style={styles.subjectMeta}>
                    Max: {maxMarks} marks · {isDone ? 'Complete' : filled > 0 ? `${filled}/${students.length} entered` : 'Not started'}
                  </Text>
                  {filled > 0 && (
                    <View style={styles.subjectMiniBar}>
                      <View style={[styles.subjectMiniFill, {
                        width: `${(filled / students.length) * 100}%`,
                        backgroundColor: isDone ? '#4CAF50' : '#1B3FA0',
                      }]} />
                    </View>
                  )}
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Saved Marks Detail Screen ───────────────────────────────────────────────
function SavedMarksDetailScreen({ classKey, exam, subject, marksMap, onBack }) {
  const students = CLASS_STUDENTS[classKey] || [];
  const maxMarks = EXAM_TIMETABLES[exam].find((r) => r.subject === subject)?.maxMarks || 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle} numberOfLines={1}>{classKey} · {subject} · {exam}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saved Student Marks</Text>
          <Text style={styles.cardHint}>Showing all student names and saved marks (Max {maxMarks})</Text>

          {students.map((student, index) => {
            const value = marksMap?.[student.id];
            const hasValue = value !== '' && value !== undefined;
            const grade = hasValue ? getGrade(value, maxMarks) : null;

            return (
              <View
                key={student.id}
                style={[styles.savedStudentRow, index === students.length - 1 && { borderBottomWidth: 0 }]}
              >
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>Roll No. {student.roll}</Text>
                </View>

                <View style={styles.savedStudentRight}>
                  <Text style={styles.savedStudentMark}>{hasValue ? value : '—'}</Text>
                  <Text style={styles.savedStudentOutof}>/ {maxMarks}</Text>
                  {grade && (
                    <View style={[styles.gradeBadge, { backgroundColor: grade.color + '18', borderColor: grade.color + '55', marginRight: 0 }]}>
                      <Text style={[styles.gradeBadgeText, { color: grade.color }]}>{grade.grade}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Main Marks Entry Screen ──────────────────────────────────────────────────
export default function TeacherMarksEntry() {
  const [screen, setScreen]           = useState('home');   // 'home' | 'timetable' | 'classmarks'
  const [selectedExam, setSelectedExam]   = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSavedSubject, setSelectedSavedSubject] = useState(null);
  // savedMarks: { classKey: { examKey: { subject: { studentId: marks } } } }
  const [savedMarks, setSavedMarks] = useState({});

  const getSavedSubjectSummary = (classKey, examKey) => {
    if (!classKey || !examKey) return [];

    const classEntry = savedMarks?.[classKey]?.[examKey];
    const students = CLASS_STUDENTS[classKey] || [];
    if (!classEntry || !students.length) return [];

    return SUBJECTS.map((subject) => {
      const marksMap = classEntry[subject];
      if (!marksMap) return null;

      const enteredValues = students
        .map((student) => marksMap[student.id])
        .filter((v) => v !== '' && v !== undefined)
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v));

      if (!enteredValues.length) return null;

      const average = (enteredValues.reduce((sum, value) => sum + value, 0) / enteredValues.length).toFixed(1);
      return {
        subject,
        entered: enteredValues.length,
        total: students.length,
        average,
      };
    }).filter(Boolean);
  };

  const handleSaveMarks = (classKey, exam, subject, marksMap) => {
    setSavedMarks((prev) => ({
      ...prev,
      [classKey]: {
        ...(prev[classKey] || {}),
        [exam]: {
          ...((prev[classKey] || {})[exam] || {}),
          [subject]: marksMap,
        },
      },
    }));
  };

  if (screen === 'timetable' && selectedExam) {
    return (
      <TimetableScreen
        exam={selectedExam}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'classmarks' && selectedClass && selectedExam) {
    return (
      <MarksEntryClassScreen
        classKey={selectedClass}
        exam={selectedExam}
        onBack={() => setScreen('home')}
        savedMarks={savedMarks}
        onSave={handleSaveMarks}
      />
    );
  }

  if (screen === 'saveddetails' && selectedClass && selectedExam && selectedSavedSubject) {
    return (
      <SavedMarksDetailScreen
        classKey={selectedClass}
        exam={selectedExam}
        subject={selectedSavedSubject}
        marksMap={savedMarks?.[selectedClass]?.[selectedExam]?.[selectedSavedSubject]}
        onBack={() => setScreen('home')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Marks Entry</Text>
          <Text style={styles.subtitle}>Enter and manage student examination marks</Text>
        </View>

        {/* ── Select Exam ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Exam</Text>
          <Text style={styles.cardHint}>Tap an exam to view its timetable</Text>

          {Object.keys(EXAM_TIMETABLES).map((exam) => {
            const colors = EXAM_COLORS[exam];
            const tt     = EXAM_TIMETABLES[exam];
            return (
              <TouchableOpacity
                key={exam}
                style={[styles.examCard, { borderColor: colors.border, backgroundColor: colors.bg }]}
                activeOpacity={0.8}
                onPress={() => { setSelectedExam(exam); setScreen('timetable'); }}
              >
                <View style={styles.examCardLeft}>
                  <Text style={[styles.examCardTitle, { color: colors.text }]}>{exam}</Text>
                  <Text style={[styles.examCardDates, { color: colors.text }]}>
                    {tt[0].date}  →  {tt[tt.length - 1].date}
                  </Text>
                  <Text style={[styles.examCardSub, { color: colors.text + 'CC' }]}>
                    {tt.length} subjects · {tt[0].maxMarks} marks each
                  </Text>
                </View>
                <View style={[styles.examCardArrow, { backgroundColor: colors.border }]}>
                  <Text style={[styles.examCardArrowText, { color: colors.text }]}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Enter Marks for Class ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter Marks for Class</Text>
          <Text style={styles.cardHint}>Choose exam and class to start entering marks</Text>

          {/* Exam selector tabs */}
          <Text style={styles.miniLabel}>Exam</Text>
          <View style={styles.tabRow}>
            {Object.keys(EXAM_TIMETABLES).map((exam) => {
              const colors = EXAM_COLORS[exam];
              const active = selectedExam === exam;
              return (
                <TouchableOpacity
                  key={exam}
                  style={[
                    styles.tabBtn,
                    active
                      ? { backgroundColor: colors.text, borderColor: colors.text }
                      : { backgroundColor: '#F0F2F5', borderColor: '#E0E0E0' },
                  ]}
                  onPress={() => setSelectedExam(exam)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabBtnText, { color: active ? '#FFF' : '#666' }]}>{exam}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Class selector */}
          <Text style={[styles.miniLabel, { marginTop: 14 }]}>Class</Text>
          <View style={styles.classGrid}>
            {CLASSES.map((cls) => {
              const active = selectedClass === cls;
              // Check overall completion for this class + exam
              const classEntry = selectedExam ? savedMarks?.[cls]?.[selectedExam] : null;
              const totalSubjects = SUBJECTS.length;
              const doneSubjects  = classEntry
                ? SUBJECTS.filter((sub) => {
                    const students = CLASS_STUDENTS[cls] || [];
                    const m = classEntry[sub];
                    return m && students.every((s) => m[s.id] !== '' && m[s.id] !== undefined);
                  }).length
                : 0;

              return (
                <TouchableOpacity
                  key={cls}
                  style={[
                    styles.classCard,
                    active && styles.classCardActive,
                  ]}
                  onPress={() => setSelectedClass(cls)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.classCardText, active && styles.classCardTextActive]}>{cls}</Text>
                  {selectedExam && doneSubjects > 0 && (
                    <Text style={[styles.classCardProgress, active && { color: '#A5D6FF' }]}>
                      {doneSubjects}/{totalSubjects} done
                    </Text>
                  )}
                  {selectedExam && doneSubjects === totalSubjects && totalSubjects > 0 && (
                    <View style={styles.classCardDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={[styles.button, (!selectedExam || !selectedClass) && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={() => {
              if (selectedExam && selectedClass) setScreen('classmarks');
            }}
          >
            <Text style={styles.buttonText}>
              📝  {selectedExam && selectedClass
                ? `Enter Marks — ${selectedClass} · ${selectedExam}`
                : 'Select exam & class above'}
            </Text>
          </TouchableOpacity>

          {/* Saved marks list below Enter Marks button */}
          <View style={styles.savedPreviewWrap}>
            <Text style={styles.savedPreviewTitle}>Saved Marks List</Text>
            {!selectedExam || !selectedClass ? (
              <Text style={styles.savedPreviewHint}>Select exam and class to view saved marks list.</Text>
            ) : (() => {
              const summary = getSavedSubjectSummary(selectedClass, selectedExam);
              if (!summary.length) {
                return <Text style={styles.savedPreviewHint}>No saved marks yet for this batch.</Text>;
              }

              return summary.map((item) => (
                <TouchableOpacity
                  key={item.subject}
                  style={styles.savedPreviewRow}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedSavedSubject(item.subject);
                    setScreen('saveddetails');
                  }}
                >
                  <View>
                    <Text style={styles.savedPreviewSubject}>{item.subject}</Text>
                    <Text style={styles.savedPreviewMeta}>
                      {item.entered}/{item.total} saved · Avg {item.average}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ));
            })()}
          </View>
        </View>

        {/* ── All Classes Overview ── */}
     

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FF' },
  content:   { flex: 1, padding: 16 },

  header:   { marginBottom: 20, marginTop: 8 },
  title:    { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },

  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    ...Platform.select({ web: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } }),
    elevation: 2,
  },
  backBtn:    { padding: 4 },
  backArrow:  { fontSize: 22, color: '#1B3FA0', fontWeight: '600' },
  screenTitle:{ fontSize: 17, fontWeight: 'bold', color: '#1A1A2E', flex: 1, textAlign: 'center' },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 4 },
  cardHint:  { fontSize: 12, color: '#888', marginBottom: 14 },

  // Exam cards on home
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  examCardLeft:   { flex: 1 },
  examCardTitle:  { fontSize: 16, fontWeight: 'bold' },
  examCardDates:  { fontSize: 12, marginTop: 4 },
  examCardSub:    { fontSize: 11, marginTop: 2 },
  examCardArrow:  { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  examCardArrowText: { fontSize: 22, fontWeight: 'bold' },

  // Tabs
  miniLabel: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  tabRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabBtnText: { fontSize: 13, fontWeight: '600' },

  // Class grid
  classGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  classCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    minWidth: 70,
  },
  classCardActive:       { backgroundColor: '#1B3FA0', borderColor: '#1B3FA0' },
  classCardText:         { fontSize: 14, fontWeight: '700', color: '#444' },
  classCardTextActive:   { color: '#FFFFFF' },
  classCardProgress:     { fontSize: 10, color: '#888', marginTop: 3 },
  classCardDot: {
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: 5, right: 5,
  },

  // Saved preview under batch selection
  savedPreviewWrap: {
    marginTop: 12,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E3E9F4',
    borderRadius: 10,
    padding: 12,
  },
  savedPreviewTitle: { fontSize: 12, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  savedPreviewHint: { fontSize: 11, color: '#7A869A' },
  savedPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F8',
  },
  savedPreviewSubject: { fontSize: 12, fontWeight: '600', color: '#1A1A2E' },
  savedPreviewMeta: { fontSize: 11, color: '#5F6C83' },

  savedStudentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
  },
  savedStudentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savedStudentMark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  savedStudentOutof: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },

  // Action button
  button: {
    backgroundColor: '#1B3FA0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { backgroundColor: '#B0BEC5' },
  buttonText:     { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  saveBtn:     { backgroundColor: '#1B3FA0', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  footerBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    ...Platform.select({ web: { boxShadow: '0 -1px 4px rgba(0,0,0,0.06)' } }),
    gap: 10,
  },
  footerProgress: { marginBottom: 4 },
  footerProgressBar: { height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  footerProgressFill: { height: '100%', backgroundColor: '#1B3FA0', borderRadius: 3 },
  footerProgressText: { fontSize: 11, color: '#888', textAlign: 'right' },

  // Timetable screen
  timetableBanner: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
  },
  timetableBannerTitle:    { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  timetableBannerSub:      { fontSize: 13, marginBottom: 10 },
  timetableBannerBadge:    { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  timetableBannerBadgeText:{ fontSize: 12, fontWeight: '700' },

  timetableCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  timetableCardLeft: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFBFF',
  },
  timetableCardIndex: { fontSize: 16, fontWeight: 'bold' },
  timetableCardBody:  { flex: 1, padding: 14 },
  timetableSubject:   { fontSize: 15, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 3 },
  timetableDate:      { fontSize: 12, color: '#666', marginBottom: 8 },
  timetableMetaRow:   { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  timetableTag:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timetableTagText:   { fontSize: 11, fontWeight: '600' },

  legendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  legendGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendChip:       { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  legendGrade:      { fontSize: 14, fontWeight: 'bold' },
  legendMin:        { fontSize: 10, color: '#888', marginTop: 1 },

  formSectionLabel: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },

  // Marks entry
  infoBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    paddingVertical: 10,
  },
  infoChip:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  infoChipVal:   { fontSize: 16, fontWeight: 'bold', color: '#1B3FA0' },
  infoChipLabel: { fontSize: 10, color: '#888', marginTop: 2 },
  infoDivider:   { width: 1, backgroundColor: '#E8EAED', marginVertical: 4 },

  marksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  marksCardHeader: { fontSize: 13, color: '#666', padding: 14, borderBottomWidth: 1, borderBottomColor: '#EEF0F3' },
  marksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
  },

  avatar:     { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { fontSize: 15, fontWeight: 'bold' },
  studentInfo:{ flex: 1 },
  studentName:{ fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  studentRoll:{ fontSize: 11, color: '#888', marginTop: 1 },

  gradeBadge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, marginRight: 8, alignItems: 'center', minWidth: 30 },
  gradeBadgeText: { fontSize: 12, fontWeight: 'bold' },

  marksInputWrap: { alignItems: 'center' },
  marksInput: {
    width: 60,
    height: 40,
    borderWidth: 1.5,
    borderColor: '#DDE1EA',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    backgroundColor: '#FAFBFF',
  },
  marksInputError: { borderColor: '#E53935', backgroundColor: '#FFEBEE' },
  marksErr:        { fontSize: 9, color: '#E53935', marginTop: 2 },

  // Subject rows in MarksEntryClassScreen
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
  },
  subjectIcon: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  subjectName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  subjectMeta: { fontSize: 11, color: '#888', marginTop: 2 },
  subjectMiniBar: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, overflow: 'hidden', marginTop: 5, width: 100 },
  subjectMiniFill:{ height: '100%', borderRadius: 2 },

  chevron: { fontSize: 22, color: '#BDBDBD' },

  // Progress overview
  progressSection:   { marginBottom: 12 },
  progressExamTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 10,
  },
  progressClass:        { fontSize: 13, fontWeight: '600', color: '#1A1A2E', width: 42 },
  progressBarMini:      { flex: 1, height: 6, backgroundColor: '#E8EAED', borderRadius: 3, overflow: 'hidden' },
  progressBarMiniFill:  { height: '100%', borderRadius: 3 },
  progressPct:          { fontSize: 11, color: '#555', width: 30, textAlign: 'right' },
});