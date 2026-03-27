import { Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import type { CommunityPost } from '@/features/home/_types';
import { Avatar } from './Avatar';
import { ActionButton } from './ActionButton';
import { formatTimeAgo } from '@/features/home/_utils/time';
import { useLikePost } from '@/features/home/_queries';
import { LikeButton } from './LikeButton';

interface PostCardProps {
  post: CommunityPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { mutate: likePost, isPending: isLiking } = useLikePost();

  return (
    <View>
      {/* Author row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 }}>
        <Avatar login={post.author_login} avatarUrl={post.author_avatar} />

        <View style={{ marginLeft: 8, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text variant="label" size="sm" color="primary">
              {post.author_name ?? post.author_login}
            </Text>
            <Text variant="body" size="xs" color="secondary">
              @{post.author_login}
            </Text>
          </View>
          <Text variant="body" size="xs" color="secondary" style={{ marginTop: 2 }}>
            {formatTimeAgo(post.created_at)}
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal" size={16} color="#A1A1A1" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 }}>
        <Text variant="body" size="sm" color="primary" numberOfLines={6}>
          {post.body}
        </Text>

        {/* Repo tags */}
        {post.repo_tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {post.repo_tags.map((tag) => (
              <View
                key={`${tag.owner}/${tag.name}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  backgroundColor: 'rgba(182, 87, 58, 0.07)',
                  borderRadius: 4,
                }}
              >
                <Ionicons name="folder" size={10} color="#B6573A" />
                <Text variant="body" size="xs" color="secondary">
                  {tag.owner}/{tag.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Images */}
        {post.image_urls.length > 0 && (
          <View style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden' }}>
            <ExpoImage
              source={{ uri: post.image_urls[0] }}
              style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 8 }}
              contentFit="cover"
              transition={200}
            />
            {post.image_urls.length > 1 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 11 }}>
                  +{post.image_urls.length - 1}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Action bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 }}>
        <LikeButton
          liked={post.liked}
          count={post.like_count}
          onPress={() => likePost({ postId: post.id })}
          disabled={isLiking}
        />
        <View style={{ marginLeft: 24 }}>
          <ActionButton icon="chatbubble-outline" count={post.comment_count} />
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity activeOpacity={0.6}>
          <Ionicons name="share-outline" size={16} color="#A1A1A1" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={{ marginLeft: 16, height: 0.5 }} className="bg-border-primary" />
    </View>
  );
};
