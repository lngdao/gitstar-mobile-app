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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarButton: (props) => <HapticTabButton {...props} routeName="home" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
          tabBarButton: (props) => <HapticTabButton {...props} routeName="explore" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarButton: (props) => <HapticTabButton {...props} routeName="profile" />,
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
