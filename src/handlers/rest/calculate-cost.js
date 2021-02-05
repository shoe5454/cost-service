// Get the DynamoDB table name from environment variables
const costsTableName = process.env.COSTS_TABLE;

const { CalculateCost } = require('../../business/calculate-cost.business.js');
const dataSourceAdapter = require('../../adapters/data-source.adapter.js');
const { expectHttpGet, extractUserPermissions, okResponse, errorResponse } = require('./security/gateway.js');

/**
 * Invoked from API Gateway. Calculates the cost based on 3 parameters
 */
exports.handler = async (event) => {
  expectHttpGet(event);
  //expectNumber(event.pathParameters.monthlyTransactions); // TODO

  console.info('received event:', event);

  // Business objects contains the bulk of the application logic
  const business = new CalculateCost(extractUserPermissions(event));
  let response;
  try {
    const cost = await business.calculateCost(
      event.pathParameters.industry,
      Number(event.pathParameters.monthlyTransactions),
      Number(event.pathParameters.monthlyVolume),
      new dataSourceAdapter.DynamoDbAdapter(costsTableName)
    );
    response = okResponse(cost);
  } catch (e) {
    response = errorResponse(e);
  }

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
