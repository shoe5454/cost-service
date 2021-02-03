const target = require('../../../src/business/calculate-cost.business.js');
const { ValidationError } = require('../../../src/errors/validation.error.js');

test('linearInterpolation', () => {
    let result;

    result = target.linearInterpolation(1000, 100, 10.00, 5000, 5.00);
    expect(result).toBe(9.08);

    result = target.linearInterpolation(100, 100, 10.00, 5000, 5.00);
    expect(result).toBe(10.00);

    result = target.linearInterpolation(5000, 100, 10.00, 5000, 5.00);
    expect(result).toBe(5.00);
});

test('interpolateCost', () => {
    let costDataPoints = {};
    let result;

    expect(() => {
        target.interpolateCost(costDataPoints, 0);
    }).toThrowError(ValidationError);

    costDataPoints = {
        100: 10.00,
        5000: 5.00,
        25000: 0.00,
        1000000: 0.00,
    };
    expect(() => {
        target.interpolateCost(costDataPoints, 0);
    }).toThrowError(ValidationError);

    result = target.interpolateCost(costDataPoints, 100);
    expect(result).toBe(10.00);

    result = target.interpolateCost(costDataPoints, 5000);
    expect(result).toBe(5.00);

    expect(() => {
        target.interpolateCost(costDataPoints, 1000001);
    }).toThrowError(ValidationError);

    result = target.interpolateCost(costDataPoints, 1000);
    expect(result).toBe(9.08);
});

test('calculateCostFromIndustryCostData Bakeries example', () => {
    const industryCostData = {
        TERMINAL: 50.00,
        TRANSACTION_COUNT: {
            100: 10.00,
            5000: 5.00,
            25000: 0.00,
            1000000: 0.00,
        },
        TRANSACTION_VOLUME: {
            5000: 20.00,
            10000: 10.00,
            100000: 0.00,
            10000000: 0.00,
        }
    };

    const result = target.calculateCostFromIndustryCostData(industryCostData, 1000, 10000.00);

    // Compare the result with the expected result 
    expect(result).toBe(69.08);
});