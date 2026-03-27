import { View } from 'react-native';
import { Skeleton, SkeletonCircle, SkeletonText } from '@/shared/components/Skeleton';

export const FeedCardSkeleton = () => {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
      {/* Author row */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <SkeletonCircle size={38} />
        <View style={{ marginLeft: 8, flex: 1, gap: 6 }}>
          <Skeleton width={140} height={14} borderRadius={4} />
          <Skeleton width={100} height={12} borderRadius={4} />
        </View>
        <Skeleton width={56} height={22} borderRadius={5} />
      </View>

      {/* Content */}
      <View style={{ marginTop: 12 }}>
        <SkeletonText lines={2} lineHeight={14} gap={6} widths={['100%', '75%']} borderRadius={4} />
        <View style={{ marginTop: 8 }}>
          <SkeletonText lines={2} lineHeight={12} gap={4} widths={['100%', '60%']} borderRadius={4} />
        </View>
      </View>

      {/* Action bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 24 }}>
        <Skeleton width={48} height={14} borderRadius={4} />
        <Skeleton width={48} height={14} borderRadius={4} />
      </View>

      {/* Divider */}
      <View style={{ marginTop: 14, height: 0.5 }} className="bg-border-primary" />
    </View>
  );
};

export const FeedSkeletonList = () => {
  return (
    <View>
      {Array.from({ length: 5 }).map((_, i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </View>
  );
};
