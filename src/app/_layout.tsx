import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Pressable } from 'react-native';
import { StudyProvider, useStudy } from '../state/StudyProvider';
import { EmptyState, Loading, Screen, Txt } from '../components/ui';
import { colors } from '../theme';

export { ErrorBoundary } from 'expo-router';
function AppContent() {
  const { ready, loadError, saveError, retry } = useStudy();
  if (loadError) return <Screen><EmptyState title="No pudimos abrir tu biblioteca" text="Tus datos se conservaron. Intenta abrirlos de nuevo." icon="cloud-offline-outline" action="Reintentar" onAction={retry} /></Screen>;
  if (!ready) return <Loading />;
  return <View style={{ flex: 1 }}>
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }} />
    {saveError && <Pressable onPress={retry} accessibilityRole="button" style={{ padding: 14, backgroundColor: colors.redLight }}><Txt style={{ color: colors.red }}>No se pudieron guardar los cambios. Toca para reintentar.</Txt></Pressable>}
  </View>;
}
export default function RootLayout() {
  const [loaded, error] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  if (!loaded && !error) return null;
  return <SafeAreaProvider><StudyProvider><StatusBar style="dark" /><AppContent /></StudyProvider></SafeAreaProvider>;
}
