var http = require('http'),
    urlUtil = require("url"),
    cheerio = require("cheerio");

function removeSpaces(oneString) {
    return oneString.replace(/\s/g, "");
}

exports.start = function (urlString, callback) {
    var url = urlUtil.parse(urlString);

    http.get({host: url.host, path: url.path, port: url.port}, function (response) {
        var data = "";
        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("end", function () {
            callback(data);
        });
    }).on('error', function (e) {
        console.log("http get error: " + e.message);
    });
};

function getWins($, rows) {
    var wins;
    wins = removeSpaces($(rows[4]).text());
    return parseInt(wins, 10);
}

function getLosses($, rows) {
    var losses = removeSpaces($(rows[5]).text());
    return parseInt(losses, 10);
}

function calculateRatio(wins, gamesCount) {
    return Math.ceil(100 * wins / gamesCount);
}

function addZeroBefore(oneNumber) {
    if (oneNumber < 10) {
        oneNumber = "0" + oneNumber.toString();
    }

    return oneNumber;
}

function extractData($, rows, index) {
    var $userLink, rank, points, wins, losses, gamesCount;

    $userLink = $(rows[2]).find("a");
    points = removeSpaces($(rows[3]).text());
    wins = getWins($, rows);
    losses = getLosses($, rows);
    gamesCount = losses + wins;

    return {
        name: removeSpaces($userLink.text()),
        points: points,
        rank: addZeroBefore(index + 1),
        profileUrl: $userLink.attr("href"),
        wins: wins.toString() + "/" + gamesCount.toString(),
        ratio: calculateRatio(wins, gamesCount)
    };
}

exports.extractFrom = function (html) {
    var $, users = [];

    $ = cheerio.load(html);
    $("tbody > tr", "#ladder").each(function (index, el) {
        var rows;

        rows = $($(el).find("> td")).filter(function (index, el) {
            return !$(el).hasClass("banner");
        });

        users.push(extractData($, rows, index));
    });

    return users;
};

exports.normalizeLink = function (base, target) {
    return urlUtil.resolve(base, target);
};
