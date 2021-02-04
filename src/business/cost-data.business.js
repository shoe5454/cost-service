const csv = require('csv-parser');
const fs = require('fs');

exports.generateCostFileUploadEndpoint = async (uploadFileName, fileStorageAdapter) => {
    return await fileStorageAdapter.generateUploadUrl(uploadFileName);
}

exports.costFileUploaded = async (fileStorageAdapter, dataSourceAdapter) => {
    const file = await fileStorageAdapter.getFile(TODO);

    this.processCostFile(file);
}

exports.processCostFile = (file) => {
    const normalized = {};

    fs.createReadStream(file)
        .pipe(csv())
        .on('data', (row) => {
            console.log(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });

}