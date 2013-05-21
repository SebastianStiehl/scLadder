var http = require('http'),
    urlUtil = require("url"),
    cheerio = require("cheerio");
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
    function removeSpaces(oneString) {
        return oneString.replace(/\s/g, "");
    }
    $ = cheerio.load(html);
    $("tbody > tr", "#ladder").each(function (index, el) {
        var name, rows, rank, points;
        rows = $($(el).find("> td")).filter(function (index, el) {
            return !$(el).hasClass("banner");
        });
        rank = removeSpaces($(rows[1]).text());
        name = removeSpaces($(rows[2]).find("a").text());
        points = removeSpaces($(rows[3]).text());
        users.push({
            name: name,
            points: points,
            rank: rank,
            index: (index + 1)
        });
    });
    return users;
};
exports.normalizeLink = function (base, target) {
    return urlUtil.resolve(base, target);
};
