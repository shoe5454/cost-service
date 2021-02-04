// Create clients and set shared const values outside of the handler.

// Get the S3 bucket name from environment variables
const costFilesBucketName = process.env.COST_FILES_BUCKET;

const costData = require('../../business/cost-data.business.js');
const fileStorageAdapter = require('../../adapters/file-storage.adapter.js');
const { authorizeCostsAdmin } = require('./security/cognito-authorize.js');
const { expectHttpPost } = require('./security/http-method-check.js');

/**
 * 
 */
exports.handler = async (event, context) => {
    authorizeCostsAdmin(event);
    expectHttpPost(event);

    // All log statements are written to CloudWatch
    console.info('received event:', event);
    console.info('received context:', context);

    const result = await costData.generateCostFileUploadEndpoint(
        context.awsRequestId,
        new fileStorageAdapter.S3Adapter(costFilesBucketName)
    );

    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
