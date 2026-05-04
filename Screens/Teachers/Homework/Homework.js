import React, { useMemo, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	TextInput,
	Alert,
} from 'react-native';

import NewAssignment from './NewAssignment';

const HOMEWORK_ITEMS = [
	{
		id: 'hw-1',
		title: 'Calculus: Partial Derivatives',
		classInfo: 'Grade 12-A',
		subject: 'Mathematics',
		timeline: 'Oct 24 - Oct 30',
		submitted: 28,
		total: 30,
		status: 'ACTIVE',
		pendingReview: true,
		dueToday: true,
		students: [
			{ name: 'Aarav Mehta', status: 'Completed' },
			{ name: 'Diya Sharma', status: 'Completed' },
			{ name: 'Kabir Singh', status: 'Completed' },
			{ name: 'Ananya Das', status: 'Pending' },
			{ name: 'Riya Patel', status: 'Pending' },
		],
	},
	{
		id: 'hw-2',
		title: 'Photosynthesis Lab Report',
		classInfo: 'Grade 11-B',
		subject: 'Biology',
		timeline: 'Oct 20 - Oct 25',
		submitted: 30,
		total: 30,
		status: 'GRADING',
		pendingReview: true,
		dueToday: false,
		students: [
			{ name: 'Megha Nair', status: 'Completed' },
			{ name: 'Ishaan Roy', status: 'Completed' },
			{ name: 'Nina Thomas', status: 'Pending' },
			{ name: 'Arjun Sen', status: 'Pending' },
		],
	},
	{
		id: 'hw-3',
		title: 'Industrial Revolution Essay',
		classInfo: 'Grade 10-C',
		subject: 'History',
		timeline: 'Oct 12 - Oct 18',
		submitted: 25,
		total: 25,
		status: 'CLOSED',
		pendingReview: false,
		dueToday: false,
		students: [
			{ name: 'Rohan Verma', status: 'Completed' },
			{ name: 'Pooja Iyer', status: 'Completed' },
			{ name: 'Sana Khan', status: 'Completed' },
			{ name: 'Dev Patel', status: 'Completed' },
		],
	},
	{
		id: 'hw-4',
		title: 'Atomic Structure Worksheet',
		classInfo: 'Grade 9-A',
		subject: 'Science',
		timeline: 'Oct 25 - Oct 26',
		submitted: 19,
		total: 32,
		status: 'ACTIVE',
		pendingReview: true,
		dueToday: true,
		students: [
			{ name: 'Rahul Jain', status: 'Completed' },
			{ name: 'Neha Gupta', status: 'Pending' },
			{ name: 'Kabir Ali', status: 'Pending' },
			{ name: 'Sara Khan', status: 'Completed' },
		],
	},
	{
		id: 'hw-5',
		title: 'Grammar Practice Set',
		classInfo: 'Grade 8-B',
		subject: 'English',
		timeline: 'Oct 25 - Oct 26',
		submitted: 22,
		total: 29,
		status: 'ACTIVE',
		pendingReview: false,
		dueToday: true,
		students: [
			{ name: 'Aanya Singh', status: 'Completed' },
			{ name: 'Mohan Das', status: 'Pending' },
			{ name: 'Fahad Khan', status: 'Pending' },
		],
	},
];

const statusStyle = {
	ACTIVE: { bg: '#E6F0FF', color: '#1D5FD1' },
	GRADING: { bg: '#FFF1E5', color: '#D16A1D' },
	CLOSED: { bg: '#EEF0F4', color: '#6B7280' },
};

const getRate = (submitted, total) => {
	if (!total) return 0;
	return Math.round((submitted / total) * 100);
};

