import { Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { HOME_TABS, type HomeTabKey } from '@/features/home/_types';

interface HomeTabBarProps {
  activeTab: HomeTabKey;
  onTabChange: (tab: HomeTabKey) => void;
}

const TAB_KEYS = Object.keys(HOME_TABS) as HomeTabKey[];

export const HomeTabBar = ({ activeTab, onTabChange }: HomeTabBarProps) => {
  return (
    <View className="flex-row bg-bg-primary border-b border-border-primary">
      {TAB_KEYS.map((key) => (
        <TabItem
          key={key}
          tabKey={key}
          label={HOME_TABS[key]}
          isActive={activeTab === key}
          onPress={() => onTabChange(key)}
        />
      ))}
    </View>
  );
};

interface TabItemProps {
  tabKey: HomeTabKey;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabItem = ({ tabKey, label, isActive, onPress }: TabItemProps) => {
  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0, { duration: 150 }),
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 items-center"
      style={{ paddingVertical: 12 }}
    >
      <View className="flex-row items-center" style={{ gap: 4 }}>
        {tabKey === 'agents' && (
          <Ionicons name="hardware-chip" size={13} color={isActive ? '#FAFAFA' : '#A1A1A1'} />
        )}
        <Text
          variant={isActive ? 'label' : 'body'}
          size="sm"
          color={isActive ? 'primary' : 'secondary'}
        >
          {label}
        </Text>
      </View>
      <Animated.View
        style={[indicatorStyle, { width: 40 }]}
        className="absolute bottom-0 h-[3px] rounded-xs bg-bg-brand"
      />
    </TouchableOpacity>
  );
};
