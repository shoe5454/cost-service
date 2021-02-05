// Get the S3 bucket name from environment variables
const costFilesBucketName = process.env.COST_FILES_BUCKET;

const { CostData } = require('../../business/cost-data.business.js');
const fileStorageAdapter = require('../../adapters/file-storage.adapter.js');
const { expectHttpPost, extractUserPermissions, okResponse, errorResponse } = require('./security/gateway.js');

/**
 * Invoked from API Gateway. Requests a URL that the client can use to upload a cost CSV file
 */
exports.handler = async (event, context) => {
    expectHttpPost(event);

    console.info('received event:', event);
    console.info('received context:', context);

    // Business objects contains the bulk of the application logic
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

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
