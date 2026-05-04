/**
 * AttendanceTracking.js
 * React Native – JS Format
 * Compatible with Expo & bare React Native (light theme)
 *
 * PDF Export requires one of:
 *   Expo:       expo install expo-print expo-sharing
 *   Bare RN:    npm install react-native-html-to-pdf react-native-share
 *
 * Usage:  <AttendanceTracking />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';

/* ─── Responsive helpers ─────────────────────────────────────────────────── */
const { width: SW } = Dimensions.get('window');
const isTablet = SW >= 768;
const s = (mobile, tablet) => (isTablet ? tablet : mobile);

/* ─── Design Tokens ──────────────────────────────────────────────────────── */
const C = {
  primary: '#1565C0',
  primaryDark: '#0D47A1',
  primaryMid: '#1976D2',
  primaryLight: '#E3F2FD',
  primaryLighter: '#F0F7FF',
  bg: '#F4F6FA',
  white: '#FFFFFF',
  text: '#111827',
  textMid: '#374151',
  textSub: '#6B7280',
  textFaint: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  present: '#1565C0',
  absent: '#DC2626',
  absentBg: '#FEF2F2',
  late: '#D97706',
  lateBg: '#FFFBEB',
  success: '#16A34A',
  successBg: '#F0FDF4',
  shadow: '#000000',
};

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const YEAR = 2024;

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Monthly attendance % for 2024
const MONTHLY_TREND = [78, 85, 98, 80, 94, 88, 91, 96, 89, 83, 79, 72];

// Calendar day marks  →  key: "YYYY-M-D"  (M is 1-indexed month)
const CALENDAR_MARKS = {
  // January
  '2024-1-2': 'present', '2024-1-3': 'present', '2024-1-4': 'present',
  '2024-1-5': 'late', '2024-1-8': 'present', '2024-1-9': 'present',
  '2024-1-10': 'absent', '2024-1-11': 'present', '2024-1-12': 'present',
  // February
  '2024-2-1': 'present', '2024-2-2': 'present', '2024-2-5': 'present',
  '2024-2-6': 'late', '2024-2-7': 'present', '2024-2-8': 'present',
  '2024-2-12': 'absent',
  // March (peak 98%)
  '2024-3-1': 'present', '2024-3-4': 'present', '2024-3-5': 'present',
  '2024-3-6': 'present', '2024-3-7': 'present', '2024-3-8': 'present',
  '2024-3-11': 'present', '2024-3-12': 'present', '2024-3-13': 'present',
  '2024-3-14': 'present', '2024-3-15': 'late',
  // April
  '2024-4-1': 'present', '2024-4-2': 'present', '2024-4-3': 'present',
  '2024-4-4': 'late', '2024-4-8': 'present', '2024-4-9': 'present',
  '2024-4-10': 'present', '2024-4-11': 'absent', '2024-4-15': 'present',
  // May
  '2024-5-1': 'present', '2024-5-2': 'present', '2024-5-3': 'late',
  '2024-5-6': 'present', '2024-5-7': 'present', '2024-5-8': 'absent',
  '2024-5-9': 'present', '2024-5-10': 'present',
  // June
  '2024-6-3': 'present', '2024-6-4': 'present', '2024-6-5': 'late',
  '2024-6-6': 'present', '2024-6-10': 'present', '2024-6-11': 'present',
  // July
  '2024-7-1': 'present', '2024-7-2': 'present', '2024-7-3': 'present',
  '2024-7-8': 'absent', '2024-7-9': 'present', '2024-7-10': 'present',
  // August
  '2024-8-1': 'present', '2024-8-5': 'present', '2024-8-6': 'late',
  '2024-8-7': 'present', '2024-8-12': 'present', '2024-8-13': 'present',
  // September
  '2024-9-2': 'present', '2024-9-3': 'present', '2024-9-4': 'present',
  '2024-9-9': 'present', '2024-9-10': 'late', '2024-9-11': 'present',
  // October
  '2024-10-1': 'present', '2024-10-2': 'absent', '2024-10-7': 'present',
  '2024-10-8': 'present', '2024-10-9': 'present', '2024-10-14': 'late',
  // November
  '2024-11-4': 'present', '2024-11-5': 'present', '2024-11-6': 'late',
  '2024-11-11': 'present', '2024-11-12': 'absent', '2024-11-13': 'present',
  // December
  '2024-12-2': 'present', '2024-12-3': 'present', '2024-12-4': 'present',
  '2024-12-9': 'late', '2024-12-10': 'absent', '2024-12-11': 'present',
};

