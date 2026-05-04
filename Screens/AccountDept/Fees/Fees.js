import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Dimensions,
	StatusBar,
	Modal,
} from 'react-native';
import AddPayment from './AddPayment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTabletOrDesktop = SCREEN_WIDTH >= 768;

const C = {
	primary: '#4F46E5',
	primaryDark: '#3730A3',
	accent: '#6366F1',
	success: '#10B981',
	warning: '#F59E0B',
	danger: '#EF4444',
	purple: '#7C3AED',
	bg: '#F8F9FC',
	card: '#FFFFFF',
	border: '#E8ECF4',
	text: '#1A1D2E',
	subtext: '#6B7280',
	lightText: '#9CA3AF',
	headerBg: '#FFFFFF',
};

const PAYMENTS = [
	{ id: '1', date: 'Oct 24, 2023', receipt: '#RCPT-8821', name: 'Arjun Sharma', classLabel: 'Class 10', billingMonth: 'October 2023', paymentMode: 'Online', grade: '10 STANDARD • 10th GR', feeType: 'Tuition Fee', amount: '$1,200.00', status: 'Success', avatar: 'AS', avatarBg: '#DBEAFE' },
	{ id: '2', date: 'Oct 23, 2023', receipt: '#RCPT-8819', name: 'Maya Brown', classLabel: 'Class 10', billingMonth: 'October 2023', paymentMode: 'Cash', grade: '10 STANDARD • 10th GR', feeType: 'Transport', amount: '$350.00', status: 'Success', avatar: 'MB', avatarBg: '#FCE7F3' },
	{ id: '3', date: 'Oct 22, 2023', receipt: '#RCPT-8815', name: 'Leo Wright', classLabel: 'Class 10', billingMonth: 'September 2023', paymentMode: 'Bank Transfer', grade: '10 STANDARD • 10th GR', feeType: 'Lab Fees', amount: '$150.00', status: 'Processing', avatar: 'LW', avatarBg: '#D1FAE5' },
	{ id: '4', date: 'Oct 21, 2023', receipt: '#RCPT-8810', name: 'Sarah Miller', classLabel: 'Class 10', billingMonth: 'October 2023', paymentMode: 'Online', grade: '10 STANDARD • 10th GR', feeType: 'Tuition Fee', amount: '$1,200.00', status: 'Failed', avatar: 'SM', avatarBg: '#FEE2E2' },
	{ id: '5', date: 'Oct 20, 2023', receipt: '#RCPT-8808', name: 'Ravi Patel', classLabel: 'Class 11', billingMonth: 'October 2023', paymentMode: 'Bank Transfer', grade: '11 STANDARD • 11th GR', feeType: 'Tuition Fee', amount: '$1,200.00', status: 'Success', avatar: 'RP', avatarBg: '#EDE9FE' },
	{ id: '6', date: 'Oct 19, 2023', receipt: '#RCPT-8802', name: 'Emma Wilson', classLabel: 'Class 9', billingMonth: 'September 2023', paymentMode: 'Cash', grade: '9 STANDARD • 9th GR', feeType: 'Library Fee', amount: '$80.00', status: 'Success', avatar: 'EW', avatarBg: '#FEF3C7' },
];

