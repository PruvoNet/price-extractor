const extractor = require("./../index").searchPriceAndCode;

console.dir(extractor("99,01€"));
console.dir(extractor("ARS 1,647.86"));
console.dir(extractor("ARS 1647.86"));
console.dir(extractor("1.958,43 NOK"));
console.dir(extractor("1958,43 NOK"));
console.dir(extractor("￥732.62"));
console.dir(extractor("2'425.64 CHF"));
console.dir(extractor("L410,400"));
