export type GeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
};

export type WeatherData = {
  current_weather: Weather;
};

export type Weather = {
  temperature: number;
  windspeed: number;
  winddirection: string;
  weathercode: number;
  time: string;
};
