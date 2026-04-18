import React, { useMemo, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	StatusBar,
	Alert,
} from 'react-native';

const TEACHERS = [
	'A. Sharma',
	'R. Gupta',
	'M. Verma',
	'N. Iyer',
	'S. Khan',
	'P. Nair',
];

const defaultForm = {
	grade: '',
	section: '',
	roomNumber: '',
	classTeacher: '',
	academicYear: '',
	maxStudents: '',
	subjects: '',
};

export default function CreateNewClass({ onBack }) {
	const [form, setForm] = useState(defaultForm);

	const canSubmit = useMemo(() => {
		return (
			form.grade.trim().length > 0 &&
			form.section.trim().length > 0 &&
			form.roomNumber.trim().length > 0 &&
			form.classTeacher.trim().length > 0 &&
			form.academicYear.trim().length > 0 &&
			form.maxStudents.trim().length > 0
		);
	}, [form]);

	const updateField = (key, value) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleReset = () => {
		setForm(defaultForm);
	};

	const handleSave = () => {
		if (!canSubmit) {
			Alert.alert('Incomplete Form', 'Please fill all required fields.');
			return;
		}

		const size = Number(form.maxStudents);
		if (!Number.isFinite(size) || size <= 0 || size > 100) {
			Alert.alert('Invalid Capacity', 'Max students must be a number between 1 and 100.');
			return;
		}

		Alert.alert(
			'Class Created',
			`Grade ${form.grade}-${form.section} created successfully.`,
			[
				{
					text: 'OK',
					onPress: () => {
						handleReset();
						if (typeof onBack === 'function') {
							onBack();
						}
					},
				},
			]
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
					<Text style={styles.backButtonText}>Back</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Create New Class</Text>
				<View style={styles.headerSpacer} />
			</View>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<Text style={styles.sectionTitle}>Class Details</Text>

				<View style={styles.row}>
					<View style={styles.fieldHalf}>
						<Text style={styles.label}>Grade *</Text>
						<TextInput
							value={form.grade}
							onChangeText={(value) => updateField('grade', value)}
							placeholder="e.g. 10"
							placeholderTextColor="#9CA3AF"
							style={styles.input}
							keyboardType="number-pad"
						/>
					</View>

					<View style={styles.fieldHalf}>
						<Text style={styles.label}>Section *</Text>
						<TextInput
							value={form.section}
							onChangeText={(value) => updateField('section', value.toUpperCase())}
							placeholder="e.g. A"
							placeholderTextColor="#9CA3AF"
							style={styles.input}
							maxLength={2}
						/>
					</View>
				</View>

				<View style={styles.row}>
					<View style={styles.fieldHalf}>
						<Text style={styles.label}>Room Number *</Text>
						<TextInput
							value={form.roomNumber}
							onChangeText={(value) => updateField('roomNumber', value)}
							placeholder="e.g. B-204"
							placeholderTextColor="#9CA3AF"
							style={styles.input}
						/>
					</View>

					<View style={styles.fieldHalf}>
						<Text style={styles.label}>Max Students *</Text>
						<TextInput
							value={form.maxStudents}
							onChangeText={(value) => updateField('maxStudents', value.replace(/[^0-9]/g, ''))}
							placeholder="e.g. 40"
							placeholderTextColor="#9CA3AF"
							style={styles.input}
							keyboardType="number-pad"
							maxLength={3}
						/>
					</View>
				</View>

				<Text style={styles.label}>Academic Year *</Text>
				<TextInput
					value={form.academicYear}
					onChangeText={(value) => updateField('academicYear', value)}
					placeholder="e.g. 2026-2027"
					placeholderTextColor="#9CA3AF"
					style={styles.input}
				/>

				<Text style={styles.label}>Class Teacher *</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
					{TEACHERS.map((name) => {
						const selected = form.classTeacher === name;
						return (
							<TouchableOpacity
								key={name}
								onPress={() => updateField('classTeacher', name)}
								style={[styles.chip, selected && styles.chipSelected]}
								activeOpacity={0.8}
							>
								<Text style={[styles.chipText, selected && styles.chipTextSelected]}>{name}</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>

				<Text style={styles.label}>Subjects (comma separated)</Text>
				<TextInput
					value={form.subjects}
					onChangeText={(value) => updateField('subjects', value)}
					placeholder="Math, Science, English"
					placeholderTextColor="#9CA3AF"
					style={[styles.input, styles.multilineInput]}
					multiline
				/>

				<View style={styles.buttonRow}>
					<TouchableOpacity style={styles.secondaryButton} onPress={handleReset} activeOpacity={0.8}>
						<Text style={styles.secondaryButtonText}>Reset</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
						onPress={handleSave}
						activeOpacity={0.8}
					>
						<Text style={styles.primaryButtonText}>Save Class</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3F6FC',
	},
	header: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	backButton: {
		minWidth: 54,
		paddingVertical: 8,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: '#EAF0FF',
		alignItems: 'center',
	},
	backButtonText: {
		color: '#1D4ED8',
		fontWeight: '700',
		fontSize: 12,
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 18,
		color: '#0F172A',
		fontWeight: '800',
	},
	headerSpacer: {
		width: 54,
	},
	content: {
		padding: 16,
		paddingBottom: 28,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1F2937',
		marginBottom: 12,
	},
	row: {
		flexDirection: 'row',
		gap: 10,
	},
	fieldHalf: {
		flex: 1,
	},
	label: {
		fontSize: 12,
		fontWeight: '600',
		color: '#475569',
		marginBottom: 6,
		marginTop: 10,
	},
	input: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#D1D5DB',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 11,
		fontSize: 14,
		color: '#0F172A',
	},
	multilineInput: {
		minHeight: 74,
		textAlignVertical: 'top',
	},
	chipsRow: {
		paddingVertical: 8,
		gap: 8,
	},
	chip: {
		backgroundColor: '#FFFFFF',
		borderColor: '#CBD5E1',
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	chipSelected: {
		backgroundColor: '#DBEAFE',
		borderColor: '#60A5FA',
	},
	chipText: {
		color: '#334155',
		fontSize: 12,
		fontWeight: '600',
	},
	chipTextSelected: {
		color: '#1D4ED8',
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 18,
	},
	secondaryButton: {
		flex: 1,
		backgroundColor: '#E2E8F0',
		borderRadius: 10,
		alignItems: 'center',
		paddingVertical: 13,
	},
	secondaryButtonText: {
		fontWeight: '700',
		color: '#334155',
	},
	primaryButton: {
		flex: 1,
		backgroundColor: '#1D4ED8',
		borderRadius: 10,
		alignItems: 'center',
		paddingVertical: 13,
	},
	primaryButtonDisabled: {
		opacity: 0.5,
	},
	primaryButtonText: {
		fontWeight: '700',
		color: '#FFFFFF',
	},
});
