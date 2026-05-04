import React, { useMemo, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
} from 'react-native';

import NewClassForm from './NewClassForm';

const INITIAL_CLASSES = [
	{
		id: '10A-MATH',
		grade: 'Grade 10-A',
		subject: 'Mathematics',
		room: 'Room 402',
		schedule: ['Mon', 'Wed', 'Fri'],
		students: [
			{ name: 'Aarav Iyer', rollNo: '10A01', overall: 87 },
			{ name: 'Megha Reddy', rollNo: '10A14', overall: 79 },
			{ name: 'Pooja Nair', rollNo: '10A21', overall: 92 },
		],
	},
	{
		id: '9B-PHY',
		grade: 'Grade 9-B',
		subject: 'Physics',
		room: 'Lab 12',
		schedule: ['Tue', 'Thu'],
		students: [
			{ name: 'Kabir Singh', rollNo: '9B03', overall: 84 },
			{ name: 'Ishita Jain', rollNo: '9B11', overall: 90 },
			{ name: 'Ravi Kumar', rollNo: '9B19', overall: 73 },
		],
	},
	{
		id: '11C-ENG',
		grade: 'Grade 11-C',
		subject: 'English',
		room: 'Room 101',
		schedule: ['Mon', 'Thu'],
		students: [
			{ name: 'Ananya Sharma', rollNo: '11C02', overall: 93 },
			{ name: 'Rahul Verma', rollNo: '11C08', overall: 81 },
			{ name: 'Dev Patel', rollNo: '11C15', overall: 76 },
		],
	},
];

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getClassAttendance = (students) => {
	if (!students.length) return 0;
	return students.reduce((sum, student) => sum + student.overall, 0) / students.length;
};

const getLetterGrade = (score) => {
	if (score >= 90) return 'A+';
	if (score >= 80) return 'A';
	if (score >= 70) return 'B';
	if (score >= 60) return 'C';
	return 'D';
};

