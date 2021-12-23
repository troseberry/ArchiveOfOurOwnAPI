'use strict';

//http://localhost:3500/tags/dcu/2

const cheerio = require('cheerio');
const FanFic = require('../models');
const axios = require('axios');

function encodeTagForUrl(tag){
    
    // if tag is an empty string or whitespace only string
    if (!(tag.replaceAll(' ', ''))) throw Error('Input tag cannot be empty.');
    
    var encodedTag = tag;
    
    // replacing ampersands | '&'
    encodedTag = encodedTag.replaceAll('&', '*a*')

    //replacing periods | '.'
    encodedTag = encodedTag.replaceAll('.', '*d*')

    // replace pipe | '|'
    encodedTag = encodedTag.replaceAll('|', '%7C');

    // replace pound | '#'
    encodedTag = encodedTag.replaceAll('#', '*h*')

    // replace question mark | '?'
    encodedTag = encodedTag.replaceAll('?', '*q*')

    // replace square brackets | '[' ']'
    encodedTag = encodedTag.replaceAll('[', '%5B')
    encodedTag = encodedTag.replaceAll(']', '%5D')

    // replace white space chars
    encodedTag = encodedTag.replaceAll(' ', '%20');

    // bungles non-arabic alphabetic chars
    //encodedTag = encodeURIComponent(encodedTag);

    return encodedTag;
}

async function scrapeFanFicsOnPage(url){
    let fics = [];

    try{
        const{data} = await axios.get(url);

        const parser = new Parser();
        fics = parser.ParsePageForFanFicObjects(data)

    } catch(err) {
        console.error(err);
    }

    return fics;
}


class Parser {
    constructor(){}

    ParsePageForFanFicObjects(html){
        const $ = cheerio.load(html);

        let fics = [];
        
        //console.log($.html());

        var foundFics = $('li.work');
        console.log(`found ${foundFics.length} fanfic list objects`);
        
        $('li.work').each( (topIndex, topElement) => {
            const work = topElement;

            //#region Fic Properties
            var _id = '';
            var _title = '';
            var _author = '';

            var _recipientAuthors = '';
            var _fandoms = '';
            var _requiredTags = '';

            var _lastUpdated = '';
            var _tags = '';
            var _summary = '';
            var _series = '';
            var _seriesIds = '';

            var _language = '';
            var _wordCount = '';
            var _chapterCount = '';
            var _collections = '';
            var _comments = '';
            var _kudos = '';
            var _bookmarks = '';
            var _hits = '';
            //#endregion
            
            //#region ID
            _id = $(work).attr('id');
            _id = _id.split('_')[1];
            //#endregion
            
            //#region Title
            _title = $(work).find('div.header > h4 > a:nth-of-type(1)').text();
            //#endregion

            //#region Author
            var foundAuthors = $(work).find('div.header > h4.heading > a[rel="author"]')
            if (foundAuthors.length <= 0) {
                _author = 'Anonymous';
            }
            else {
                foundAuthors.each( function(index, element){
                    _author += $(element).text();
                    if (index < foundAuthors.length - 1){
                        _author += ', ';
                    }
                });
            }
            //#endregion

            //#region Recipient Authors
            var foundRecipients = $(work).find('div.header > h4.heading > a');
            foundRecipients.each( function(index, element) {
                //console.log(`a tag rel at index ${index} is ${$(element).attr('rel')}` )
                if ($(element).attr('rel') != 'author' && index > 0){
                    _recipientAuthors += $(element).text();
                    //console.log(`found recipient ${$(element).text()} at index ${topIndex}`);
                    if (index < foundRecipients.length - 1){
                        _recipientAuthors += ', ';
                    }
                }
            });
            //#endregion

            //#region Fandoms 
            var foundFandoms = $(work).find('div.header > h5.fandoms > a');
            foundFandoms.each( function(index, element) {
                _fandoms += $(element).text();
                if (index < foundFandoms.length - 1) {
                    _fandoms += ', ';
                }
            });
            //#endregion

            //#region Required Tags
            var foundReqTags = $(work).find('div.header > ul.required-tags > li > a > span');
            //console.log('Required Tags Count: ' + foundReqTags.length);
            foundReqTags.each( function(index, element) {
                _requiredTags += $(element).text();
                if (index < foundReqTags.length - 1) {
                    _requiredTags += ', ';
                }
            });
            //#endregion

            //#region Last Updated
            _lastUpdated = $(work).find('div.header > p.datetime').text();
            //#endregion

            //#region Tags
            var foundTags = $(work).find('ul.tags > li');
            foundTags.each( function(index, element) {
                _tags += $(element).text();
                if (index < foundTags.length - 1) {
                    _tags += ', ';
                }
            })
            //#endregion

            //#region Summary
            var foundSummaryLines = $(work).find('blockquote.summary > p');
            foundSummaryLines.each( function(index, element) {
                _summary += $(element).text();
                if(index < foundSummaryLines.length - 1){
                    _summary += '\n';
                }
            });
            //#endregion

            //#region Series
            var foundSeries = $(work).find('ul.series > li');
            foundSeries.each( function(index, element) {
                _series += 'Part ';
               _series += $(element).children(':nth-child(1)').text();
               _series += ' of ';
               _series += $(element).children(':nth-child(2)').text();

                let foundSeriesId = $(element).find('a').attr('href');
                _seriesIds += foundSeriesId.split('/')[2];

                if (index < foundSeries.length - 1) {
                    _series += ', ';
                    _seriesIds += ', ';
                }
            });
            //#endregion

            //#region Stats
            _language = $(work).find('dl.stats > dd.language').text();
            _wordCount = $(work).find('dl.stats > dd.words').text();
            _chapterCount = $(work).find('dl.stats > dd.chapters').text();
            _collections = $(work).find('dl.stats > dd.collections').text();
            _comments = $(work).find('dl.stats > dd.comments').text();
            _kudos = $(work).find('dl.stats > dd.kudos').text();
            _bookmarks = $(work).find('dl.stats > dd.bookmarks').text();
            _hits = $(work).find('dl.stats > dd.hits').text();
            //#endregion

            fics.push(new FanFic(_id, _title, _author, _recipientAuthors, _fandoms, _requiredTags,
                                    _lastUpdated, _tags, _summary, _series, _seriesIds, _language, _wordCount,
                                    _chapterCount, _collections, _comments, _kudos, _bookmarks, _hits));
        });
        //console.log("Parsed Fics: " + fics.length);
        return fics;
    }
}

module.exports = {
    scrapeFanFicsOnPage,
    encodeTagForUrl,
    Parser
}