import type { AreaId } from '../domain/models';

// These tokens follow the subject through discovery, reading, saving and study.
export const areas = {
  medicine: { id: 'medicine', name: 'Medicina', description: 'Salud e instrumentación', color: '#246A56', soft: '#E4F1EB', dark: '#173F34', accent: '#CDE9BF', icon: 'medical-outline' },
  science: { id: 'science', name: 'Ciencias', description: 'Biología, química y más', color: '#285FA7', soft: '#E8F0FB', dark: '#173D6E', accent: '#C6DDFB', icon: 'planet-outline' },
  other: { id: 'other', name: 'Otras disciplinas', description: 'Lectura y aprendizaje', color: '#7951A6', soft: '#F0EAF8', dark: '#492E6A', accent: '#E4CFF8', icon: 'bulb-outline' },
} as const;
export const areaList = Object.values(areas);
export const isArea = (value?: string): value is AreaId => !!value && Object.hasOwn(areas, value);
