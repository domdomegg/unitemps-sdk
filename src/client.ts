import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import * as Types from "./types";
import moneyParser from "./parsers/money";
import hoursParser from "./parsers/hours";
import dateParser from "./parsers/date";

const BASE_URL = "https://www.unitemps.com";

const http = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36" // TODO: Is this actually necessary?
  },
  transformResponse: (data, headers): Types.CheerioedResponse => ({
    html: data,
    $: cheerio.load(data)
  }),
  maxRedirects: 0,
  validateStatus: status => status < 400
});

export default {
  /**
   * Login to Unitemps. All future calls will be authenticated as this user, use logout to avoid this.
   * @param username Unitemps username
   * @param password Unitemps password
   */
  login(
    username: string,
    password: string
  ): Promise<{
    res: AxiosResponse<Types.CheerioedResponse>;
    authCookie: string;
  }> {
    if (!username) throw new Error("Missing username");
    if (!password) throw new Error("Missing password");

    return http
      .post<Types.CheerioedResponse>(`${BASE_URL}/Account/SignOn`, {
        Username: username,
        Password: password
      })
      .then(res => {
        const validationErrors = res.data.$(".validation-summary-errors");
        if (validationErrors.length)
          throw new Error(validationErrors.text().trim());

        // .UNITEMPS cookie is used for authentication
        const authCookie = res.headers["set-cookie"][0].split(";")[0];
        http.defaults.headers.Cookie = authCookie;

        return { res, authCookie };
      });
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
    timesheets: Array<Types.TimesheetResponse>;
    pageData: Types.PageDataResponse;
  }> {
    return http
      .get<Types.CheerioedResponse>(
        `${BASE_URL}/members/candidate/timesheets?page=${page}`
      )
      .then(res => {
        const timesheetTableRowElems = res.data.$(".table tbody tr");
        const timesheets = timesheetTableRowElems.toArray().map(
          (element): Types.TimesheetResponse => {
            const $ = cheerio(element);

            return {
              ref: $.find('[data-label="Ref"]').text(),
              id: "12345678", // TODO
              jobTitle: $.find('[data-label="Job title"]').text(),
              weekEnding: dateParser($.find('[data-label="Week"]').text()),
              hours: hoursParser($.find('[data-label="Hours"]').text()),
              pay: moneyParser($.find('[data-label="Pay"]').text()),
              status: $.find('[data-label="Status"]').text()
            };
          }
        );

        const pageResultsElem = res.data.$(".page-results");
        const { 0: from, 1: to, 2: total } = pageResultsElem
          .text()
          .match(/\d+/g)
          .map(parseInt);

        return { res, timesheets, pageData: { from, to, total } };
      });
  }
};
