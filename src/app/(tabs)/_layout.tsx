import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/ui';
import { colors, fonts } from '../../theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.green, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line, height: 66 + Math.max(insets.bottom, 8), paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8) }, tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11, marginTop: 3 } }}>
    <Tabs.Screen name="index" options={{ title: 'Explorar', tabBarIcon: ({ focused }) => <Icon name={focused ? 'compass' : 'compass-outline'} color={focused ? colors.green : colors.muted} /> }} />
    <Tabs.Screen name="library" options={{ title: 'Mi biblioteca', tabBarIcon: ({ focused }) => <Icon name={focused ? 'book' : 'book-outline'} color={focused ? colors.green : colors.muted} /> }} />
    <Tabs.Screen name="practice" options={{ title: 'Practicar', tabBarIcon: ({ focused }) => <Icon name={focused ? 'layers' : 'layers-outline'} color={focused ? colors.green : colors.muted} /> }} />
  </Tabs>;
}
