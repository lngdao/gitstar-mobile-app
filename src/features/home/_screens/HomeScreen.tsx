import { Box, Text } from '@/shared/components';
import { useTranslation } from '@/shared/hooks';
import { WelcomeCard } from '../_components/WelcomeCard';

export const HomeScreen = () => {
  const { t } = useTranslation();
  return (
    <Box bg="primary" className="flex-1 p-16 pt-64">
      <Text variant="heading" color="primary">{t('navigation.home')}</Text>
      <WelcomeCard />
    </Box>
  );
};
