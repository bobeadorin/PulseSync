import { SensorData } from "../types";

export const parseSensorData = (data: string): SensorData | null => {
  try {
    const pulseMatch = data.match(/pulse:(\d+)/);
    const stepsMatch = data.match(/steps:(\d+)/);

    if (pulseMatch && pulseMatch[1] && stepsMatch && stepsMatch[1]) {
      const pulse = Number(pulseMatch[1]);
      const steps = Number(stepsMatch[1]);

      if (!isNaN(pulse) && !isNaN(steps)) {
        const result: SensorData = {
          pulse,
          steps,
          timestamp: new Date(),
        };
        return result;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};
