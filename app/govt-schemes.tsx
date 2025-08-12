import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon, getIcon } from '@/assets/icons';

interface Scheme {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  eligibility: string;
  amount: string;
  status: 'eligible' | 'applied' | 'not_eligible' | 'completed';
  category: 'subsidy' | 'loan' | 'insurance' | 'direct_benefit';
  icon: any;
  deadline?: string;
}

const mockSchemes: Scheme[] = [
  {
    id: '1',
    title: 'PM-KISAN Samman Nidhi',
    description: 'Direct income support to all landholding farmers families',
    benefits: ['₹6,000 per year', 'Direct bank transfer', 'No paperwork required'],
    eligibility: 'All small and marginal farmers',
    amount: '₹6,000/year',
    status: 'applied',
    category: 'direct_benefit',
    icon: getIcon('schemes'),
  },
  {
    id: '2',
    title: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Comprehensive crop insurance scheme to protect farmers',
    benefits: ['Crop loss coverage', 'Natural disaster protection', 'Low premium rates'],
    eligibility: 'All farmers with crop cultivation',
    amount: 'Up to ₹2 lakh',
    status: 'eligible',
    category: 'insurance',
    icon: createPlaceholderIcon('🛡️'),
    deadline: '31 Dec 2024',
  },
  {
    id: '3',
    title: 'Kisan Credit Card (KCC)',
    description: 'Credit facility for farmers to meet their agricultural needs',
    benefits: ['Easy loan approval', 'Low interest rates', 'Insurance coverage'],
    eligibility: 'Land-owning farmers',
    amount: 'Based on land size',
    status: 'completed',
    category: 'loan',
    icon: createPlaceholderIcon('💳'),
  },
  {
    id: '4',
    title: 'Soil Health Card Scheme',
    description: 'Free soil testing and nutrient management recommendations',
    benefits: ['Free soil testing', 'Fertilizer recommendations', 'Increase crop yield'],
    eligibility: 'All farmers',
    amount: 'Free service',
    status: 'eligible',
    category: 'subsidy',
    icon: createPlaceholderIcon('🧪'),
  },
  {
    id: '5',
    title: 'Pradhan Mantri Kisan Maandhan Yojana',
    description: 'Pension scheme for small and marginal farmers',
    benefits: ['₹3,000 monthly pension', 'After 60 years age', 'Family pension available'],
    eligibility: 'Age 18-40, land up to 2 hectares',
    amount: '₹3,000/month',
    status: 'not_eligible',
    category: 'direct_benefit',
    icon: createPlaceholderIcon('👴'),
  },
  {
    id: '6',
    title: 'National Agriculture Market (e-NAM)',
    description: 'Online trading platform for agricultural commodities',
    benefits: ['Better price discovery', 'Reduced transaction costs', 'Quality assurance'],
    eligibility: 'Registered farmers',
    amount: 'Market based',
    status: 'eligible',
    category: 'subsidy',
    icon: createPlaceholderIcon('📱'),
  },
];

