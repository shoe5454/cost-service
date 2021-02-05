const lambda = require('../../../../src/handlers/rest/generate-cost-file-upload-endpoint.js');
const s3 = require('aws-sdk/clients/s3');

describe('Test handler', function () {
    let createPresignedPostSpy;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => {
        // Mock dynamodb get and put methods 
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        createPresignedPostSpy = jest.spyOn(s3.prototype, 'createPresignedPost');
    });

    // Clean up mocks 
    afterAll(() => {
        createPresignedPostSpy.mockRestore();
    });

    // This test invokes handler() and compare the result  
    it('should generate signed post URL details', async () => {
        const signedPost = { url: 'https://url', fields: [] };

        // Return the specified value whenever the spied put function is called 
        createPresignedPostSpy.mockImplementation((params, callback) => {
            callback(null, signedPost);
        });

        const event = {
            httpMethod: 'POST',
            body: '{"id": "id1","name": "name1"}',
            requestContext: {
                authorizer: {
                    claims: {
                        'cognito:groups': "costs_admin"
                    }
                }
            }
        };
        const context = {
            awsRequestId: '123',
        }

        // Invoke handler() 
        const result = await lambda.handler(event, context);
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(signedPost),
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };

        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult);
    });
});
