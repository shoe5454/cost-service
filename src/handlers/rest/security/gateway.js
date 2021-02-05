const { AuthorizationError } = require("../../../errors/authorization.error");
const { NotFoundError } = require("../../../errors/not-found.error");
const { ValidationError } = require("../../../errors/validation.error");
const { MethodNotAllowedError } = require("../../../errors/method-not-allowed.error");

exports.extractUserPermissions = (event) => {
    return event.requestContext.authorizer.claims['cognito:groups'];
}

exports.expectHttpGet = (event) => {
    if (event.httpMethod !== 'GET') {
        throw new MethodNotAllowedError(`calculate-cost only accepts GET method, you tried: ${event.httpMethod}`);
    }
}

exports.expectHttpPost = (event) => {
    if (event.httpMethod !== 'POST') {
        throw new MethodNotAllowedError(`generate-cost-file-upload-endpoint only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
}

exports.okResponse = (bodyObj) => {
    return {
        statusCode: 200,
        body: JSON.stringify(bodyObj),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
}

exports.errorResponse = (error) => {
    console.error(error);
    let statusCode;
    let body;
    if (error instanceof AuthorizationError) {
        statusCode = 403;
        body = null;
    } else if (error instanceof NotFoundError) {
        statusCode = 404;
        body = null;
    } else if (error instanceof MethodNotAllowedError) {
        statusCode = 405;
        body = null;
    } else if (error instanceof ValidationError) {
        statusCode = 422;
        body = null;
    } else {
        statusCode = 500;
        body = null;
    }
    return {
        statusCode,
        body,
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
}