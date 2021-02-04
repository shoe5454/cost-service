exports.authorizeAtLeastOneGroup = (event) => {
    const groups = event.requestContext.authorizer.claims['cognito:groups'];
    if (!groups) {
        throw new Error('Unauthorized');
    }
    return groups.split(',');
}

exports.authorizeCostsAdmin = (event) => {
    const groups = this.authorizeAtLeastOneGroup(event);
    if (!groups.includes('costs_admin')) {
        throw new Error('Unauthorized');
    }
}

exports.authorizeSalesRepOrCostsAdmin = (event) => {
    const groups = this.authorizeAtLeastOneGroup(event);
    if (!groups.includes('costs_admin') && !groups.includes('sales_rep')) {
        throw new Error('Unauthorized');
    }
}