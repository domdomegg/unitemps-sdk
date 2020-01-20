import * as Types from "../types";

export const timeSheethoursToUnitempsForm = (
  timesheetHours: Types.TimesheetHours
): { [key: string]: number } => {
  const result = {};

  if (timesheetHours.monday) {
    timesheetHours.monday.forEach(addWP(result, "Mon"));
  }

  if (timesheetHours.tuesday) {
    timesheetHours.tuesday.forEach(addWP(result, "Tue"));
  }

  if (timesheetHours.wednesday) {
    timesheetHours.wednesday.forEach(addWP(result, "Wed"));
  }

  if (timesheetHours.thursday) {
    timesheetHours.thursday.forEach(addWP(result, "Thur"));
  }

  if (timesheetHours.friday) {
    timesheetHours.friday.forEach(addWP(result, "Fri"));
  }

  if (timesheetHours.saturday) {
    timesheetHours.saturday.forEach(addWP(result, "Sat"));
  }

  if (timesheetHours.sunday) {
    timesheetHours.sunday.forEach(addWP(result, "Sun"));
  }

  return result;
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
