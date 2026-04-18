import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#1B3FA0',
  background: '#F4F6FB',
  white: '#FFFFFF',
  textDark: '#0D0D0D',
  textMuted: '#9CA3AF',
  green: '#22C55E',
  red: '#E53935',
};

const recipients = [
  { id: 'all-students', label: 'All Students', icon: '👥', count: '1,200' },
  { id: 'all-staff', label: 'All Staff', icon: '👨‍💼', count: '85' },
  { id: 'parents', label: 'All Parents', icon: '👨‍👩‍👧', count: '1,200' },
  { id: 'grade10', label: 'Grade 10 Only', icon: '📚', count: '125' },
  { id: 'teachers', label: 'Teachers Only', icon: '🎓', count: '65' },
  { id: 'admin', label: 'Admin Staff', icon: '⚙️', count: '20' },
];

const alertCategories = [
  { id: 'general', label: 'General Announcement', icon: '📢', color: COLORS.primary },
  { id: 'urgent', label: 'Urgent Alert', icon: '🚨', color: COLORS.red },
  { id: 'holiday', label: 'Holiday Notice', icon: '🎉', color: '#F97316' },
  { id: 'maintenance', label: 'Maintenance Notice', icon: '🔧', color: '#8B5CF6' },
  { id: 'event', label: 'Event Reminder', icon: '📅', color: COLORS.green },
];

function RecipientButton({ recipient, isSelected, onToggle }) {
  return (
    <TouchableOpacity
      style={[
        styles.recipientButton,
        isSelected && styles.recipientButtonActive,
      ]}
      onPress={() => onToggle(recipient.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.recipientIcon}>{recipient.icon}</Text>
      <View style={styles.recipientInfo}>
        <Text style={[
          styles.recipientLabel,
          isSelected && styles.recipientLabelActive,
        ]}>
          {recipient.label}
        </Text>
        <Text style={styles.recipientCount}>{recipient.count}</Text>
      </View>
      {isSelected && <Text style={styles.selectedCheck}>✓</Text>}
    </TouchableOpacity>
  );
}

function CategoryButton({ category, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        isSelected && { backgroundColor: category.color + '20', borderColor: category.color },
      ]}
      onPress={() => onSelect(category.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={[
        styles.categoryLabel,
        isSelected && { color: category.color, fontWeight: '700' },
      ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AdminBroadcastAlert({ onBack }) {
  const [selectedRecipients, setSelectedRecipients] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleToggleRecipient = (recipientId) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(recipientId)) {
      newSelected.delete(recipientId);
    } else {
      newSelected.add(recipientId);
    }
    setSelectedRecipients(newSelected);
  };

  const handleSendAlert = () => {
    if (selectedRecipients.size === 0) {
      Alert.alert('Select Recipients', 'Please select at least one recipient group');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter an alert title');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Missing Message', 'Please enter an alert message');
      return;
    }

    const recipientCount = Array.from(selectedRecipients).reduce((sum, id) => {
      const recipient = recipients.find(r => r.id === id);
      const count = parseInt(recipient?.count.replace(/,/g, '') || 0);
      return sum + count;
    }, 0);

    Alert.alert(
      'Alert Sent Successfully',
      `Alert sent to ${recipientCount} people\n\nTitle: ${title}\nCategory: ${selectedCategory}`,
      [{ text: 'OK', onPress: onBack }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Broadcast Alert</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Alert Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert Category *</Text>
          <View style={styles.categoriesGrid}>
            {alertCategories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={setSelectedCategory}
              />
            ))}
          </View>
        </View>

        {/* Title and Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert Content *</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Alert Title"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          
          <Text style={styles.characterCount}>{title.length}/100</Text>

          <TextInput
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            placeholder="Alert Message"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={setMessage}
            maxLength={500}
          />
          
          <Text style={styles.characterCount}>{message.length}/500</Text>
        </View>

        {/* Recipients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Recipients *</Text>
          <View style={styles.recipientsContainer}>
            {recipients.map((recipient) => (
              <RecipientButton
                key={recipient.id}
                recipient={recipient}
                isSelected={selectedRecipients.has(recipient.id)}
                onToggle={handleToggleRecipient}
              />
            ))}
          </View>
        </View>

        {/* Preview */}
        {title && message && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{title}</Text>
              <Text style={styles.previewMessage}>{message}</Text>
            </View>
          </View>
        )}

        {/* Send Button */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendAlert}
          activeOpacity={0.7}
        >
          <Text style={styles.sendButtonIcon}>📤</Text>
          <Text style={styles.sendButtonText}>Send Alert to {selectedRecipients.size} Group(s)</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8ECF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#E8ECF5',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E8ECF5',
  },
  characterCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginBottom: 12,
  },
  recipientsContainer: {
    gap: 10,
  },
  recipientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E8ECF5',
  },
  recipientButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  recipientIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  recipientLabelActive: {
    color: COLORS.primary,
  },
  recipientCount: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  selectedCheck: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  previewMessage: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonIcon: {
    fontSize: 18,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
