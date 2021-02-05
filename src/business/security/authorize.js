const { AuthorizationError } = require("../../errors/authorization.error");

// Various authorization functions

exports.authorizeAtLeastOneGroup = (userPerms) => {
    if (!userPerms) {
        throw new AuthorizationError('Unauthorized');
    }
    return userPerms.split(',');
}

exports.authorizeCostsAdmin = (userPerms) => {
    const perms = this.authorizeAtLeastOneGroup(userPerms);
    if (!perms.includes('costs_admin')) {
        throw new AuthorizationError('Unauthorized');
    }
}

exports.authorizeSalesRepOrCostsAdmin = (userPerms) => {
    const perms = this.authorizeAtLeastOneGroup(userPerms);
    if (!perms.includes('costs_admin') && !perms.includes('sales_rep')) {
        throw new AuthorizationError('Unauthorized');
    }
}