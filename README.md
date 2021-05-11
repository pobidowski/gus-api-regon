# gus-api-regon
Small service to connect to GUS API REGON

[![npm version](https://img.shields.io/npm/v/@pobidowski/gus-api-regon.svg?style=flat-square)](https://www.npmjs.org/package/@pobidowski/cz-conventional-changelog-for-phabricator)
[![npm downloads](https://img.shields.io/npm/dm/@pobidowski/gus-api-regon.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@pobidowski/cz-conventional-changelog-for-phabricator&from=2015-08-01)

## Features

- Connect You to GUS API REGON
- Fully in TypeScript

## Quickstart

### Installation

```bash
npm install @pobidowski/gus-api-regon
```

or 

```bash
yarn add @pobidowski/gus-api-regon
```

### Example usage

```javascript
import { GUSApiRegon } from '@pobidowski/gus-api-regon';

const service = new GUSApiRegon('YOUR_API_KEY');

const results = await service.search({
  nip: '1234567890'
});

console.log('Results', results);
```
