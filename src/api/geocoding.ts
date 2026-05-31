import { buildUrl, fetchJson } from './client';
import type { CityResult } from './types';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

interface GeocodingResponse {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }[];
}

export async function searchCities(query: string): Promise<CityResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = buildUrl(GEOCODING_URL, {
    name: q,
    count: 8,
    language: 'en',
    format: 'json',
  });
  const res = await fetchJson<GeocodingResponse>(url);
  return (res.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

export function cityLabel(c: Pick<CityResult, 'name' | 'admin1' | 'country'>): string {
  return [c.name, c.admin1, c.country].filter(Boolean).join(', ');
}
