'use strict'

const svc = require('../api/services/util');


exports.handler = async function(event, context){
    const workId = event.queryStringParameters.workId;
    const lastChapterId = event.queryStringParameters.lastId;
    const chapterNumber = event.queryStringParameters.chapterNumber;

    var chapterId = await svc.getIdForChapter(workId, lastChapterId, chapterNumber);
    //console.log(chapterId);

    var bodyContent = await svc.scrapeWorkBodyContentForChapter(workId, chapterId);

    return {
        statusCode: 200,
        body: JSON.stringify(bodyContent),
    }
}


//https://ao3api.netlify.app/.netlify/functions/GetWorkBodyContentForChapter?workId=35308720&chapterNumber=2
//http://localhost:51499/GetWorkBodyContentForChapter?workId=36116224&&lastId=90088831&chapterNumber=2