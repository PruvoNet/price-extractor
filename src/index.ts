'use strict';

import * as symbolToCodeRaw from './symbolToCode.json';
import * as nativeSymbolToCodeRaw from './nativeSymbolToCode.json';
import * as codeToSymbolRaw from './codeToSymbol.json';
import * as currenciesFileRaw from './currenciesSymbols.json';

type Json = Record<string, string | undefined>;

interface ICurrency {
    'symbol': string;
    'name': string;
    'symbol_native': string;
    'decimal_digits': number;
    'rounding': number;
    'code': string;
    'name_plural': string;
    'decimal_separator'?: string;
}

const currencies: Record<string, ICurrency | undefined> = currenciesFileRaw;
const symbolToCode: Json = symbolToCodeRaw;
const nativeSymbolToCode: Json = nativeSymbolToCodeRaw;
const codeToSymbol: Json = codeToSymbolRaw;

const unicodeRegex = /&#(x?[0-9a-fA-F]+);/;
const regexReplace = /[0-9,'_\-.\s]/g;
const dotDecimalRegex = /^(\d{1,3}(,?\d{3})*(\.\d{1,2})?)$/; // dot decimal separator
const longDotDecimalRegex = /^(\d{1,3}(,?\d{3})*(\.\d{1,3})?)$/; // dot decimal separator
const commaDecimalRegex = /^(\d{1,3}(\.?\d{3})*(,\d{1,2})?)$/; // comma decimal separator
const longCommaDecimalRegex = /^(\d{1,3}(\.?\d{3})*(,\d{1,3})?)$/; // comma decimal separator

const getPriceNumber = (str: string, currency: ICurrency | undefined): number => {
    let price: number = Number.NaN;
    let match: RegExpMatchArray | null;
    if (currency && currency.decimal_digits === 3) {
        if (currency.decimal_separator === ',') {
            match = str.match(longCommaDecimalRegex);
            if (match && match[0] === str) {
                price = parseFloat(match[1].replace(/\./g, '').replace(/,/g, '.').trim());
            }
        } else {
            match = str.match(longDotDecimalRegex);
            if (match && match[0] === str) {
                price = parseFloat(match[1].replace(/,/g, '').trim());
            }
        }
    } else {
        match = str.match(dotDecimalRegex);
        if (match && match[0] === str) {
            price = parseFloat(match[1].replace(/,/g, '').trim());
        }
        if (isNaN(price)) {
            match = str.match(commaDecimalRegex);
            if (match && match[0] === str) {
                price = parseFloat(match[1].replace(/\./g, '').replace(/,/g, '.').trim());
            }
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
    // Remove custom thousands separator
    const str = raw.str.replace(/\s/g, '').replace(/'/g, '').replace(/_/g, '');
    const price = getPriceNumber(str, currencies[code || 'foo']);
    if (price || price === 0) {
        return {price, code};
    }
    return {};
};
