import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import qs from "querystring";
import * as Types from "./types";
import moneyParser from "./parsers/money";
import hoursParser from "./parsers/hours";
import dateParser from "./parsers/date";
import { timeSheethoursToUnitempsForm } from "./util/timesheetHours";
import { toUnitempsDate } from "./util/date";

const BASE_URL = "https://portal.unitemps.com";

const http = axios.create({
  transformResponse: (data, headers): Types.CheerioedResponse => ({
    html: data,
    $: cheerio.load(data)
  }),
  maxRedirects: 0,
  validateStatus: status => status < 400
});

const unitemps = {
  /**
   * Login to Unitemps. All future calls will be authenticated as this user, use logout to avoid this.
   * @param username Unitemps username
   * @param password Unitemps password
   */
  async login(
    username: string,
    password: string
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    authCookie: string;
  }> {
    if (!username) throw new Error("Missing username");
    if (!password) throw new Error("Missing password");

    const res = await http.post<Types.CheerioedResponse>(
      `${BASE_URL}/Account/SignOn`,
      {
        Username: username,
        Password: password
      }
    );

    const validationErrors = res.data.$(".validation-summary-errors");
    if (validationErrors.length) {
      throw new Error(validationErrors.text().trim());
    }

    // .UNITEMPS cookie is used for authentication
    const cookies: Array<string> = res.headers["set-cookie"];
    const authCookie = cookies
      .find(string => string.includes(".UNITEMPS"))
      .split(";")[0];
    http.defaults.headers.Cookie = authCookie;

    return { res, authCookie };
  },

  /**
   * Clears auth cookie. Only necessary if you're logging in to multiple accounts.
   * Doesn't actually talk to the server at all.
   */
  logout() {
    delete http.defaults.headers.Cookie;
  },

  /**
   * Get next 10 timesheets
   * These will be the ones displayed on https://www.unitemps.com/members/candidate/timesheets
   * @param page Page number
   */
  getTimesheets(
    page: number = 1
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    data: Array<Types.TimesheetResponse>;
    pageData: Types.PageDataResponse;
  }> {
    return unitemps._getPaginatedTableResource(
      `${BASE_URL}/members/candidate/timesheets`,
      page,
      ($: Cheerio): Types.TimesheetResponse => ({
        ref: $.find('[data-label="Ref"]').text(),
        id: $.find('[data-label="Job title"] > a')
          .attr("href")
          .split("/")[4],
        jobTitle: $.find('[data-label="Job title"]').text(),
        weekEnding: dateParser($.find('[data-label="Week"]').text()),
        hours: hoursParser($.find('[data-label="Hours"]').text()),
        pay: moneyParser($.find('[data-label="Pay"]').text()),
        status: $.find('[data-label="Status"]').text()
      })
    );
  },

  /**
   * Get next 10 jobs
   * These will be the ones displayed on https://www.unitemps.com/members/candidate/jobs
   * @param page Page number
   */
  getJobs(
    page: number = 1
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    data: Array<Types.JobResponse>;
    pageData: Types.PageDataResponse;
  }> {
    return unitemps._getPaginatedTableResource(
      `${BASE_URL}/members/candidate/jobs`,
      page,
      ($: Cheerio): Types.JobResponse => ({
        ref: $.find('[data-label="Ref"]').text(),
        company: $.find('[data-label="Company"]').text(),
        id: $.find('[data-label="Job title"] > a')
          .attr("href")
          .split("/")[4],
        jobTitle: $.find('[data-label="Job title"]')
          .text()
          .trim(),
        rateOfPay: moneyParser($.find('[data-label="Rate of pay"]').text()),
        holidayRate: moneyParser($.find('[data-label="Holiday rate"]').text()),
        start: dateParser($.find('[data-label="Start"]').text()),
        end: dateParser($.find('[data-label="End"]').text()),
        status: $.find('[data-label="Status"]').text()
      })
    );
  },

  /**
   * Get next 10 applications
   * These will be the ones displayed on https://www.unitemps.com/members/candidate/applications
   * @param page Page number
   */
  getApplications(
    page: number = 1
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    data: Array<Types.ApplicationResponse>;
    pageData: Types.PageDataResponse;
  }> {
    return unitemps._getPaginatedTableResource(
      `${BASE_URL}/members/candidate/applications`,
      page,
      ($: Cheerio): Types.ApplicationResponse => ({
        ref: $.find('[data-label="Ref"]').text(),
        id: $.find('[data-label="Job title"] > a')
          .attr("href")
          .split("/")[4],
        jobTitle: $.find('[data-label="Job title"]')
          .text()
          .trim(),
        status: $.find('[data-label="Status"]').text()
      })
    );
  },

  /**
   * Get next 10 CVs
   * These will be the ones displayed on https://www.unitemps.com/members/candidate/documents
   * @param page Page number
   */
  getCVs(
    page: number = 1
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    data: Array<Types.CVResponse>;
    pageData: Types.PageDataResponse;
  }> {
    return unitemps._getPaginatedTableResource(
      `${BASE_URL}/members/candidate/documents`,
      page,
      ($: Cheerio): Types.CVResponse => ({
        id: $.find('[data-label="Name"] > a')
          .attr("href")
          .split("/")[4],
        cvTitle: $.find('[data-label="Name"]')
          .text()
          .trim(),
        size: parseInt($.find('[data-label="Size"]').text())
      })
    );
  },

  /**
   * Save a draft timesheet, either creating a new one or updating an existing one.
   * @param options Options for creating the draft timesheet.
   * @param options.jobId Job ID to submit this timesheet under. Not updatable.
   * @param options.weekEnding: Week ending date (Sunday) for this timesheet, in ISO 8601 format (YYYY-MM-DD). Necessary if creating a timesheet.
   * @param options.timesheetId: Timesheet ID. Necessary if updating a timesheet.
   * @param options.hoursWorked: Hours worked to enter on the timesheet. Updatable - will replace any existing hours.
   * @param options.notes: Notes to attach to the timesheet. Updatable - will replace any existing notes.
   * @param options.submitAction: Whether to save or submit the timesheet
   */
  async upsertTimesheet({
    jobId,
    weekEnding,
    timesheetId = "",
    hoursWorked,
    notes,
    submitAction = "save"
  }:
    | {
        jobId: string | number;
        weekEnding: string;
        timesheetId?: string | number;
        hoursWorked: Types.TimesheetHours;
        notes: string;
        submitAction: "save" | "submit";
      }
    | {
        jobId: string | number;
        weekEnding?: string;
        timesheetId: string | number;
        hoursWorked: Types.TimesheetHours;
        notes: string;
        submitAction: "save" | "submit";
      }): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
  }> {
    const { formToken } = await unitemps._requireRequestVerificationAuth(
      `${BASE_URL}/members/candidate/createtimesheet/${jobId}`
    );

    // Whether this operation is an update of an existing timesheet or the creation of a new one
    const isUpdate = !!timesheetId.toString().length;

    // We only need to check the date if we're creating a new timesheet
    if (!isUpdate && !/^\d\d\d\d-[01]\d-[0123]\d/.test(weekEnding)) {
      throw new Error("Invalid date format for weekEnding: " + weekEnding);
    }

    const res = await http.post<Types.CheerioedResponse>(
      `${BASE_URL}/members/candidate/createtimesheet/${jobId}`,
      qs.stringify({
        AssignmentId: jobId,
        Editing: isUpdate ? "True" : "False",
        timesheetId,
        WeekEndingDate: toUnitempsDate(weekEnding),
        ...timeSheethoursToUnitempsForm(hoursWorked),
        Notes: notes.replace(/\n/g, "\r\n"),
        submitAction: submitAction[0].toUpperCase() + submitAction.slice(1),
        __RequestVerificationToken: formToken
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const validationErrors = res.data.$(".validation-summary-errors");
    if (validationErrors.length) {
      throw new Error(validationErrors.text().trim());
    }

    return { res };
  },

  async _requireRequestVerificationAuth(
    getUrl: string
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    cookieToken: string;
    formToken: string;
    sessionId: string;
  }> {
    const res = await http.get<Types.CheerioedResponse>(getUrl);
    const cookies: Array<string> = res.headers["set-cookie"];

    // __RequestVerificationToken cookie used for CSRF protection
    const cookie = cookies
      .find(string => string.includes("__RequestVerificationToken"))
      .split(";")[0];
    http.defaults.headers.Cookie += "; " + cookie;
    const cookieToken = cookie.split("=")[1];

    // ASP.NET_SessionID to match up with the __RequestVerificationToken
    const sessionIdCookie = cookies
      .find(string => string.includes("ASP.NET_SessionId"))
      .split(";")[0];
    http.defaults.headers.Cookie += "; " + sessionIdCookie;
    const sessionId = sessionIdCookie.split("=")[1];

    // __RequestVerificationToken form element used for CSRF protection
    const formToken = res.data.$('[name="__RequestVerificationToken"]').val();

    return { res, cookieToken, formToken, sessionId };
  },

  async _getPaginatedTableResource<ItemType>(
    endpoint: string,
    page: number,
    tableMapping: (value: Cheerio, index: number, array: Cheerio[]) => ItemType
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    data: Array<ItemType>;
    pageData: Types.PageDataResponse;
  }> {
    const res = await http.get<Types.CheerioedResponse>(
      `${endpoint}?page=${page}`
    );

    const data = res.data
      .$(".table tbody tr")
      .toArray()
      .map(cheerio)
      .map(tableMapping);

    const pageResultsElem = res.data.$(".page-results");
    const { 0: from, 1: to, 2: total } = pageResultsElem
      .text()
      .match(/\d+/g)
      .map(n => parseInt(n));

    return { res, data, pageData: { from, to, total } };
  }
};

export default unitemps;
