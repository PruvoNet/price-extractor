'use strict';

import {expect} from 'chai';
import {searchPriceAndCode, searchCode, getCodeToSymbol} from '../';

describe('price extractor', () => {

    it('parse number with space cents', () => {
        const res = searchPriceAndCode('1899 01 €');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1899.01);
    });

    it('parse euro with , cents', () => {
        const res = searchPriceAndCode('99,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(99.01);
    });

    it('parse euro with multiple , thousands', () => {
        const res = searchPriceAndCode('999,091€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(999091);
    });

    it('parse euro with multiple . thousands', () => {
        const res = searchPriceAndCode('999.091€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(999091);
    });

    it('parse euro with , cents no thousands', () => {
        const res = searchPriceAndCode('1999,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999.01);
    });

    it('parse euro with , cents with . thousands', () => {
        const res = searchPriceAndCode('1.999,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999.01);
    });

    it('parse euro with , cents', () => {
        const res = searchPriceAndCode('99,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(99.01);
    });

    it('parse euro with , cents no thousands', () => {
        const res = searchPriceAndCode('1999,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999.01);
    });

    it('parse euro with , cents with . thousands', () => {
        const res = searchPriceAndCode('1.999,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999.01);
    });

    it('parse euro with space thousnads . cents', () => {
        const res = searchPriceAndCode('1 999.01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999.01);
    });

    it('parse euro with multiple space thousnads . cents', () => {
        const res = searchPriceAndCode('991 999.01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(991999.01);
    });

    it('parse euro with space thousnads , cents', () => {
        const res = searchPriceAndCode('1 999,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999.01);
    });

    it('parse euro with multiple space thousnads , cents', () => {
        const res = searchPriceAndCode('991 999,01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(991999.01);
    });

    it('parse euro with space thousnads no cents', () => {
        const res = searchPriceAndCode('1 999€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999);
    });

    it('parse CHF with \' thousnads no cents', () => {
        const res = searchPriceAndCode('1\'999€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999);
    });

    it('parse CHF with multiple \' thousnads no cents', () => {
        const res = searchPriceAndCode('991\'999€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(991999);
    });

    it('parse CHF with \' thousnads . cents', () => {
        const res = searchPriceAndCode('1\'999.01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(1999.01);
    });

    it('parse CHF with \' thousnads . cents', () => {
        const res = searchPriceAndCode('991\'999.01€');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(991999.01);
    });

    it('parse with native symbol', () => {
        const res = searchPriceAndCode('99,01؋');
        expect(res.code).to.eql('AFN');
        expect(res.price).to.eql(99.01);
    });

    it('parse currency with multiple identical native symbols no fallback', () => {
        const res = searchPriceAndCode('99,01kr');
        expect(res.code).to.eql(undefined);
        expect(res.price).to.eql(undefined);
    });

    it('parse currency with multiple identical native symbols with fallback', () => {
        const res = searchPriceAndCode('99,01kr', 'USD');
        expect(res.code).to.eql('USD');
        expect(res.price).to.eql(99.01);
    });

    it('search code works', () => {
        const res = searchCode('99,01€');
        expect(res).to.eql('EUR');
    });

    it('get codes works', () => {
        const res = getCodeToSymbol();
        expect(res.EUR).to.eql('€');
    });

    it('parse euro in unicode', () => {
        const res = searchPriceAndCode('99,01&#8364;');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(99.01);
    });

    it('parse euro in unicode hex', () => {
        const res = searchPriceAndCode('99,01&#x20AC;');
        expect(res.code).to.eql('EUR');
        expect(res.price).to.eql(99.01);
    });

    it('parse currency that has $ first in symbol', () => {
        const res = searchPriceAndCode('99,01 $CAD');
        expect(res.code).to.eql('CAD');
        expect(res.price).to.eql(99.01);
    });

    it('parse left most symbol with . cents', () => {
        const res = searchPriceAndCode('ARS 1,647.86');
        expect(res.code).to.eql('ARS');
        expect(res.price).to.eql(1647.86);
    });

});
