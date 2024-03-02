const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/currencyRate', async (req, res) => {
    try {
        const apiKey = '7801b743d443d1f606e51085';
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const currencies = Object.keys(response.data.rates);
        const baseCurrency = response.data.base;
    
        res.render('index', { currencies, baseCurrency });
      } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
      }
  });   

  module.exports = router;