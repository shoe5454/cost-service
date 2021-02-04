
exports.S3Adapter = class {
    constructor(bucketName) {
        this.bucketName = bucketName;
    }
    /*async getIndustryCostData(industry) {
        // Get the item from the table
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
        var params = {
            TableName: this.tableName,
            Key: { id: industry },
        };
        const data = await docClient.get(params).promise();
        return data.Item;
    }*/
}