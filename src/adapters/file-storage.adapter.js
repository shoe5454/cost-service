// Create a client for interacting with S3
const s3 = require('aws-sdk/clients/s3');
const s3Client = new s3();

/**
 * Encapsulates business operations with S3.
 */
exports.S3Adapter = class {
    constructor(costFilesBucketName) {
        this.costFilesBucketName = costFilesBucketName;
    }

    /**
     * Generate a presigned POST URL for uploading the costs CSV file directly to S3
     * @param {*} key 
     * @returns details that the client can use to POST the CSV file to S3
     */
    async generateCostsFileUploadUrl(key) {
        const params = {
            Bucket: this.costFilesBucketName,
            Fields: {
                key,
                acl: 'private',
            },
            Expires: 30, // Seconds before presigned POST expires
        };
        const presignedPostResult = await this.createPresignedPostPromise(params);
        return presignedPostResult;
    }

    /**
     * Returns the costs file contents identified by key from S3 as a stream
     * @param {*} key 
     */
    getCostsFile(key) {
        var params = {
            Bucket: this.costFilesBucketName,
            Key: key
        };
        return s3Client.getObject(params).createReadStream();
    }

    /**
     * AWS SDK v2's createPresignedPost only supports callbacks, so this converts the callback signature to a promise
     * @param {*} params 
     */
    createPresignedPostPromise(params) {
        return new Promise((resolve, reject) => {
            s3Client.createPresignedPost(params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        });
    }
}