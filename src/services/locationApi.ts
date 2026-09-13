export interface LocationResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export const searchCity = async (query: string): Promise<LocationResult[]> => {
  if (!query) return [];
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    if (!data.results) return [];
    
    return data.results.map((r: any) => ({
      name: r.name,
      country: r.country || '',
      lat: r.latitude,
      lon: r.longitude
    }));
  } catch (err) {
    console.error("Geocoding error", err);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<{city: string, country: string}> => {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await res.json();
    return {
      city: data.city || data.locality || "Unknown City",
      country: data.countryName || "Unknown Country"
    };
  } catch (err) {
    console.error("Reverse geocoding error", err);
    return { city: "Current Location", country: "" };
  }
};
