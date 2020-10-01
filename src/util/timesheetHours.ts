import * as Types from "../types";

export const timeSheethoursToUnitempsForm = (
  timesheetHours: Types.TimesheetHours
): { [key: string]: number } => {
  const result = {};

  if (timesheetHours.monday) {
    prepare(timesheetHours.monday).forEach(addWP(result, "Mon"));
  }

  if (timesheetHours.tuesday) {
    prepare(timesheetHours.tuesday).forEach(addWP(result, "Tue"));
  }

  if (timesheetHours.wednesday) {
    prepare(timesheetHours.wednesday).forEach(addWP(result, "Wed"));
  }

  if (timesheetHours.thursday) {
    prepare(timesheetHours.thursday).forEach(addWP(result, "Thur"));
  }

  if (timesheetHours.friday) {
    prepare(timesheetHours.friday).forEach(addWP(result, "Fri"));
  }

  if (timesheetHours.saturday) {
    prepare(timesheetHours.saturday).forEach(addWP(result, "Sat"));
  }

  if (timesheetHours.sunday) {
    prepare(timesheetHours.sunday).forEach(addWP(result, "Sun"));
  }

  return result;
};

/**
 * Sorts work periods, validates they don't overlap, and merges larger blocks
 * For example:
 * 9 - 11, 10 - 12 throws Error
 * 9 - 10, 10 - 11 will be changed to 9 - 11
 */
const prepare = (workPeriods: Types.WorkPeriod[]) => {
  let sorted = workPeriods.sort(
    (a, b) => toMinutes(a.from) - toMinutes(b.from)
  );
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (toMinutes(b.from) < toMinutes(a.to)) {
      throw new Error(
        "Overlapping work periods: " +
          JSON.stringify(a) +
          " and " +
          JSON.stringify(b)
      );
    }
    if (a.to.hour == b.from.hour && a.to.minute == b.from.minute) {
      a.to.hour = b.to.hour;
      a.to.minute = b.to.minute;
      sorted.splice(i + 1, 1);
      i--;
    }
  }
  return sorted;
};

const toMinutes = (time: Types.HourAndMinute) => {
  return time.hour * 60 + time.minute;
};

const addWP = (result: { [key: string]: number }, dayName: string) => (
  workPeriod: Types.WorkPeriod,
  index: number
) => {
  result[`${dayName}[${index}].From.Hour`] = workPeriod.from.hour;
  result[`${dayName}[${index}].From.Minute`] = workPeriod.from.minute;
  result[`${dayName}[${index}].To.Hour`] = workPeriod.to.hour;
  result[`${dayName}[${index}].To.Minute`] = workPeriod.to.minute;
};