export default function TeacherHomework() {
	const [showNewAssignment, setShowNewAssignment] = useState(false);
	const [screenMode, setScreenMode] = useState('dashboard');
	const [selectedClass, setSelectedClass] = useState(HOMEWORK_ITEMS[0].classInfo);
	const [selectedHomeworkId, setSelectedHomeworkId] = useState(HOMEWORK_ITEMS[0].id);
	const [filterMode, setFilterMode] = useState('all');
	const [gradeDraft, setGradeDraft] = useState({ student: '', grade: '', remark: '' });
	const [savedGrades, setSavedGrades] = useState([]);

	const pendingCount = useMemo(
		() => HOMEWORK_ITEMS.filter((item) => item.pendingReview).length,
		[]
	);

	const dueTodayCount = useMemo(
		() => HOMEWORK_ITEMS.filter((item) => item.dueToday).length,
		[]
	);

	const classOptions = useMemo(
		() => [...new Set(HOMEWORK_ITEMS.map((item) => item.classInfo))],
		[]
	);

	const selectedHomework = useMemo(
		() => HOMEWORK_ITEMS.find((item) => item.id === selectedHomeworkId) || HOMEWORK_ITEMS[0],
		[selectedHomeworkId]
	);

	const selectedHomeworkStudents = selectedHomework.students || [];
	const completedCount = selectedHomeworkStudents.filter((student) => student.status === 'Completed').length;
	const pendingCompletionCount = selectedHomeworkStudents.filter(
		(student) => student.status !== 'Completed'
	).length;

	const classHomeworkItems = useMemo(
		() => HOMEWORK_ITEMS.filter((item) => item.classInfo === selectedClass),
		[selectedClass]
	);

	const filteredItems = useMemo(() => {
		if (filterMode === 'pending') {
			return classHomeworkItems.filter((item) => item.pendingReview);
		}
		if (filterMode === 'dueToday') {
			return classHomeworkItems.filter((item) => item.dueToday);
		}
		return classHomeworkItems;
	}, [classHomeworkItems, filterMode]);

	const headerLabel =
		filterMode === 'pending'
			? 'Showing pending reviews for the selected class'
			: filterMode === 'dueToday'
			? 'Showing due-today work for the selected class'
			: 'Showing all assignments for the selected class';

	const openHomeworkScreen = () => {
		setShowNewAssignment(true);
	};

	const handleSaveGrade = () => {
		if (!gradeDraft.student.trim() || !gradeDraft.grade.trim()) {
			Alert.alert('Missing Details', 'Please add the student name and grade.');
			return;
		}

		setSavedGrades((prev) => [
			{
				id: `${Date.now()}`,
				homeworkTitle: selectedHomework.title,
				student: gradeDraft.student.trim(),
				grade: gradeDraft.grade.trim(),
				remark: gradeDraft.remark.trim(),
			},
			...prev,
		]);
		setGradeDraft({ student: '', grade: '', remark: '' });
		Alert.alert('Saved', 'Grade added successfully.');
	};

	const heroActions = [
		{ key: 'homework', label: 'Homework', hint: 'Add assignment' },
		{ key: 'list', label: 'View List', hint: 'Class homework' },
		{ key: 'submissions', label: 'View Submissions', hint: 'Due date & status' },
		{ key: 'grades', label: 'Add Grades', hint: 'Mark student work' },
	];

	const openMode = (mode) => {
		setScreenMode(mode);
	};

	if (showNewAssignment) {
		return <NewAssignment onBack={() => setShowNewAssignment(false)} />;
	}

	if (screenMode === 'list') {
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.pageShell}>
						<View style={styles.pageHeaderRow}>
							<TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => openMode('dashboard')}>
								<Text style={styles.backButtonText}>← Back</Text>
							</TouchableOpacity>
							<View>
								<Text style={styles.sectionTitle}>Homework List</Text>
								<Text style={styles.sectionSubtitle}>Open the class homework list in its own page.</Text>
							</View>
						</View>

						<View style={styles.sectionCard}>
							<View style={styles.sectionHeader}>
								<View>
									<Text style={styles.sectionTitle}>{headerLabel}</Text>
									<Text style={styles.sectionSubtitle}>Pick a class and view the homework list with completion status.</Text>
								</View>
								<View style={styles.chipRow}>
									{classOptions.map((className) => (
										<TouchableOpacity
											key={className}
											style={[styles.chip, selectedClass === className && styles.chipActive]}
											activeOpacity={0.85}
											onPress={() => setSelectedClass(className)}
										>
											<Text style={[styles.chipText, selectedClass === className && styles.chipTextActive]}>{className}</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>

							<View style={styles.filterRow}>
								{['all', 'pending', 'dueDate'].map((mode) => (
									<TouchableOpacity
										key={mode}
										style={[styles.filterChip, filterMode === mode && styles.filterChipActive]}
										activeOpacity={0.85}
										onPress={() => setFilterMode(mode)}
									>
										<Text style={[styles.filterChipText, filterMode === mode && styles.filterChipTextActive]}>
											{mode === 'all' ? 'All' : mode === 'pending' ? 'Pending' : 'Due Date'}
										</Text>
									</TouchableOpacity>
								))}
							</View>

							{filterMode === 'dueDate' ? (
								<View style={styles.detailCard}>
									<Text style={styles.detailTitle}>Due Date</Text>
									<Text style={styles.detailLine}>{selectedHomework.timeline}</Text>
									<Text style={[styles.detailLine, {marginTop: 16}]}>Homework: {selectedHomework.title}</Text>
									<Text style={styles.detailLine}>Class: {selectedHomework.classInfo}</Text>
									<Text style={styles.detailLine}>Status: {selectedHomework.status}</Text>
								</View>
							) : (
								<View>
									<View style={styles.detailCard}>
										<Text style={styles.detailTitle}>{selectedHomework.title}</Text>
										<Text style={styles.detailLine}>Class: {selectedHomework.classInfo}</Text>
										<Text style={styles.detailLine}>Subject: {selectedHomework.subject}</Text>
										<Text style={styles.detailLine}>Due date: {selectedHomework.timeline}</Text>
									</View>

									<View style={styles.studentList}>
										<Text style={{fontSize: 14, fontWeight: '900', color: '#0F172A', marginBottom: 10, marginTop: 8}}>
											{filterMode === 'all' ? 'All Students' : 'Students with Pending Homework'}
										</Text>
										{selectedHomeworkStudents
											.filter((student) => filterMode === 'all' || student.status !== 'Completed')
											.map((student, index) => (
												<View key={`${student.name}-${index}`} style={styles.studentRow}>
													<Text style={styles.studentName}>{student.name}</Text>
													<View
														style={[
															styles.studentStatusPill,
															student.status === 'Completed' ? styles.studentStatusDone : styles.studentStatusPending,
														]}
													>
														<Text style={styles.studentStatusText}>{student.status}</Text>
													</View>
												</View>
											))}
									</View>
								</View>
							)}
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	if (screenMode === 'submissions') {
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.pageShell}>
						<View style={styles.pageHeaderRow}>
							<TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => openMode('dashboard')}>
								<Text style={styles.backButtonText}>← Back</Text>
							</TouchableOpacity>
							<Text style={styles.sectionTitle}>View Submissions</Text>
						</View>
						<View style={styles.sectionCard}>
							<Text style={styles.sectionSubtitle}>Select a homework below to see the due date and submission status.</Text>
							<View style={styles.homeworkPickerRow}>
								{HOMEWORK_ITEMS.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={[styles.homeworkPicker, selectedHomeworkId === item.id && styles.homeworkPickerActive]}
										activeOpacity={0.85}
										onPress={() => setSelectedHomeworkId(item.id)}
									>
										<Text style={[styles.homeworkPickerText, selectedHomeworkId === item.id && styles.homeworkPickerTextActive]}>{item.title}</Text>
									</TouchableOpacity>
								))}
							</View>
							<View style={styles.detailCard}>
								<Text style={styles.detailTitle}>{selectedHomework.title}</Text>
								<Text style={styles.detailLine}>Class: {selectedHomework.classInfo}</Text>
								<Text style={styles.detailLine}>Subject: {selectedHomework.subject}</Text>
								<Text style={styles.detailLine}>Due date: {selectedHomework.timeline}</Text>
								<Text style={styles.detailLine}>Submissions: {selectedHomework.submitted}/{selectedHomework.total}</Text>
								<Text style={styles.detailLine}>Review status: {selectedHomework.pendingReview ? 'Pending review' : 'Reviewed'}</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	if (screenMode === 'grades') {
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.pageShell}>
						<View style={styles.pageHeaderRow}>
							<TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => openMode('dashboard')}>
								<Text style={styles.backButtonText}>← Back</Text>
							</TouchableOpacity>
							<Text style={styles.sectionTitle}>Add Grades</Text>
						</View>
						<View style={styles.sectionCard}>
							<Text style={styles.sectionSubtitle}>Enter student marks for the selected homework.</Text>
							<View style={styles.detailCard}>
								<Text style={styles.detailLine}>Homework: {selectedHomework.title}</Text>
								<Text style={styles.detailLine}>Due date: {selectedHomework.timeline}</Text>

								<Text style={styles.label}>Student Name</Text>
								<TextInput
									style={styles.input}
									value={gradeDraft.student}
									onChangeText={(text) => setGradeDraft((prev) => ({ ...prev, student: text }))}
									placeholder="Enter student name"
									placeholderTextColor="#94A3B8"
								/>

								<Text style={styles.label}>Grade</Text>
								<TextInput
									style={styles.input}
									value={gradeDraft.grade}
									onChangeText={(text) => setGradeDraft((prev) => ({ ...prev, grade: text }))}
									placeholder="Enter grade, e.g. 18/20"
									placeholderTextColor="#94A3B8"
								/>

								<Text style={styles.label}>Remark</Text>
								<TextInput
									style={[styles.input, styles.textArea]}
									value={gradeDraft.remark}
									onChangeText={(text) => setGradeDraft((prev) => ({ ...prev, remark: text }))}
									placeholder="Optional note"
									placeholderTextColor="#94A3B8"
									multiline
								/>

								<TouchableOpacity style={styles.primaryButton} activeOpacity={0.88} onPress={handleSaveGrade}>
									<Text style={styles.primaryButtonText}>Save Grade</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.savedList}>
								<Text style={styles.savedListTitle}>Saved Grades</Text>
								{savedGrades.length ? (
									savedGrades.map((entry) => (
										<View key={entry.id} style={styles.savedItem}>
											<Text style={styles.savedItemTitle}>{entry.student}</Text>
											<Text style={styles.savedItemMeta}>{entry.homeworkTitle}</Text>
											<Text style={styles.savedItemMeta}>Grade: {entry.grade}</Text>
											{entry.remark ? <Text style={styles.savedItemMeta}>{entry.remark}</Text> : null}
										</View>
									))
								) : (
									<Text style={styles.emptyStateText}>No grades saved yet.</Text>
								)}
							</View>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.pageShell}>
					<View style={styles.heroCard}>
						<View style={styles.heroTopRow}>
							<View style={styles.heroCopy}>
								<Text style={styles.kicker}>Teacher Workspace</Text>
								<Text style={styles.title}>Homework Management</Text>
								<Text style={styles.subtitle}>
									Create assignments, review submissions, assign grades, and keep every class in one clean view.
								</Text>
							</View>
							<View style={styles.heroStatsRow}>
								<View style={styles.heroStat}>
									<Text style={styles.heroStatValue}>{HOMEWORK_ITEMS.length}</Text>
									<Text style={styles.heroStatLabel}>Assignments</Text>
								</View>
								<View style={styles.heroStat}>
									<Text style={styles.heroStatValue}>{pendingCount}</Text>
									<Text style={styles.heroStatLabel}>Pending</Text>
								</View>
								<View style={styles.heroStat}>
									<Text style={styles.heroStatValue}>{dueTodayCount}</Text>
									<Text style={styles.heroStatLabel}>Due Today</Text>
								</View>
							</View>
						</View>

						<View style={styles.actionGrid}>
							{heroActions.map((action) => (
								<TouchableOpacity
									key={action.key}
									style={styles.actionButton}
									activeOpacity={0.88}
									onPress={() => {
										if (action.key === 'homework') {
											openHomeworkScreen();
											return;
										}
										openMode(action.key);
									}}
								>
									<Text style={styles.actionButtonLabel}>{action.label}</Text>
									<Text style={styles.actionButtonHint}>{action.hint}</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F3F7FC' },
	content: { padding: 14, paddingBottom: 24 },
	pageShell: {
		width: '100%',
		maxWidth: 1180,
		alignSelf: 'center',
	},
	pageHeaderRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 12,
		marginBottom: 16,
	},
	backButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: '#F3F7FC',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#DCE6F5',
	},
	backButtonText: {
		fontSize: 14,
		fontWeight: '700',
		color: '#2563EB',
	},
	heroCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		padding: 18,
		borderWidth: 1,
		borderColor: '#E6ECF5',
		marginBottom: 14,
		shadowColor: '#0F172A',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.06,
		shadowRadius: 16,
		elevation: 2,
	},
	heroTopRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between' },
	heroCopy: { flex: 1, minWidth: 280 },
	kicker: { fontSize: 11, color: '#2563EB', fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
	title: { fontSize: 32, lineHeight: 38, fontWeight: '900', color: '#0F172A', marginTop: 6 },
	subtitle: { fontSize: 13, lineHeight: 20, color: '#64748B', marginTop: 8, maxWidth: 640 },
	heroStatsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
	heroStat: {
		minWidth: 92,
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: 14,
		backgroundColor: '#F8FBFF',
		borderWidth: 1,
		borderColor: '#E5EEF9',
		alignItems: 'center',
	},
	heroStatValue: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
	heroStatLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 2 },
	actionGrid: { flexDirection: 'column', gap: 10, marginTop: 16 },
	actionButton: {
		backgroundColor: '#F8FBFF',
		borderRadius: 14,
		padding: 14,
		borderWidth: 1,
		borderColor: '#DCE6F5',
	},
	actionButtonActive: { backgroundColor: '#EAF2FF', borderColor: '#2563EB' },
	actionButtonLabel: { fontSize: 14, color: '#0F172A', fontWeight: '800' },
	actionButtonHint: { fontSize: 11, color: '#64748B', marginTop: 4 },
	sectionCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 18,
		padding: 16,
		borderWidth: 1,
		borderColor: '#E6ECF5',
		marginBottom: 14,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 12,
		flexWrap: 'wrap',
	},
	sectionTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
	sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 4, maxWidth: 680 },
	smallPrimaryButton: {
		backgroundColor: '#2563EB',
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	smallPrimaryButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
	quickStatsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
	quickStatCard: {
		flexGrow: 1,
		flexBasis: '30%',
		minWidth: 160,
		backgroundColor: '#F8FBFF',
		borderRadius: 14,
		padding: 14,
		borderWidth: 1,
		borderColor: '#E2EAF6',
	},
	quickStatLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
	quickStatValue: { fontSize: 15, color: '#0F172A', fontWeight: '900', marginTop: 6 },
	chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
	chip: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: '#F7FAFF',
		borderWidth: 1,
		borderColor: '#D7E2F1',
	},
	chipActive: { backgroundColor: '#EAF2FF', borderColor: '#2563EB' },
	chipText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
	chipTextActive: { color: '#1D4ED8' },
	filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
	filterChip: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#DFE7F2',
		backgroundColor: '#FFFFFF',
	},
	filterChipActive: { borderColor: '#2563EB', backgroundColor: '#EEF5FF' },
	filterChipText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
	filterChipTextActive: { color: '#1D4ED8' },
	cardList: { marginTop: 14, gap: 10 },
	homeworkCard: {
		backgroundColor: '#FDFEFF',
		borderRadius: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: '#E3EAF5',
	},
	homeworkTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
	homeworkTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
	homeworkMeta: { fontSize: 12, color: '#64748B', marginTop: 4 },
	metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
	metaChip: {
		fontSize: 11,
		color: '#475569',
		backgroundColor: '#F3F7FC',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		overflow: 'hidden',
	},
	rateTrack: { marginTop: 12, height: 6, backgroundColor: '#E7EDF6', borderRadius: 999, overflow: 'hidden' },
	rateFill: { height: '100%', backgroundColor: '#2563EB' },
	statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
	statusText: { fontSize: 10, fontWeight: '800' },
	emptyState: { paddingVertical: 22, alignItems: 'center' },
	emptyStateText: { color: '#64748B', fontSize: 12 },
	homeworkPickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
	homeworkPicker: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#DFE7F2',
		backgroundColor: '#FFFFFF',
	},
	homeworkPickerActive: { backgroundColor: '#EAF2FF', borderColor: '#2563EB' },
	homeworkPickerText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
	homeworkPickerTextActive: { color: '#1D4ED8' },
	detailCard: {
		marginTop: 14,
		backgroundColor: '#F8FBFF',
		borderRadius: 16,
		padding: 14,
		borderWidth: 1,
		borderColor: '#DFE7F2',
	},
	detailTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A', marginBottom: 8 },
	detailLine: { fontSize: 12, color: '#334155', marginTop: 6, lineHeight: 18 },
	label: { fontSize: 12, color: '#475569', fontWeight: '800', marginTop: 12, marginBottom: 6 },
	input: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#D8E2F0',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 11,
		fontSize: 13,
		color: '#0F172A',
	},
	textArea: { minHeight: 88, textAlignVertical: 'top' },
	primaryButton: {
		marginTop: 14,
		backgroundColor: '#2563EB',
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center',
	},
	primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
	savedList: { marginTop: 14 },
	savedListTitle: { fontSize: 14, fontWeight: '900', color: '#0F172A', marginBottom: 10 },
	savedItem: {
		backgroundColor: '#FFFFFF',
		borderRadius: 14,
		padding: 12,
		borderWidth: 1,
		borderColor: '#E3EAF5',
		marginBottom: 10,
	},
	savedItemTitle: { fontSize: 13, fontWeight: '900', color: '#0F172A' },
	savedItemMeta: { fontSize: 11, color: '#64748B', marginTop: 4, lineHeight: 16 },
	studentList: { marginTop: 12, gap: 8 },
	studentRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: '#E3EAF5',
	},
	studentName: { fontSize: 12, color: '#0F172A', fontWeight: '700', flex: 1, paddingRight: 10 },
	studentStatusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
	studentStatusDone: { backgroundColor: '#E7F7EE' },
	studentStatusPending: { backgroundColor: '#FFF3E8' },
	studentStatusText: { fontSize: 10, fontWeight: '800', color: '#0F172A' },
});
