# price-extractor

A small library for parsing price strings in order to extract the price as a number and the currency code of the price.

Examples
---------
```javascript
const extractor = require("price-extractor").searchPriceAndCode;
console.dir(extractor("99,01€"));
// { price: 99.01, code: 'EUR' }
```

```javascript
const extractor = require("price-extractor").searchPriceAndCode;
console.dir(extractor("ARS 1,647.86"));
// { price: 1647.86, code: 'ARS' }
```

```javascript
const extractor = require("price-extractor").searchPriceAndCode;
console.dir(extractor("1.958,43 NOK"));
// { price: 1958.43, code: 'NOK' }
```

```javascript
const extractor = require("price-extractor").searchPriceAndCode;
console.dir(extractor("￥732.62"));
// { price: 732.62, code: 'JPY' }
```
