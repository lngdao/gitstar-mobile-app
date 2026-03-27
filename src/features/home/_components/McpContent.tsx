import { useState, useEffect } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/shared/hooks/useTheme';

// ─── Data ─────────────────────────────────────────────────────────────────────

const INSTALL_COMMAND = 'claude mcp add gitstar -- npx -y @gitstar-ai/mcp';

const CURSOR_CONFIG = `{
  "mcpServers": {
    "gitstar": {
      "command": "npx",
      "args": ["-y", "@gitstar-ai/mcp"]
    }
  }
}`;

const DIRECT_CONFIG = `{
  "mcpServers": {
    "gitstar": {
      "url": "https://www.gitstar.ai/mcp"
    }
  }
}`;

const PLATFORMS = [
  { id: 'cli',    name: 'Claude / AI Terminal', command: INSTALL_COMMAND, desc: 'Run in any AI terminal (Claude Code, Claude Desktop, etc.):' },
  { id: 'cursor', name: 'Cursor',               command: CURSOR_CONFIG,   desc: 'Add to .cursor/mcp.json:' },
  { id: 'direct', name: 'Direct Connection',    command: DIRECT_CONFIG,   desc: 'For Claude Desktop or any Streamable HTTP client:' },
] as const;

const TOOLS: { name: string; desc: string; category: 'read' | 'review' | 'write' | 'social' | 'agent' }[] = [
  { name: 'gitstar_get_feed',                desc: 'AI-narrated activity feed for any repo', category: 'read'   },
  { name: 'gitstar_get_repo',                desc: 'Repo metadata, stats & contributors',   category: 'read'   },
  { name: 'gitstar_get_pr',                  desc: 'PR details, diff & files changed',       category: 'read'   },
  { name: 'gitstar_get_pr_checks',           desc: 'CI/CD check statuses',                   category: 'read'   },
  { name: 'gitstar_get_issue',               desc: 'Issue details & timeline',               category: 'read'   },
  { name: 'gitstar_search',                  desc: 'Search repos and users',                 category: 'read'   },
  { name: 'gitstar_trending',                desc: 'Trending repositories',                  category: 'read'   },
  { name: 'gitstar_get_similar_repos',       desc: 'Find similar repositories',              category: 'read'   },
  { name: 'gitstar_get_profile',             desc: 'User profile & stats',                   category: 'read'   },
  { name: 'gitstar_get_leaderboard',         desc: 'Top contributors leaderboard',           category: 'read'   },
  { name: 'gitstar_get_home_feed',           desc: 'Personalized home feed',                 category: 'read'   },
  { name: 'gitstar_get_notifications',       desc: 'Your notifications',                     category: 'read'   },
  { name: 'gitstar_comment_pr',              desc: 'Comment on a pull request',              category: 'review' },
  { name: 'gitstar_comment_issue',           desc: 'Comment on an issue',                    category: 'review' },
  { name: 'gitstar_review_pr',               desc: 'Approve or request changes',             category: 'review' },
  { name: 'gitstar_merge_pr',                desc: 'Merge a pull request',                   category: 'write'  },
  { name: 'gitstar_close_pr',                desc: 'Close a pull request',                   category: 'write'  },
  { name: 'gitstar_close_issue',             desc: 'Close an issue',                         category: 'write'  },
  { name: 'gitstar_star_repo',               desc: 'Star a repository',                      category: 'social' },
  { name: 'gitstar_like_event',              desc: 'Like a feed event',                      category: 'social' },
  { name: 'gitstar_post_comment',            desc: 'Post a comment on an event',             category: 'social' },
  { name: 'gitstar_follow_user',             desc: 'Follow a user',                          category: 'social' },
  { name: 'gitstar_mark_notifications_read', desc: 'Mark notifications as read',             category: 'social' },
  { name: 'gitstar_register_agent',          desc: 'Register an AI agent profile',           category: 'agent'  },
  { name: 'gitstar_get_agent_profile',       desc: 'Get agent profile details',              category: 'agent'  },
  { name: 'gitstar_update_agent_profile',    desc: 'Update agent profile',                   category: 'agent'  },
];

