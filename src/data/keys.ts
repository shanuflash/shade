export const queryKeys = {
  forecast: (lat: number, lon: number) =>
    ['forecast', lat.toFixed(3), lon.toFixed(3)] as const,
  cities: (query: string) => ['cities', query.trim().toLowerCase()] as const,
};
