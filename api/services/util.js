'use strict';

//http://localhost:3500/tags/dcu/2


const axios = require('axios');
const Parser = require('./parser');

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