export default function Myclasses() {
	const [classes, setClasses] = useState(INITIAL_CLASSES);
	const [viewMode, setViewMode] = useState('list');
	// Active students collapse state (single common arrow)
	const [activeStudentsOpen, setActiveStudentsOpen] = useState(false);
	const [activeStudentsRows, setActiveStudentsRows] = useState([]);

	// Main results (attendance / today's classes / selected class)
	const [mainResultTitle, setMainResultTitle] = useState('');
	const [mainResultRows, setMainResultRows] = useState([]);
	const [expandedItems, setExpandedItems] = useState({});
	const [showNewClassForm, setShowNewClassForm] = useState(false);

	const todayShort = WEEKDAY_SHORT[new Date().getDay()];

	const totalActiveStudents = useMemo(
		() => classes.reduce((sum, classItem) => sum + classItem.students.length, 0),
		[classes]
	);

	const averageAttendance = useMemo(() => {
		if (!classes.length) return 0;
		const sum = classes.reduce((acc, classItem) => acc + getClassAttendance(classItem.students), 0);
		return sum / classes.length;
	}, [classes]);

	const todayClasses = useMemo(
		() => classes.filter((classItem) => classItem.schedule.includes(todayShort)),
		[classes, todayShort]
	);

	const isClassResult = useMemo(
		() => classes.some((c) => `${c.grade} ${c.subject}` === mainResultTitle),
		[classes, mainResultTitle]
	);

	const showActiveStudentsList = () => {
		const rows = [];
		classes.forEach((classItem) => {
			classItem.students.forEach((student) => {
				rows.push(`${student.name} (${student.rollNo}) - ${classItem.grade} ${classItem.subject}`);
			});
		});

		setActiveStudentsRows(rows);
		// toggle the single common arrow panel
		setActiveStudentsOpen((v) => !v);
	};

	const showAverageAttendanceList = () => {
		const rows = classes.map((classItem) => {
			const value = getClassAttendance(classItem.students).toFixed(1);
			return `${classItem.grade} ${classItem.subject}: ${value}%`;
		});
		rows.unshift(`Overall: ${averageAttendance.toFixed(1)}%`);

		setMainResultTitle('Attendance');
		setMainResultRows(rows);
		setExpandedItems({});
	};

	const showTodayClassesList = () => {
		const rows = todayClasses.map(
			(classItem) => `${classItem.grade} ${classItem.subject} - ${classItem.room}`
		);

		setMainResultTitle(`Today's Classes`);
		setMainResultRows(rows.length ? rows : ['No class scheduled today.']);
		setExpandedItems({});
	};

	const showClassOverallGrades = (classItem) => {
		const rows = classItem.students.map(
			(student) => `${student.name} (${student.rollNo}) - ${student.overall}% (${getLetterGrade(student.overall)})`
		);

		// Open in the MAIN results panel (not the Active Students panel)
		setMainResultTitle(`${classItem.grade} ${classItem.subject}`);
		setMainResultRows(rows);
		setExpandedItems({});
	};

	const toggleExpanded = (index) => {
		setExpandedItems((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const handleCreateNewClass = (newClass) => {
		setClasses((prev) => [newClass, ...prev]);
		setShowNewClassForm(false);
		setMainResultTitle('New Class Created');
		setMainResultRows([
			`${newClass.grade} ${newClass.subject}`,
			`Room: ${newClass.room}`,
			`Schedule: ${newClass.schedule.join(', ')}`,
		]);
	};

	if (showNewClassForm) {
		return (
			<NewClassForm
				onCancel={() => setShowNewClassForm(false)}
				onSubmit={handleCreateNewClass}
			/>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.statsRow}>
					<TouchableOpacity style={styles.statCard} activeOpacity={0.9} onPress={showActiveStudentsList}>
						<Text style={styles.statLabel}>STUDENTS</Text>
						<Text style={styles.statValue}>{totalActiveStudents}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.statCard} activeOpacity={0.9} onPress={showAverageAttendanceList}>
						<Text style={styles.statLabel}>ATTENDANCE</Text>
						<Text style={styles.statValue}>{averageAttendance.toFixed(1)}%</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.statCard} activeOpacity={0.9} onPress={showTodayClassesList}>
						<Text style={styles.statLabel}>TODAY</Text>
						<Text style={styles.statValue}>{todayClasses.length}</Text>
					</TouchableOpacity>
				</View>

				{/* Active Students compact toggle (single arrow) */}
				<View style={styles.activeHeaderRow}>
					<TouchableOpacity style={styles.activeToggle} onPress={showActiveStudentsList} activeOpacity={0.8}>
						<Text style={styles.activeLabel}>Active Students</Text>
						<Text style={styles.expandArrow}>{activeStudentsOpen ? '▼' : '▶'}</Text>
					</TouchableOpacity>
				</View>

				{activeStudentsOpen && (
					<View style={styles.activePanel}>
						{activeStudentsRows.length > 0 ? (
							activeStudentsRows.map((row, idx) => (
								<Text key={`${row}-${idx}`} style={styles.activeItem}>
									{idx + 1}. {row}
								</Text>
							))
						) : (
							<Text style={styles.resultEmpty}>No students</Text>
						)}
					</View>
				)}

				{/* Main results panel (attendance / today's classes / selected class) */}
				{mainResultTitle ? (
					<View style={styles.resultPanel}>
						<Text style={styles.resultTitle}>{mainResultTitle}</Text>
						{mainResultRows.length ? (
							mainResultRows.map((row, idx) => (
								isClassResult ? (
									<Text key={`${row}-${idx}`} style={styles.resultPlain}>
										{idx + 1}. {row}
									</Text>
								) : (
									<TouchableOpacity
										key={`${row}-${idx}`}
										onPress={() => toggleExpanded(idx)}
										style={styles.resultItemWrapper}
										activeOpacity={0.7}
									>
										<Text style={styles.resultItem}>{row}</Text>
										<Text style={styles.expandArrow}>{expandedItems[idx] ? '▼' : '▶'}</Text>
									</TouchableOpacity>
								)
							))
						) : (
							<Text style={styles.resultEmpty}>No data</Text>
						)}
					</View>
				) : null}

				<View style={styles.headerRow}>
					<View>
						<Text style={styles.title}>My Classes</Text>
					</View>
				</View>

				<View style={styles.list}>
					{classes.map((classItem) => (
						<TouchableOpacity
							key={classItem.id}
							style={styles.classCard}
							activeOpacity={0.9}
							onPress={() => showClassOverallGrades(classItem)}
						>
							<View style={styles.cardTop}>
								<View>
									<Text style={styles.classTitle}>{classItem.grade}</Text>
									<Text style={styles.classSubject}>{classItem.subject}</Text>
								</View>
								<Text style={styles.classRoom}>{classItem.room}</Text>
							</View>
							<Text style={styles.classMeta}>👥 {classItem.students.length} students</Text>
							<Text style={styles.classMeta}>📅 {classItem.schedule.join(', ')}</Text>
						</TouchableOpacity>
					))}

					<TouchableOpacity
						style={[styles.classCard, styles.addCard]}
						activeOpacity={0.9}
						onPress={() => setShowNewClassForm(true)}
					>
						<Text style={styles.addTitle}>+ New Class</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F8FAFC' },
	content: { padding: 14, paddingBottom: 24 },
	statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
	statCard: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		padding: 14,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	statLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 },
	statValue: { fontSize: 26, color: '#1E293B', fontWeight: '800' },
	statMeta: { fontSize: 11, color: '#4B6B9D', fontWeight: '600' },

	resultPanel: {
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		padding: 14,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#E2E8F0',
	},
	resultTitle: { fontSize: 14, color: '#1E293B', fontWeight: '700', marginBottom: 12 },
	resultItemWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginBottom: 6,
		backgroundColor: '#F8FAFC',
		borderRadius: 8,
	},
	resultItem: { fontSize: 12, color: '#475569', flex: 1 },
	expandArrow: { fontSize: 12, color: '#64748B', marginLeft: 10, fontWeight: '600' },
	resultEmpty: { fontSize: 12, color: '#94A3B8', paddingVertical: 10 },
    resultPlain: { fontSize: 12, color: '#475569', paddingVertical: 8 },

	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 14,
		gap: 12,
	},
	title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
	subtitle: { fontSize: 12, color: '#7D8798', marginTop: 2 },
	switchRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 3 },
	switchBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
	switchBtnActive: { backgroundColor: '#FFFFFF' },
	switchText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
	switchTextActive: { color: '#1E293B', fontWeight: '700' },

	grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
	list: { flexDirection: 'column', gap: 10 },
	classCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		padding: 14,
		width: '100%',
		borderWidth: 1,
		borderColor: '#E2E8F0',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.04,
		shadowRadius: 3,
		elevation: 1,
	},
	cardTop: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	classTitle: { fontSize: 15, color: '#1E293B', fontWeight: '700' },
	classRoom: { fontSize: 11, color: '#64748B', fontWeight: '600', textAlign: 'right' },
	classSubject: { fontSize: 12, color: '#0F766E', fontWeight: '600', marginBottom: 8 },
	classMeta: { fontSize: 11, color: '#64748B', marginBottom: 3 },
	cardHintWrap: {
		marginTop: 10,
		backgroundColor: '#EEF4FF',
		borderRadius: 8,
		paddingVertical: 7,
		alignItems: 'center',
	},
	cardHint: { fontSize: 11, color: '#1B3FA0', fontWeight: '700' },

	addCard: {
		borderStyle: 'dashed',
		borderColor: '#CBD5E1',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 120,
	},
	addTitle: { fontSize: 15, color: '#1E293B', fontWeight: '700' },
	addSubtitle: { fontSize: 11, color: '#7D8798', marginTop: 8, textAlign: 'center' },
	activeHeaderRow: { marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
	activeToggle: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#E2E8F0',
	},
	activeLabel: { fontSize: 13, color: '#0F172A', fontWeight: '700', marginRight: 8 },
	activePanel: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
	activeItem: { fontSize: 12, color: '#475569', lineHeight: 20, marginBottom: 6 },
});
