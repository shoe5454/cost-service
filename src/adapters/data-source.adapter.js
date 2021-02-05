const DynamoDB = require('aws-sdk/clients/dynamodb');
const dynamoDb = new DynamoDB();
const docClient = new DynamoDB.DocumentClient();
const { NotFoundError } = require('../errors/not-found.error.js');

/**
 * Encapsulates business operations with DynamoDb.
 */
exports.DynamoDbAdapter = class {
    constructor(costsTableName) {
        this.costsTableName = costsTableName;
    }

    /**
     * Return the costs data for a particular industry
     * @param {*} industry 
     */
    async getIndustryCostData(industry) {
        // Get the item from the table
        const params = {
            TableName: this.costsTableName,
            Key: { industry: industry },
        };
        const data = await docClient.get(params).promise();
        if (!data.Item)
            throw new NotFoundError();
        return data.Item.costData;
    }

    /**
     * Fully replace all existing cost data with fullCostData. All existing cost data items will be deleted prior
     * to the replace.
     * @param {*} fullCostData 
     */
    async replaceCostData(fullCostData) {
        // TODO make this transactional

        // Scanning + deleting is expensive. I delete the table and recreate.

        // Delete table. Ignore errors to make sure we don't leave the system in a state without a table
        try {
            const deleteParams = {
                TableName: this.costsTableName
            };
            await dynamoDb.deleteTable(deleteParams).promise();
            // Wait for table to really be deleted
            const waitParams = {
                TableName: this.costsTableName
            };
            await dynamoDb.waitFor('tableNotExists', waitParams).promise();

            console.log(`Deleted existing costs table`);
        } catch (e) {
            console.error(`Error deleting costs table`);
        }

        // Create table
        const createParams = {
            TableName: this.costsTableName,
            KeySchema: [
                { AttributeName: "industry", KeyType: "HASH" }, // partition key
            ],
            AttributeDefinitions: [
                { AttributeName: "industry", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 2
            }
        };
        await dynamoDb.createTable(createParams).promise();
        // Wait for table to really be created
        const waitParams = {
            TableName: this.costsTableName
        };
        await dynamoDb.waitFor('tableExists', waitParams).promise();
        console.log(`Created new costs table`);

        // Transform cost data to dynamo batch write syntax
        const batchWrite = this.transformCostDataToBatchWriteObject(fullCostData);
        // Store cost data
        // TODO there is a batch limit that will probably be hit in a real production system (https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html)
        await docClient.batchWrite(batchWrite).promise();

        console.log(`Cost data successfully replaced`);
    }

    /**
     * Convert the normalized cost data (fullCostData) into a batchWrite param object for DynamoDb
     * @param {*} fullCostData 
     */
    transformCostDataToBatchWriteObject(fullCostData) {
        //console.log(fullCostData);
        const tablePuts = Object.entries(fullCostData).map(entry => {
            return {
                PutRequest: {
                    Item: {
                        industry: entry[0],
                        costData: entry[1]
                    }
                }
            };
        });
        const requestItems = {
            RequestItems: {}
        };
        requestItems.RequestItems[this.costsTableName] = tablePuts;
        //console.log(requestItems);
        return requestItems;
    }
}