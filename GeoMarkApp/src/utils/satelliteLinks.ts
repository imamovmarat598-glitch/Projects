/**
 * Утилиты для генерации ссылок на спутниковые сервисы
 */

export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Генерация ссылки на Геопортал Роскосмоса
 */
export function getRoscosmosGeoportalLink(coords: Coordinates): string {
  return `https://gptl.ru/?lat=${coords.latitude}&lon=${coords.longitude}&zoom=15`
}

/**
 * Генерация ссылки на платформу "Цифровая Земля"
 */
export function getDigitalEarthLink(coords: Coordinates): string {
  return `https://dgearth.ru/?lat=${coords.latitude}&lon=${coords.longitude}`
}

/**
 * Генерация ссылки на Google Maps Satellite
 */
export function getGoogleSatelliteLink(coords: Coordinates): string {
  return `https://www.google.com/maps/@?api=1&map_action=map&center=${coords.latitude},${coords.longitude}&zoom=18&basemap=satellite`
}

/**
 * Генерация ссылки на Google Earth Web
 */
export function getGoogleEarthLink(coords: Coordinates): string {
  return `https://earth.google.com/web/@${coords.latitude},${coords.longitude},0a,1000d,35y,0h,0t,0r`
}

/**
 * Все доступные спутниковые сервисы
 */
export interface SatelliteService {
  id: string
  name: string
  description: string
  icon: string
  getLink: (coords: Coordinates) => string
  color: string
}

export const SATELLITE_SERVICES: SatelliteService[] = [
  {
    id: 'roscosmos',
    name: 'Геопортал Роскосмоса',
    description: 'Спутниковые снимки российских аппаратов',
    icon: 'satellite-outline',
    getLink: getRoscosmosGeoportalLink,
    color: '#4A90E2',
  },
  {
    id: 'digital-earth',
    name: 'Цифровая Земля',
    description: 'AI-анализ территорий от Роскосмоса',
    icon: 'earth-outline',
    getLink: getDigitalEarthLink,
    color: '#50C878',
  },
  {
    id: 'google-satellite',
    name: 'Google Maps Satellite',
    description: 'Спутниковый слой Google Maps',
    icon: 'map-outline',
    getLink: getGoogleSatelliteLink,
    color: '#EA4335',
  },
  {
    id: 'google-earth',
    name: 'Google Earth',
    description: '3D-модель Земли',
    icon: 'globe-outline',
    getLink: getGoogleEarthLink,
    color: '#34A853',
  },
]
