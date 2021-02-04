// Create clients and set shared const values outside of the handler.

// Get the S3 bucket name from environment variables
const bucketName = process.env.COST_FILES_BUCKET_NAME;

const costData = require('../business/cost-data.business.js');

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`generate-cost-file-upload-endpoint only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body)
    const id = body.id;
    const name = body.name;

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    /*var params = {
        TableName: tableName,
        Item: { id: id, name: name }
    };*/

    const result = await costData.generateCostFileUploadEndpoint(
        new fileStorageAdapter.S3Adapter(bucketName)
    );

    //const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
