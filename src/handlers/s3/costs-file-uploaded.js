// Get the DynamoDB table name from environment variables
const costsTableName = process.env.COSTS_TABLE;

const { CostData } = require('../../business/cost-data.business.js');
const fileStorageAdapter = require('../../adapters/file-storage.adapter.js');
const dataSourceAdapter = require('../../adapters/data-source.adapter.js');

/**
 * Invoked when a cost CSV file has been fully uploaded
 */
exports.handler = async (event) => {
    console.info('received event:', event);

    // Business objects contains the bulk of the application logic
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
