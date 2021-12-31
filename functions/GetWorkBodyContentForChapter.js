'use strict'

const svc = require('../api/services/util');


exports.handler = async function(event, context){
    const workId = event.queryStringParameters.workId;
    const chapterNumber = event.queryStringParameters.chapterNumber;

    var bodyContent = svc.scrapeWorkBodyContentForChapter(workId, chapterNumber);

    return {
        statusCode: 200,
        body: JSON.stringify(bodyContent),
    }
}