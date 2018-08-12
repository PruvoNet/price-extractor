var fs = require('fs');
var currenciesFile = __dirname + '/currenciesSymbols.json';
var symbolToCodeFile = __dirname + '/symbolToCode.json';
var nativeSymbolToCodeFile = __dirname + '/nativeSymbolToCode.json';
var codeToSymbolFile = __dirname + '/codeToSymbol.json';

// https://gist.github.com/GoGross/19b254a4210d3d72b3dfc1e808116af3

var _ = require('underscore');
fs.readFile(currenciesFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var obj = JSON.parse(data);
  var symbolToCode = {};
  var codeToSymbol = {};
  var nativeSymbolToCode = {};
  _.map(obj, function (data) {
    if (symbolToCode[data.symbol]) {
      console.log('symbolToCode');
      console.log(symbolToCode[data.symbol]);
      console.log(data.symbol);
    }
    symbolToCode[data.symbol] = data.code;
    if (nativeSymbolToCode[data['symbol_native']]) {
      console.log('nativeSymbolToCode');
      console.log(nativeSymbolToCode[data['symbol_native']]);
      console.log(data['symbol_native']);
    }
    nativeSymbolToCode[data['symbol_native']] = data.code;
    if (codeToSymbol[data.code]) {
      console.log('codeToSymbol');
      console.log(codeToSymbol[data.code]);
      console.log(data.code);
    }
    codeToSymbol[data.code] = data.symbol;
  });
  delete nativeSymbolToCode['$'];
  nativeSymbolToCode['kr'] = '_____';
  nativeSymbolToCode['C$'] = '_____';
  symbolToCode["$CAD"] = "CAD";
  symbolToCode["A$"] = "AUD";
  symbolToCode["JP¥"] = "JPY";
  symbolToCode["₹"] = "INR";
  symbolToCode["CFPF"] = "XPF";
  fs.writeFile(symbolToCodeFile, JSON.stringify(symbolToCode, null, 2));
  fs.writeFile(nativeSymbolToCodeFile, JSON.stringify(nativeSymbolToCode, null, 2));
  fs.writeFile(codeToSymbolFile, JSON.stringify(codeToSymbol, null, 2));
});
