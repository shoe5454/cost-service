exports.expectHttpGet = (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`calculate-cost only accepts GET method, you tried: ${event.httpMethod}`);
    }
}

exports.expectHttpPost = (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`generate-cost-file-upload-endpoint only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
}