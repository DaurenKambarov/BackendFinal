const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/countries', async (req, res) => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countries = response.data;
      res.render('countries', { countries });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;