import { GeocodeResult, WeatherData } from "./types";

export async function fetchGeocode(query = "Berlin"): Promise<GeocodeResult[]> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}`
  );
  if (!response.ok) {
    throw new Error("Geocode fetch failed");
  }
  const data = await response.json();
  return data.results || [];
}

// Function to fetch weather data using the provided latitude and longitude
export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );
  if (!response.ok) {
    throw new Error("Weather fetch failed");
  }
  return response.json();
}
