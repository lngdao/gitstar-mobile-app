import { Box, Text, Button } from '@/shared/components';
import { useTheme } from '@/shared/hooks';

export const WelcomeCard = () => {
  const { toggleTheme, isDark } = useTheme();
  return (
    <Box bg="secondary" radius="2xl" padding={16} className="mt-16">
      <Text variant="heading" size="sm" color="primary">Welcome to the Boilerplate</Text>
      <Text color="secondary" className="mt-8">
        This is an example feature module demonstrating the architecture.
      </Text>
      <Button type="primary" size="md" className="mt-16" onPress={toggleTheme}>
        Toggle Theme ({isDark ? 'Dark' : 'Light'})
      </Button>
    </Box>
  );
};
