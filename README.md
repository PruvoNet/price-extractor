[![Npm Version](https://img.shields.io/npm/v/price-extractor.svg?style=popout)](https://www.npmjs.com/package/price-extractor)
[![node](https://img.shields.io/node/v-lts/price-extractor)](https://www.npmjs.com/package/price-extractor)
[![Build status](https://github.com/PruvoNet/price-extractor/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/PruvoNet/price-extractor/actions/workflows/ci.yml)
[![Test Coverage](https://api.codeclimate.com/v1/badges/83a4b9446725afb8f6ef/test_coverage)](https://codeclimate.com/github/PruvoNet/price-extractor/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/83a4b9446725afb8f6ef/maintainability)](https://codeclimate.com/github/PruvoNet/price-extractor/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/PruvoNet/price-extractor/badge.svg?targetFile=package.json)](https://snyk.io/test/github/PruvoNet/price-extractor?targetFile=package.json)

# price-extractor

A small library for parsing price strings in order to extract the price as a number and the currency code of the price.  
The library can handle all kinds of thousands and cents delimiters, as well as all currency native symbols and unicodes.

## Installation 
```sh
npm install price-extractor
```
Or
```sh
yarn add price-extractor
```

## Examples
```typescript
import {searchPriceAndCode} from 'price-extractor';
console.dir(searchPriceAndCode('99,01€')); // { price: 99.01, code: 'EUR' }
console.dir(searchPriceAndCode('ARS 1,647.86')); // { price: 1647.86, code: 'ARS' }
console.dir(searchPriceAndCode('1.958,43 NOK')); // { price: 1958.43, code: 'NOK' }
console.dir(searchPriceAndCode('￥732.62')); // { price: 732.62, code: 'JPY' }
console.dir(searchPriceAndCode('2\'425.64 CHF')); // { price: 2425.64, code: 'CHF' }
```
