'use strict'

const svc = require('../api/services/util');

exports.handler = async function(event, context) {
    // your server-side functionality

    const pageNumber = event.queryStringParameters.pageNumber;
    const tag = svc.encodeTagForUrl(event.queryStringParameters.tagName);
    const pageUrl = `http://archiveofourown.org/tags/${tag}/works?page=${pageNumber}`;
    
    let fics = [];
    fics = await svc.scrapeFanFicsOnPage(pageUrl);

    //res.send(fics);
    return {
        statusCode: 200,
        body: `Tag: ${tag} | Page Number: ${pageNumber}`,
    }
}