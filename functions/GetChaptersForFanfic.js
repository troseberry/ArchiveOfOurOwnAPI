'use strict'

const svc = require('../api/services/util');

exports.handler = async function(event, context){
    const workId = event.queryStringParameters.workId;
    const lastChapterId = event.queryStringParameters.lastId;

    var bodyContent = await svc.getChaptersForFanfic(workId, lastChapterId);
    
    return {
        statusCode: 200,
        body: JSON.stringify(bodyContent),
    }
}