export default function GovtSchemesScreen() {
  const { t } = useI18n();
  const [schemes] = React.useState<Scheme[]>(mockSchemes);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Schemes', icon: '📋' },
    { id: 'direct_benefit', label: 'Direct Benefits', icon: '💰' },
    { id: 'loan', label: 'Loans', icon: '💳' },
    { id: 'insurance', label: 'Insurance', icon: '🛡️' },
    { id: 'subsidy', label: 'Subsidies', icon: '🎯' },
  ];

  const filteredSchemes = selectedCategory === 'all' 
    ? schemes 
    : schemes.filter(scheme => scheme.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return '#10b981';
      case 'applied': return '#3b82f6';
      case 'completed': return '#8b5cf6';
      case 'not_eligible': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'eligible': return '#d1fae5';
      case 'applied': return '#dbeafe';
      case 'completed': return '#e9d5ff';
      case 'not_eligible': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'eligible': return 'Eligible';
      case 'applied': return 'Applied';
      case 'completed': return 'Enrolled';
      case 'not_eligible': return 'Not Eligible';
      default: return 'Unknown';
    }
  };

  const applyForScheme = (scheme: Scheme) => {
    if (scheme.status === 'eligible') {
      Alert.alert(
        'Apply for Scheme',
        `Would you like to apply for ${scheme.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Apply Now', 
            onPress: () => {
              Alert.alert('Success', 'Application submitted successfully! You will receive updates soon.');
            }
          }
        ]
      );
    } else if (scheme.status === 'applied') {
      Alert.alert('Already Applied', 'You have already applied for this scheme. Track your application status.');
    } else if (scheme.status === 'completed') {
      Alert.alert('Already Enrolled', 'You are already enrolled in this scheme.');
    } else {
      Alert.alert('Not Eligible', 'You are not eligible for this scheme based on current criteria.');
    }
  };

  const eligibleCount = schemes.filter(s => s.status === 'eligible').length;
  const appliedCount = schemes.filter(s => s.status === 'applied').length;

  return (
    <MainBackgroundImage blurIntensity={30} overlayOpacity={0.4} showWatermark={true}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Brand.green} />
          </Pressable>
          <Text style={styles.title}>{t('govt_schemes', 'Government Schemes')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{eligibleCount}</Text>
            <Text style={styles.statLabel}>Eligible</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{appliedCount}</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>{schemes.filter(s => s.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryBtn,
                  selectedCategory === category.id && styles.selectedCategoryBtn
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.schemesList}>
          {filteredSchemes.map((scheme) => (
            <View key={scheme.id} style={styles.schemeCard}>
              <View style={styles.schemeHeader}>
                <View style={styles.schemeIconContainer}>
                  <Image source={scheme.icon} style={styles.schemeIcon} />
                </View>
                
                <View style={styles.schemeInfo}>
                  <Text style={styles.schemeTitle}>{scheme.title}</Text>
                  <Text style={styles.schemeAmount}>{scheme.amount}</Text>
                  {scheme.deadline && (
                    <Text style={styles.deadline}>Deadline: {scheme.deadline}</Text>
                  )}
                </View>

                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(scheme.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(scheme.status) }]}>
                    {getStatusText(scheme.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.schemeDescription}>{scheme.description}</Text>
              
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Key Benefits:</Text>
                {scheme.benefits.map((benefit, index) => (
                  <Text key={index} style={styles.benefitItem}>• {benefit}</Text>
                ))}
              </View>

              <View style={styles.schemeFooter}>
                <Text style={styles.eligibilityText}>
                  <Text style={styles.eligibilityLabel}>Eligibility: </Text>
                  {scheme.eligibility}
                </Text>
                
                <Pressable 
                  style={[
                    styles.applyBtn,
                    scheme.status === 'eligible' ? styles.eligibleBtn : styles.disabledBtn
                  ]}
                  onPress={() => applyForScheme(scheme)}
                >
                  <Text style={[
                    styles.applyBtnText,
                    scheme.status === 'eligible' ? styles.eligibleBtnText : styles.disabledBtnText
                  ]}>
                    {scheme.status === 'eligible' ? 'Apply Now' : 
                     scheme.status === 'applied' ? 'Applied' :
                     scheme.status === 'completed' ? 'Enrolled' : 'Not Eligible'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </MainBackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: Spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { 
    fontWeight: '800', 
    fontSize: Typography.title,
    color: Brand.green,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.green,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingVertical: 5,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryBtn: {
    backgroundColor: Brand.saffron,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.green,
  },
  selectedCategoryText: {
    color: 'white',
  },
  schemesList: {
    gap: 16,
    paddingBottom: 30,
  },
  schemeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  schemeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  schemeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Palette.leafLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  schemeIcon: {
    width: 30,
    height: 30,
  },
  schemeInfo: {
    flex: 1,
  },
  schemeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 4,
  },
  schemeAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.saffron,
    marginBottom: 2,
  },
  deadline: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  schemeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 15,
  },
  benefitsContainer: {
    marginBottom: 15,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.green,
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginLeft: 8,
  },
  schemeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 15,
  },
  eligibilityText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  eligibilityLabel: {
    fontWeight: '600',
    color: Brand.green,
  },
  applyBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  eligibleBtn: {
    backgroundColor: Brand.saffron,
  },
  disabledBtn: {
    backgroundColor: '#f3f4f6',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  eligibleBtnText: {
    color: 'white',
  },
  disabledBtnText: {
    color: '#6b7280',
  },
});
