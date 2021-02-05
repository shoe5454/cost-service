// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const costsTableName = process.env.COSTS_TABLE;

const { CostData } = require('../../business/cost-data.business.js');
const fileStorageAdapter = require('../../adapters/file-storage.adapter.js');
const dataSourceAdapter = require('../../adapters/data-source.adapter.js');

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.handler = async (event) => {
    // All log statements are written to CloudWatch
    console.info('received event:', event);

    const business = new CostData(null);

    for (const record of event.Records) {
        // TODO use Promise.all
        const result = await business.costsFileUploaded(
            record.s3.object.key,
            new fileStorageAdapter.S3Adapter(record.s3.bucket.name),
            new dataSourceAdapter.DynamoDbAdapter(costsTableName)
        );

        // TODO delete file
    }
}
