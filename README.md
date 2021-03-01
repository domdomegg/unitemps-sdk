# unitemps-sdk

[![CI/CD Status](https://github.com/domdomegg/unitemps-sdk/workflows/CI/CD/badge.svg)](https://github.com/domdomegg/unitemps-sdk/actions?workflow=CI/CD)
[![JavaScript Standard Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/domdomegg/unitemps-sdk/blob/master/LICENSE)
[![NPM Package Version](https://img.shields.io/npm/v/unitemps-sdk)](https://www.npmjs.com/package/unitemps-sdk) 
[![Bundle size](https://img.shields.io/bundlephobia/minzip/unitemps-sdk?label=size)](https://bundlephobia.com/result?p=unitemps-sdk@latest)

Unofficial SDK for [Unitemps](https://www.unitemps.com/)

Scrapes their website, so may be broken by updates to their front end

## Usage

### Setup

```js
const unitemps = require('unitemps-sdk').default
```

OR

```typescript
import unitemps from 'unitemps-sdk'
```

### Login

This is required before making any other calls

```js
unitemps.login('username', 'password')
```

### Logout

Clears session data locally.

```js
unitemps.logout()
```

### Get timesheets

Lists all timesheets

Returns:
- `res`: the axios response
- `data`: an array of timesheet objects
- `pageData`: information which timesheets are being listed

```js
unitemps.login('username', 'password')
  .then(() => unitemps.getTimesheets())
  .then(result => console.dir(result.data))

// [ { ref: '1234567',
//     id: '12345678',
//     jobTitle: 'Do-er of things',
//     weekEnding: { asText: '2020-01-05', asRawText: '05/01/2020' },
//     hours: { asFloat: 1.25, asText: '1.25', asRawText: '1.25' },
//     pay: { asFloat: 12.34, asText: '£12.34', asRawText: '£12.34' },
//     status: 'Authorised' },
//   { ref: '1234568',
//     id: '12345679',
//     jobTitle: 'Do-er of other things',
//     weekEnding: { asText: '2019-12-22', asRawText: '22/12/2019' },
//     hours: { asFloat: 2.5, asText: '2.50', asRawText: '2.50' },
//     pay: { asFloat: 23.45, asText: '£23.45', asRawText: '£23.45' },
//     status: 'Paid' } ]
```


### Get jobs

Lists all timesheets

Returns:
- `res`: the axios response
- `data`: an array of job objects
- `pageData`: information which jobs are being listed

```js
unitemps.login('username', 'password')
  .then(() => unitemps.getJobs())
  .then(result => console.dir(result.data))

// [ { ref: '2345678',
//     company: 'Company McCompanyface',      
//     id: '34567890',
//     jobTitle: 'Do-er of things',
//     rateOfPay: { asFloat: 12.34, asText: '£12.34', asRawText: '£\r\n12.34' },
//     holidayRate: { asFloat: 1.23, asText: '£1.23', asRawText: '£\r\n1.23' },
//     start: { asText: '2019-08-01', asRawText: '01/08/2019' },
//     end: { asText: '2020-07-31', asRawText: '31/07/2020' },
//     status: 'Current' },
//   { ref: '456789',
//     company: 'Company McCompanyface',
//     id: '56789012',
//     jobTitle: 'Do-er of other things',
//     rateOfPay: { asFloat: 9.99, asText: '£9.99', asRawText: '£\r\n9.99' },
//     holidayRate: { asFloat: 1.00, asText: '£1.00', asRawText: '£\r\n1.00' },
//     start: { asText: '2019-01-01', asRawText: '01/01/2019' },
//     end: { asText: '2019-07-31', asRawText: '31/07/2019' },
//     status: 'Past' } ]
```