const CLASSES = ['All Classes', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const MONTHS = ['October 2023', 'September 2023', 'August 2023', 'July 2023'];
const PAY_MODES = ['All Modes', 'Bank Transfer', 'Cash', 'Online'];

const statusStyle = (status) => {
	switch (status) {
		case 'Success': return { bg: '#D1FAE5', color: '#065F46' };
		case 'Processing': return { bg: '#FEF3C7', color: '#92400E' };
		case 'Failed': return { bg: '#FEE2E2', color: '#991B1B' };
		default: return { bg: '#F3F4F6', color: '#374151' };
	}
};

const Dropdown = ({ label, options, selected, onSelect }) => {
	const [open, setOpen] = useState(false);
	return (
		<View style={styles.dropdownWrapper}>
			<Text style={styles.dropdownLabel}>{label}</Text>
			<TouchableOpacity style={styles.dropdownBtn} onPress={() => setOpen(true)} activeOpacity={0.75}>
				<Text style={styles.dropdownText} numberOfLines={1}>{selected}</Text>
				<Text style={styles.dropdownCaret}>▾</Text>
			</TouchableOpacity>
			<Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
				<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
					<View style={styles.dropdownMenu}>
						{options.map((opt) => (
							<TouchableOpacity
								key={opt}
								style={[styles.dropdownItem, opt === selected && styles.dropdownItemActive]}
								onPress={() => { onSelect(opt); setOpen(false); }}
								activeOpacity={0.7}
							>
								<Text style={[styles.dropdownItemText, opt === selected && styles.dropdownItemTextActive]}>{opt}</Text>
							</TouchableOpacity>
						))}
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
};

const PaymentRow = ({ item, onView, onDownload, onRetry, onDelete }) => {
	const st = statusStyle(item.status);
	const isDesktop = isTabletOrDesktop;

	return (
		<View style={styles.row}>
			{isDesktop && (
				<View style={styles.colDate}>
					<Text style={styles.rowDate}>{item.date}</Text>
				</View>
			)}
			<TouchableOpacity style={styles.colReceipt} onPress={() => onView(item)} activeOpacity={0.7}>
				<Text style={styles.receiptNo}>{item.receipt}</Text>
			</TouchableOpacity>
			<View style={styles.colStudent}>
				<View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
					<Text style={styles.avatarText}>{item.avatar}</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text style={styles.studentName} numberOfLines={1}>{item.name}</Text>
					{!isDesktop && <Text style={styles.rowDate}>{item.date}</Text>}
					<Text style={styles.studentGrade} numberOfLines={1}>{item.grade}</Text>
				</View>
			</View>
			{isDesktop && (
				<View style={styles.colFee}>
					<Text style={styles.feeType}>{item.feeType}</Text>
				</View>
			)}
			<View style={styles.colAmount}>
				<Text style={styles.amount}>{item.amount}</Text>
			</View>
			<View style={styles.colStatus}>
				<View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
					<Text style={[styles.statusText, { color: st.color }]}>{item.status}</Text>
				</View>
			</View>
			<View style={styles.colAction}>
				{item.status === 'Failed' ? (
					<>
						<TouchableOpacity style={styles.actionBtn} onPress={() => onRetry(item)} activeOpacity={0.7}>
							<Text style={styles.actionIcon}>↻</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={() => onDelete(item)} activeOpacity={0.7}>
							<Text style={[styles.actionIcon, { color: C.danger }]}>🗑</Text>
						</TouchableOpacity>
					</>
				) : (
					<>
						<TouchableOpacity style={styles.actionBtn} onPress={() => onView(item)} activeOpacity={0.7}>
							<Text style={styles.actionIcon}>👁</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionBtn} onPress={() => onDownload(item)} activeOpacity={0.7}>
							<Text style={styles.actionIcon}>⬇</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
};

export default function PaymentHistory() {
	const [search, setSearch] = useState('');
	const [selClass, setSelClass] = useState('All Classes');
	const [selMonth, setSelMonth] = useState('October 2023');
	const [selMode, setSelMode] = useState('All Modes');
	const [currentPage, setPage] = useState(1);
	const [activeAlert, setAlert] = useState(null);
	const [activeScreen, setActiveScreen] = useState('payment-history');
	const totalPages = 42;

	const clearFilters = () => {
		setSelClass('All Classes');
		setSelMonth('October 2023');
		setSelMode('All Modes');
	};

	const showAlert = (msg) => {
		setAlert(msg);
		setTimeout(() => setAlert(null), 2000);
	};

	const openAddPayment = () => {
		setActiveScreen('add-payment');
	};

	const closeAddPayment = () => {
		setActiveScreen('payment-history');
	};

	const submitPayment = (paymentData) => {
		showAlert(`Saved ${paymentData.paymentType || 'Payment'}`);
		closeAddPayment();
	};

	const filtered = PAYMENTS.filter((p) => {
		const q = search.toLowerCase();
		const matchesSearch = p.name.toLowerCase().includes(q) || p.receipt.toLowerCase().includes(q);
		const matchesClass = selClass === 'All Classes' || p.classLabel === selClass;
		const matchesMonth = selMonth === 'October 2023' || p.billingMonth === selMonth;
		const matchesMode = selMode === 'All Modes' || p.paymentMode === selMode;
		return matchesSearch && matchesClass && matchesMonth && matchesMode;
	});

	const pageNums = [1, 2, 3, '…', totalPages];

	if (activeScreen === 'add-payment') {
		return <AddPayment onBack={closeAddPayment} onSave={submitPayment} />;
	}

	return (
		<View style={styles.root}>
			<StatusBar barStyle="dark-content" backgroundColor={C.headerBg} />

			<ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
				<View style={styles.breadcrumb}>
					<TouchableOpacity onPress={() => showAlert('Finance')} activeOpacity={0.7}>
						<Text style={styles.breadLink}>FINANCE</Text>
					</TouchableOpacity>
					<Text style={styles.breadSep}> / </Text>
					<Text style={styles.breadCurrent}>FEE COLLECTION</Text>
				</View>

				<View style={styles.pageHeader}>
					<View style={{ flex: 1 }}>
						<Text style={styles.pageTitle}>Payment History</Text>
						<Text style={styles.pageSubtitle}>Manage and track all student academic fee transactions</Text>
					</View>
					<TouchableOpacity style={styles.addBtn} onPress={openAddPayment} activeOpacity={0.8}>
						<Text style={styles.addBtnIcon}>＋</Text>
						<Text style={styles.addBtnText}>Add Payment</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.statsRow}>
					<View style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
						<Text style={styles.statLabel}>TODAY'S COLLECTION</Text>
						<Text style={styles.statValue}>$12,450.00</Text>
						<View style={styles.statBadge}>
							<Text style={styles.statBadgeText}>↑ 14% from yesterday</Text>
						</View>
					</View>
					<View style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
						<Text style={styles.statLabel}>PENDING DUES</Text>
						<Text style={styles.statValue}>$4,120.00</Text>
						<View style={[styles.statBadge, { backgroundColor: '#FEF3C7' }]}>
							<Text style={[styles.statBadgeText, { color: '#92400E' }]}>⚠ 24 students overdue</Text>
						</View>
					</View>
					<View style={[styles.statCard, styles.forecastCard, { flex: isTabletOrDesktop ? 1.6 : 1 }]}>
						<Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.75)' }]}>MONTHLY FORECAST</Text>
						<Text style={[styles.statValue, { color: '#FFF', fontSize: isTabletOrDesktop ? 28 : 22 }]}>$142,000.00</Text>
						<Text style={styles.forecastSub}>You have collected 82% of the projected monthly revenue.</Text>
					</View>
				</View>

				<View style={styles.filtersCard}>
					<View style={[styles.filtersRow, !isTabletOrDesktop && styles.filtersRowMobile]}>
						<Dropdown label="CLASS/GRADE" options={CLASSES} selected={selClass} onSelect={setSelClass} />
						<Dropdown label="BILLING MONTH" options={MONTHS} selected={selMonth} onSelect={setSelMonth} />
						<Dropdown label="PAYMENT MODE" options={PAY_MODES} selected={selMode} onSelect={setSelMode} />
						<TouchableOpacity style={styles.clearBtn} onPress={clearFilters} activeOpacity={0.75}>
							<Text style={styles.clearBtnIcon}>⊘</Text>
							<Text style={styles.clearBtnText}>Clear Filters</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.tableCard}>
					<View style={styles.tableHeader}>
						{isTabletOrDesktop && <Text style={[styles.thText, styles.colDate]}>DATE</Text>}
						<Text style={[styles.thText, styles.colReceipt]}>RECEIPT NO</Text>
						<Text style={[styles.thText, styles.colStudent]}>STUDENT NAME</Text>
						{isTabletOrDesktop && <Text style={[styles.thText, styles.colFee]}>FEE TYPE</Text>}
						<Text style={[styles.thText, styles.colAmount]}>AMOUNT</Text>
						<Text style={[styles.thText, styles.colStatus]}>STATUS</Text>
						<Text style={[styles.thText, styles.colAction]}>ACTION</Text>
					</View>

					{filtered.length > 0 ? (
						filtered.map((item) => (
							<PaymentRow
								key={item.id}
								item={item}
								onView={(i) => showAlert(`Viewing ${i.receipt}`)}
								onDownload={(i) => showAlert(`Downloading ${i.receipt}`)}
								onRetry={(i) => showAlert(`Retrying ${i.receipt}`)}
								onDelete={(i) => showAlert(`Deleted ${i.receipt}`)}
							/>
						))
					) : (
						<View style={styles.emptyState}>
							<Text style={styles.emptyText}>No results found.</Text>
						</View>
					)}

					<View style={styles.pagination}>
						<Text style={styles.paginationInfo}>Showing 1 to 10 of 4,230 entries</Text>
						<View style={styles.paginationControls}>
							<TouchableOpacity
								style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
								onPress={() => setPage((p) => Math.max(1, p - 1))}
								activeOpacity={0.7}
								disabled={currentPage === 1}
							>
								<Text style={styles.pageBtnText}>‹</Text>
							</TouchableOpacity>
							{pageNums.map((n, idx) => (
								<TouchableOpacity
									key={idx}
									style={[styles.pageBtn, n === currentPage && styles.pageBtnActive]}
									onPress={() => typeof n === 'number' && setPage(n)}
									activeOpacity={0.7}
									disabled={n === '…'}
								>
									<Text style={[styles.pageBtnText, n === currentPage && styles.pageBtnTextActive]}>{n}</Text>
								</TouchableOpacity>
							))}
							<TouchableOpacity
								style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
								onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
								activeOpacity={0.7}
								disabled={currentPage === totalPages}
							>
								<Text style={styles.pageBtnText}>›</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View style={styles.summaryRow}>
					<TouchableOpacity style={[styles.summaryCard, { flex: 1, marginRight: 8 }]} onPress={() => showAlert('Bank Deposits')} activeOpacity={0.8}>
						<Text style={styles.summaryIcon}>🏦</Text>
						<View>
							<Text style={styles.summaryLabel}>Bank Deposits</Text>
							<Text style={styles.summaryValue}>$8,400</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.summaryCard, { flex: 1, marginRight: 8 }]} onPress={() => showAlert('Cash on Hand')} activeOpacity={0.8}>
						<Text style={styles.summaryIcon}>💵</Text>
						<View>
							<Text style={styles.summaryLabel}>Cash on Hand</Text>
							<Text style={styles.summaryValue}>$2,150</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.summaryCard, { flex: 1 }]} onPress={() => showAlert('Online Apps')} activeOpacity={0.8}>
						<Text style={styles.summaryIcon}>📱</Text>
						<View>
							<Text style={styles.summaryLabel}>Online Apps</Text>
							<Text style={styles.summaryValue}>$1,900</Text>
						</View>
					</TouchableOpacity>
				</View>

				<View style={{ height: 24 }} />
			</ScrollView>

			{activeAlert && (
				<View style={styles.toast}>
					<Text style={styles.toastText}>{activeAlert}</Text>
				</View>
			)}
		</View>
	);
}

