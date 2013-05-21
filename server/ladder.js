var crawler = require("./crawl.js"),
    ladderCache = [],
    urls = {
        us: 'http://us.battle.net/sc2/en/ladder/grandmaster/heart-of-the-swarm',
        eu: 'http://eu.battle.net/sc2/de/ladder/grandmaster/heart-of-the-swarm',
        kr: 'http://kr.battle.net/sc2/ko/ladder/grandmaster/heart-of-the-swarm'
    };

function formatDate() {
    var date = new Date();

    return date.getDate() + "." +
    (date.getMonth() + 1) + ". " +
    date.getHours() + ":" +
    (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + ":" +
    (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
}

function response(usersAsJson, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(usersAsJson, 'utf8'));
    res.end(usersAsJson);
}

function crawlUrl(url, res) {
    crawler.start(url, function (html) {
        var usersAsJson,

        users = crawler.extractFrom(html);
        usersAsJson = JSON.stringify({users: users, date: formatDate()});
        ladderCache[url] = usersAsJson;

        response(usersAsJson, res);
    });
}

function deleteCacheOn(forceRefresh, url) {
    if (forceRefresh) {
        delete ladderCache[url];
    }
}

exports.getFor = function (region, forceRefresh, res) {
    var cachedData,
        url = urls[region];

    deleteCacheOn(forceRefresh, url);
    cachedData = ladderCache[url];

    if (!cachedData) {
        crawlUrl(url, res);
    } else {
        response(cachedData, res);
    }
};