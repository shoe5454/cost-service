// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.COSTS_TABLE;

const calculateCost = require('../business/calculate-cost.business.js');
const dataSourceAdapter = require('../adapters/data-source.adapter.js');

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.handler = async (event) => {
  // All log statements are written to CloudWatch
  console.info('received:', event);

  const cost = await calculateCost.calculateCost(
    event.pathParameters.industry,
    event.pathParameters.monthlyTransactions,
    event.pathParameters.monthlyVolume,
    new dataSourceAdapter.DynamoDbAdapter(tableName)
  );

  const response = {
    statusCode: 200,
    body: cost
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
