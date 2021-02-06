const csv = require('fast-csv');
const { authorizeCostsAdmin } = require('./security/authorize.js');

/**
 * Business methods related to managing the costing data
 */
exports.CostData = class {
    constructor(userPerms) {
        this.userPerms = userPerms;
    }

    /**
     * Generates a URL that the client can use to securely POST upload a cost CSV file
     * @param {*} uploadFileName 
     * @param {*} fileStorageAdapter 
     */
    async generateCostFileUploadEndpoint(uploadFileName, fileStorageAdapter) {
        authorizeCostsAdmin(this.userPerms);

        return await fileStorageAdapter.generateCostsFileUploadUrl(uploadFileName);
    }

    /**
     * Responds to a cost CSV file being successfully uploaded by the client
     * @param {*} filepath 
     * @param {*} fileStorageAdapter 
     * @param {*} dataSourceAdapter 
     */
    async costsFileUploaded(filepath, fileStorageAdapter, dataSourceAdapter) {
        console.info(`processing costs CSV file at ${filepath}`);

        const stream = fileStorageAdapter.getCostsFile(filepath);

        const normalizedCosts = await this.normalizeCostsFile(stream);

        await dataSourceAdapter.replaceCostData(normalizedCosts);
    }

    /**
     * Converts the data in the costs CSV file into a normalized form
     * @param {*} stream 
     */
    async normalizeCostsFile(stream) {
        stream = stream.pipe(csv.parse({ headers: true, trim: true }));

        const promise = new Promise((resolve, reject) => {
            const normalized = {};

            stream.on('data', (row) => {
                //console.log(row);
                // Initialize the industry data object if it hasn't been initialized
                if (!normalized[row['Industry']]) {
                    normalized[row['Industry']] = {
                        'TRANSACTION_COUNT': {},
                        'TRANSACTION_VOLUME': {},
                    };
                }
                const normalizedIndustry = normalized[row['Industry']];
                // Assign the row to the appropriate field in the normalized object
                switch (row['Type']) {
                    case 'TERMINAL':
                        normalizedIndustry['TERMINAL'] = Number(row['Price']);
                        break;
                    case 'TRANSACTION_COUNT':
                        normalizedIndustry['TRANSACTION_COUNT'][row['Value']] = Number(row['Price']);
                        break;
                    case 'TRANSACTION_VOLUME':
                        normalizedIndustry['TRANSACTION_VOLUME'][row['Value']] = Number(row['Price']);
                        break;
                }
            });
            stream.on('error', (err) => {
                console.error('Error parsing cost CSV: ' + err);
                reject(err);
            });
            stream.on('end', () => {
                console.log('Cost CSV successfully parsed');
                resolve(normalized);
            });
        });

        return await promise;
    }
}