export type GeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
};

export type WeatherData = {
  daily_weather: DayWeather[];
};

export type DayWeather = {
  day: number;
  date: number;
  weather_code: number;
  temperature_2m_min: number;
  temperature_2m_max: number;
  wind_speed_10m_max: number;
};
