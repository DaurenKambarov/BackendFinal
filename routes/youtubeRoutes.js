const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/youtube', async (req, res, next) => {
  try {
    const apiKey = 'AIzaSyCUl1WCoMieKFjYLZz3nflctzkCvp82ons';
    const searchQuery = 'Your Search Query';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`;

    const response = await axios.get(apiUrl);
    const titles = response.data.items.map((item) => item.snippet.title);
    const videos = response.data.items.map((item) => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
      }));
  

    res.render('youtube', { titles, videos });
  } catch (error) {
    next(error);
  }
});

module.exports = router;