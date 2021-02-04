const { ValidationError } = require("../errors/validation.error");

/**
 * Implements the linear interpolation formula. Rounds the end result to 2 decimal points
 * @param {*} x 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @returns Result as a number rounded to 2 decimal places
 */
exports.linearInterpolation = (x, x1, y1, x2, y2) => {
    // Validate inputs
    if (x1 === x2)
        throw new ValidationError(`Cannot interpolate when reference points are the same`);

    const numerator = (x - x1) * (y2 - y1);
    const denominator = x2 - x1;
    const result = y1 + (numerator / denominator);
    return parseFloat(result.toFixed(2));
}

exports.interpolateCost = (costCoordinates, x) => {
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
 * @param {*} monthlyTransactions 
 * @param {*} monthlyVolume 
 * @returns Cost as a Number rounded to 2 decimal places
 */
exports.calculateCostFromIndustryCostData = (industryCostData, monthlyTransactions, monthlyVolume) => {
    const terminalCost = industryCostData.TERMINAL !== undefined ? industryCostData.TERMINAL : 0.00;
    const monthlyTransactionsCost = this.interpolateCost(industryCostData.TRANSACTION_COUNT, monthlyTransactions);
    const monthlyVolumeCost = this.interpolateCost(industryCostData.TRANSACTION_VOLUME, monthlyVolume);
    const total = terminalCost + monthlyTransactionsCost + monthlyVolumeCost;
    return parseFloat(total.toFixed(2)); // Round the result to 2 decimal places
}

exports.calculateCost = async (industry, monthlyTransactions, monthlyVolume, dataSourceAdapter) => {
    const industryCostData = await dataSourceAdapter.getIndustryCostData(industry);

    const cost = this.calculateCostFromIndustryCostData(industryCostData, monthlyTransactions, monthlyVolume);

    return cost;
}

