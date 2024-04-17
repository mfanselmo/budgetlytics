/* eslint-disable @typescript-eslint/no-empty-function */
import dayjs from "dayjs";
import { createContext } from "react";

export type Period = {
  date: dayjs.Dayjs;
  increaseMonth: () => void;
  decreaseMonth: () => void;
  setPeriod: (date: dayjs.Dayjs) => void;
};

export const PeriodContext = createContext<Period>({
  date: dayjs(),
  increaseMonth: () => {},
  decreaseMonth: () => {},
  setPeriod: () => {},
});
