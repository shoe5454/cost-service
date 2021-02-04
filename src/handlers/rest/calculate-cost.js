// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const costsTableName = process.env.COSTS_TABLE;

const calculateCost = require('../../business/calculate-cost.business.js');
const dataSourceAdapter = require('../../adapters/data-source.adapter.js');
const { authorizeSalesRepOrCostsAdmin } = require('./security/cognito-authorize.js');
const { expectHttpGet } = require('./security/http-method-check.js');

/**
 * 
 */
exports.handler = async (event) => {
  authorizeSalesRepOrCostsAdmin(event);
  expectHttpGet(event);

  // All log statements are written to CloudWatch
  console.info('received:', event);

  const cost = await calculateCost.calculateCost(
    event.pathParameters.industry,
    event.pathParameters.monthlyTransactions,
    event.pathParameters.monthlyVolume,
    new dataSourceAdapter.DynamoDbAdapter(costsTableName)
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify({ cost }),
    headers: { 'Access-Control-Allow-Origin': '*' }
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
