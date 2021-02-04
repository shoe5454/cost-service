// Create a client for interacting with DynamoDb
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.DynamoDbAdapter = class {
    constructor(costsTableName) {
        this.costsTableName = costsTableName;
    }
    async getIndustryCostData(industry) {
        // Get the item from the table
        const params = {
            TableName: this.costsTableName,
            Key: { id: industry },
        };
        const data = await docClient.get(params).promise();
        return data.Item;
    }
}