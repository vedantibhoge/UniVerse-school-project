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
	const [viewMode, setViewMode] = useState('grid');
	const [resultTitle, setResultTitle] = useState('Tap a card to view details');
	const [resultRows, setResultRows] = useState([]);
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

	const showActiveStudentsList = () => {
		const rows = [];
		classes.forEach((classItem) => {
			classItem.students.forEach((student) => {
				rows.push(`${student.name} (${student.rollNo}) - ${classItem.grade} ${classItem.subject}`);
			});
		});

		setResultTitle('Active Students List (Only Your Classes)');
		setResultRows(rows);
	};

	const showAverageAttendanceList = () => {
		const rows = classes.map((classItem) => {
			const value = getClassAttendance(classItem.students).toFixed(1);
			return `${classItem.grade} ${classItem.subject}: ${value}%`;
		});
		rows.unshift(`Overall Average Attendance: ${averageAttendance.toFixed(1)}%`);

		setResultTitle('Average Attendance List');
		setResultRows(rows);
	};

	const showTodayClassesList = () => {
		const rows = todayClasses.map(
			(classItem) => `${classItem.grade} ${classItem.subject} - ${classItem.room}`
		);

		setResultTitle(`Classes You Teach Today (${todayShort})`);
		setResultRows(rows.length ? rows : ['No class scheduled today.']);
	};

	const showClassOverallGrades = (classItem) => {
		const average = getClassAttendance(classItem.students).toFixed(1);
		const rows = [
			`${classItem.grade} ${classItem.subject} - Class Average: ${average}%`,
			...classItem.students.map(
				(student) =>
					`${student.name} (${student.rollNo}) - ${student.overall}% (${getLetterGrade(student.overall)})`
			),
		];

		setResultTitle(`${classItem.grade} Overall Grades`);
		setResultRows(rows);
	};

	const handleCreateNewClass = (newClass) => {
		setClasses((prev) => [newClass, ...prev]);
		setShowNewClassForm(false);
		setResultTitle('New Class Created');
		setResultRows([
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
						<Text style={styles.statLabel}>TOTAL ACTIVE STUDENTS</Text>
						<Text style={styles.statValue}>{totalActiveStudents}</Text>
						<Text style={styles.statMeta}>Tap to view class student list</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.statCard} activeOpacity={0.9} onPress={showAverageAttendanceList}>
						<Text style={styles.statLabel}>AVERAGE ATTENDANCE</Text>
						<Text style={styles.statValue}>{averageAttendance.toFixed(1)}%</Text>
						<Text style={styles.statMeta}>Tap to view attendance list</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.statCard} activeOpacity={0.9} onPress={showTodayClassesList}>
						<Text style={styles.statLabel}>CLASSES TODAY</Text>
						<Text style={styles.statValue}>{todayClasses.length}</Text>
						<Text style={styles.statMeta}>Tap to view today's class list</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.resultPanel}>
					<Text style={styles.resultTitle}>{resultTitle}</Text>
					{resultRows.length ? (
						resultRows.map((row, idx) => (
							<Text key={`${row}-${idx}`} style={styles.resultItem}>
								{idx + 1}. {row}
							</Text>
						))
					) : (
						<Text style={styles.resultEmpty}>No data yet.</Text>
					)}
				</View>

				<View style={styles.headerRow}>
					<View>
						<Text style={styles.title}>My Classes</Text>
						<Text style={styles.subtitle}>Tap a class card to see overall grades</Text>
					</View>
					<View style={styles.switchRow}>
						<TouchableOpacity
							style={[styles.switchBtn, viewMode === 'grid' && styles.switchBtnActive]}
							activeOpacity={0.9}
							onPress={() => setViewMode('grid')}
						>
							<Text style={[styles.switchText, viewMode === 'grid' && styles.switchTextActive]}>Grid View</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.switchBtn, viewMode === 'list' && styles.switchBtnActive]}
							activeOpacity={0.9}
							onPress={() => setViewMode('list')}
						>
							<Text style={[styles.switchText, viewMode === 'list' && styles.switchTextActive]}>List View</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={viewMode === 'grid' ? styles.grid : styles.list}>
					{classes.map((classItem) => (
						<TouchableOpacity
							key={classItem.id}
							style={[styles.classCard, viewMode === 'list' && styles.classCardList]}
							activeOpacity={0.9}
							onPress={() => showClassOverallGrades(classItem)}
						>
							<View style={styles.cardTop}>
								<Text style={styles.classTitle}>{classItem.grade}</Text>
								<Text style={styles.classRoom}>{classItem.room}</Text>
							</View>
							<Text style={styles.classSubject}>{classItem.subject}</Text>
							<Text style={styles.classMeta}>Students: {classItem.students.length}</Text>
							<Text style={styles.classMeta}>Schedule: {classItem.schedule.join(', ')}</Text>
							<View style={styles.cardHintWrap}>
								<Text style={styles.cardHint}>Tap to view overall grades</Text>
							</View>
						</TouchableOpacity>
					))}

					<TouchableOpacity
						style={[styles.classCard, styles.addCard, viewMode === 'list' && styles.classCardList]}
						activeOpacity={0.9}
						onPress={() => setShowNewClassForm(true)}
					>
						<Text style={styles.addTitle}>Assign New Class</Text>
						<Text style={styles.addSubtitle}>Tap to open new class form</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#EEF2F7' },
	content: { padding: 14, paddingBottom: 24 },
	statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
	statCard: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 12,
		shadowColor: '#0F172A',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
	},
	statLabel: { fontSize: 10, color: '#7D8798', fontWeight: '700', marginBottom: 6 },
	statValue: { fontSize: 28, color: '#1A1A2E', fontWeight: '800', marginBottom: 4 },
	statMeta: { fontSize: 11, color: '#4B6B9D', fontWeight: '600' },

	resultPanel: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 12,
		marginBottom: 14,
		borderWidth: 1,
		borderColor: '#DEE6F2',
	},
	resultTitle: { fontSize: 13, color: '#1A1A2E', fontWeight: '800', marginBottom: 8 },
	resultItem: { fontSize: 12, color: '#475569', lineHeight: 19, marginBottom: 4 },
	resultEmpty: { fontSize: 12, color: '#64748B' },

	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
		gap: 12,
	},
	title: { fontSize: 30, fontWeight: '800', color: '#1A1A2E' },
	subtitle: { fontSize: 12, color: '#7D8798', marginTop: 2 },
	switchRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 4 },
	switchBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
	switchBtnActive: { backgroundColor: '#E8EEF9' },
	switchText: { fontSize: 11, color: '#76839A', fontWeight: '700' },
	switchTextActive: { color: '#1B3FA0' },

	grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
	list: { flexDirection: 'column', gap: 10 },
	classCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 14,
		padding: 12,
		width: '48.5%',
		borderWidth: 1,
		borderColor: '#E5EAF1',
	},
	classCardList: { width: '100%' },
	cardTop: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	classTitle: { fontSize: 16, color: '#1A1A2E', fontWeight: '800' },
	classRoom: { fontSize: 11, color: '#5E759B', fontWeight: '700' },
	classSubject: { fontSize: 14, color: '#1A1A2E', fontWeight: '700', marginBottom: 6 },
	classMeta: { fontSize: 11, color: '#64748B', marginBottom: 2 },
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
		borderColor: '#D6DEE9',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 170,
	},
	addTitle: { fontSize: 16, color: '#1A1A2E', fontWeight: '800' },
	addSubtitle: { fontSize: 11, color: '#7D8798', marginTop: 8, textAlign: 'center' },
});
