'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'underscore';
import * as currenciesFileRaw from '../currenciesSymbols.json';

const symbolToCodeFile = path.join(__dirname, '..', '..', 'src', 'symbolToCode.json');
const nativeSymbolToCodeFile = path.join(__dirname, '..', '..', 'src', 'nativeSymbolToCode.json');
const codeToSymbolFile = path.join(__dirname, '..', '..', 'src', 'codeToSymbol.json');

// original list was taken from https://gist.github.com/GoGross/19b254a4210d3d72b3dfc1e808116af3

interface ICurrency {
    'symbol': string;
    'name': string;
    'symbol_native': string;
    'decimal_digits': number;
    'rounding': number;
    'code': string;
    'name_plural': string;
}

type Json = Record<string, string | undefined>;

const currencies: ICurrency[] = currenciesFileRaw;
const symbolToCode: Json = {};
const codeToSymbol: Json = {};
const nativeSymbolToCode: Json = {};
_.map(currencies, (currency) => {
    if (symbolToCode[currency.symbol]) {
        console.log('symbolToCode');
        console.log(symbolToCode[currency.symbol]);
        console.log(currency.symbol);
    }
    symbolToCode[currency.symbol] = currency.code;
    if (nativeSymbolToCode[currency.symbol_native]) {
        console.log('nativeSymbolToCode');
        console.log(nativeSymbolToCode[currency.symbol_native]);
        console.log(currency.symbol_native);
    }
    nativeSymbolToCode[currency.symbol_native] = currency.code;
    if (codeToSymbol[currency.code]) {
        console.log('codeToSymbol');
        console.log(codeToSymbol[currency.code]);
        console.log(currency.code);
    }
    codeToSymbol[currency.code] = currency.symbol;
});
delete nativeSymbolToCode.$;
delete symbolToCode.Br;
symbolToCode.$ = 'USD';
nativeSymbolToCode.kr = '_____';
nativeSymbolToCode.C$ = '_____';
nativeSymbolToCode.Br = '_____';
symbolToCode.$CAD = 'CAD';
symbolToCode.A$ = 'AUD';
symbolToCode['JP¥'] = 'JPY';
symbolToCode['₹'] = 'INR';
symbolToCode.CFPF = 'XPF';
fs.writeFileSync(symbolToCodeFile, JSON.stringify(symbolToCode, Object.keys(symbolToCode).sort(), 2));
fs.writeFileSync(nativeSymbolToCodeFile, JSON.stringify(nativeSymbolToCode, Object.keys(nativeSymbolToCode).sort(), 2));
fs.writeFileSync(codeToSymbolFile, JSON.stringify(codeToSymbol, Object.keys(codeToSymbol).sort(), 2));
