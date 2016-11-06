var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/githubToken', function(req, res) {
  res.send({
    token: process.env.GITHUB_API_KEY
  });
});

module.exports = router;
