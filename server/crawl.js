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

exports.extractFrom = function (html) {
    var $, users = [];

    $ = cheerio.load(html);
    $("tbody > tr", "#ladder").each(function (index, el) {
        var $userLink, rows, rank, points, profileUrl, name;

        rows = $($(el).find("> td")).filter(function (index, el) {
            return !$(el).hasClass("banner");
        });
        $userLink = $(rows[2]).find("a");
        rank = removeSpaces($(rows[1]).text());
        name = removeSpaces($userLink.text());
        points = removeSpaces($(rows[3]).text());
        profileUrl = $userLink.attr("href");

        users.push({
            name: name,
            points: points,
            rank: rank,
            index: (index + 1),
            profileUrl: profileUrl
        });
    });

    return users;
};

exports.normalizeLink = function (base, target) {
    return urlUtil.resolve(base, target);
};
