import React from "react";
import { weatherIconComponents } from "./WeatherIconComponents";
import { WiDaySunny } from "react-icons/wi"; // fallback icon

export interface WeatherIconProps {
  weatherCode: number;
  size?: number;
  color?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  size = 40,
  color = "black",
}) => {
  const IconComponent = weatherIconComponents[weatherCode] || WiDaySunny;
  return <IconComponent size={size} color={color} />;
};

export default WeatherIcon;
