//require('dotenv').config();

const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artist-search', (req, res) => {
  const searchQuery = `http://api.spotify.com/v1/search?q -H "Authorization: Bearer ${spotifyApi.clientSecret}"`;
  spotifyApi
    .searchArtists(searchQuery)
    .then((data) => {
      console.log('The received data from the API:', data.body);
      const results = data.body;
      const artists = data.body.artists;
      res.render('results', {
        artists: data.body.artists.items,
        images: data.body.artists.items.images
      });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);

//const searchQuery = request.query.q;
//const apiURL = `https://api.spotify.com/v1/search=${searchQuery}`;
//const apiURL = `"https://api.spotify.com/v1/search?q=${searchQuery}&type=artist" -H "Authorisation: Bearer ${87a40b43f94d4bb8a2ad84121c036e01}"`;
//const apiURL = `http://api.spotify.com/v1/search?q=${searchQuery}
//const searchQuery = `http://api.spotify.com/v1/search?q`;
//const searchQuery = `http://api.spotify.com/v1/search?q -H "Authorization: Bearer {87a40b43f94d4bb8a2ad84121c036e01}"`;

//const searchQuery = `http://api.spotify.com/v1/search?q -H "Authorization: Bearer ${spotifyApi.clientSecret}"`;
