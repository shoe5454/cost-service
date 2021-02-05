const fs = require('fs');
const { CostData } = require('../../../src/business/cost-data.business.js');
const { ValidationError } = require('../../../src/errors/validation.error.js');

describe('Test CostData', () => {
    let target;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => {
        target = new CostData(null);
    });

    test('normalizeCostsFile', async () => {
        const stream = fs.createReadStream('./__tests__/unit/business/cost-data-example.csv');
        const result = await target.normalizeCostsFile(stream);
        //console.log(result);

        // Verify TERMINAL prices
        expect(result['Bars/Taverns/Night Clubs'].TERMINAL).toBe('60.00');
        expect(result['Others'].TERMINAL).toBe('50.00');
        expect(result['Bakeries'].TERMINAL).toBe('50.00');
        expect(result['Charitable and Social Service Organizations'].TERMINAL).toBe('25.00');

        // Verify a sample of the TRANSACTION_VOLUME prices
        expect(result['Bars/Taverns/Night Clubs'].TRANSACTION_VOLUME['5000']).toBe('20.00');

        // Verify a sample of the TRANSACTION_COUNT prices
        expect(result['Bars/Taverns/Night Clubs'].TRANSACTION_COUNT['10']).toBe('10.00');
        expect(result['Others'].TRANSACTION_COUNT['100']).toBe('20.00');

        // Verify number of TRANSACTION_VOLUME price points for Others industry
        expect(Object.keys(result['Others'].TRANSACTION_VOLUME).length).toBe(3);
    });

});