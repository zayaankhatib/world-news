var express = require('express');
var router = express.Router();
var FeedParser  = require('feedparser');
var request     = require('request');

var feedparser = new FeedParser();
var req = request('http://news.google.ca/news?pz=1&cf=all&ned=ca&hl=en&topic=w&output=rss')
/* GET users listing. */
router.get('/', function(req, res, next) {
	req.on('error', function (error) {
	  // handle any request errors
	});

	req.on('response', function (res) {
	  var stream = this;
	  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
	  stream.pipe(feedparser);
	});

	feedparser.on('error', function(error) {
	  // always handle errors
	});

	feedparser.on('readable', function() {
	    // This is where the action is!
	    var stream = this
	    // , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
	    , item;

	    while (item = stream.read()) {
	        var location = parseLocationFromTitle(item.title)

	        client.query('INSERT INTO articles(title, link, country, city, pub_date) VALUES ($1, $2, $3, $4, $5) RETURNING title',
	            [item.title, item.link, location.country, location.city, item.pubdate], 
	            function (err, result) {
	                if(err && err.code != 23505) { //excludes exists error
	                      return console.error('error running insert', err);
	                }
	                if (!err || err.code != 23505) {
	                  console.log("NEW ARTICLE: " + result.rows[0].title);
	                }
	        });
	    }
	});
});

module.exports = router;
