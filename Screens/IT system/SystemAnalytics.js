import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import ITSidebar from './ITSidebar';

const { width } = Dimensions.get('window');

const SystemAnalytics = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const [metrics, setMetrics] = useState([
    { label: 'CPU Usage', value: 65, suffix: '%', color: '#F39C12', icon: '⚡' },
    { label: 'Memory Usage', value: 78, suffix: '%', color: '#E74C3C', icon: '💾' },
    { label: 'Disk Usage', value: 45, suffix: '%', color: '#2ECC71', icon: '💿' },
    { label: 'Network I/O', value: 234, suffix: ' Mbps', color: '#4A90E2', icon: '📡', max: 500 },
  ]);

  const animations = useRef(metrics.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animateToCurrentValues(metrics);
  }, []);

  const animateToCurrentValues = (currentMetrics) => {
    const anims = currentMetrics.map((item, idx) => {
      const targetPercent = item.max ? (item.value / item.max) * 100 : item.value;
      return Animated.timing(animations[idx], {
        toValue: targetPercent,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      });
    });
    Animated.parallel(anims).start();
  };

  const handleRefresh = () => {
    const resetAnims = animations.map((anim) =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      })
    );

    Animated.parallel(resetAnims).start(() => {
      const newMetrics = [
        { ...metrics[0], value: Math.floor(Math.random() * 51) + 40 },
        { ...metrics[1], value: Math.floor(Math.random() * 46) + 50 },
        { ...metrics[2], value: Math.floor(Math.random() * 61) + 20 },
        { ...metrics[3], value: Math.floor(Math.random() * 401) + 100 },
      ];
      setMetrics(newMetrics);
      animateToCurrentValues(newMetrics);
    });
  };

  const handleExport = () => {
    const summary = metrics.map(m => `${m.label}: ${m.value}${m.suffix}`).join('\n');
    Alert.alert('Export Report', `Report generated successfully:\n\n${summary}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ITSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeRoute="Analytics"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={toggleSidebar}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>System Analytics</Text>
          <Text style={styles.headerSubtitle}>Real-time Performance Metrics</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.refreshBtn, { flex: 1, marginRight: 8 }]} onPress={handleRefresh} activeOpacity={0.8}>
            <Text style={styles.refreshIcon}>🔄</Text>
            <Text style={styles.refreshText}>Refresh Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.refreshBtn, { flex: 1, backgroundColor: '#2ECC71', marginLeft: 8 }]} onPress={handleExport} activeOpacity={0.8}>
            <Text style={styles.refreshIcon}>📤</Text>
            <Text style={styles.refreshText}>Export Report</Text>
          </TouchableOpacity>
        </View>

        {metrics.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
            <Text style={[styles.cardValue, { color: item.color }]}>{`${item.value}${item.suffix}`}</Text>
            <View style={[styles.progressBar, { backgroundColor: '#E8EBF0' }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { 
                    width: animations[idx].interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%']
                    }), 
                    backgroundColor: item.color 
                  },
                ]}
              />
            </View>
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📊 Performance Summary</Text>
          <Text style={styles.infoText}>
            System is performing optimally with all metrics within acceptable ranges.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 25,
    paddingTop: StatusBar.currentHeight + 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
    elevation: 2,
  },
  hamburgerBtn: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 6 },
  hamburgerIcon: { fontSize: 24, color: '#1A1A2E', fontWeight: 'bold' },
  spacer: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: '#666880' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20 },
  refreshBtn: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  refreshIcon: { fontSize: 18, marginRight: 8 },
  refreshText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8EBF0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIcon: { fontSize: 24, marginRight: 10 },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  cardValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  infoTitle: { fontSize: 13, fontWeight: '600', color: '#1B3FA0', marginBottom: 8 },
  infoText: { fontSize: 12, color: '#1B3FA0' },
});

export default SystemAnalytics;
