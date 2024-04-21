/* eslint-disable @typescript-eslint/no-empty-function */
import dayjs from "dayjs";
import { createContext } from "react";

export type Period = {
  /**
   * The queries will depend on the queryDate and userStartDay
   * if queryDate < userStartDay, periodStart will be the userStartDay of the previous month, periodEnd will be the userStartDay of the current month
   * else periodStart will be the userStartDay of the currentMonth,  periodEnd will be the userStartDay of the next month,
   */
  periodStart: dayjs.Dayjs;
  periodEnd: dayjs.Dayjs;
  /**
   * Settings defined start date
   */
  userStartDay: number;
  // queryDate: dayjs.Dayjs;
  nextPeriod: () => void;
  previousPeriod: () => void;
  setPeriod: (date: dayjs.Dayjs) => void;
};

export const PeriodContext = createContext<Period>({
  userStartDay: 1,
  // queryDate: dayjs(),
  nextPeriod: () => {},
  previousPeriod: () => {},
  setPeriod: () => {},
  periodEnd: dayjs(),
  periodStart: dayjs(),
});
