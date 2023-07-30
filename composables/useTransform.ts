import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default () => ({
  toKm: (value: number): number => {
    return +(value / 1000).toFixed(1);
  },

  toKmPerHour: (value: number): number => {
    return +(value * 3.6).toFixed(1);
  },
  round: (value: number): number => {
    return Math.round(value);
  },
  toFormattedDuration: (
    value: number,
    format: string = "H[h] m[min]"
  ): string => {
    return dayjs.duration(value, "seconds").format(format);
  },
  toFormattedDate: (value: string, format: string = "DD/MM/YYYY"): string => {
    return dayjs(value).format(format);
  },
});
