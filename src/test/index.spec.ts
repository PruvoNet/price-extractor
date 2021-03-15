'use strict';

import {expect} from 'chai';
import {searchPriceAndCode, searchCode, getCodeToSymbol} from '../';

describe('price extractor', () => {

    describe('3 decimal digits', () => {
        describe(', cents no thousands 3 decimal digits', () => {
            it('fail tp parse TND with , cents no thousands 3 decimal digits and bad number', () => {
                const res = searchPriceAndCode('9D9,00T');
                expect(res.code).to.eql(undefined);
                expect(res.price).to.eql(undefined);
            });

            it('parse TND with , cents no thousands 3 decimal digits', () => {
                const res = searchPriceAndCode('99,001DT');
                expect(res.code).to.eql('TND');
                expect(res.price).to.eql(99.001);
            });

            it('parse no currency with , cents no thousands 3 decimal digits', () => {
                const res = searchPriceAndCode('99,010');
                expect(res.code).to.eql(undefined);
                expect(res.price).to.eql(99010);
            });

            it('parse JOD with , cents no thousands 3 decimal digits', () => {
                const res = searchPriceAndCode('99,010JD');
                expect(res.code).to.eql('JOD');
                expect(res.price).to.eql(99010);
            });
        });

        describe('. cents no thousands 3 decimal digits', () => {

            it('fail tp parse JOD with , cents no thousands 3 decimal digits and bad number', () => {
                const res = searchPriceAndCode('9J9,00D');
                expect(res.code).to.eql(undefined);
                expect(res.price).to.eql(undefined);
            });

            it('parse JOD with . cents no thousands 3 decimal digits', () => {
                const res = searchPriceAndCode('99.001JD');
                expect(res.code).to.eql('JOD');
                expect(res.price).to.eql(99.001);
            });

            it('fail to parse no currency with . cents no thousands 3 decimal digits', () => {
                const res = searchPriceAndCode('99.010');
                expect(res.code).to.eql(undefined);
                expect(res.price).to.eql(99010);
            });

            it('parse TND with . cents no thousands 3 decimal digits', () => {
                const res = searchPriceAndCode('99.010DT');
                expect(res.code).to.eql('TND');
                expect(res.price).to.eql(99010);
            });
        });
    });

    describe(', cents no thousands 2 decimal digits', () => {
        it('parse zloti with , cents no thousands 2 decimal digits', () => {
            const res = searchPriceAndCode('99,01zł');
            expect(res.code).to.eql('PLN');
            expect(res.price).to.eql(99.01);
        });

        it('parse no currency with , cents no thousands 2 decimal digits', () => {
            const res = searchPriceAndCode('99,01');
            expect(res.code).to.eql(undefined);
            expect(res.price).to.eql(99.01);
        });

        it('not fail to parse euro with , cents no thousands 2 decimal digits', () => {
            const res = searchPriceAndCode('99,01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(99.01);
        });
    });

    describe('. cents no thousands 2 decimal digits', () => {
        it('parse euro with , cents no thousands 2 decimal digits', () => {
            const res = searchPriceAndCode('99,01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(99.01);
        });

        it('parse no currency with . cents no thousands 2 decimal digits', () => {
            const res = searchPriceAndCode('99.01');
            expect(res.code).to.eql(undefined);
            expect(res.price).to.eql(99.01);
        });

        it('fail to parse zloti with . cents no thousands 2 decimal digits', () => {
            const res = searchPriceAndCode('99.01zł');
            expect(res.code).to.eql('PLN');
            expect(res.price).to.eql(99.01);
        });
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

    describe('space thousands separator', () => {
        it('parse euro with space thousands . cents', () => {
            const res = searchPriceAndCode('1 999.01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(1999.01);
        });

        it('parse euro with multiple space thousands . cents', () => {
            const res = searchPriceAndCode('992 991 999.01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(992991999.01);
        });

        it('parse euro with space thousands , cents', () => {
            const res = searchPriceAndCode('1 999,01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(1999.01);
        });

        it('parse euro with multiple space thousands , cents', () => {
            const res = searchPriceAndCode('992 991 999,01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(992991999.01);
        });

        it('parse euro with space thousands no cents', () => {
            const res = searchPriceAndCode('1 999€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(1999);
        });
    });

    describe('_ thousands separator', () => {
        it('parse euro with _ thousands . cents', () => {
            const res = searchPriceAndCode('1_999.01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(1999.01);
        });

        it('parse euro with multiple _ thousands . cents', () => {
            const res = searchPriceAndCode('992_991_999.01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(992991999.01);
        });

        it('parse euro with _ thousands , cents', () => {
            const res = searchPriceAndCode('1_999,01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(1999.01);
        });

        it('parse euro with multiple _ thousands , cents', () => {
            const res = searchPriceAndCode('992_991 999,01€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(992991999.01);
        });

        it('parse euro with _ thousands no cents', () => {
            const res = searchPriceAndCode('1_999€');
            expect(res.code).to.eql('EUR');
            expect(res.price).to.eql(1999);
        });
    });

    describe('\' thousands separator', () => {
        it('parse CHF with \' thousands . cents', () => {
            const res = searchPriceAndCode('1\'999.01 CHF');
            expect(res.code).to.eql('CHF');
            expect(res.price).to.eql(1999.01);
        });

        it('parse CHF with multiple \' thousands . cents', () => {
            const res = searchPriceAndCode('992\'991\'999.01 CHF');
            expect(res.code).to.eql('CHF');
            expect(res.price).to.eql(992991999.01);
        });

        it('parse CHF with \' thousands , cents', () => {
            const res = searchPriceAndCode('1\'999,01 CHF');
            expect(res.code).to.eql('CHF');
            expect(res.price).to.eql(1999.01);
        });

        it('parse CHF with multiple \' thousands , cents', () => {
            const res = searchPriceAndCode('992\'991\'999,01 CHF');
            expect(res.code).to.eql('CHF');
            expect(res.price).to.eql(992991999.01);
        });

        it('parse CHF with \' thousands no cents', () => {
            const res = searchPriceAndCode('1\'999 CHF');
            expect(res.code).to.eql('CHF');
            expect(res.price).to.eql(1999);
        });
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

    it('should parse usd properly', () => {
        const res = searchPriceAndCode('$515.37');
        expect(res.code).to.eql('USD');
        expect(res.price).to.eql(515.37);
    });

});
