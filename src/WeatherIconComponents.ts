// weatherIconComponents.ts
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiFog,
  WiSprinkle,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiShowers,
} from "react-icons/wi";

// Map weather codes to icon components
export const weatherIconComponents: Record<
  number,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  0: WiDaySunny, // Clear sky
  1: WiDaySunny, // Mainly clear (you can further customize if needed)
  2: WiDayCloudy, // Partly cloudy
  3: WiCloud, // Overcast
  45: WiFog,
  48: WiFog,
  51: WiSprinkle,
  53: WiSprinkle,
  55: WiSprinkle,
  56: WiSprinkle, // freezing drizzle (can be also a sprinkle icon)
  57: WiSprinkle,
  61: WiRain,
  63: WiRain,
  65: WiRain,
  66: WiRain,
  67: WiRain,
  71: WiSnow,
  73: WiSnow,
  75: WiSnow,
  77: WiSnow,
  80: WiShowers, // Rain showers
  81: WiShowers,
  82: WiShowers,
  85: WiSnow,
  86: WiSnow,
  95: WiThunderstorm,
  96: WiThunderstorm,
  99: WiThunderstorm,
};
