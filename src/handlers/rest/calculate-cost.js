// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const costsTableName = process.env.COSTS_TABLE;

const { CalculateCost } = require('../../business/calculate-cost.business.js');
const dataSourceAdapter = require('../../adapters/data-source.adapter.js');
const { expectHttpGet, extractUserPermissions, okResponse, errorResponse } = require('./security/gateway.js');

/**
 * 
 */
exports.handler = async (event) => {
  expectHttpGet(event);

  // All log statements are written to CloudWatch
  console.info('received event:', event);

  const business = new CalculateCost(extractUserPermissions(event));
  let response;
  try {
    const cost = await business.calculateCost(
      event.pathParameters.industry,
      event.pathParameters.monthlyTransactions,
      event.pathParameters.monthlyVolume,
      new dataSourceAdapter.DynamoDbAdapter(costsTableName)
    );
    response = okResponse(cost);
  } catch (e) {
    response = errorResponse(e);
  }

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