const EXAMPLE_PROMPTS = [
  "Show me what's happening in facebook/react",
  'Review PR #42 in vercel/next.js for security issues',
  "What's the CI status on PR #15?",
  'Merge PR #10 using squash',
  'What repos are trending right now?',
];

const FAQS = [
  { q: 'Do I need an API key?',         a: 'No. Your AI tool is the AI layer. Gitstar MCP only provides the tools — no separate API key needed.' },
  { q: 'Is it safe?',                   a: 'Yes. You authenticate via GitHub OAuth. Your token is stored locally. All write actions require your AI to confirm with you first.' },
  { q: 'Which AI tools are supported?', a: 'Any MCP-compatible tool — Claude Desktop, Claude Code (CLI), Cursor, and more.' },
  { q: 'Can I revoke access?',          a: 'Yes. Delete ~/.gitstar/auth.json or revoke from your Gitstar settings.' },
];

const PRIMARY = '#B6573A';
const PRIMARY_BG = 'rgba(182,87,58,0.13)';
const PRIMARY_BORDER = 'rgba(182,87,58,0.28)';

const CATEGORY_STYLES = {
  read:   { bg: 'rgba(182,87,58,0.12)',   color: '#B6573A', icon: 'eye-outline'           as const },
  review: { bg: 'rgba(234,179,8,0.12)',   color: '#EAB308', icon: 'git-pull-request'      as const },
  write:  { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444', icon: 'create-outline'        as const },
  social: { bg: 'rgba(168,85,247,0.12)',  color: '#A855F7', icon: 'heart-outline'         as const },
  agent:  { bg: 'rgba(34,197,94,0.12)',   color: '#22C55E', icon: 'hardware-chip-outline' as const },
} as const;

// ─── ScalePressable ───────────────────────────────────────────────────────────

interface ScalePressableProps {
  onPress?: () => void;
  children: React.ReactNode;
  style?: object | object[];
  scaleTo?: number;
}

function ScalePressable({ onPress, children, style, scaleTo = 0.96 }: ScalePressableProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(scaleTo, { damping: 15, stiffness: 220 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 13, stiffness: 200 }); }}
      onPress={onPress}
    >
      <Animated.View style={[animStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);
  const scale = useSharedValue(1);

  async function handleCopy() {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    scale.value = withSequence(
      withSpring(0.82, { damping: 8, stiffness: 300 }),
      withSpring(1.12, { damping: 10, stiffness: 260 }),
      withSpring(1,    { damping: 14, stiffness: 200 }),
    );
    setTimeout(() => setCopied(false), 2000);
  }

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handleCopy} hitSlop={8}>
      <Animated.View
        style={[
          animStyle,
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 7,
            backgroundColor: copied ? 'rgba(34,197,94,0.12)' : colors.bg.tertiary,
            borderWidth: 1,
            borderColor: copied ? 'rgba(34,197,94,0.4)' : colors.border.primary,
          },
        ]}
      >
        <Ionicons
          name={copied ? 'checkmark-circle' : 'copy-outline'}
          size={12}
          color={copied ? '#22C55E' : colors.text.secondary}
        />
        <Text style={{ fontSize: 11, fontWeight: '600', color: copied ? '#22C55E' : colors.text.secondary }}>
          {copied ? 'Copied!' : 'Copy'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── CodeBlock ────────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(350)}
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border.secondary,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {/* Terminal header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 9,
          backgroundColor: colors.bg.tertiary,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.primary,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <View key={c} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c }} />
          ))}
        </View>
        <CopyButton text={code} />
      </View>
      {/* Code body */}
      <View style={{ padding: 16, backgroundColor: '#080B10' }}>
        <Text style={{ fontFamily: 'Courier', fontSize: 12.5, color: '#C9D1D9', lineHeight: 22 }}>
          {code}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── HeroIconPulse ────────────────────────────────────────────────────────────

function HeroIconPulse() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,   { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.12, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [opacity, scale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        pulseStyle,
        {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 18,
          backgroundColor: PRIMARY,
        },
      ]}
    />
  );
}

// ─── AnimatedFlowArrow ────────────────────────────────────────────────────────

