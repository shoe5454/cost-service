const { DynamoDbAdapter } = require('../../../src/adapters/data-source.adapter.js');

describe('Test DynamoDbAdapter', () => {
    let target;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => {
        target = new DynamoDbAdapter('TABLE');
    });

    test('replaceCostData', async () => {
        let result;

        //result = await target.replaceCostData({});
        // TODO
    });

    test('transformCostDataToBatchWriteObject 01', () => {
        const result = target.transformCostDataToBatchWriteObject({
            'Bars/Taverns/Night Clubs': {
                TRANSACTION_COUNT: { '10': '10.00', '30000': '0.00', '100000': '0.00' },
                TRANSACTION_VOLUME: {
                    '5000': '20.00',
                    '10000': '10.00',
                    '100000': '0.00',
                    '10000000': '0.00'
                },
                TERMINAL: '60.00'
            },
            Others: {
                TRANSACTION_COUNT: { '100': '20.00', '25000': '0.00', '1000000': '0.00' },
                TRANSACTION_VOLUME: { '5000': '20.00', '100000': '0.00', '100000000': '0.00' },
                TERMINAL: '50.00'
            },
            Bakeries: {
                TRANSACTION_COUNT: {
                    '100': '10.00',
                    '5000': '5.00',
                    '25000': '0.00',
                    '1000000': '0.00'
                },
                TRANSACTION_VOLUME: {
                    '5000': '20.00',
                    '10000': '10.00',
                    '100000': '0.00',
                    '10000000': '0.00'
                },
                TERMINAL: '50.00'
            },
            'Charitable and Social Service Organizations': {
                TRANSACTION_COUNT: { '10': '10.00', '1000': '0.00', '1000000': '0.00' },
                TRANSACTION_VOLUME: { '1000': '10.00', '50000': '0.00', '10000000': '0.00' },
                TERMINAL: '25.00'
            }
        });
        expect(result.RequestItems.TABLE.length).toBe(4);
        expect(result.RequestItems.TABLE[0].PutRequest.Item.industry).toBe('Bars/Taverns/Night Clubs');
    });

});