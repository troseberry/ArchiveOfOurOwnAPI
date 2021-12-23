'use strict'

const svc = require('../services/util');

async function getAllFanficsOnPage (req, res) {
    const pageNumber = req.params.pageNumber;
    const tag = svc.encodeTagForUrl(req.params.tagName);
    const pageUrl = `http://archiveofourown.org/tags/${tag}/works?page=${pageNumber}`;
 
    let fics = [];
    fics = await svc.scrapeFanficsOnPage(pageUrl);
    
    res.send(fics);
}

async function getSpecificFanficOnPage(req, res){
    const pageNumber = req.params.pageNumber;
    const tag = svc.encodeTagForUrl(req.params.tagName);
    const index = req.params.indexNumber;

    const pageUrl = `http://archiveofourown.org/tags/${tag}/works?page=${pageNumber}`;
 
    let fics = [];
    fics = await svc.scrapeFanficsOnPage(pageUrl);

    res.send(fics[index]);
}

module.exports = {
    getAllFanficsOnPage,
    getSpecificFanficOnPage
}