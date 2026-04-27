import React, { useMemo, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
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
	const [filterMode, setFilterMode] = useState('all');

	const pendingCount = useMemo(
		() => HOMEWORK_ITEMS.filter((item) => item.pendingReview).length,
		[]
	);

	const dueTodayCount = useMemo(
		() => HOMEWORK_ITEMS.filter((item) => item.dueToday).length,
		[]
	);

	const filteredItems = useMemo(() => {
		if (filterMode === 'pending') {
			return HOMEWORK_ITEMS.filter((item) => item.pendingReview);
		}
		if (filterMode === 'dueToday') {
			return HOMEWORK_ITEMS.filter((item) => item.dueToday);
		}
		return HOMEWORK_ITEMS;
	}, [filterMode]);

	const headerLabel =
		filterMode === 'pending'
			? 'Showing Pending Reviews'
			: filterMode === 'dueToday'
			? 'Showing Due Today'
			: 'Showing All Assignments';

	if (showNewAssignment) {
		return <NewAssignment onBack={() => setShowNewAssignment(false)} />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.headerRow}>
					<View>
						<Text style={styles.title}>Homework Management</Text>
						<Text style={styles.subtitle}>Track, manage, and review all active student assignments.</Text>
					</View>
					<TouchableOpacity
						style={styles.newButton}
						activeOpacity={0.85}
						onPress={() => setShowNewAssignment(true)}
					>
						<Text style={styles.newButtonText}>⊕ New Assignment</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.topCardsRow}>
					<TouchableOpacity
						style={[styles.topCard, filterMode === 'pending' && styles.topCardActive]}
						activeOpacity={0.9}
						onPress={() => setFilterMode('pending')}
					>
						<Text style={styles.topCardValue}>{pendingCount}</Text>
						<Text style={styles.topCardLabel}>PENDING REVIEWS</Text>
						<Text style={styles.topCardHint}>Tap to show pending homework</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.topCard, filterMode === 'dueToday' && styles.topCardActive]}
						activeOpacity={0.9}
						onPress={() => setFilterMode('dueToday')}
					>
						<Text style={styles.topCardValue}>{dueTodayCount}</Text>
						<Text style={styles.topCardLabel}>DUE TODAY</Text>
						<Text style={styles.topCardHint}>Tap to show due-today list</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.filterRow}>
					<TouchableOpacity style={styles.filterChip} activeOpacity={0.85} onPress={() => setFilterMode('all')}>
						<Text style={[styles.filterChipText, filterMode === 'all' && styles.filterChipTextActive]}>All</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterChip}
						activeOpacity={0.85}
						onPress={() => setFilterMode('pending')}
					>
						<Text style={[styles.filterChipText, filterMode === 'pending' && styles.filterChipTextActive]}>
							Pending
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterChip}
						activeOpacity={0.85}
						onPress={() => setFilterMode('dueToday')}
					>
						<Text style={[styles.filterChipText, filterMode === 'dueToday' && styles.filterChipTextActive]}>
							Due Today
						</Text>
					</TouchableOpacity>
				</View>

				<Text style={styles.activeFilterLabel}>{headerLabel}</Text>

				<View style={styles.tableWrap}>
					<View style={styles.tableHeader}>
						<Text style={[styles.tableHeaderText, styles.colTitle]}>HOMEWORK TITLE</Text>
						<Text style={[styles.tableHeaderText, styles.colClass]}>CLASS / SUBJECT</Text>
						<Text style={[styles.tableHeaderText, styles.colTimeline]}>TIMELINE</Text>
						<Text style={[styles.tableHeaderText, styles.colRate]}>RATE</Text>
						<Text style={[styles.tableHeaderText, styles.colStatus]}>STATUS</Text>
					</View>

					{filteredItems.map((item) => {
						const rate = getRate(item.submitted, item.total);
						return (
							<View key={item.id} style={styles.tableRow}>
								<View style={styles.colTitle}>
									<Text style={styles.mainText}>{item.title}</Text>
									<Text style={styles.subText}>Topic: {item.subject}</Text>
								</View>

								<View style={styles.colClass}>
									<Text style={styles.mainText}>{item.classInfo}</Text>
									<Text style={styles.subText}>{item.subject}</Text>
								</View>

								<View style={styles.colTimeline}>
									<Text style={styles.mainText}>{item.timeline}</Text>
								</View>

								<View style={styles.colRate}>
									<Text style={styles.mainText}>{item.submitted}/{item.total}</Text>
									<View style={styles.rateTrack}>
										<View style={[styles.rateFill, { width: `${rate}%` }]} />
									</View>
								</View>

								<View style={styles.colStatus}>
									<View style={[styles.statusPill, { backgroundColor: statusStyle[item.status].bg }]}>
										<Text style={[styles.statusText, { color: statusStyle[item.status].color }]}>{item.status}</Text>
									</View>
								</View>
							</View>
						);
					})}

					{!filteredItems.length && (
						<View style={styles.emptyState}>
							<Text style={styles.emptyStateText}>No assignments found for this filter.</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F4F6FA' },
	content: { flex: 1, padding: 14 },
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 14,
		gap: 10,
	},
	title: { fontSize: 34, fontWeight: '800', color: '#1A1A2E' },
	subtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
	newButton: {
		backgroundColor: '#1D5FD1',
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 10,
		shadowColor: '#1D5FD1',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 3,
	},
	newButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
	topCardsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
	topCard: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 14,
		borderWidth: 1,
		borderColor: '#E7EAF0',
	},
	topCardActive: { borderColor: '#1D5FD1', backgroundColor: '#F2F7FF' },
	topCardValue: { fontSize: 38, fontWeight: '800', color: '#1A1A2E' },
	topCardLabel: { fontSize: 11, color: '#7D8696', fontWeight: '700', marginTop: 2 },
	topCardHint: { fontSize: 10, color: '#9AA3B2', marginTop: 8 },
	filterRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
	filterChip: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E6EAF2',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	filterChipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
	filterChipTextActive: { color: '#1D5FD1' },
	activeFilterLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginBottom: 8 },
	tableWrap: {
		backgroundColor: '#FFFFFF',
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#E7EAF0',
		overflow: 'hidden',
	},
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: '#F7F9FC',
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E7EAF0',
	},
	tableHeaderText: { fontSize: 9, color: '#8E96A3', fontWeight: '700' },
	tableRow: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#EEF2F7',
	},
	colTitle: { flex: 2.2, paddingRight: 8 },
	colClass: { flex: 1.5, paddingRight: 8 },
	colTimeline: { flex: 1.3, paddingRight: 8 },
	colRate: { flex: 1.2, paddingRight: 8 },
	colStatus: { flex: 1, alignItems: 'flex-start' },
	mainText: { fontSize: 11, color: '#1F2937', fontWeight: '700' },
	subText: { fontSize: 10, color: '#8B95A5', marginTop: 2 },
	rateTrack: {
		marginTop: 4,
		height: 5,
		backgroundColor: '#E6EBF2',
		borderRadius: 4,
		overflow: 'hidden',
	},
	rateFill: { height: '100%', backgroundColor: '#1D5FD1' },
	statusPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
	statusText: { fontSize: 9, fontWeight: '700' },
	emptyState: { padding: 18, alignItems: 'center' },
	emptyStateText: { color: '#8B95A5', fontSize: 12 },
});
