// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const costsTableName = process.env.COSTS_TABLE;
const costFilesBucketName = process.env.COST_FILES_BUCKET;

const costData = require('../../business/cost-data.business.js');
const fileStorageAdapter = require('../../adapters/file-storage.adapter.js');
const dataSourceAdapter = require('../../adapters/data-source.adapter.js');

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.handler = async (event, context) => {
    /*if (event.httpMethod !== 'GET') {
        throw new Error(`cost-file-uploaded only accepts GET method, you tried: ${event.httpMethod}`);
    }*/
    // All log statements are written to CloudWatch
    console.info('received:', event);
    console.info('received:', context);

    const result = await costData.costFileUploaded(
        new fileStorageAdapter.S3Adapter(costFilesBucketName),
        new dataSourceAdapter.DynamoDbAdapter(costsTableName)
    );

    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
