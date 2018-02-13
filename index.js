"use strict";
var fs = require('fs');
var symbolToCodeFile = __dirname + '/symbolToCode.json';
var codeToSymbolFile = __dirname + '/codeToSymbol.json';
var nativeSymbolToCodeFile = __dirname + '/nativeSymbolToCode.json';
var symbolToCode = JSON.parse(fs.readFileSync(symbolToCodeFile));
var nativeSymbolToCode = JSON.parse(fs.readFileSync(nativeSymbolToCodeFile));
var codeToSymbol = JSON.parse(fs.readFileSync(codeToSymbolFile));
var unicodeRegex = /&#(x?[0-9a-fA-F]+);/;
var regexReplace = /[0-9,\-\.\s]/g;
var priceRegex = /(\d{1,3}(,?\d{3})*(\.\d+)?)/;
var priceRegex2 = /(\d{1,3}(\.?\d{3})*(,\d+)?)/;

module.exports = {
  searchCode: searchCode,
  searchPriceAndCode: searchPriceAndCode
};

function searchCode(moneyStr, fallbackCode) {
  return _searchCodeAndStrip(moneyStr, fallbackCode).code;
}

function getPriceNumber(str) {
  var price;
  var regex = str.match(priceRegex);
  if (regex && regex[0] === str) {
    price = Number(regex[1].replace(/,/g, "").trim());
  }
  if (!price && price !== 0) {
    regex = str.match(priceRegex2);
    if (regex && regex[0] === str) {
      price = Number(regex[1].replace(/\./g, "").replace(/,/g, ".").trim());
    }
  }
  return price;
}
function searchPriceAndCode(moneyStr, fallbackCode) {
  var raw = _searchCodeAndStrip(moneyStr, fallbackCode);
  var code = raw.code;
  var str = raw.str;
  var price = getPriceNumber(str);
  if (!price && price !== 0 && str.match(/\s/)) {
    var tmpStr = str.replace(/\s/g, '.');
    price = getPriceNumber(tmpStr);
  }
  if (!price && price !== 0 && str.match(/\s/)) {
    var tmpStr = str.replace(/\s/g, ',');
    price = getPriceNumber(tmpStr);
  }
  if (price || price === 0) {
    return {price: price, code: code};
  }
  return {};
}

function _searchCodeAndStrip(moneyStr, fallbackCode) {
  var res = {};
  var str = moneyStr;
  var toCheck = moneyStr;
  var regex = toCheck.match(unicodeRegex);
  if (regex) {
    str = str.replace(unicodeRegex, '').trim();
    var code = regex[1].toLowerCase();
    toCheck = String.fromCharCode(code[0] === "x" ? parseInt(code.substr(1), 16) : parseInt(code, 10));
  }
  toCheck = toCheck.replace(regexReplace, "").trim();
  var code = symbolToCode[toCheck];
  if (code) {
    res.code = code;
    res.str = str.replace(toCheck, '').trim();
    if (toCheck.indexOf('$') === 0 && toCheck.length > 1) {
      res.str = res.str.replace(toCheck.substr(1), '').replace('$', '').trim();
    }
    return res;
  }
  code = nativeSymbolToCode[toCheck];
  if (code === '_____') {
    if (fallbackCode) {
      return _searchCodeAndStrip(str.replace(toCheck, fallbackCode).trim());
    } else {
      code = undefined;
    }
  }
  if (code) {
    res.code = code;
    res.str = str.replace(toCheck, '').trim();
    return res;
  }
  if (toCheck in codeToSymbol) {
    res.code = toCheck;
    res.str = str.replace(toCheck, '').trim();
    return res;
  }
  res.str = moneyStr;
  return res;
}
