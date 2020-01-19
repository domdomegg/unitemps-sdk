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

### Get timesheets

Lists all timesheets

Returns:
- `res`: the axios response
- `timesheets`: an array of timesheet objects
- `pageData`: information which timesheets are being listed

```js
unitemps.login('username', 'password')
  .then(unitemps.getTimesheets)
  .then(result => console.dir(result.timesheets))

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