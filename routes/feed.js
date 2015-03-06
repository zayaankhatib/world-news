var express = require('express');
var router = express.Router();
var FeedParser  = require('feedparser');
var request     = require('request');
var pg          = require('pg');
var pg_info     = require('../db/db_config')['pg']
var pg_conn     = "postgres://" + pg_info['user'] + ":" + pg_info['password'] + "@" + pg_info['host'] + "/" + pg_info['database']

/* GET home page. */
router.get('/', function(req, res, next) {
	pg.connect(pg_conn, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT title, link, country, city, pub_date FROM articles;', function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();

	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.send(result.rows)
	    client.end();
	  });
	});
});

var feedparser = new FeedParser();
var req = request('http://news.google.ca/news?pz=1&cf=all&ned=ca&hl=en&topic=w&output=rss')
var obj = []
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
        obj.push({'title': item.title, 'link': item.link, 'desc': item['rss:description']})
    }
});

router.get('/raw', function(req, res, next) {
	res.send(obj)
});

module.exports = router;

