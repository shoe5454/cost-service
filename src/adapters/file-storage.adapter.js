// Create a client for interacting with S3
const s3 = require('aws-sdk/clients/s3');
const s3Client = new s3();

exports.S3Adapter = class {
    constructor(costFilesBucketName) {
        this.costFilesBucketName = costFilesBucketName;
    }
    async generateUploadUrl(key) {
        const params = {
            Bucket: this.costFilesBucketName,
            Fields: {
                key,
                acl: 'private',
            },
            Expires: 30, // Seconds before presigned POST expires
        };
        const presignedPost = await this.createPresignedPostPromise(params);
        return presignedPost;
    }
    async getFile(key) {
        // TODO
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