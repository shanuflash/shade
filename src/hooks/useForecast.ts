import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getForecast } from '../api/openMeteo';
import { writeForecastCache } from '../data/cache';
import { queryKeys } from '../data/keys';
import { effectiveLocation, useSettings } from '../state/settingsStore';
import { updateUvWidget } from '../widget/update';

// Fetches the forecast for the active location and, on each success, updates
// the shared cache and the home-screen widgets.
export function useForecast() {
  const location = useSettings(effectiveLocation);

  const query = useQuery({
    queryKey: location
      ? queryKeys.forecast(location.latitude, location.longitude)
      : ['forecast', 'pending'],
    queryFn: () => getForecast(location!.latitude, location!.longitude),
    enabled: !!location,
  });

  const { data } = query;
  useEffect(() => {
    if (data && location) {
      void writeForecastCache(data, location).then(() => updateUvWidget(data, location));
    }
  }, [data, location]);

  return { ...query, location };
}
