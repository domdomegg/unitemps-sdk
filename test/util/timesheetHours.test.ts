import { timeSheethoursToUnitempsForm } from "../../src/util/timesheetHours";

it("processes no hours", () => {
  expect(timeSheethoursToUnitempsForm({})).toEqual({});
});

it("processes one period on one day", () => {
  expect(
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 9,
            minute: 30
          },
          to: {
            hour: 10,
            minute: 30
          }
        }
      ]
    })
  ).toEqual({
    "Mon[0].From.Hour": 9,
    "Mon[0].From.Minute": 30,
    "Mon[0].To.Hour": 10,
    "Mon[0].To.Minute": 30
  });
});

it("processes multiple periods on one day", () => {
  expect(
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 9,
            minute: 30
          },
          to: {
            hour: 10,
            minute: 30
          }
        },
        {
          from: {
            hour: 11,
            minute: 30
          },
          to: {
            hour: 12,
            minute: 30
          }
        }
      ]
    })
  ).toEqual({
    "Mon[0].From.Hour": 9,
    "Mon[0].From.Minute": 30,
    "Mon[0].To.Hour": 10,
    "Mon[0].To.Minute": 30,
    "Mon[1].From.Hour": 11,
    "Mon[1].From.Minute": 30,
    "Mon[1].To.Hour": 12,
    "Mon[1].To.Minute": 30
  });
});

it("processes one period on multiple days", () => {
  expect(
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 9,
            minute: 30
          },
          to: {
            hour: 10,
            minute: 30
          }
        }
      ],
      tuesday: [
        {
          from: {
            hour: 11,
            minute: 30
          },
          to: {
            hour: 12,
            minute: 30
          }
        }
      ]
    })
  ).toEqual({
    "Mon[0].From.Hour": 9,
    "Mon[0].From.Minute": 30,
    "Mon[0].To.Hour": 10,
    "Mon[0].To.Minute": 30,
    "Tue[0].From.Hour": 11,
    "Tue[0].From.Minute": 30,
    "Tue[0].To.Hour": 12,
    "Tue[0].To.Minute": 30
  });
});

it("processes multiple periods on multiple days", () => {
  expect(
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 9,
            minute: 30
          },
          to: {
            hour: 10,
            minute: 0
          }
        },
        {
          from: {
            hour: 10,
            minute: 30
          },
          to: {
            hour: 11,
            minute: 0
          }
        }
      ],
      tuesday: [
        {
          from: {
            hour: 11,
            minute: 30
          },
          to: {
            hour: 12,
            minute: 0
          }
        },
        {
          from: {
            hour: 12,
            minute: 30
          },
          to: {
            hour: 13,
            minute: 0
          }
        }
      ]
    })
  ).toEqual({
    "Mon[0].From.Hour": 9,
    "Mon[0].From.Minute": 30,
    "Mon[0].To.Hour": 10,
    "Mon[0].To.Minute": 0,
    "Mon[1].From.Hour": 10,
    "Mon[1].From.Minute": 30,
    "Mon[1].To.Hour": 11,
    "Mon[1].To.Minute": 0,
    "Tue[0].From.Hour": 11,
    "Tue[0].From.Minute": 30,
    "Tue[0].To.Hour": 12,
    "Tue[0].To.Minute": 0,
    "Tue[1].From.Hour": 12,
    "Tue[1].From.Minute": 30,
    "Tue[1].To.Hour": 13,
    "Tue[1].To.Minute": 0
  });
});

it("processes back-to-back periods", () => {
  expect(
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 9,
            minute: 0
          },
          to: {
            hour: 10,
            minute: 0
          }
        },
        {
          from: {
            hour: 10,
            minute: 0
          },
          to: {
            hour: 11,
            minute: 0
          }
        }
      ]
    })
  ).toEqual({
    "Mon[0].From.Hour": 9,
    "Mon[0].From.Minute": 0,
    "Mon[0].To.Hour": 11,
    "Mon[0].To.Minute": 0
  });
});

it("sorts periods", () => {
  expect(
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 14,
            minute: 0
          },
          to: {
            hour: 15,
            minute: 0
          }
        },
        {
          from: {
            hour: 10,
            minute: 0
          },
          to: {
            hour: 11,
            minute: 0
          }
        }
      ]
    })
  ).toEqual({
    "Mon[0].From.Hour": 10,
    "Mon[0].From.Minute": 0,
    "Mon[0].To.Hour": 11,
    "Mon[0].To.Minute": 0,
    "Mon[1].From.Hour": 14,
    "Mon[1].From.Minute": 0,
    "Mon[1].To.Hour": 15,
    "Mon[1].To.Minute": 0
  });
});

it("sorts and handles back-to-back periods", () => {
  expect(
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 14,
            minute: 0
          },
          to: {
            hour: 15,
            minute: 0
          }
        },
        {
          from: {
            hour: 13,
            minute: 0
          },
          to: {
            hour: 14,
            minute: 0
          }
        }
      ]
    })
  ).toEqual({
    "Mon[0].From.Hour": 13,
    "Mon[0].From.Minute": 0,
    "Mon[0].To.Hour": 15,
    "Mon[0].To.Minute": 0
  });
});

it("rejects overlapping periods", () => {
  expect(() =>
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 8,
            minute: 0
          },
          to: {
            hour: 10,
            minute: 0
          }
        },
        {
          from: {
            hour: 9,
            minute: 0
          },
          to: {
            hour: 11,
            minute: 0
          }
        }
      ]
    })
  ).toThrow();
});

it("rejects overlapping periods within an hour", () => {
  expect(() =>
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 9,
            minute: 0
          },
          to: {
            hour: 9,
            minute: 30
          }
        },
        {
          from: {
            hour: 9,
            minute: 15
          },
          to: {
            hour: 9,
            minute: 45
          }
        }
      ]
    })
  ).toThrow();
});

it("rejects overlapping periods out of order", () => {
  expect(() =>
    timeSheethoursToUnitempsForm({
      monday: [
        {
          from: {
            hour: 9,
            minute: 0
          },
          to: {
            hour: 11,
            minute: 0
          }
        },
        {
          from: {
            hour: 8,
            minute: 0
          },
          to: {
            hour: 10,
            minute: 0
          }
        }
      ]
    })
  ).toThrow();
});
