import { useTranslation } from '@/shared/hooks';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Tabs, usePathname } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      detachInactiveScreens={Platform.OS !== 'ios'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FAFAFA',
        tabBarInactiveTintColor: '#717171',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          paddingBottom: 32,
          paddingTop: 8,
          paddingHorizontal: 12,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          lineHeight: 12,
          marginTop: 4,
        },
        sceneStyle: { backgroundColor: '#000000' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
          tabBarButton: (props) => <HapticTabButton {...props} routeName="home" />,
        }}
      />
      <Tabs.Screen
        name="trending"
        options={{
          title: t('navigation.trending'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'flame' : 'flame-outline'} size={size} color={color} />
          ),
          tabBarButton: (props) => <HapticTabButton {...props} routeName="trending" />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t('navigation.notifications'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={size} color={color} />
          ),
          tabBarButton: (props) => <HapticTabButton {...props} routeName="notifications" />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: t('navigation.bookmarks'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={size} color={color} />
          ),
          tabBarButton: (props) => <HapticTabButton {...props} routeName="bookmarks" />,
        }}
      />
    </Tabs>
  );
}

function HapticTabButton({ children, onPress, routeName, ...props }: any) {
  const pathname = usePathname();

  const handlePress = (e: any) => {
    const isActive = pathname === `/${routeName}`;
    if (!isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={handlePress}
      activeOpacity={1}
      style={[props.style, { flex: 1 }]}
    >
      {children}
    </TouchableOpacity>
  );
}
