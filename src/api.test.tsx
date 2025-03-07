// src/api.test.ts
import { fetchGeocode, fetchWeather } from "./api";

// Set a default fetch mock (will be re-mocked in individual tests)
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
    // Simulate a response with 5 days of daily data (raw API format)
    const mockResponse = {
      daily: {
        time: [1741305600, 1741392000, 1741478400, 1741564800, 1741651200],
        weather_code: [0, 1, 2, 3, 45],
        temperature_2m_max: [22, 23, 24, 25, 26],
        temperature_2m_min: [12, 13, 14, 15, 16],
        uv_index_max: [5, 6, 7, 8, 9],
        precipitation_sum: [0, 0.1, 0.2, 0.3, 0.4],
        wind_speed_10m_max: [10, 11, 12, 13, 14],
      },
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Call fetchWeather which should transform daily into daily_weather with 5 days
    const result = await fetchWeather(52.52, 3.4);
    expect(result).toHaveProperty("daily_weather");
    expect(Array.isArray(result.daily_weather)).toBe(true);
    expect(result.daily_weather).toHaveLength(5);

    // Check that the first day's transformation is correct.
    // (Assuming transformDailyWeather converts the Unix timestamp to a string date and day.)
    expect(result.daily_weather[0]).toMatchObject({
      temperature_2m_max: 22,
      temperature_2m_min: 12,
      wind_speed_10m_max: 10,
      weather_code: 0,
    });
    expect(result.daily_weather[0].date).toBeDefined();
    expect(result.daily_weather[0].day).toBeDefined();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("latitude=52.52")
    );
  });

  it("should throw an error if the weather response is not ok", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(fetchWeather(52.52, 13.405)).rejects.toThrow(
      "response.json is not a function"
    );
  });

  it("should correctly parse and return weather JSON", async () => {
    const mockResponse = {
      daily: {
        time: [1741305600, 1741392000, 1741478400, 1741564800, 1741651200],
        weather_code: [3, 2, 3, 45, 45],
        temperature_2m_max: [18.2, 17.5, 15.7, 15.3, 9.5],
        temperature_2m_min: [3.5, 6, 4.9, -0.5, 1.8],
        uv_index_max: [3.35, 3.5, 3.5, 3.4, 2.9],
        precipitation_sum: [0, 0, 0, 0, 0],
        wind_speed_10m_max: [20, 21, 19, 18, 22],
      },
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchWeather(40, -74);
    expect(result).toHaveProperty("daily_weather");
    expect(result.daily_weather.length).toBe(5);
    // Validate one value from the first day's transformed data
    expect(result.daily_weather[0].temperature_2m_max).toBe(18.2);
  });
});
