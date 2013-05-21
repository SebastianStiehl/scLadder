var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    getLadderFor = require('./server/ladder.js').getFor,
    port = 8484;

var app = express();

app.get('/', function (req, res) {
    res.render("ladder", {});
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: function (str, path) {
        return stylus(str).set('filename', path).use(nib());
    }
}));

app.get('/ladder/:region', function(req, res){
    var region = req.params.region,
        forceRefresh = req.query.forceRefresh;

    getLadderFor(region, forceRefresh, res);
});

app.listen(port);
console.log('Up and Listening on port ' + port);






