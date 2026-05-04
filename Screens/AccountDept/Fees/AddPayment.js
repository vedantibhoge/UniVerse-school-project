import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	StatusBar,
} from 'react-native';

const C = {
	primary: '#4F46E5',
	card: '#FFFFFF',
	border: '#E8ECF4',
	text: '#1A1D2E',
	subtext: '#6B7280',
	lightText: '#9CA3AF',
	bg: '#F8F9FC',
};

const CLASSES = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];
const PAYMENT_TYPES = ['Payment History', 'Pending Fees', 'Other'];

export default function AddPayment({ onBack, onSave }) {
	const [paymentName, setPaymentName] = useState('');
	const [paymentClass, setPaymentClass] = useState('Class 10');
	const [paymentType, setPaymentType] = useState('Payment History');
	const [paymentAmount, setPaymentAmount] = useState('');
	const [paymentNote, setPaymentNote] = useState('');

	const handleSave = () => {
		onSave({
			paymentName,
			paymentClass,
			paymentType,
			paymentAmount,
			paymentNote,
		});
	};

	return (
		<View style={styles.root}>
			<StatusBar barStyle="dark-content" backgroundColor={C.card} />
			<ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
						<Text style={styles.backBtnText}>← Back</Text>
					</TouchableOpacity>
					<Text style={styles.title}>Add Payment</Text>
				</View>

				<View style={styles.formSection}>
					<Text style={styles.formLabel}>Name</Text>
					<TextInput
						style={styles.formInput}
						placeholder="Student or parent name"
						placeholderTextColor={C.lightText}
						value={paymentName}
						onChangeText={setPaymentName}
					/>
				</View>

				<View style={styles.formSection}>
					<Text style={styles.formLabel}>Class</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRow}>
						{CLASSES.map((item) => {
							const active = paymentClass === item;
							return (
								<TouchableOpacity
									key={item}
									style={[styles.optionChip, active && styles.optionChipActive]}
									onPress={() => setPaymentClass(item)}
									activeOpacity={0.8}
								>
									<Text style={[styles.optionChipText, active && styles.optionChipTextActive]}>{item}</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				</View>

				<View style={styles.formSection}>
					<Text style={styles.formLabel}>Payment Type</Text>
					<View style={styles.optionGrid}>
						{PAYMENT_TYPES.map((item) => {
							const active = paymentType === item;
							return (
								<TouchableOpacity
									key={item}
									style={[styles.optionCard, active && styles.optionCardActive]}
									onPress={() => setPaymentType(item)}
									activeOpacity={0.8}
								>
									<Text style={[styles.optionCardText, active && styles.optionCardTextActive]}>{item}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>

				<View style={styles.formSection}>
					<Text style={styles.formLabel}>Amount</Text>
					<TextInput
						style={styles.formInput}
						placeholder="$0.00"
						placeholderTextColor={C.lightText}
						keyboardType="decimal-pad"
						value={paymentAmount}
						onChangeText={setPaymentAmount}
					/>
				</View>

				<View style={styles.formSection}>
					<Text style={styles.formLabel}>Note</Text>
					<TextInput
						style={[styles.formInput, styles.formTextarea]}
						placeholder="Add an optional note"
						placeholderTextColor={C.lightText}
						multiline
						value={paymentNote}
						onChangeText={setPaymentNote}
					/>
				</View>

				<View style={styles.formActions}>
					<TouchableOpacity style={styles.secondaryBtn} onPress={onBack} activeOpacity={0.8}>
						<Text style={styles.secondaryBtnText}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.primaryBtn} onPress={handleSave} activeOpacity={0.85}>
						<Text style={styles.primaryBtnText}>Save Payment</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: C.bg },
	body: { flex: 1, paddingHorizontal: 12 },
	bodyContent: { paddingTop: 16, paddingBottom: 24 },
	headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
	backBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FAFAFA' },
	backBtnText: { color: C.subtext, fontSize: 13, fontWeight: '700' },
	title: { fontSize: 22, fontWeight: '800', color: C.text },
	formSection: { marginBottom: 14 },
	formLabel: { fontSize: 11, fontWeight: '700', color: C.subtext, letterSpacing: 0.4, marginBottom: 8 },
	formInput: { borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: '#FAFAFA', paddingHorizontal: 14, paddingVertical: 12, color: C.text, fontSize: 14 },
	formTextarea: { minHeight: 92, textAlignVertical: 'top' },
	optionRow: { gap: 10, paddingRight: 4 },
	optionChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: '#FAFAFA' },
	optionChipActive: { backgroundColor: '#EEF2FF', borderColor: C.primary },
	optionChipText: { fontSize: 13, color: C.subtext, fontWeight: '600' },
	optionChipTextActive: { color: C.primary },
	optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
	optionCard: { minWidth: 150, flexGrow: 1, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#FAFAFA' },
	optionCardActive: { borderColor: C.primary, backgroundColor: '#EEF2FF' },
	optionCardText: { fontSize: 13, color: C.text, fontWeight: '600' },
	optionCardTextActive: { color: C.primary },
	formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
	secondaryBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FAFAFA' },
	secondaryBtnText: { color: C.subtext, fontSize: 14, fontWeight: '700' },
	primaryBtn: { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: C.primary },
	primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});