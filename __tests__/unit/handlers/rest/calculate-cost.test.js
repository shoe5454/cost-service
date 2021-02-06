const lambda = require('../../../../src/handlers/rest/calculate-cost.js');
const DynamoDB = require('aws-sdk/clients/dynamodb');

describe('Test handler', () => {
    let getSpy;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => {
        // Mock dynamodb get method
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        getSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'get');
    });

    // Clean up mocks 
    afterAll(() => {
        getSpy.mockRestore();
    });

    // This test invokes handler() and compare the result  
    it('should calculate cost', async () => {
        const item = {
            costData: {
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
            }
        };

        // Return the specified value whenever the spied get function is called 
        getSpy.mockReturnValue({
            promise: () => Promise.resolve({ Item: item })
        });

        const event = {
            httpMethod: 'GET',
            pathParameters: {
                industry: 'Bakeries',
                monthlyTransactions: 1000,
                monthlyVolume: 10000.00,
            },
            requestContext: {
                authorizer: {
                    claims: {
                        'cognito:groups': "sales_rep"
                    }
                }
            }
        }

        // Invoke handler() 
        const result = await lambda.handler(event);

        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(69.08),
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };

        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult);
    });
});