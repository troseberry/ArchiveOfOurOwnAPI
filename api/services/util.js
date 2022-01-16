'use strict';

//http://localhost:3500/tags/dcu/2


const axios = require('axios');
const Parser = require('./parser');


function encodeTagForUrl(tag){
    
    // if tag is an empty string or whitespace only string
    if (!(tag.replace(/[' ']/g, ''))) throw Error('Input tag cannot be empty.');
    
    var encodedTag = tag;
    
    // replacing ampersands | '&'
    encodedTag = encodedTag.replace(/['&']/g, '*a*')

    //replacing periods | '.'
    encodedTag = encodedTag.replace(/['.']/g, '*d*')

    // replace pipe | '|'
    encodedTag = encodedTag.replace(/['|']/g, '%7C');

    // replace pound | '#'
    encodedTag = encodedTag.replace(/['#']/g, '*h*')

    // replace question mark | '?'
    encodedTag = encodedTag.replace(/['?']/g, '*q*')

    // replace square brackets | '[' ']'
    encodedTag = encodedTag.replace(/['[']/g, '%5B')
    encodedTag = encodedTag.replace(/[']']/g, '%5D')

    // replace white space chars
    encodedTag = encodedTag.replace(/[' ']/g, '%20');

    // bungles non-arabic alphabetic chars
    //encodedTag = encodeURIComponent(encodedTag);

    return encodedTag;
}

async function scrapeFanficsOnPage(url){
    let fics = [];

    try{
        const{data} = await axios.get(url);

        const parser = new Parser();
        fics = parser.parsePageForFanficObjects(data)

    } catch(err) {
        console.error(err);
    }

    return fics;
}

async function getIdForChapter(id, lastChapterId, chapterNumber){
    const workUrl = `https://archiveofourown.org/works/${id}/chapters/${lastChapterId}?view_adult=true`;
    
    let chapterId = '';

    try{
        const{data} = await axios.get(workUrl);
        const parser = new Parser();
        chapterId = parser.getChapterId(data, chapterNumber)
    } catch(err) {
        console.error(err);
    }

    return chapterId;
}

async function checkForProceedRedirectLink(chapterUrl) {
    var resultValue = undefined;
    try {
        const parser = new Parser();
        const{data} = await axios.get(chapterUrl);
        
        resultValue = parser.checkHtmlForProceedLink(data)
    } catch (err) {
        console.error(err);
    }

    const resultPromise = new Promise((resolve, reject) => {
        resolve(resultValue);
    });

    return resultPromise;
}

async function scrapeWorkBodyContentForChapter(workId, chapterId){
    var chapterUrl = '';
    var bodyContent = '';

    if (chapterId == '' || chapterId == undefined)
    {
        chapterUrl = `https://archiveofourown.org/works/${workId}?view_adult=true`;
    } else {
        chapterUrl = `https://archiveofourown.org/works/${workId}/chapters/${chapterId}?view_adult=true`;
    }

    try{
        var proceedResult = await checkForProceedRedirectLink(chapterUrl);

        //console.log('Proceed Result: ' + proceedResult);

        if (proceedResult != undefined) {
            chapterUrl = 'https://archiveofourown.org' + proceedResult
        }
    
        //console.log('Chapter URL: ' + chapterUrl)


        const{data} = await axios.get(chapterUrl);
        const parser = new Parser();
        bodyContent = parser.getWorkBodyContent(data);
    } catch (err) {
        console.error(err);
    }

    return bodyContent;
}

async function getChaptersForFanfic(workId, lastChapterId) {
    let chapters = [];
    var url = '';

    if (lastChapterId == '' || lastChapterId == undefined)
    {
        url = `https://archiveofourown.org/works/${workId}?view_adult=true`;
    } else {
        url = `https://archiveofourown.org/works/${workId}/chapters/${lastChapterId}?view_adult=true`;
    }

    try {
        var proceedResult = await checkForProceedRedirectLink(url);
        if (proceedResult != undefined) {
            url = 'https://archiveofourown.org' + proceedResult;
        }

        const{data} = await axios.get(url);
        const parser = new Parser();
        chapters = parser.getWorkChapters(data);

    } catch (err) {
        console.error(err);
    }

    return chapters;
}

module.exports = {
    scrapeFanficsOnPage,
    encodeTagForUrl,
    getIdForChapter,
    scrapeWorkBodyContentForChapter,
    getChaptersForFanfic
}