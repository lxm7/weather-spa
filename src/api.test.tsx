// src/api.test.ts
import { fetchGeocode, fetchWeather } from "./api";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  })
) as jest.Mock;

describe("fetchGeocode", () => {
  afterEach(() => {
    // Restore the original fetch after each test
    jest.restoreAllMocks();
  });

  it("should return geocode results for a valid query", async () => {
    const mockResponse = {
      results: [
        {
          id: 1,
          name: "Berlin",
          latitude: 52.52,
          longitude: 13.405,
          country_code: "DE",
        },
      ],
    };

    // Mock the global.fetch call.
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchGeocode("Berlin");
    expect(result).toEqual(mockResponse.results);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("name=Berlin")
    );
  });

  it("should return an empty array if no results are found", async () => {
    const mockResponse = { results: [] };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchGeocode("UnknownLocation");
    expect(result).toEqual([]);
  });

  it("should throw an error if the response is not ok", async () => {
    // Simulate a failed fetch call.
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(fetchGeocode("Berlin")).rejects.toThrow(
      "Geocode fetch failed"
    );
  });
});

describe("fetchWeather", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return weather data for valid coordinates", async () => {
    const mockWeather = {
      current_weather: {
        temperature: 20,
        windspeed: 12,
        weathercode: 0,
      },
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeather,
    } as Response);

    const result = await fetchWeather(52.52, 13.405);
    expect(result).toEqual(mockWeather);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("latitude=52.52")
    );
  });

  it("should throw an error if the weather response is not ok", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(fetchWeather(52.52, 13.405)).rejects.toThrow(
      "Weather fetch failed"
    );
  });

  it("should correctly parse and return weather JSON", async () => {
    const mockWeather = {
      current_weather: {
        temperature: 15,
        windspeed: 10,
        weathercode: 1,
      },
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeather,
    } as Response);

    const result = await fetchWeather(40, -74);
    expect(result).toHaveProperty("current_weather");
    expect(result.current_weather.temperature).toBe(15);
  });
});