const COL = {
	date: { width: isTabletOrDesktop ? 110 : 0 },
	receipt: { width: isTabletOrDesktop ? 120 : 100 },
	student: { flex: 1 },
	fee: { width: isTabletOrDesktop ? 110 : 0 },
	amount: { width: isTabletOrDesktop ? 110 : 90 },
	status: { width: isTabletOrDesktop ? 110 : 90 },
	action: { width: isTabletOrDesktop ? 90 : 70 },
};

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: C.bg },
	body: { flex: 1, paddingHorizontal: isTabletOrDesktop ? 24 : 12 },
	breadcrumb: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 6 },
	breadLink: { fontSize: 11, fontWeight: '700', color: C.subtext },
	breadSep: { fontSize: 11, color: C.lightText, marginHorizontal: 2 },
	breadCurrent: { fontSize: 11, fontWeight: '700', color: C.primary },
	pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
	pageTitle: { fontSize: isTabletOrDesktop ? 26 : 20, fontWeight: '800', color: C.text },
	pageSubtitle: { fontSize: 13, color: C.subtext, marginTop: 2 },
	addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, gap: 6, shadowColor: C.primary, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
	addBtnIcon: { color: '#FFF', fontSize: 16, fontWeight: '700' },
	addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
	statsRow: { flexDirection: 'row', marginBottom: 16 },
	statCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
	forecastCard: { backgroundColor: C.primary, borderWidth: 0 },
	statLabel: { fontSize: 10, fontWeight: '700', color: C.subtext, letterSpacing: 0.5, marginBottom: 6 },
	statValue: { fontSize: isTabletOrDesktop ? 24 : 18, fontWeight: '800', color: C.text, marginBottom: 8 },
	statBadge: { backgroundColor: '#D1FAE5', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
	statBadgeText: { fontSize: 10, fontWeight: '600', color: '#065F46' },
	forecastSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 6, lineHeight: 16 },
	filtersCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: C.border },
	filtersRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' },
	filtersRowMobile: { flexDirection: 'column', gap: 12 },
	dropdownWrapper: { flex: isTabletOrDesktop ? 1 : undefined, minWidth: isTabletOrDesktop ? 120 : '100%' },
	dropdownLabel: { fontSize: 10, fontWeight: '700', color: C.subtext, letterSpacing: 0.5, marginBottom: 6 },
	dropdownBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#FAFAFA' },
	dropdownText: { fontSize: 13, color: C.text, flex: 1 },
	dropdownCaret: { fontSize: 11, color: C.subtext, marginLeft: 4 },
	modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },
	dropdownMenu: { backgroundColor: C.card, borderRadius: 12, padding: 6, minWidth: 180, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 10 },
	dropdownItem: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
	dropdownItemActive: { backgroundColor: '#EEF2FF' },
	dropdownItemText: { fontSize: 13, color: C.text },
	dropdownItemTextActive: { color: C.primary, fontWeight: '700' },
	clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#FAFAFA', alignSelf: isTabletOrDesktop ? 'flex-end' : 'flex-start' },
	clearBtnIcon: { fontSize: 13, color: C.subtext },
	clearBtnText: { fontSize: 13, color: C.subtext, fontWeight: '600' },
	tableCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 16 },
	tableHeader: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: C.border },
	thText: { fontSize: 10, fontWeight: '700', color: C.subtext, letterSpacing: 0.5 },
	row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
	rowDate: { fontSize: 11, color: C.subtext },
	receiptNo: { fontSize: 12, fontWeight: '700', color: C.primary },
	avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
	avatarText: { fontSize: 11, fontWeight: '800', color: C.text },
	studentName: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 1 },
	studentGrade: { fontSize: 10, color: C.lightText },
	feeType: { fontSize: 12, color: C.subtext },
	amount: { fontSize: 13, fontWeight: '700', color: C.text },
	statusBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
	statusText: { fontSize: 10, fontWeight: '700' },
	actionBtn: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginLeft: 4, backgroundColor: '#FAFAFA' },
	actionBtnDanger: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
	actionIcon: { fontSize: 12, color: C.subtext },
	colDate: COL.date,
	colReceipt: COL.receipt,
	colStudent: { ...COL.student, flexDirection: 'row', alignItems: 'center' },
	colFee: COL.fee,
	colAmount: COL.amount,
	colStatus: COL.status,
	colAction: { ...COL.action, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
	emptyState: { padding: 32, alignItems: 'center' },
	emptyText: { color: C.subtext, fontSize: 14 },
	pagination: { flexDirection: isTabletOrDesktop ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-between', padding: 16, gap: 12 },
	paginationInfo: { fontSize: 12, color: C.subtext },
	paginationControls: { flexDirection: 'row', gap: 4 },
	pageBtn: { width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card },
	pageBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
	pageBtnDisabled: { opacity: 0.4 },
	pageBtnText: { fontSize: 12, color: C.text, fontWeight: '600' },
	pageBtnTextActive: { color: '#FFF' },
	summaryRow: { flexDirection: 'row', marginBottom: 8 },
	summaryCard: { backgroundColor: C.card, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border },
	summaryIcon: { fontSize: isTabletOrDesktop ? 28 : 22 },
	summaryLabel: { fontSize: 11, color: C.subtext, marginBottom: 2 },
	summaryValue: { fontSize: isTabletOrDesktop ? 18 : 15, fontWeight: '800', color: C.text },
	toast: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#1A1D2E', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
	toastText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});
