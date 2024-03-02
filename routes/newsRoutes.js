const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/news', async (req, res) => {
    try {
      const apiKey = 'daf9fd191df64d3eaa8e616759e9b536';
      const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  
      const response = await axios.get(apiUrl);
      const articles = response.data.articles;
  
      res.render('news', { articles });
    } catch (error) {
      console.error('Error fetching news data:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });


 module.exports = router;