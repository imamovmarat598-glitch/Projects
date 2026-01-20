import axios from 'axios';
import { config } from '../config/config.js';

export interface Location {
  name: string;
  address: string;
  lat: number;
  lon: number;
}

export interface RouteInfo {
  distance: number; // в метрах
  duration: number; // в секундах
  points: Array<{ lat: number; lon: number }>;
}

class YandexMapsService {
  private readonly apiKey = config.api.yandexMaps.apiKey;
  private readonly geocodeUrl = 'https://geocode-maps.yandex.ru/1.x/';
  private readonly routeUrl = 'https://api.routing.yandex.net/v2/route';

  // Геокодирование адреса (получение координат)
  async geocode(address: string): Promise<{ lat: number; lon: number } | null> {
    if (!this.apiKey) {
      console.warn('Yandex Maps API key not configured');
      return null;
    }

    try {
      const response = await axios.get(this.geocodeUrl, {
        params: {
          apikey: this.apiKey,
          geocode: address,
          format: 'json',
        },
      });

      const geoObject = response.data.response.GeoObjectCollection.featureMember[0];
      if (!geoObject) return null;

      const pos = geoObject.GeoObject.Point.pos.split(' ');
      return {
        lon: parseFloat(pos[0]),
        lat: parseFloat(pos[1]),
      };
    } catch (error) {
      console.error('Yandex Geocode API error:', error);
      return null;
    }
  }

  // Построение маршрута между точками
  async buildRoute(points: Location[]): Promise<RouteInfo | null> {
    if (!this.apiKey) {
      console.warn('Yandex Maps API key not configured');
      return this.buildMockRoute(points);
    }

    try {
      const waypoints = points.map(p => `${p.lon},${p.lat}`).join('|');

      const response = await axios.get(this.routeUrl, {
        params: {
          apikey: this.apiKey,
          waypoints,
        },
      });

      const route = response.data.route;
      return {
        distance: route.distance.value,
        duration: route.duration.value,
        points: route.legs.flatMap((leg: any) =>
          leg.steps.map((step: any) => ({
            lat: step.polyline.points[0][1],
            lon: step.polyline.points[0][0],
          }))
        ),
      };
    } catch (error) {
      console.error('Yandex Route API error:', error);
      return this.buildMockRoute(points);
    }
  }

  // Заглушка для маршрута (когда нет API ключа)
  private buildMockRoute(points: Location[]): RouteInfo {
    // Примерный расчет расстояния по прямой
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const d = this.calculateDistance(
        points[i].lat,
        points[i].lon,
        points[i + 1].lat,
        points[i + 1].lon
      );
      totalDistance += d;
    }

    // Примерная скорость 30 км/ч в городе
    const duration = (totalDistance / 1000) * (3600 / 30);

    return {
      distance: totalDistance,
      duration,
      points: points.map(p => ({ lat: p.lat, lon: p.lon })),
    };
  }

  // Расчет расстояния между двумя точками (формула Haversine)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Радиус Земли в метрах
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Форматирование маршрута для отображения
  formatRoute(route: RouteInfo, locations: Location[]): string {
    const distanceKm = (route.distance / 1000).toFixed(1);
    const durationMin = Math.round(route.duration / 60);
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;

    let timeStr = '';
    if (hours > 0) {
      timeStr = `${hours} ч ${minutes} мин`;
    } else {
      timeStr = `${minutes} мин`;
    }

    let message = `🗺 <b>Маршрут построен</b>\n\n`;
    message += `📏 Расстояние: ${distanceKm} км\n`;
    message += `⏱ Время в пути: ~${timeStr}\n\n`;
    message += `<b>Точки маршрута:</b>\n`;

    locations.forEach((loc, index) => {
      const emoji = index === 0 ? '🏁' : index === locations.length - 1 ? '🏁' : '📍';
      message += `${emoji} ${index + 1}. ${loc.name}\n`;
      message += `   ${loc.address}\n\n`;
    });

    return message;
  }

  // Создать ссылку на Yandex Maps с маршрутом
  createMapLink(points: Location[]): string {
    const waypoints = points
      .map(p => `${p.lat},${p.lon}`)
      .join('~');

    return `https://yandex.ru/maps/?rtext=${waypoints}&rtt=auto`;
  }
}

export const yandexMapsService = new YandexMapsService();
