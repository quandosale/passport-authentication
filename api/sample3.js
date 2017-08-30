var express = require('express'),
    router = express.Router(),
    Util = require('../lib/util');


router.get('/test', (req, res) => {
    res.send('get test');
})

router.post('/test', (req, res) => {
    res.send('post test');
})

router.delete('/test', (req, res) => {
    res.send('delete test');
})

router.put('/test', (req, res) => {
    res.send('put test');
})

module.exports = router;