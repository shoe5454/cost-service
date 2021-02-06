const { ValidationError } = require("../errors/validation.error");
const { authorizeSalesRepOrCostsAdmin } = require('./security/authorize.js');

/**
 * Business methods related to cost calculation
 */
exports.CalculateCost = class {
    constructor(userPerms) {
        this.userPerms = userPerms;
    }

    /**
     * Implements the linear interpolation formula. Rounds the end result to 2 decimal points
     * @param {*} x Number
     * @param {*} x1 Number
     * @param {*} y1 Number
     * @param {*} x2 Number
     * @param {*} y2 Number
     * @returns Result as a Number rounded to 2 decimal places
     */
    linearInterpolation(x, x1, y1, x2, y2) {
        // Validate inputs
        if (x1 === x2)
            throw new ValidationError(`Cannot interpolate when reference points are the same`);

        const numerator = (x - x1) * (y2 - y1);
        const denominator = x2 - x1;
        const result = y1 + (numerator / denominator);
        return parseFloat(result.toFixed(2));
    }

    /**
     * Given a set of coordinates, interpolates the cost (y) for the reference point identified by x
     * @param {*} costCoordinates Associative array where key is "x" and the value is "y" (the cost)
     * @param {*} x Number
     * @returns cost as a Number
     */
    interpolateCost(costCoordinates, x) {
        //console.log(costCoordinates);
        //console.log(x);
        // If x is an exact match in costCoordinates, return the y
        if (costCoordinates[x.toString()] !== undefined)
            return costCoordinates[x.toString()];

        // Find the surrounding keys within costCoordinates that are closest to x
        const keys = Object.keys(costCoordinates).map(key => parseInt(key));
        let lowerKey = null;
        let higherKey = null;
        for (let key of keys) {
            if (key < x && (lowerKey === null || key > lowerKey))
                lowerKey = key;
            else if (key > x && (higherKey === null || key < higherKey))
                higherKey = key;
        }

        // If there isn't a pair of surrounding keys, throw ValidationError
        if (lowerKey === null || higherKey === null)
            throw new ValidationError(`${x} is not valid for interpolation`);

        // Interpolate
        //console.log(`${x} ${lowerKey} ${costCoordinates[lowerKey.toString()]} ${higherKey} ${costCoordinates[higherKey.toString()]}`);
        return this.linearInterpolation(x, lowerKey, costCoordinates[lowerKey.toString()], higherKey, costCoordinates[higherKey.toString()]);
    }

    /**
     * Calculates the cost based on the data in industryCostData and for the given monthly average transaction and volume.
     * Rounds the result to 2 decimal places to prevent loss of precision
     * @param {*} industryCostData 
     * @param {*} monthlyTransactions Number
     * @param {*} monthlyVolume Number
     * @returns Cost as a Number rounded to 2 decimal places
     */
    calculateCostFromIndustryCostData(industryCostData, monthlyTransactions, monthlyVolume) {
        authorizeSalesRepOrCostsAdmin(this.userPerms);

        const terminalCost = industryCostData.TERMINAL !== undefined ? industryCostData.TERMINAL : 0.00;
        const monthlyTransactionsCost = this.interpolateCost(industryCostData.TRANSACTION_COUNT, monthlyTransactions);
        const monthlyVolumeCost = this.interpolateCost(industryCostData.TRANSACTION_VOLUME, monthlyVolume);
        const total = terminalCost + monthlyTransactionsCost + monthlyVolumeCost;
        return parseFloat(total.toFixed(2)); // Round the result to 2 decimal places
    }

    /**
     * Obtain cost data from data source and calculate the cost based on industry, monthly transactions, monthly volume
     * @param {*} industry string
     * @param {*} monthlyTransactions Number
     * @param {*} monthlyVolume Number
     * @param {*} dataSourceAdapter 
     */
    async calculateCost(industry, monthlyTransactions, monthlyVolume, dataSourceAdapter) {
        const industryCostData = await dataSourceAdapter.getIndustryCostData(industry);

        const cost = this.calculateCostFromIndustryCostData(industryCostData, monthlyTransactions, monthlyVolume);

        return cost;
    }
}