const RECENT_RECORDS = [
  { id: 1, date: 'May 08, 2024', status: 'Absent',  arrival: '--:--',    remark: 'Family emergency reported via portal' },
  { id: 2, date: 'May 07, 2024', status: 'Present', arrival: '07:52 AM', remark: '' },
  { id: 3, date: 'May 03, 2024', status: 'Late',    arrival: '08:15 AM', remark: 'Bus delay reported' },
  { id: 4, date: 'May 02, 2024', status: 'Present', arrival: '07:45 AM', remark: '' },
  { id: 5, date: 'Apr 30, 2024', status: 'Present', arrival: '07:48 AM', remark: '' },
  { id: 6, date: 'Apr 29, 2024', status: 'Late',    arrival: '08:20 AM', remark: 'Traffic delay' },
  { id: 7, date: 'Apr 26, 2024', status: 'Absent',  arrival: '--:--',    remark: 'Medical appointment – excused' },
  { id: 8, date: 'Apr 25, 2024', status: 'Present', arrival: '07:55 AM', remark: '' },
  { id: 9, date: 'Apr 22, 2024', status: 'Present', arrival: '07:50 AM', remark: '' },
  { id: 10, date: 'Apr 19, 2024', status: 'Present', arrival: '08:00 AM', remark: '' },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

// Returns Mon=0 … Sun=6
const getFirstDayMon = (month, year) => {
  const d = new Date(year, month, 1).getDay(); // Sun=0 … Sat=6
  return d === 0 ? 6 : d - 1;
};

const statusColors = {
  Present: { text: C.present, bg: C.primaryLight },
  Absent:  { text: C.absent,  bg: C.absentBg },
  Late:    { text: C.late,    bg: C.lateBg },
};

const dotColor = { present: C.present, absent: C.absent, late: C.late };

/* ─── PDF HTML template ───────────────────────────────────────────────────── */
const buildPdfHtml = (records) => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  body{font-family:sans-serif;padding:32px;color:#111}
  h1{color:#1565C0;font-size:24px;margin-bottom:4px}
  .sub{color:#6B7280;font-size:13px;margin-bottom:24px}
  .stats{display:flex;gap:16px;margin-bottom:24px}
  .stat{background:#F0F7FF;border-radius:8px;padding:12px 18px;flex:1}
  .stat-l{font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.8px}
  .stat-v{font-size:26px;font-weight:800;color:#1565C0}
  table{width:100%;border-collapse:collapse}
  th{background:#1565C0;color:#fff;text-align:left;padding:8px 10px;font-size:12px}
  td{padding:8px 10px;font-size:12px;border-bottom:1px solid #E5E7EB}
  tr:nth-child(even){background:#F9FAFB}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px}
  .Present{background:#E3F2FD;color:#1565C0}
  .Absent{background:#FEF2F2;color:#DC2626}
  .Late{background:#FFFBEB;color:#D97706}
  .footer{margin-top:24px;font-size:11px;color:#9CA3AF}
</style></head><body>
<h1>Attendance Report – Alex Johnson</h1>
<p class="sub">Grade 10-B  •  Academic Year 2024-25  •  Generated ${new Date().toLocaleDateString()}</p>
<div class="stats">
  <div class="stat"><div class="stat-l">Total Days</div><div class="stat-v">142</div></div>
  <div class="stat"><div class="stat-l">Present</div><div class="stat-v" style="color:#1565C0">134</div></div>
  <div class="stat"><div class="stat-l">Late</div><div class="stat-v" style="color:#D97706">3</div></div>
  <div class="stat"><div class="stat-l">Absent</div><div class="stat-v" style="color:#DC2626">5</div></div>
</div>
<table>
  <thead><tr><th>Date</th><th>Status</th><th>Arrival Time</th><th>Teacher Remarks</th></tr></thead>
  <tbody>
    ${records.map(r => `
      <tr>
        <td>${r.date}</td>
        <td><span class="badge ${r.status}">${r.status}</span></td>
        <td>${r.arrival}</td>
        <td>${r.remark || '—'}</td>
      </tr>`).join('')}
  </tbody>
</table>
<p class="footer">ParentPortal  •  Confidential student record  •  Do not distribute</p>
</body></html>`;

/* ─── Sub-components ──────────────────────────────────────────────────────── */

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, valueColor, sub, subColor, accent }) {
  return (
    <View style={[styles.statCard, accent && { borderLeftColor: accent, borderLeftWidth: 3 }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, valueColor && { color: valueColor }]}>{value}</Text>
      {sub ? <Text style={[styles.statSub, subColor && { color: subColor }]}>{sub}</Text> : null}
    </View>
  );
}

// ── Calendar ─────────────────────────────────────────────────────────────────
function Calendar({ month, year }) {
  const firstDay    = getFirstDayMon(month, year);
  const daysInMonth = getDaysInMonth(month, year);
  const prevDays    = getDaysInMonth(month - 1 < 0 ? 11 : month - 1, year);

  // Build cell array
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const key  = `${year}-${month + 1}-${d}`;
    const mark = CALENDAR_MARKS[key];
    cells.push({ day: d, current: true, mark });
  }
  const rem = 7 - (cells.length % 7);
  if (rem < 7) for (let d = 1; d <= rem; d++) cells.push({ day: d, current: false });

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(
      <View key={i} style={styles.calRow}>
        {cells.slice(i, i + 7).map((cell, j) => (
          <View key={j} style={styles.calCell}>
            <Text style={[
              styles.calDayText,
              !cell.current && styles.calDayOther,
              cell.current && cell.mark === 'absent' && { color: C.absent, fontWeight: '700' },
            ]}>
              {cell.day}
            </Text>
            {cell.current && cell.mark ? (
              <View style={[styles.calDot, { backgroundColor: dotColor[cell.mark] }]} />
            ) : <View style={styles.calDot} />}
          </View>
        ))}
      </View>
    );
  }
  return <>{rows}</>;
}

// ── Monthly Trend Bar Chart ───────────────────────────────────────────────────
function TrendChart({ data, selectedIdx, onSelect }) {
  const maxVal = Math.max(...data);
  const CHART_H = 110;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
      <View style={styles.chartWrap}>
        {data.map((val, idx) => {
          const barH    = Math.max(8, (val / maxVal) * CHART_H);
          const active  = idx === selectedIdx;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.75}
              onPress={() => onSelect(idx)}
              style={styles.barGroup}
            >
              <Text style={[styles.barPct, { opacity: active ? 1 : 0 }]}>{val}%</Text>
              <View style={[
                styles.barBody,
                { height: barH },
                active
                  ? { backgroundColor: C.primary, shadowColor: C.primary, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 4 }
                  : { backgroundColor: C.primaryLight },
              ]} />
              <Text style={[styles.barLabel, active && { color: C.primary, fontWeight: '700' }]}>
                {MONTHS_SHORT[idx]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ── Records Table ─────────────────────────────────────────────────────────────
function RecordsTable({ records }) {
  return (
    <>
      {/* Header row */}
      <View style={styles.tblHead}>
        {['DATE', 'STATUS', 'ARRIVAL', 'TEACHER REMARKS'].map((h, i) => (
          <Text key={h} style={[styles.tblHeadCell, { flex: [1.3, 0.85, 0.85, 1.8][i] }]}>{h}</Text>
        ))}
      </View>
      {records.map((rec, i) => {
        const sc = statusColors[rec.status] || {};
        return (
          <View key={rec.id} style={[styles.tblRow, i % 2 === 1 && { backgroundColor: C.borderLight }]}>
            <Text style={[styles.tblCell, { flex: 1.3, fontWeight: '600', color: C.text }]}>{rec.date}</Text>
            <View style={{ flex: 0.85, justifyContent: 'center' }}>
              <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                <Text style={[styles.badgeText, { color: sc.text }]}>{rec.status}</Text>
              </View>
            </View>
            <Text style={[styles.tblCell, { flex: 0.85 }]}>{rec.arrival}</Text>
            <Text style={[
              styles.tblCell,
              { flex: 1.8 },
              rec.remark ? { fontStyle: 'italic', color: C.textSub } : {},
            ]}>
              {rec.remark ? `"${rec.remark}"` : '—'}
            </Text>
          </View>
        );
      })}
    </>
  );
}

/* ─── Leave Request Page (rendered as modal sheet) ───────────────────────── */
function RequestLeavePage({ visible, onClose }) {
  const [form, setForm] = useState({
    type: 'Medical', startDate: '', endDate: '', reason: '', notes: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.startDate || !form.endDate || !form.reason) {
      Alert.alert('Missing Fields', 'Please fill in Start Date, End Date, and Reason.');
      return;
    }
    Alert.alert(
      '✅ Leave Requested',
      `Your ${form.type} leave request from ${form.startDate} to ${form.endDate} has been submitted. The school will review and respond within 24 hours.`,
      [{ text: 'Done', onPress: onClose }],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.sheetOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Request Leave</Text>
                <Text style={styles.sheetSub}>Alex Johnson  •  Grade 10-B</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Leave Type */}
            <Text style={styles.fieldLabel}>Leave Type</Text>
            <View style={styles.chipRow}>
              {['Medical', 'Personal', 'Family', 'Other'].map(t => (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.8}
                  style={[styles.chip, form.type === t && styles.chipActive]}
                  onPress={() => set('type', t)}
                >
                  <Text style={[styles.chipText, form.type === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Dates */}
            <View style={styles.dateRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLabel}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor={C.textFaint}
                  value={form.startDate}
                  onChangeText={v => set('startDate', v)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>End Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor={C.textFaint}
                  value={form.endDate}
                  onChangeText={v => set('endDate', v)}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Reason *</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief reason for leave"
              placeholderTextColor={C.textFaint}
              value={form.reason}
              onChangeText={v => set('reason', v)}
            />

            <Text style={styles.fieldLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
              placeholder="Any extra information for the teacher…"
              placeholderTextColor={C.textFaint}
              multiline
              value={form.notes}
              onChangeText={v => set('notes', v)}
            />

            {/* Info strip */}
            <View style={styles.infoStrip}>
              <Text style={styles.infoText}>ℹ  Requests submitted before 8 AM are processed the same day.</Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Leave Request</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ─── Status Filter Modal ─────────────────────────────────────────────────── */
function StatusFilterModal({ visible, current, onSelect, onClose }) {
  const options = ['All Statuses', 'Present', 'Absent', 'Late'];
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableOpacity style={styles.overlayFull} activeOpacity={1} onPress={onClose}>
        <View style={styles.dropdownCard}>
          <Text style={styles.dropdownTitle}>Filter by Status</Text>
          {options.map(opt => {
            const active = opt === current;
            const sc = statusColors[opt];
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownItem, active && { backgroundColor: C.primaryLighter }]}
                onPress={() => { onSelect(opt); onClose(); }}
              >
                <View style={styles.dropdownRow}>
                  {sc ? <View style={[styles.dropdownDot, { backgroundColor: sc.text }]} /> : null}
                  <Text style={[styles.dropdownLabel, active && { color: C.primary, fontWeight: '700' }]}>{opt}</Text>
                </View>
                {active && <Text style={{ color: C.primary }}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function AttendanceTracking() {
  const [calMonth,       setCalMonth]       = useState(4);   // 0-indexed → May
  const [trendSelected,  setTrendSelected]  = useState(2);   // March peak
  const [statusFilter,   setStatusFilter]   = useState('All Statuses');
  const [showStatus,     setShowStatus]     = useState(false);
  const [showLeave,      setShowLeave]      = useState(false);
  const [recordsExpanded,setRecordsExpanded]= useState(false);

  /* Filtered records */
  const filteredRecords = useMemo(() =>
    statusFilter === 'All Statuses'
      ? RECENT_RECORDS
      : RECENT_RECORDS.filter(r => r.status === statusFilter),
    [statusFilter]
  );
  const displayRecords = recordsExpanded ? filteredRecords : filteredRecords.slice(0, 4);

  /* PDF export */
  const handleExport = useCallback(async () => {
    /* ── Expo implementation ────────────────────────────────────────────────
       import * as Print  from 'expo-print';
       import * as Sharing from 'expo-sharing';

       const { uri } = await Print.printToFileAsync({ html: buildPdfHtml(RECENT_RECORDS) });
       await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Export Attendance' });
    ── Bare React Native implementation ─────────────────────────────────────
       import RNHTMLtoPDF from 'react-native-html-to-pdf';
       import Share      from 'react-native-share';

       const pdf = await RNHTMLtoPDF.convert({ html: buildPdfHtml(RECENT_RECORDS), fileName: 'attendance_report', base64: false });
       await Share.open({ url: `file://${pdf.filePath}`, type: 'application/pdf' });
    ─────────────────────────────────────────────────────────────────────── */
    Alert.alert(
      '📄 Export Report',
      'Attendance report for Alex Johnson (Grade 10-B) exported as PDF.\n\n' +
      '(Install expo-print + expo-sharing or react-native-html-to-pdf + react-native-share ' +
      'and uncomment the PDF code inside handleExport to enable real PDF generation.)',
      [{ text: 'OK' }],
    );
  }, []);

  const peakMonth = MONTHLY_DATA_PEAK(); // March → index 2

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <View style={[styles.pageHeader, isTablet && styles.pageHeaderTablet]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Attendance Tracking</Text>
            <Text style={styles.pageSubtitle}>Detailed summary for Alex Johnson  •  Grade 10-B</Text>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity
              style={styles.exportBtn}
              activeOpacity={0.8}
              onPress={handleExport}
            >
              <Text style={styles.exportIcon}>⬇  </Text>
              <Text style={styles.exportBtnText}>Export Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.leaveBtn}
              activeOpacity={0.85}
              onPress={() => setShowLeave(true)}
            >
              <Text style={styles.leaveBtnText}>Request Leave</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <View style={styles.statsGrid}>
          <StatCard label="TOTAL DAYS"    value="142" accent={C.textSub} />
          <StatCard
            label="PRESENT DAYS" value="134" valueColor={C.primary}
            sub="↗  94.4% Rate" subColor={C.success} accent={C.primary}
          />
          <StatCard label="LATE ARRIVALS" value="3"   valueColor={C.absent}
            sub="Decreased from last month" />
          <StatCard label="ABSENT"        value="5"   valueColor={C.absent}
            sub="2 Excused, 3 Unexcused" />
        </View>

        {/* ── Calendar + Trend row ────────────────────────────────────────── */}
        <View style={[styles.midRow, isTablet && { flexDirection: 'row' }]}>

          {/* Calendar card */}
          <View style={[styles.card, isTablet && { flex: 1.3, marginRight: 10 }]}>
            {/* Header */}
            <View style={styles.calCardHeader}>
              <Text style={styles.calMonthLabel}>{MONTHS_FULL[calMonth]} {YEAR}</Text>

              <View style={styles.legendRow}>
                {[['Present', C.present], ['Absent', C.absent], ['Late', C.late]].map(([lbl, col]) => (
                  <View key={lbl} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: col }]} />
                    <Text style={styles.legendText}>{lbl}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.navBtns}>
                <TouchableOpacity
                  style={styles.navBtn}
                  activeOpacity={0.7}
                  onPress={() => setCalMonth(m => Math.max(0, m - 1))}
                >
                  <Text style={styles.navBtnText}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navBtn}
                  activeOpacity={0.7}
                  onPress={() => setCalMonth(m => Math.min(11, m + 1))}
                >
                  <Text style={styles.navBtnText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Weekday labels */}
            <View style={styles.calRow}>
              {WEEKDAYS.map(d => (
                <View key={d} style={styles.calCell}>
                  <Text style={styles.calWeekday}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Days grid */}
            <Calendar month={calMonth} year={YEAR} />
          </View>

          {/* Monthly Trend card */}
          <View style={[
            styles.card,
            isTablet ? { flex: 1, marginTop: 0 } : { marginTop: 12 },
          ]}>
            <Text style={styles.cardTitle}>Monthly Trend  •  {YEAR}</Text>
            <Text style={styles.cardSubtitle}>
              {MONTHS_FULL[trendSelected]}  —  {MONTHLY_TREND[trendSelected]}% attendance
            </Text>

            <TrendChart
              data={MONTHLY_TREND}
              selectedIdx={trendSelected}
              onSelect={setTrendSelected}
            />

            <View style={styles.peakRow}>
              <Text style={styles.peakLabel}>Peak Attendance</Text>
              <TouchableOpacity onPress={() => setTrendSelected(2)}>
                <Text style={styles.peakValue}>March (98%) →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Recent Records ───────────────────────────────────────────────── */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <View style={styles.recordsHeader}>
            <Text style={styles.cardTitle}>Recent Attendance Records</Text>
            <TouchableOpacity
              style={styles.filterBtn}
              activeOpacity={0.8}
              onPress={() => setShowStatus(true)}
            >
              <Text style={styles.filterBtnText}>{statusFilter}  ▾</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: SW - (isTablet ? 80 : 32) }}>
              <RecordsTable records={displayRecords} />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.loadMoreBtn}
            activeOpacity={0.8}
            onPress={() => setRecordsExpanded(e => !e)}
          >
            <Text style={styles.loadMoreText}>
              {recordsExpanded ? '↑ Show Less' : '↓ Load Older Records'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <RequestLeavePage visible={showLeave} onClose={() => setShowLeave(false)} />

      <StatusFilterModal
        visible={showStatus}
        current={statusFilter}
        onSelect={setStatusFilter}
        onClose={() => setShowStatus(false)}
      />
    </SafeAreaView>
  );
}

/* Helper to find peak month index */
function MONTHLY_DATA_PEAK() {
  return MONTHLY_TREND.indexOf(Math.max(...MONTHLY_TREND));
}

/* ─── StyleSheet ──────────────────────────────────────────────────────────── */
const PAD  = s(16, 24);
const CARD = s(16, 20);

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  scroll:      { flex: 1 },
  scrollContent: { paddingHorizontal: PAD, paddingTop: Platform.OS === 'android' ? 12 : 8 },

  /* Page Header */
  pageHeader: {
    marginBottom: 16,
    gap: 12,
  },
  pageHeaderTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 0,
  },
  pageTitle: {
    fontSize: s(22, 28),
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: C.textSub,
    marginTop: 3,
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: C.white,
  },
  exportIcon:    { color: C.primary, fontSize: 13 },
  exportBtnText: { color: C.primary, fontWeight: '700', fontSize: 13 },
  leaveBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  leaveBtnText: { color: C.white, fontWeight: '700', fontSize: 13 },

  /* Stats */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    minWidth: s('44%', 0),
    backgroundColor: C.white,
    borderRadius: 12,
    padding: CARD,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textSub,
    letterSpacing: 0.9,
    marginBottom: 4,
  },
  statValue: {
    fontSize: s(28, 32),
    fontWeight: '800',
    color: C.text,
    lineHeight: s(34, 38),
  },
  statSub: {
    fontSize: 11,
    color: C.textSub,
    marginTop: 3,
  },

  /* Layout */
  midRow: { gap: 0 },

  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: CARD,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },

  /* Calendar */
  calCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  calMonthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: C.textSub,
  },
  navBtns: {
    flexDirection: 'row',
    gap: 4,
  },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: C.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: {
    fontSize: 18,
    color: C.primary,
    lineHeight: 22,
  },
  calRow:  { flexDirection: 'row' },
  calCell: { flex: 1, alignItems: 'center', paddingVertical: 5 },
  calWeekday: {
    fontSize: 9,
    fontWeight: '700',
    color: C.textSub,
    letterSpacing: 0.5,
  },
  calDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: C.text,
  },
  calDayOther: { color: '#D1D5DB' },
  calDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 2,
    backgroundColor: 'transparent',
  },

  /* Bar chart */
  cardTitle:    { fontSize: 15, fontWeight: '700', color: C.text },
  cardSubtitle: { fontSize: 12, color: C.textSub, marginTop: 2, marginBottom: 8 },
  chartWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingBottom: 4,
    paddingHorizontal: 2,
    height: 160,
  },
  barGroup: { alignItems: 'center', width: s(28, 36) },
  barPct: {
    fontSize: 9,
    fontWeight: '700',
    color: C.primary,
    marginBottom: 3,
    height: 12,
  },
  barBody: {
    width: s(22, 28),
    borderRadius: 5,
    minHeight: 8,
  },
  barLabel: {
    fontSize: s(9, 10),
    color: C.textSub,
    marginTop: 5,
  },
  peakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 12,
    paddingTop: 10,
  },
  peakLabel: { fontSize: 13, color: C.textSub },
  peakValue: { fontSize: 13, fontWeight: '700', color: C.primary },

  /* Records */
  recordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterBtn: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: C.white,
  },
  filterBtnText: { fontSize: 12, color: C.text, fontWeight: '600' },

  tblHead: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: C.border,
    paddingBottom: 8,
    marginBottom: 2,
  },
  tblHeadCell: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textSub,
    letterSpacing: 0.7,
  },
  tblRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  tblCell: { fontSize: 12, color: C.textMid },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  loadMoreBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 6,
  },
  loadMoreText: { fontSize: 13, color: C.primary, fontWeight: '600' },

  /* Status modal */
  overlayFull: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownCard: {
    width: 220,
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  dropdownTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSub,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  dropdownRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dropdownDot:  { width: 8, height: 8, borderRadius: 4 },
  dropdownLabel: { fontSize: 14, color: C.text },

  /* Leave request sheet */
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: C.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '92%',
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  sheetTitle:    { fontSize: 20, fontWeight: '800', color: C.text },
  sheetSub:      { fontSize: 13, color: C.textSub, marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 14, color: C.textSub, fontWeight: '700' },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textMid,
    marginTop: 16,
    marginBottom: 6,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: C.white,
  },
  chipActive:     { backgroundColor: C.primary, borderColor: C.primary },
  chipText:       { fontSize: 13, color: C.textMid, fontWeight: '500' },
  chipTextActive: { color: C.white, fontWeight: '700' },
  dateRow:        { flexDirection: 'row', gap: 0 },
  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: C.text,
    backgroundColor: '#FAFAFA',
  },
  infoStrip: {
    backgroundColor: C.primaryLighter,
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  infoText: { fontSize: 12, color: C.primary, lineHeight: 18 },
  submitBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnText: { color: C.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
});