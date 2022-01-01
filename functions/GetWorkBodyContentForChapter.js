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


//https://ao3api.netlify.app/.netlify/functions/GetWorkBodyContentForChapter?workId=35308720&chapterNumber=2
//http://localhost:51499/GetWorkBodyContentForChapter?workId=35308720&chapterNumber=2