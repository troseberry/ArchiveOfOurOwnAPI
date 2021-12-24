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
        fics = parser.ParsePageForFanficObjects(data)

    } catch(err) {
        console.error(err);
    }

    return fics;
}

module.exports = {
    scrapeFanficsOnPage,
    encodeTagForUrl
}