var express = require('express');
var router = express.Router();
var request = require('request');
var steam_api_key = process.env.STEAM_API_KEY;
var steam_format = '&format=json';

function getGames(steam_id, res) {
  request('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + steam_api_key + '&steamid=' + steam_id + '&include_appinfo=1' + ' &include_played_free_games=1' +  steam_format, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var object = JSON.parse(body);
      var response = object.response;
      res.render('getGames', { title: 'Steam API', game_count: response.game_count, games: object.response.games });
    }
  })
};

function convertSteamID(steam_id, res) {
  request('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001?vanityurl=' + steam_id + '&key=' + steam_api_key, function (error, response, body) {
   if (!error && response.statusCode == 200) {
      var object = JSON.parse(body);
      var response = object.response;
      var steamID = response.steamid;
      getGames(steamID, res);
    }
  })
};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST getGames page */
router.post('/getGames', function(req, res) {
  if (isNaN(parseInt(req.body.steamID))) {
    convertSteamID(req.body.steamID, res)
  } else {
    getGames(req.body.steamID, res);
  };
});

module.exports = router;
