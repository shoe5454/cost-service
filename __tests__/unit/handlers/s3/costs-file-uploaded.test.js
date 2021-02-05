const lambda = require('../../../../src/handlers/s3/costs-file-uploaded.js');
const DynamoDB = require('aws-sdk/clients/dynamodb');

describe('Test handler', () => {
    let scanSpy;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => {
        // Mock dynamodb get and put methods 
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        scanSpy = jest.spyOn(DynamoDB.DocumentClient.prototype, 'scan');
    });

    // Clean up mocks 
    afterAll(() => {
        scanSpy.mockRestore();
    });

    it('should return ids', async () => {
        const items = [{ id: 'id1' }, { id: 'id2' }];

        // Return the specified value whenever the spied scan function is called 
        scanSpy.mockReturnValue({
            promise: () => Promise.resolve({ Items: items })
        });

        const event = {
            Records: []
        }

        // Invoke helloFromLambdaHandler() 
        const result = await lambda.handler(event);

        // TODO
        /*const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(items)
        };*/

        // Compare the result with the expected result 
        //expect(result).toEqual(expectedResult);
    });
}); 
