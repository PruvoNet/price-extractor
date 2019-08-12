'use strict';

import * as symbolToCodeRaw from './symbolToCode.json';
import * as nativeSymbolToCodeRaw from './nativeSymbolToCode.json';
import * as codeToSymbolRaw from './codeToSymbol.json';

type Json = Record<string, string | undefined>;

const symbolToCode: Json = symbolToCodeRaw;
const nativeSymbolToCode: Json = nativeSymbolToCodeRaw;
const codeToSymbol: Json = codeToSymbolRaw;

// List of formats - https://www.thefinancials.com/Default.aspx?SubSectionID=curformat

const unicodeRegex = /&#(x?[0-9a-fA-F]+);/;
const regexReplace = /[0-9,'\-.\s]/g;
const priceRegex = /^(\d{1,3}(,?\d{3})*(\.\d{1,2})?)$/;
const priceRegex2 = /^(\d{1,3}(\.?\d{3})*(,\d{1,2})?)$/;
const priceRegex3 = /^(\d{1,3}('?\d{3})*(\.\d{1,2})?)$/;

const getPriceNumber = (str: string): number => {
    let price: number = Number.NaN;
    let regex = str.match(priceRegex);
    if (regex && regex[0] === str) {
        price = parseFloat(regex[1].replace(/,/g, '').trim());
    }
    if (isNaN(price)) {
        regex = str.match(priceRegex2);
        if (regex && regex[0] === str) {
            price = parseFloat(regex[1].replace(/\./g, '').replace(/,/g, '.').trim());
        }
    }
    if (isNaN(price)) {
        regex = str.match(priceRegex3);
        if (regex && regex[0] === str) {
            price = parseFloat(regex[1].replace(/'/g, '').trim());
        }
    }
    return price;
};

export interface ICodeResult {
    code?: string;
    str: string;
}

const searchCodeAndStrip = (moneyStr: string, fallbackCode?: string): ICodeResult => {
    let str = moneyStr;
    let toCheck = moneyStr;
    const regex = toCheck.match(unicodeRegex);
    if (regex) {
        str = str.replace(unicodeRegex, '').trim();
        const unicode = regex[1].toLowerCase();
        toCheck = String.fromCharCode(unicode[0] === 'x' ? parseInt(unicode.substr(1), 16) :
            parseInt(unicode, 10));
    }
    toCheck = toCheck.replace(regexReplace, '').trim();
    let code = symbolToCode[toCheck];
    if (code) {
        str = str.replace(toCheck, '').trim();
        if (toCheck.indexOf('$') === 0 && toCheck.length > 1) {
            str = str.replace(toCheck.substr(1), '').replace('$', '').trim();
        }
        return {code, str};
    }
    code = nativeSymbolToCode[toCheck];
    if (code === '_____') {
        if (fallbackCode) {
            return searchCodeAndStrip(str.replace(toCheck, fallbackCode).trim());
        }
        code = undefined;
    }
    if (code) {
        return {code, str: str.replace(toCheck, '').trim()};
    }
    if (toCheck in codeToSymbol) {
        return {code: toCheck, str: str.replace(toCheck, '').trim()};
    }
    return {str: moneyStr};
};

export interface IExtractResult {
    code?: string;
    price?: number;
}

export const getCodeToSymbol = (): Json => {
    return Object.assign({}, codeToSymbol);
};

export const searchCode = (moneyStr: string, fallbackCode?: string): string | undefined => {
    return searchCodeAndStrip(moneyStr, fallbackCode).code;
};

export const searchPriceAndCode = (moneyStr: string, fallbackCode?: string): IExtractResult => {
    const raw = searchCodeAndStrip(moneyStr, fallbackCode);
    const code = raw.code;
    const str = raw.str;
    let price = getPriceNumber(str);
    if (isNaN(price) && str.match(/\s/)) {
        const tmpStr = str.replace(/\s/g, '.');
        price = getPriceNumber(tmpStr);
    }
    if (isNaN(price) && str.match(/\s/)) {
        const tmpStr = str.replace(/\s/g, ',');
        price = getPriceNumber(tmpStr);
    }
    if (price || price === 0) {
        return {price, code};
    }
    return {};
};