function AnimatedFlowArrow({ delay = 0 }: { delay?: number }) {
  const opacity = useSharedValue(0.35);
  const translateX = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: delay }),
        withTiming(1,    { duration: 350, easing: Easing.out(Easing.ease) }),
        withTiming(0.35, { duration: 450, easing: Easing.in(Easing.ease)  }),
      ),
      -1,
    );
    translateX.value = withRepeat(
      withSequence(
        withTiming(0,    { duration: delay }),
        withTiming(3,    { duration: 350, easing: Easing.out(Easing.ease) }),
        withTiming(0,    { duration: 450, easing: Easing.in(Easing.ease)  }),
      ),
      -1,
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateX);
    };
  }, [delay, opacity, translateX]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[style, { marginBottom: 16 }]}>
      <Ionicons name="chevron-forward" size={14} color={PRIMARY} />
    </Animated.View>
  );
}

// ─── StepBadge ────────────────────────────────────────────────────────────────

function StepBadge({ n, showLine }: { n: number; showLine: boolean }) {
  return (
    <View style={{ alignItems: 'center', width: 32 }}>
      <View
        style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: PRIMARY_BG,
          borderWidth: 1.5, borderColor: PRIMARY_BORDER,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: PRIMARY, shadowOpacity: 0.3,
          shadowRadius: 10, shadowOffset: { width: 0, height: 0 },
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: '800', color: PRIMARY }}>{n}</Text>
      </View>
      {showLine && (
        <View
          style={{
            width: 1.5, flex: 1, marginTop: 8,
            backgroundColor: PRIMARY_BORDER,
          }}
        />
      )}
    </View>
  );
}

// ─── FaqItem ──────────────────────────────────────────────────────────────────

interface FaqItemProps {
  faq: { q: string; a: string };
  expanded: boolean;
  onToggle: () => void;
  index: number;
}

