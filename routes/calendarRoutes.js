const express = require('express');
const axios = require('axios');
const router = express.Router();

// Define a route to get Google Calendar events
router.get('/calendar', async (req, res) => {
  try {
    const calendarId = 'ru.kz#holiday@group.v.calendar.google.com'; 

    const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
      params: {
        key: 'AIzaSyCUl1WCoMieKFjYLZz3nflctzkCvp82ons', 
      },
    });

    const events = response.data.items;

    console.log('Calendar Response:', calendarResponse);
    console.log('Events:', events);

    res.render('calendar', { events });
  } catch (error) {
    console.error('Error Message:', error.message);
  console.error('Stack Trace:', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;