const svc = require('../api/services');
const Fanfic = require('../api/models');
const ctrl = require('../api/controllers');
const axios = require('axios');

describe('Tag Encoding for URL', () => {
    test('Encode - alphanumeric chars and spaces only', async () => {
        expect(svc.encodeTagForUrl('Marvel')).toStrictEqual('Marvel')
        expect(svc.encodeTagForUrl('Bandom')).toStrictEqual('Bandom')
        expect(svc.encodeTagForUrl('Naruto')).toStrictEqual('Naruto')
        expect(svc.encodeTagForUrl('Final Fantasy Series')).toStrictEqual('Final%20Fantasy%20Series')
        expect(svc.encodeTagForUrl('Marvel Cinematic Universe')).toStrictEqual('Marvel%20Cinematic%20Universe')
    })

    test('Encode - with special characters', async () => {
        expect(svc.encodeTagForUrl('Sherlock Holmes & Related Fandoms')).toStrictEqual('Sherlock%20Holmes%20*a*%20Related%20Fandoms')
        expect(svc.encodeTagForUrl('Minecraft (Video Game)')).toStrictEqual('Minecraft%20(Video%20Game)')
        expect(svc.encodeTagForUrl('방탄소년단 | Bangtan Boys | BTS')).toStrictEqual('방탄소년단%20%7C%20Bangtan%20Boys%20%7C%20BTS')
        expect(svc.encodeTagForUrl('TOLKIEN J. R. R. - Works & Related Fandoms')).toStrictEqual('TOLKIEN%20J*d*%20R*d*%20R*d*%20-%20Works%20*a*%20Related%20Fandoms')
        expect(svc.encodeTagForUrl('Harry Potter - J. K. Rowling')).toStrictEqual('Harry%20Potter%20-%20J*d*%20K*d*%20Rowling')
        
        expect(svc.encodeTagForUrl('101 Dalmatians: The Series (Cartoon 1997)')).toStrictEqual('101%20Dalmatians:%20The%20Series%20(Cartoon%201997)')
        expect(svc.encodeTagForUrl('えんどろ～！ | Endro! (Anime)')).toStrictEqual('えんどろ～！%20%7C%20Endro!%20(Anime)')
        expect(svc.encodeTagForUrl('@Midnight (TV)')).toStrictEqual('@Midnight%20(TV)')
        expect(svc.encodeTagForUrl('#000000 Ultra Black (Manga)')).toStrictEqual('*h*000000%20Ultra%20Black%20(Manga)')
        expect(svc.encodeTagForUrl('$uicideboy$ (Band)')).toStrictEqual('$uicideboy$%20(Band)')
       
        expect(svc.encodeTagForUrl('LOVE DEATH + ROBOTS (Cartoon)')).toStrictEqual('LOVE%20DEATH%20+%20ROBOTS%20(Cartoon)')
        expect(svc.encodeTagForUrl('Where Do You Go To (My Lovely)? - Peter Sarstedt (Song)')).toStrictEqual('Where%20Do%20You%20Go%20To%20(My%20Lovely)*q*%20-%20Peter%20Sarstedt%20(Song)')
        expect(svc.encodeTagForUrl('That \'70s Show')).toStrictEqual('That%20\'70s%20Show')
        expect(svc.encodeTagForUrl('[MODE] (Video Game)')).toStrictEqual('%5BMODE%5D%20(Video%20Game)')
    })

    test('Encode - Throw Error for empty tag string', async () => {
        expect(() => svc.encodeTagForUrl('')).toThrowError( Error('Input tag cannot be empty.') )
        expect(() => svc.encodeTagForUrl(' ')).toThrowError( Error('Input tag cannot be empty.') )
        expect(() => svc.encodeTagForUrl("")).toThrowError( Error('Input tag cannot be empty.') )
        expect(() => svc.encodeTagForUrl(" ")).toThrowError( Error('Input tag cannot be empty.') )
    })
})

describe('Fanfic Parser', () => {
    var model = new Fanfic('28257258', 'The Instruments of Their Master', 'iberiandoctor (Jehane)', 'Kainosite', 'La Comédie Humaine - Honoré de Balzac, 19th Century CE France RPF', 'Explicit, Choose Not To Use Archive Warnings, M/M, Multi, Complete Work', '01 Jan 2021', 
    'Creator Chose Not To Use Archive Warnings, referenced Corentin/Hulot (Comédie Humaine), Joseph Fouché/Corentin, Joseph Fouché/Jacques-Antoine Manuel, Corentin/Jacques-Antoine Manuel, Corentin (Comédie Humaine), Joseph Fouché, Jacques-Antoine Manuel, Unequal relationships, Pedagogy, Propaganda, Jealousy, Blowjobs, Politics, Yuleporn, Hate Sex, Crossover',
    'The Duke of Otranto had two protégés: one, a police spy; the other, a promising future Deputy. The lessons these men learned under his tutelage — none more during the Hundred Days, when the Republic hung on a knife’s edge of war and politics — left the one greater, the other more guilty.',
    'Part 1 of The Spymaster and his Instruments', '2478010',
    'English', '5,700', '1/1', '1', '8', '11', '1', '172');

   test('Parser - Scrape all attributes', async() => {
        let fics = [];

        try{
            const{data} = await axios.get('http://archiveofourown.org/series/2478010');
    
            const parser = new svc.Parser();
            fics = parser.ParsePageForFanFicObjects(data)
    
        } catch(err) {
            console.error(err);
        }

        var comp = fics[0];

        expect(model.id).toEqual(comp.id)
        expect(model.title).toEqual(comp.title)
        expect(model.author).toEqual(comp.author)

        expect(model.recipientUsers).toEqual(comp.recipientUsers)
        expect(model.fandoms).toEqual(comp.fandoms)
        expect(model.requiredTags).toEqual(comp.requiredTags)

        expect(model.lastUpdated).toEqual(comp.lastUpdated)
        expect(model.tags).toEqual(comp.tags)
        expect(model.summary).toEqual(comp.summary)
        expect(model.series).toEqual(comp.series)
        expect(model.seriesIds).toEqual(comp.seriesIds)

        // Stats can vary but should never be null
        expect(comp.language).not.toBe('')
        expect(comp.wordCount).not.toBe('')
        expect(comp.chapterCount).not.toBe('')
        expect(comp.collections).not.toBe('')
        expect(comp.comments).not.toBe('')
        expect(comp.kudos).not.toBe('')
        expect(comp.bookmarks).not.toBe('')
        expect(comp.hits).not.toBe('')
    })
})