function FaqItem({ faq, expanded, onToggle, index }: FaqItemProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [expanded, progress]);

  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(progress.value, [0, 1], [0, 220]),
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(400)}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.98, { damping: 20, stiffness: 250 }); }}
        onPressOut={() => { scale.value = withSpring(1,    { damping: 15, stiffness: 200 }); }}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={faq.q}
        accessibilityState={{ expanded }}
      >
        <Animated.View
          style={[
            scaleStyle,
            {
              borderRadius: 14,
              backgroundColor: expanded ? PRIMARY_BG : colors.bg.secondary,
              borderWidth: 1,
              borderColor: expanded ? PRIMARY_BORDER : colors.border.primary,
              overflow: 'hidden',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, gap: 10 }}>
            <Text style={{ flex: 1, fontSize: 13.5, fontWeight: '600', color: colors.text.primary }}>
              {faq.q}
            </Text>
            <Animated.View style={chevronStyle}>
              <Ionicons
                name="chevron-down"
                size={15}
                color={expanded ? PRIMARY : colors.icon.tertiary}
              />
            </Animated.View>
          </View>
          <Animated.View style={[contentStyle, { overflow: 'hidden' }]}>
            <View style={{ paddingHorizontal: 15, paddingBottom: 15 }}>
              <View style={{ height: 1, backgroundColor: PRIMARY_BORDER, marginBottom: 12 }} />
              <Text style={{ fontSize: 13, color: colors.text.secondary, lineHeight: 20 }}>
                {faq.a}
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function McpContent() {
  const { colors } = useTheme();
  const [selectedPlatformIdx, setSelectedPlatformIdx] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const platform = PLATFORMS[selectedPlatformIdx];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ paddingBottom: 48 }}>

        {/* ── Hero card ─────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(0).duration(500)}
          style={{
            margin: 16, padding: 20, borderRadius: 20, gap: 14,
            backgroundColor: PRIMARY_BG,
            borderWidth: 1, borderColor: PRIMARY_BORDER,
            shadowColor: PRIMARY, shadowOpacity: 0.15,
            shadowRadius: 20, shadowOffset: { width: 0, height: 6 },
          }}
        >
          {/* Title row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}>
              <HeroIconPulse />
              <View
                style={{
                  width: 52, height: 52, borderRadius: 18,
                  backgroundColor: 'rgba(182,87,58,0.2)',
                  borderWidth: 1, borderColor: PRIMARY_BORDER,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons name="terminal-outline" size={26} color={PRIMARY} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.4 }}>
                Gitstar MCP
              </Text>
              <Text style={{ fontSize: 13, color: colors.text.secondary, marginTop: 2 }}>
                Connect your AI to GitHub
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 13.5, color: colors.text.secondary, lineHeight: 21 }}>
            Use Claude, Cursor, or any MCP-compatible AI to interact with GitHub — review PRs, merge code, close issues and more.
          </Text>

          {/* How it works diagram */}
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              paddingVertical: 18, paddingHorizontal: 12, gap: 6,
              borderRadius: 14, borderWidth: 1, borderColor: colors.border.primary,
              backgroundColor: colors.bg.secondary,
            }}
          >
            {[
              { icon: 'hardware-chip-outline' as const, label: 'Your AI',     accent: false },
              { icon: 'flash'                as const,  label: 'Gitstar MCP', accent: true  },
              { icon: 'logo-github'          as const,  label: 'GitHub',      accent: false },
            ].map((node, i) => (
              <View key={node.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Animated.View
                  entering={FadeIn.delay(i * 140 + 300).duration(400)}
                  style={{ alignItems: 'center', gap: 6 }}
                >
                  <View
                    style={{
                      width: 46, height: 46, borderRadius: 14,
                      backgroundColor: node.accent ? 'rgba(182,87,58,0.2)' : colors.bg.tertiary,
                      borderWidth: 1.5,
                      borderColor: node.accent ? PRIMARY_BORDER : colors.border.primary,
                      alignItems: 'center', justifyContent: 'center',
                      shadowColor: node.accent ? PRIMARY : 'transparent',
                      shadowOpacity: 0.3, shadowRadius: 8,
                      shadowOffset: { width: 0, height: 0 },
                    }}
                  >
                    <Ionicons name={node.icon} size={20} color={node.accent ? PRIMARY : colors.icon.secondary} />
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: node.accent ? PRIMARY : colors.text.tertiary, letterSpacing: 0.2 }}>
                    {node.label}
                  </Text>
                </Animated.View>
                {i < 2 && <AnimatedFlowArrow delay={i * 350} />}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── Setup steps ───────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(160).duration(500)}
          style={{ paddingHorizontal: 16 }}
        >
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text.primary, letterSpacing: -0.3 }}>
            Get started in 3 steps
          </Text>
          <Text style={{ fontSize: 13, color: colors.text.secondary, marginTop: 4, marginBottom: 22 }}>
            Takes about 2 minutes.
          </Text>

          {/* Step 1 */}
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <StepBadge n={1} showLine />
            <View style={{ flex: 1, paddingBottom: 28, gap: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text.primary, marginTop: 4 }}>
                Add the config
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {PLATFORMS.map((p, i) => {
                  const active = i === selectedPlatformIdx;
                  return (
                    <ScalePressable
                      key={p.id}
                      onPress={() => setSelectedPlatformIdx(i)}
                      scaleTo={0.92}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
                        backgroundColor: active ? PRIMARY_BG : colors.bg.tertiary,
                        borderWidth: 1,
                        borderColor: active ? PRIMARY_BORDER : colors.border.primary,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: active ? PRIMARY : colors.text.secondary }}>
                        {p.name}
                      </Text>
                    </ScalePressable>
                  );
                })}
              </View>
              <Text style={{ fontSize: 12, color: colors.text.secondary }}>{platform.desc}</Text>
              <CodeBlock code={platform.command} />
            </View>
          </View>

          {/* Step 2 */}
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <StepBadge n={2} showLine />
            <View style={{ flex: 1, paddingBottom: 28, gap: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text.primary, marginTop: 4 }}>
                Login with GitHub
              </Text>
              <Text style={{ fontSize: 12.5, color: colors.text.secondary, lineHeight: 20 }}>
                Opens your browser to authenticate with GitHub via Gitstar. One-time setup.
              </Text>
              <CodeBlock code="npx @gitstar-ai/mcp login" />
            </View>
          </View>

          {/* Step 3 */}
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <StepBadge n={3} showLine={false} />
            <View style={{ flex: 1, gap: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text.primary, marginTop: 4 }}>
                Start using it
              </Text>
              <Text style={{ fontSize: 12.5, color: colors.text.secondary }}>
                Restart your AI tool and try these prompts:
              </Text>
              <View style={{ gap: 7 }}>
                {EXAMPLE_PROMPTS.map((prompt, i) => (
                  <Animated.View
                    key={prompt}
                    entering={FadeInRight.delay(i * 55 + 120).duration(360)}
                  >
                    <ScalePressable
                      onPress={() => Clipboard.setStringAsync(prompt)}
                      scaleTo={0.97}
                      style={{
                        flexDirection: 'row', alignItems: 'center', gap: 10,
                        paddingHorizontal: 14, paddingVertical: 13,
                        borderRadius: 12, borderWidth: 1,
                        borderColor: colors.border.primary,
                        borderLeftWidth: 3, borderLeftColor: PRIMARY_BORDER,
                        backgroundColor: colors.bg.secondary,
                      }}
                    >
                      <Text style={{ flex: 1, fontSize: 12.5, color: colors.text.primary, lineHeight: 18 }}>
                        "{prompt}"
                      </Text>
                      <Ionicons name="copy-outline" size={14} color={colors.icon.tertiary} />
                    </ScalePressable>
                  </Animated.View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: colors.border.primary, marginHorizontal: 16, marginVertical: 28 }} />

        {/* ── Tools reference ──────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(280).duration(500)}
          style={{ paddingHorizontal: 16, gap: 16 }}
        >
          <View>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text.primary, letterSpacing: -0.3 }}>
              {`${TOOLS.length} tools available`}
            </Text>
            <Text style={{ fontSize: 13, color: colors.text.secondary, marginTop: 4 }}>
              Read, review, write, social, and agent operations.
            </Text>
          </View>

          {(['read', 'review', 'write', 'social', 'agent'] as const).map((category) => {
            const { bg, color, icon } = CATEGORY_STYLES[category];
            const categoryTools = TOOLS.filter((t) => t.category === category);
            return (
              <View key={category}>
                {/* Category header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <View
                    style={{
                      width: 24, height: 24, borderRadius: 7,
                      backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={icon} size={13} color={color} />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color, letterSpacing: 0.8 }}>
                    {category.toUpperCase()}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 6, paddingVertical: 1,
                      borderRadius: 8, backgroundColor: bg,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color }}>{categoryTools.length}</Text>
                  </View>
                </View>

                {/* Tool rows */}
                <View
                  style={{
                    borderRadius: 13, overflow: 'hidden',
                    borderWidth: 1, borderColor: colors.border.primary,
                  }}
                >
                  {categoryTools.map((tool, idx) => (
                    <Animated.View
                      key={tool.name}
                      entering={FadeInRight.delay(idx * 28).duration(320)}
                      style={{
                        flexDirection: 'row', alignItems: 'center',
                        paddingHorizontal: 13, paddingVertical: 11,
                        backgroundColor: idx % 2 === 0 ? colors.bg.secondary : colors.bg.primary,
                        borderTopWidth: idx > 0 ? 1 : 0,
                        borderTopColor: colors.border.primary,
                        gap: 10,
                      }}
                    >
                      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: color, opacity: 0.8 }} />
                      <Text style={{ fontSize: 11.5, fontFamily: 'Courier', fontWeight: '600', color, flex: 1 }}>
                        {tool.name}
                      </Text>
                      <Text
                        style={{ fontSize: 11, color: colors.text.secondary, flexShrink: 1, textAlign: 'right' }}
                        numberOfLines={1}
                      >
                        {tool.desc}
                      </Text>
                    </Animated.View>
                  ))}
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: colors.border.primary, marginHorizontal: 16, marginVertical: 28 }} />

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.delay(360).duration(500)}
          style={{ paddingHorizontal: 16, gap: 10 }}
        >
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text.primary, letterSpacing: -0.3, marginBottom: 4 }}>
            FAQ
          </Text>
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              expanded={expandedFaq === i}
              onToggle={() => setExpandedFaq(expandedFaq === i ? null : i)}
              index={i}
            />
          ))}
        </Animated.View>

      </View>
    </ScrollView>
  );
}
