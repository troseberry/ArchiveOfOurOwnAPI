'use strict'

const svc = require('../api/services/util');


function getIdFromKnownTag(tag) {
    var inTag = '' + tag;
    inTag = inTag.toLowerCase();

    switch (inTag) {
        case 'general audiences':
            return 10;
        case 'teen and up audiences':
            return 11;
        case 'mature':
            return 12;
        case 'explicit':
            return 13;
        case 'not rated':
            return 9;

        case 'no archive warnings apply':
            return 16;
        case 'creator chose not to use archive warnings':
            return 14;
        case 'graphic depictions of violence':
            return 17;
        case 'major character death':
            return 18;
        case 'rape/non-con':
            return 19;
        case 'underage':
            return 20;

        case 'm/m':
            return 23;
        case 'f/m':
            return 22;
        case 'gen':
            return 21;
        case 'f/f':
            return 116;
        case 'multi':
            return 2246;
        case 'other':
            return 24;
        default:
            break;
    }
}

exports.handler = async function(event, context) {
    
    const pageNumber = event.queryStringParameters.pageNumber;
    const tag = svc.encodeTagForUrl(event.queryStringParameters.tagName);

    // always included queries
    const completionQuery = svc.getStringIfNotUndefined(event.queryStringParameters.completion);
    const crossoverQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.crossover);
    const dateFromQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.dateFrom);
    const dateToQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.dateTo);
    const excludedTagsQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.excludedTags);
    const languageQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.language);
    const otherTagsQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.otherTags);
    const searchWithinQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.searchWithinResults);
    const sortQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.sort);
    const wordsFromQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.wordsFrom);
    const wordsToQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.wordsTo);

    // only included if non-null queries
    const ratingsIncludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.ratingsInclude);
    const ratingsExcludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.ratingsExclude);
    const warningsIncludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.warningsInclude);
    const warningsExcludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.warningsExclude);
    const categoriesIncludeQuery = svc.getStringIfNotUndefined(event.queryStringParameters.categoriesInclude);
    const categoriesExcludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.categoriesExclude);

    const fandomsIncludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.fandomsInclude);
    const fandomsExcludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.fandomsExclude);;
    const charactersIncludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.charactersInclude);
    const charactersExcludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.charactersExclude);;
    const relationshipsIncludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.relationshipsInclude);
    const relationshipsExcludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.relationshipsExclude);;
    const additionalTagsIncludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.additionalTagsInclude);
    const additionalTagsExcludeQuery =  svc.getStringIfNotUndefined(event.queryStringParameters.additionalTagsExclude);;


    //const pageUrl = `http://archiveofourown.org/tags/${tag}/works?page=${pageNumber}`;

    var pageUrl = `http://archiveofourown.org/tags/${tag}/works?commit=Sort+and+Filter&page=${pageNumber}&utf8=%E2%9C%93`;
    pageUrl += `&work_search%5Bcomplete%5D=${completionQuery}`;
    pageUrl +=`&work_search%5Bcrossover%5D=${crossoverQuery}`;
    pageUrl +=`&work_search%5Bdate_from%5D=${dateFromQuery}`;
    pageUrl +=`&work_search%5Bdate_to%5D=${dateToQuery}`;
    pageUrl +=`&work_search%5Bexcluded_tag_names%5D=${excludedTagsQuery}`;
    pageUrl +=`&work_search%5Blanguage_id%5D=${languageQuery}`;
    pageUrl +=`&work_search%5Bother_tag_names%5D=${otherTagsQuery}`;
    pageUrl +=`&work_search%5Bquery%5D=${searchWithinQuery}`;
    pageUrl +=`&work_search%5Bsort_column%5D=${sortQuery}`;
    pageUrl +=`&work_search%5Bwords_from%5D=${wordsFromQuery}`;
    pageUrl +=`&work_search%5Bwords_to%5D=${wordsToQuery}`;

    if (ratingsIncludeQuery.length > 0 ) pageUrl += `&include_work_search%5Brating_ids%5D%5B%5D=${getIdFromKnownTag(ratingsIncludeQuery)}`;
    if (ratingsExcludeQuery.length > 0) {
        let queries = ratingsExcludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Exclude Rating:${element}`);
            pageUrl += `&exclude_work_search%5Brating_ids%5D%5B%5D=${getIdFromKnownTag(element)}`;
        });
    }

    if (warningsIncludeQuery.length > 0) {
        let queries = warningsIncludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Include Warning: ${element}`);
            pageUrl += `&include_work_search%5Barchive_warning_ids%5D%5B%5D=${getIdFromKnownTag(element)}`;
        });
    }

    if (warningsExcludeQuery.length > 0) {
        let queries = warningsExcludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Exclude Warning`);
            pageUrl += `&exclude_work_search%5Barchive_warning_ids%5D%5B%5D=${getIdFromKnownTag(element)}`;
        });
    }

    if (categoriesIncludeQuery.length > 0) {
        let queries = categoriesIncludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Include Category: ${element}`);
            pageUrl += `&include_work_search%5Bcategory_ids%5D%5B%5D=${getIdFromKnownTag(element)}`;
        });
    }

    if (categoriesExcludeQuery.length > 0) {
        let queries = categoriesExcludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Exclude Category: ${element}`);
            pageUrl += `&exclude_work_search%5Bcategory_ids%5D%5B%5D=${getIdFromKnownTag(element)}`;
        });
    }

    if (fandomsIncludeQuery.length > 0) {
        let queries = fandomsIncludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Include Fandom: ${element}`);
            pageUrl += `&include_work_search%5Bfandom_ids%5D%5B%5D=${element}`;
        });
    }

    if (fandomsExcludeQuery.length > 0) {
        let queries = fandomsExcludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Exclude Fandom: ${element}`);
            pageUrl += `&exclude_work_search%5Bfandom_ids%5D%5B%5D=${element}`;
        });
    }

    if (charactersIncludeQuery.length > 0) {
        let queries = charactersIncludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Include Character: ${element}`);
            pageUrl += `&include_work_search%5Bcharacter_ids%5D%5B%5D=${element}`;
        });
    }

    if (charactersExcludeQuery.length > 0) {
        let queries = charactersExcludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Exclude Character: ${element}`);
            pageUrl += `&exclude_work_search%5Bcharacter_ids%5D%5B%5D=${element}`;
        });
    }

    if (relationshipsIncludeQuery.length > 0) {
        let queries = relationshipsIncludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Include Relationship: ${element}`);
            pageUrl += `&include_work_search%5Brelationship_ids%5D%5B%5D=${element}`;
        });
    }

    if (relationshipsExcludeQuery.length > 0) {
        let queries = relationshipsExcludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Exclude Relationship: ${element}`);
            pageUrl += `&exclude_work_search%5Brelationship_ids%5D%5B%5D=${element}`;
        });
    }

    if (additionalTagsIncludeQuery.length > 0) {
        let queries = additionalTagsIncludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Include Additional Tag: ${element}`);
            pageUrl += `&include_work_search%5Bfreeform_ids%5D%5B%5D=${element}`;
        });
    }

    if (additionalTagsExcludeQuery.length > 0) {
        let queries = additionalTagsExcludeQuery.split(',');
        queries.forEach(element => {
            console.log(`Exclude Additional Tag: ${element}`);
            pageUrl += `&exclude_work_search%5Bfreeform_ids%5D%5B%5D=${element}`;
        });
    }
    
    console.log(pageUrl);

    let fics = [];
    fics = await svc.scrapeFanficsOnPage(pageUrl);

    //res.send(fics);
    return {
        statusCode: 200,
        body: JSON.stringify(fics),
    }
}

//http://localhost:55258/.netlify/functions/GetAllFanficsOnPage?tagName=dcu&pageNumber=1