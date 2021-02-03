// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.DynamoDbAdapter = class {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async getIndustryCostData(industry) {
        // Get the item from the table
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
        var params = {
            TableName: this.tableName,
            Key: { id: industry },
        };
        const data = await docClient.get(params).promise();
        return data.Item;
    }
}