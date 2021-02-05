// Create clients and set shared const values outside of the handler.

// Get the S3 bucket name from environment variables
const costFilesBucketName = process.env.COST_FILES_BUCKET;

const { CostData } = require('../../business/cost-data.business.js');
const fileStorageAdapter = require('../../adapters/file-storage.adapter.js');
const { expectHttpPost, extractUserPermissions, okResponse, errorResponse } = require('./security/gateway.js');

/**
 * 
 */
exports.handler = async (event, context) => {
    expectHttpPost(event);

    // All log statements are written to CloudWatch
    console.info('received event:', event);
    console.info('received context:', context);

    const business = new CostData(extractUserPermissions(event));
    let response;
    try {
        const result = await business.generateCostFileUploadEndpoint(
            context.awsRequestId,
            new fileStorageAdapter.S3Adapter(costFilesBucketName)
        );
        response = okResponse(result);
    } catch (e) {
        response = errorResponse(e);
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
