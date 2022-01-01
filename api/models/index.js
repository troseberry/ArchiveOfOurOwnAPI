'use strict'

class Fanfic {
    constructor(id, title, author, recipientUsers = '', fandoms = '', requiredTags = '',
                lastUpdated = '', tags = '', summary = '', series = '', seriesIds = '', language = '', wordCount = '',
                chapterCount = '', collections = '', comments = '', kudos = '', bookmarks = '', hits = '', latestChapterId = '') {
        this.id = id;
        this.title = title;
        this.author = author;

        this.recipientUsers = recipientUsers;
        this.fandoms = fandoms;
        this.requiredTags = requiredTags;
        
        this.lastUpdated = lastUpdated;
        this.tags = tags;
        this.summary = summary;
        this.series = series;
        this.seriesIds = seriesIds;
        
        this.language = language;
        this.wordCount = wordCount;
        this.chapterCount = chapterCount;
        this.collections = collections;
        this.comments = comments;
        this.kudos = kudos;
        this.bookmarks = bookmarks;
        this.hits = hits;

        this.latestChapterId = latestChapterId;
    }
}

module.exports = Fanfic;