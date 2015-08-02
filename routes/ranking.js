var express = require('express');
var nosql = require('./nosql');
var router = express.Router();

router.get('/:start/:limit', function (req, res, next) {
    var start = parseInt(req.params.start) - 1;
    var limit = parseInt(req.params.limit) > 100 ? 100 : parseInt(req.params.limit);
    var args = [ 'users', start, start + limit, 'WITHSCORES' ];

    console.time('ranking_list');
    nosql.zrevrange(args, function (err, response) {
        console.timeEnd('ranking_list');
        if (err) {
            res.json({ result: 'error' });
            throw err;
        }

        res.render('ranking', { start :start + 1, limit :limit, data: response });
        // write your code here
    });
});

router.get('/:name', function(req, res, next) {
    var args = [ 'users', req.params.name ];

    console.time('ranking_only');
    nosql.zrevrank(args, function (err, response) {
        console.timeEnd('ranking_only');
        if (err) {
            res.json({ result: 'error' });
            throw err;
        }

        res.render('ranking_only', { name: req.params.name, rank: response + 1 });
        // write your code here
    });
});

router.get('/insert_data/', function(req, res, next) {
    for (var j = 0; j < 400; j++) {
        var args = [ 'users' ];
        for (var i = j * 10000 + 1; i <= (j + 1) * 10000; i++) {
            args.push(parseInt(Math.random() * 10000000));
            args.push(i);
        }

        nosql.zadd(args, function (err, response) {
            if (err) {
                res.json({ result: 'error' });
                throw err;
            }
        });
    }
});

module.exports = router;
