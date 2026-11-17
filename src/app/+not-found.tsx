import { router } from 'expo-router';
import { EmptyState, Screen } from '../components/ui';

export default function NotFound() {
  return <Screen><EmptyState title="Este camino no lleva a una ficha" text="Vuelve a explorar para encontrar tu próximo tema de estudio." action="Ir a explorar" onAction={() => router.replace('/')} /></Screen>;
}
