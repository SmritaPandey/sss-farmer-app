import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MainBackgroundImage from '@/components/MainBackgroundImage';
import { Brand, Palette } from '@/constants/Colors';
import { Typography, Spacing } from '@/constants/Theme';
import { useI18n } from '@/contexts/i18n';
import { createPlaceholderIcon } from '@/assets/icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  icon: any;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Fertilizer Request Approved',
    message: 'Your urea fertilizer request for 3 bags has been approved and will be delivered tomorrow.',
    time: '2 hours ago',
    type: 'success',
    read: false,
    icon: createPlaceholderIcon('✅'),
  },
  {
    id: '2',
    title: 'Weather Alert',
    message: 'Heavy rainfall expected in your area this week. Protect your crops and ensure proper drainage.',
    time: '5 hours ago',
    type: 'warning',
    read: false,
    icon: createPlaceholderIcon('🌧️'),
  },
  {
    id: '3',
    title: 'New Government Scheme',
    message: 'PM-KISAN subsidy scheme now available. Check eligibility and apply today.',
    time: '1 day ago',
    type: 'info',
    read: true,
    icon: createPlaceholderIcon('🏛️'),
  },
  {
    id: '4',
    title: 'PACS Loan Update',
    message: 'Your loan application is under review. You will receive an update within 3 business days.',
    time: '2 days ago',
    type: 'info',
    read: true,
    icon: createPlaceholderIcon('💰'),
  },
  {
    id: '5',
    title: 'Crop Price Alert',
    message: 'Wheat prices have increased by 8% in the local market. Consider selling your produce.',
    time: '3 days ago',
    type: 'alert',
    read: true,
    icon: createPlaceholderIcon('📈'),
  },
];

export default function NotificationsScreen() {
  const { t } = useI18n();
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'alert': return '#ef4444';
      default: return Brand.green;
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'success': return '#d1fae5';
      case 'warning': return '#fef3c7';
      case 'alert': return '#fee2e2';
      default: return Palette.leafLight;
    }
  };

  return (
    <MainBackgroundImage blurIntensity={30} overlayOpacity={0.4} showWatermark={true}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Brand.green} />
          </Pressable>
          <Text style={styles.title}>{t('notifications', 'Notifications')}</Text>
          <View style={{ width: 40 }} />
        </View>

        {unreadCount > 0 && (
          <View style={styles.unreadHeader}>
            <Text style={styles.unreadText}>
              {t('unread_notifications', `${unreadCount} unread notifications`)}
            </Text>
            <Pressable onPress={markAllAsRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>{t('mark_all_read', 'Mark all as read')}</Text>
            </Pressable>
          </View>
        )}

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Image source={createPlaceholderIcon('🔔')} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>{t('no_notifications', 'No notifications yet')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('notifications_desc', 'You\'ll receive updates about your requests, weather, and schemes here')}
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <Pressable
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: getTypeBgColor(notification.type) }]}>
                  <Image source={notification.icon} style={styles.notificationIcon} />
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>
                      {notification.title}
                    </Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  <View style={styles.notificationFooter}>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(notification.type) }]}>
                      <Text style={styles.typeBadgeText}>{notification.type}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
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
  unreadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadText: {
    fontSize: 16,
    fontWeight: '600',
    color: Brand.green,
  },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Palette.leafLight,
    borderRadius: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.green,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: Typography.subtitle,
    fontWeight: '700',
    color: Brand.green,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  notificationsList: {
    gap: 12,
    paddingBottom: 30,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: Brand.saffron,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  notificationIcon: {
    width: 30,
    height: 30,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
    color: Brand.green,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.saffron,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 10,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
});
